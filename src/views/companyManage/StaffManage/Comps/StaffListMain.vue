<template>
  <main>
    <el-table :data="localList" stripe border class="row-ft-12" empty-text="暂无数据">
      <mp-table-column width="100px" prop="StaffName" label="姓名"></mp-table-column>
      <mp-table-column width="120px" prop="Mobile" label="手机号"></mp-table-column>
      <mp-table-column width="160px" prop='IDCard' label="身份证号"></mp-table-column>
      <mp-table-column width="70px" prop="_gender" label="性别"></mp-table-column>
      <mp-table-column width="85px" prop="_EducationText" label="学历"></mp-table-column>
      <mp-table-column min-width="120px" prop="_address" label="籍贯"></mp-table-column>
      <mp-table-column width="100px" prop="_Birthday" label="出生日期"></mp-table-column>
      <mp-table-column width="100px" prop="_JoinDate" label="入职日期"></mp-table-column>
      <!-- <mp-table-column min-width="160px" prop="_department" label="部门岗位">
        <span slot-scope="scope" :title="scope.row._department.replaceAll(' | ', '\r\n')">{{scope.row._department}}</span>
      </mp-table-column> -->
      <mp-table-column width="80px" prop="_statusText" label="状态">
        <!-- <span slot-scope="scope" :class="scope.row._class">{{scope.row._statusText}}</span> -->
      </mp-table-column>
      <mp-table-column width="80px" prop="CheckUser.StaffName" label="审核人"></mp-table-column>
      <mp-table-column width="260px" label="操作">
        <template #default="scope">
          <mp-button type="info" link @click="onEditClick(scope.row)">
            <i class="iconfont icon-bianji"></i>编辑
          </mp-button>
          <mp-button type="info" link @click="onRemoveClick(scope.row)">
            <i class="iconfont icon-delete"></i>删除
          </mp-button>
        </template>
      </mp-table-column>
    </el-table>
  </main>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import MpButton from '@/components/common/MpButton.vue';
import { computed } from 'vue';
import { useCommonStore } from '@/store/modules/common';
import { storeToRefs } from 'pinia';
import { ILocalEnumValue } from '@/assets/js/utils/getListByEnums';
import { EducationEnumList, SexEnum, StaffStatusEnumList } from '../js/enums';
import { StaffManageClass } from '../js/StaffManageClass';
import { IStaff } from '../js/types';

const commonStore = useCommonStore();
const { DistrictTreeList } = storeToRefs(commonStore);

const props = defineProps<{
  StaffManagePageData: StaffManageClass
}>();

const emit = defineEmits(['edit', 'remove']);

const formatEnumName = (id: number, list: ILocalEnumValue[]) => {
  const t = list.find(it => it.ID === id);
  return t ? t.Name : '';
};

const getAddressContent = ({ RegionalID, CityID }, list) => {
  const Regional = list.find(it => it.ID === RegionalID);
  if (Regional) {
    const City = Regional.children.find(it => it.ID === CityID);
    if (City) return `${Regional.Name}${City.Name}`;
  }
  return '';
};

const formatDate = (date: string) => {
  if (date && date.includes('T')) {
    return date.split('T')[0];
  }
  return '';
};

const formatDepartment = ({ PositionList }, departmentLevelList) => {
  if (Array.isArray(PositionList) && PositionList.length > 0) {
    const list = PositionList.map(({ First, Second }) => {
      const { FirstDepartmentID, SecondDepartmentID, ThirdDepartmentID } = First;
      const { PositionName } = Second;
      let str = '';
      const _getDepartmentName = (id, _list) => {
        if ((!id && id !== 0) || id === -666 || !Array.isArray(_list)) return undefined;
        const t = _list.find(it => it.ID === id);
        return t && { ClassName: t.ClassName, arr: t.children };
      };
      const f = _getDepartmentName(FirstDepartmentID, departmentLevelList);
      if (f) {
        str += f.ClassName;
        const s = _getDepartmentName(SecondDepartmentID, f.arr);
        if (s) {
          str += `-${s.ClassName}`;
          const third = _getDepartmentName(ThirdDepartmentID, s.arr);
          if (third) {
            str += `-${third.ClassName}`;
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
  _gender: it.Sex === SexEnum.male ? '男' : '女',
  _EducationText: formatEnumName(it.Education, EducationEnumList),
  _IntranetContent: it.UseIntranet ? '仅限内部网络' : '不限',
  _address: getAddressContent(it.LinkArea, DistrictTreeList.value),
  _Birthday: formatDate(it.TimeRecord?.Birthday),
  _JoinDate: formatDate(it.TimeRecord?.JoinDate),
  _department: formatDepartment(it, []),
  // _department: formatDepartment(it, this.departmentLevelList),
  _statusText: formatEnumName(it.Status, StaffStatusEnumList),
})));

const onEditClick = (it: IStaff) => {
  emit('edit', it);
};

const onRemoveClick = (it: IStaff) => {
  MpMessage.warn({
    title: '确定删除该员工吗 ?',
    msg: `员工名称：[ ${it.StaffName} ]`,
    onOk: () => {
      emit('remove', it);
    },
  });
};

</script>

<style scoped lang='scss'>
</style>
