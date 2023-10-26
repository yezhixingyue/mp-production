<template>
  <footer class="footer">
    <div class="ctrl" v-show="ManageListData.listNumber > 0"  v-if="Permission?.Deal">
      <el-checkbox :disabled="status.disabled" :indeterminate="status.indeterminate" v-model="checkAllValue" label="">全选</el-checkbox>
      <mp-button :disabled="ManageListData.selectList.length === 0" type="primary" link class="button" @click="onclick">批量标记为已处理</mp-button>
    </div>
    <MpPagination center :nowPage="ManageListData.condition.Page" :pageSize="ManageListData.condition.PageSize"
     :total="ManageListData.listNumber" :handlePageChange="(num: number) => ManageListData.getList(num)" />
  </footer>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { IUser } from '@/store/modules/user/types';
import MpPagination from '@/components/common/MpPagination.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ManageListClass } from '../js/ManageListClass';

const props = defineProps<{
  ManageListData: ManageListClass
  Permission: null | IUser['PermissionList']['PermissionScheduleException']['Obj']
}>();

const onclick = () => {
  MpMessage.warn('确定批量标记为已处理吗 ?', `共选中 ${props.ManageListData.selectList.length} 个订单`, () => {
    props.ManageListData.setRowsHaveDeal(props.ManageListData.selectList);
  });
};

const status = computed(() => {
  const canSelectList = props.ManageListData.list.filter(it => !it.DealTime);
  return {
    disabled: canSelectList.length === 0,
    indeterminate: props.ManageListData.selectList.length > 0 && props.ManageListData.selectList.length < canSelectList.length,
    isCheckAll: props.ManageListData.selectList.length > 0 && props.ManageListData.selectList.length === canSelectList.length,
  };
});

const checkAllValue = computed({
  get() {
    return status.value.isCheckAll;
  },
  set() {
    props.ManageListData.multipleTableRef?.toggleAllSelection();
  },
});

</script>

<style scoped lang='scss'>
.footer {
  display: flex;
  align-items: center;
  .ctrl {
    font-size: 12px;
    margin: 0 15px;
    display: flex;
    flex: none;
    z-index: 9;

    width: 50px;

    --el-fill-color-light: #eee;

    button {
      font-size: 12px;
      padding: 0;
      margin-left: 10px;
    }
  }

  > section {
    flex: 1;
    overflow: hidden;
  }
}
</style>
