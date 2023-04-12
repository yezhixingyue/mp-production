<template>
 <DialogContainerComp
   :visible='localVisible'
   :width='980'
   title='未送出任务列表'
   top='11vh'
   @open='onOpen'
   @cancel='localVisible = false'
   :loading="listDataClass.loading"
   :showPrimary="false"
   closeBtnText="关闭"
   >
   <div class='dialog-content'>
    <div class="table-box">
      <Table
        :TaskList="getLocalTaskList(listDataClass.TaskList, false)"
        :loading="listDataClass.loading"
        pageType="undelivered"
      />
    </div>
    <div class="footer">
      <MpPagination
        left
        :nowPage="listDataClass.condition.Page"
        :pageSize="listDataClass.condition.PageSize"
        :total="listDataClass.TaskListNumber"
        :handlePageChange="getList" />
    </div>
   </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import { IManageEquipmentInfo } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/types';
import Table from '@/views/OutsourceManage/Comps/Table.vue';
import { InstanceTaskListClass } from '../../assets/js/Instance/InstanceTaskListClass/InstanceTaskListClass';
import { getLocalTaskList } from './TaskActivateAndList/BatchReport/getLocalTaskList';

const props = defineProps<{
  visible: boolean
  Equipment: IManageEquipmentInfo
}>();

const emit = defineEmits(['update:visible']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const listDataClass = ref(new InstanceTaskListClass(props.Equipment, true));
const getList = async (Page = 1) => {
  await listDataClass.value.getEquipmentTaskList(Page, props.Equipment);
};
const onOpen = () => {
  getList();
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
 margin-top: -15px;
 margin-bottom: -15px;
 height: 450px;
 display: flex;
 flex-direction: column;

 .table-box {
  flex: 1;
  overflow: hidden;
  > :deep(.el-table) {
    height: 100%;
  }
 }

 .footer {
  flex: none;
  margin-top: 5px;
 }

 @include scroll;
}
</style>
