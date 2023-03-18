<template>
  <main>
    <el-table :data="localList" stripe border class="row-ft-12">
      <mp-table-column width="100px" prop="StaffName" label="姓名"></mp-table-column>
      <mp-table-column width="120px" prop="Mobile" label="手机号"></mp-table-column>
      <mp-table-column width="160px" prop='IDCard' label="身份证号"></mp-table-column>
      <mp-table-column width="70px" prop="_gender" label="性别"></mp-table-column>
      <mp-table-column width="85px" prop="_EducationText" label="学历"></mp-table-column>
      <mp-table-column min-width="130px" prop="_address" label="籍贯"></mp-table-column>
      <mp-table-column width="100px" prop="_Birthday" label="出生日期"></mp-table-column>
      <mp-table-column width="100px" prop="_JoinDate" label="入职日期"></mp-table-column>
      <mp-table-column min-width="160px" prop="_department" label="部门岗位">
        <template #default="scope">
          <span :title="scope.row._department.replaceAll(' | ', '\r\n')">{{scope.row._department || ''}}</span>
        </template>
      </mp-table-column>
      <mp-table-column width="80px" prop="_statusText" label="状态"></mp-table-column>
      <mp-table-column width="80px" prop="CheckUser.StaffName" label="审核人"></mp-table-column>
      <el-table-column width="320px" label="操作">
        <template #default="scope">
          <div class="menus">
            <DetailMenu @click="onDetailClick(scope.row, scope.$index)" :disabled="scope.row.Status===StaffStatusEnum.pending" />
            <Menu title="离职" icon="icon-lizhi iconfont" isPink
               v-if="scope.row.Status===StaffStatusEnum.approved" @click="onChangeStatusClick(scope.row, scope.$index)" />
            <Menu title="取消离职" icon="icon-fanhui iconfont" isSuccess
               v-if="scope.row.Status===StaffStatusEnum.leaved" @click="onChangeStatusClick(scope.row, scope.$index)"/>
            <Menu title="审核" icon="icon-shenhe iconfont" isSuccess
               v-if="scope.row.Status===StaffStatusEnum.pending" @click="onChangeStatusClick(scope.row, scope.$index)"/>
            <EditMenu @click="onEditClick(scope.row)" />
            <RemoveMenu :disabled="scope.row.Status !== StaffStatusEnum.pending" @click="onRemoveClick(scope.row, scope.$index)" />
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <span v-show="!props.StaffManagePageData.loading">暂无数据</span>
      </template>
    </el-table>
  </main>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import Menu from '@/components/common/menus/Menu.vue';
import EditMenu from '@/components/common/menus/EditMenu.vue';
import RemoveMenu from '@/components/common/menus/RemoveMenu.vue';
import DetailMenu from '@/components/common/menus/DetailMenu.vue';
import { computed } from 'vue';
import { useCommonStore } from '@/store/modules/common';
import { storeToRefs } from 'pinia';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import {
  EducationEnumList, SexEnumList, StaffStatusEnumList, StaffStatusEnum,
} from '../js/enums';
import { StaffManageClass } from '../js/StaffManageClass';
import { IStaff } from '../js/types';
import { IDepartmentLevelItem } from '../../DepartmentManage/js/types';
import { IJobPost } from '../../JobPostManage/js/types';

const commonStore = useCommonStore();
const { DistrictTreeList } = storeToRefs(commonStore);

const props = defineProps<{
  StaffManagePageData: StaffManageClass
}>();

const emit = defineEmits(['edit', 'remove', 'dimission', 'check', 'detail']);

const getAddressContent = ({ RegionalID, CityID }, list) => {
  const Regional = list.find(it => it.ID === RegionalID);
  if (Regional) {
    const City = Regional.children.find(it => it.ID === CityID);
    if (City) return `${Regional.Name}${City.Name}`;
  }
  return '';
};

const formatDate = (date: string) => (date && date.includes('T') ? date.split('T')[0] : '');

