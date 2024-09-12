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
        <template #default="scope:any">
          <span :title="scope.row._department.replaceAll(' | ', '\r\n')">{{scope.row._department || ''}}</span>
        </template>
      </mp-table-column>
      <mp-table-column width="80px" prop="_statusText" label="状态"></mp-table-column>
      <mp-table-column width="80px" prop="CheckUser.StaffName" label="审核人"></mp-table-column>
      <el-table-column width="185px" label="操作">
        <template #default="scope:any">
          <div class="menus">
            <Menu title="审核" icon="icon-shenhe iconfont" isSuccess
               v-if="scope.row.Status===StaffStatusEnum.pending && localPermission?.Check" @click="onChangeStatusClick(scope.row, scope.$index)"/>
            <DetailMenu v-if="scope.row.Status!==StaffStatusEnum.pending && localPermission?.ViewStaffDetail"
             @click="onDetailClick(scope.row, scope.$index)" :disabled="scope.row.Status===StaffStatusEnum.pending" />
            <!-- <Menu title="离职" icon="icon-lizhi iconfont" isPink
               v-if="scope.row.Status===StaffStatusEnum.approved" @click="onChangeStatusClick(scope.row, scope.$index)" />
            <Menu title="取消离职" icon="icon-fanhui iconfont" isSuccess
               v-if="scope.row.Status===StaffStatusEnum.leaved" @click="onChangeStatusClick(scope.row, scope.$index)"/>
            <EditMenu @click="onEditClick(scope.row)" />
            <RemoveMenu :disabled="scope.row.Status !== StaffStatusEnum.pending" @click="onRemoveClick(scope.row, scope.$index)" /> -->

            <el-dropdown trigger="click" v-if="!noMoreMenuPermission">
              <span class="el-dropdown-link staff">
                <el-icon><MoreFilled /></el-icon>
                更多
              </span>
              <template #dropdown>
                <el-dropdown-menu class="mp-stall-manage-table-menu--drop-down-wrap">
                  <el-dropdown-item v-if="localPermission?.ImpositionUnLock" @click="onUnLockClick(scope.row)">
                    <el-icon class="ft-16 is-warning bold"><Unlock /></el-icon>
                    <span>拼版释放</span>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.Status===StaffStatusEnum.approved && localPermission?.Dimission"
                   @click="onChangeStatusClick(scope.row, scope.$index)">
                    <i class="icon-lizhi iconfont is-pink"></i>
                    <span>离职</span>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.Status===StaffStatusEnum.leaved && localPermission?.Dimission"
                   @click="onChangeStatusClick(scope.row, scope.$index)">
                    <i class="icon-fanhui iconfont is-success"></i>
                    <span>取消离职</span>
                  </el-dropdown-item>
                  <el-dropdown-item  @click="onEditClick(scope.row)" v-if="localPermission?.Edit">
                    <i class="icon-bianji iconfont is-primary"></i>
                    <span>编辑</span>
                  </el-dropdown-item>
                  <el-dropdown-item :disabled="scope.row.Status !== StaffStatusEnum.pending" @click="onRemoveClick(scope.row, scope.$index)"
                   v-if="localPermission?.Delete">
                    <i class="icon-delete iconfont"></i>
                    <span>删除</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
import api from '@/api';
import Menu from '@/components/common/menus/Menu.vue';
import DetailMenu from '@/components/common/menus/DetailMenu.vue';
import { computed } from 'vue';
import { useCommonStore } from '@/store/modules/common';
import { storeToRefs } from 'pinia';
import { IUser } from '@/store/modules/user/types';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { getDepartmentDisplayList } from '@/assets/js/utils/getDepartmentLevelList';
import {
  EducationEnumList, SexEnumList, StaffStatusEnumList, StaffStatusEnum,
} from '../js/enums';
import { StaffManageClass } from '../js/StaffManageClass';
import { IStaff } from '../js/types';

const commonStore = useCommonStore();
const { DistrictTreeList } = storeToRefs(commonStore);

const props = defineProps<{
  StaffManagePageData: StaffManageClass
  localPermission?: IUser['PermissionList']['PermissionManageStaffBase']['Obj']
}>();

const noMoreMenuPermission = computed(() => {
  if (props.localPermission) {
    const { Edit, Delete, Dimission, ImpositionUnLock } = props.localPermission;

    return !Edit && !Delete && !Dimission && !ImpositionUnLock;
  }

  return false;
});

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

const localList = computed(() => props.StaffManagePageData.dataList.map(it => ({
  ...it,
  _gender: getEnumNameByID(it.Sex, SexEnumList),
  _EducationText: getEnumNameByID(it.Education, EducationEnumList),
  _IntranetContent: it.UseIntranet ? '仅限内部网络' : '不限',
  _address: getAddressContent(it.Area, DistrictTreeList.value),
  _Birthday: formatDate(it.TimeRecord?.Birthday),
  _JoinDate: formatDate(it.TimeRecord?.JoinDate),
  _department: getDepartmentDisplayList(it, props.StaffManagePageData.departmentLevelList, props.StaffManagePageData.jobPostList).join(' | '),
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

const handleUplock = async (item:IStaff) => {
  const resp = await api.getStaffImpositionUnLock(item.StaffID).catch(() => null);

  if (resp?.data?.isSuccess) {
    MpMessage.success('释放成功');
  }
};

const onUnLockClick = (item:IStaff) => { // 审稿释放|解锁 getStaffImpositionUnLock
  MpMessage.warn({
    title: '确定释放拼版内容吗 ?',
    msg: `该操作将会解锁 [ ${item.StaffName} ] 已拖到大版上的全部文件，请谨慎操作！`,
    onOk: () => {
      handleUplock(item);
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
  :deep(.el-dropdown-link) {
    font-size: 12px;
    color: #989898;
    line-height: 23px;
    cursor: pointer;

    > i {
      transform: rotateZ(90deg);
      font-size: 14px;
      vertical-align: -2px;
      color: #989898;
    }

    &:hover {
      color: #585858;
    }
    &[aria-expanded="true"] {
      color: #585858;
    }
  }
}

</style>

<style lang="scss">
.mp-stall-manage-table-menu--drop-down-wrap {
  > li {
    font-size: 12px;
    display: flex;
    align-items: center;

    > i {
      margin-right: 8px;
    }

    &:not(.is-disabled) {
      i.icon-delete {
        color: #ff3769;
      }
    }
  }
}
</style>
