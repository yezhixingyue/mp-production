import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import { IUser } from '@/store/modules/user/types';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { IDepartment, IDepartmentLevelItem } from '../../DepartmentManage/js/types';
import { IJobPost } from '../../JobPostManage/js/types';
import { StaffStatusEnum } from './enums';
import { StaffListCondition } from './StaffListCondition';
import { IStaff } from './types';

/**
 * 员工管理页面类
 *
 * @export
 * @class StaffManageClass
 */
export class StaffManageClass {
  dataList: IStaff[] = []

  dataNumber = 0

  condition = new StaffListCondition()

  loading = false

  curEditStaff: IStaff | null = null

  curEditIndex = -1

  /** 是否展示网络设置相关 */
  showIntranet = false

  /** 岗位列表 */
  jobPostList: IJobPost[] = []

  /** 部门列表 暂时没有用到 */
  departmentList: IDepartment[] = []

  /** 部门分级列表 */
  departmentLevelList: IDepartmentLevelItem[] = []

  async getJobPostList() {
    const resp = await api.getJobPermissionsList().catch(() => null);
    if (resp?.data.isSuccess) {
      this.jobPostList = resp.data.Data as IJobPost[];
    }
  }

  async getDepartmentList() {
    const resp = await api.getDepartmentList().catch(() => null);
    if (resp?.data.isSuccess) {
      const _list = resp.data.Data as IDepartment[];
      this.departmentList = _list;
      const level1List = _list.filter(item => item.Level === 1).map(i => ({ ...i, children: [] }));
      level1List.unshift({
        ID: -666, Name: '无', children: [], Level: 1, ParentID: -1,
      });
      const list = level1List.map(level1 => {
        const _level1: IDepartmentLevelItem = { ...level1, children: [] };
        const _level2list = _list.filter(item => item.Level === 2 && item.ParentID === level1.ID)
          .map(item => ({ ...item, children: [] }));
        _level2list.unshift({
          ID: -666, Name: '无', children: [], Level: 2, ParentID: level1.ID,
        });
        _level1.children = _level2list;
        _level1.children.forEach(level2 => {
          const _level3list = _list.filter(item => item.Level === 3 && item.ParentID === level2.ID);
          _level3list.unshift({
            ID: -666, Name: '无', Level: 3, ParentID: level2.ID,
          });
          // eslint-disable-next-line no-param-reassign
          level2.children = _level3list;
        });
        return _level1;
      });
      this.departmentLevelList = list;
    }
  }

  /**
   * 设置条件
   *
   * @param {*} [[key1, key2], value]
   * @returns
   * @memberof StaffManageClass
   */
  setCondition([[key1, key2], value]: ISetConditionParams) {
    CommonClassType.setCondition([[key1, key2], value], this.condition);
  }

  /**
   * 清除条件
   *
   * @memberof StaffManageClass
   */
  clearConditon() {
    this.condition = new StaffListCondition();
  }

  /**
   * 获取列表数据
   *
   * @param {number} [Page=1]
   * @memberof StaffManageClass
   */
  async getDataList(Page = 1) {
    const _Page = Number.isInteger(+Page) ? Page : 1;
    this.setCondition([['Page', ''], _Page]);

    const temp = CommonClassType.filter(this.condition, true);

    this.dataList = [];
    this.loading = true;
    const resp = await api.getStaffList(temp).catch(() => null);
    this.loading = false;

    if (resp && resp.data.Status === 1000) {
      this.dataList = resp.data.Data as IStaff[];
      this.dataNumber = resp.data.DataNumber;
    }
  }

  /**
   * 员工删除
   *
   * @param {*} item 员工对象
   * @param {*} index 索引位
   * @returns
   * @memberof StaffManageClass
   */
  async removeItem(item, index, callback) {
    if (!item || !item.StaffID || typeof index !== 'number') return;
    const resp = await api.getStaffRemove(item.StaffID).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      const cb = () => {
        if (callback) callback();
        if (index >= 0) this.dataList.splice(index, 1);
      };
      MpMessage.success({
        title: '删除成功',
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  /**
   * 审核员工或修改员工岗位/部门
   *
   * @param {*} item
   * @param {*} index
   * @param {*} callback
   * @returns
   * @memberof StaffManageClass
   */
  async checkOrSetJobSubmit(item: IStaff, index: number, Permission: IUser, callback) {
    if (!item || !item.StaffID || typeof index !== 'number') return;

    const resp = await api.getCheckStaffPassed(item).catch(() => null);

    if (resp && resp.data.Status === 1000) {
      const cb = () => {
        const temp = item;
        // 修改成功后补充审核人信息
        if (Permission && !temp.CheckUser?.StaffID) {
          temp.CheckUser = { StaffName: Permission.StaffName, StaffID: Permission.StaffID };
        }

        // 如果之前未审核，则修改审核状态为通过 并 补充审核时间为当前时间
        if (temp.Status === StaffStatusEnum.pending) {
          temp.Status = StaffStatusEnum.approved;
          temp.TimeRecord.CheckTime = getTimeConvertFormat({ withHMS: true });
        }

        if (callback) callback();

        if (index >= 0) this.dataList.splice(index, 1, temp);
      };

      const title = item.Status === StaffStatusEnum.pending ? '审核成功' : '设置成功';
      MpMessage.success({
        title,
        onOk: cb,
        onCancel: cb,
      });
    }
  }

  /**
   * 员工状态修改， 离职|取消离职
   *
   * @param {*} item
   * @param {*} expectStatus 期待的状态
   * @param {*} index
   * @returns
   * @memberof StaffManageClass
   */
  async setItemStatusChange(item, expectStatus, index) {
    if (!item || !item.StaffID || typeof index !== 'number' || typeof expectStatus !== 'number') return;
    const temp = {
      staffID: item.StaffID,
      status: expectStatus,
    };
    const resp = await api.getStaffChangeStatus(temp).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      let title = '设置成功';
      if (expectStatus === StaffStatusEnum.leaved) title = '设置离职成功';
      if (expectStatus === StaffStatusEnum.approved) title = '取消离职成功';
      const cb = () => {
        if (this.dataList[index]) {
          this.dataList[index].Status = expectStatus;
          // 如果是离职应更新离职时间
          if (expectStatus === StaffStatusEnum.leaved) {
            this.dataList[index].TimeRecord.OutTime = getTimeConvertFormat({ withHMS: true });
            this.dataList[index].PositionList = [];
          } else if (expectStatus === StaffStatusEnum.approved) {
            this.dataList[index].TimeRecord.OutTime = '';
          }
        }
      };
      MpMessage.success({ title, onOk: cb, onCancel: cb });
    }
  }
}