const formatDepartment = ({ PositionList }: IStaff, departmentLevelList: IDepartmentLevelItem[], jobPostList: IJobPost[]) => {
  if (Array.isArray(PositionList) && PositionList.length > 0) {
    const list = PositionList.map(({ First, Second }) => {
      const { FirstDepartmentID, SecondDepartmentID, ThirdDepartmentID } = First;
      const { PositionID } = Second;
      const t = jobPostList.find(it => it.PositionID === PositionID);
      const PositionName = t && t.PositionName ? t.PositionName : '';
      let str = '';
      const _getDepartmentName = (id: number, _list: IDepartmentLevelItem[]) => {
        if ((!id && id !== 0) || id === -666 || !Array.isArray(_list)) return undefined;
        const t = _list.find(it => it.ID === id);
        return t && { Name: t.Name, arr: t.children };
      };
      const f = _getDepartmentName(FirstDepartmentID, departmentLevelList);
      if (f) {
        str += f.Name;
        const s = _getDepartmentName(SecondDepartmentID, f.arr || []);
        if (s) {
          str += `-${s.Name}`;
          const third = _getDepartmentName(ThirdDepartmentID, s.arr || []);
          if (third) {
            str += `-${third.Name}`;
          }
        }
      }
      return [str, PositionName].filter(it => it).join(' ');
    });
    return list.filter(it => it).join(' | ');
  }
  return '';
};

const localList = computed(() => props.StaffManagePageData.dataList.map(it => ({
  ...it,
  _gender: getEnumNameByID(it.Sex, SexEnumList),
  _EducationText: getEnumNameByID(it.Education, EducationEnumList),
  _IntranetContent: it.UseIntranet ? '仅限内部网络' : '不限',
  _address: getAddressContent(it.Area, DistrictTreeList.value),
  _Birthday: formatDate(it.TimeRecord?.Birthday),
  _JoinDate: formatDate(it.TimeRecord?.JoinDate),
  _department: formatDepartment(it, props.StaffManagePageData.departmentLevelList, props.StaffManagePageData.jobPostList),
  _statusText: getEnumNameByID(it.Status, StaffStatusEnumList),
})));

const onDetailClick = (item: IStaff, index: number) => {
  emit('detail', { item, index });
};

const onEditClick = (item: IStaff) => {
  emit('edit', { item, id: item.StaffID });
};

const onChangeStatusClick = (item: IStaff, index: number) => { // 审核|离职|取消离职
  switch (item.Status) {
    case StaffStatusEnum.pending:
      // 要审核
      emit('check', { item, index });
      break;
    case StaffStatusEnum.approved:
      // 要离职
      MpMessage.warn({
        title: '确定设为离职状态吗 ?',
        msg: `员工离职：[ ${item.StaffName} ]`,
        onOk: () => {
          emit('dimission', { item, expectStatus: StaffStatusEnum.leaved, index });
        },
      });
      break;
    case StaffStatusEnum.leaved:
      // 要取消离职
      MpMessage.warn({
        title: '确定要取消离职吗 ?',
        msg: `取消离职：[ ${item.StaffName} ]`,
        onOk: () => {
          emit('dimission', { item, expectStatus: StaffStatusEnum.approved, index });
        },
      });
      break;

    default:
      break;
  }
};

const onRemoveClick = (item: IStaff, index: number) => {
  MpMessage.warn({
    title: '确定删除该员工吗 ?',
    msg: `删除员工：[ ${item.StaffName} ]`,
    onOk: () => {
      emit('remove', { item, index });
    },
  });
};

</script>

<style scoped lang='scss'>
.menus {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: -22px;
  :deep(.menu-box) {
    flex: none;
    margin: 0;
    margin-right: 8px;
    > span {
      display: inline-block;
      width: 4em;
      text-align: left;
    }
  }
  .h {
    visibility: hidden;
  }
}
</style>
