<template>
  <footer>
    <mp-button type="primary" @click="visible = true" v-if="localPermission?.Import">批量发起金额修改</mp-button>
    <div class="magination">
      <MpPagination center :nowPage="listManager.condition.Page" :pageSize="listManager.condition.PageSize"
        :total="listManager.listNumber" :handlePageChange="(p) => listManager.getList(p)" />
    </div>
  </footer>

  <ExcelImportDialog v-model:visible="visible" @success="() => listManager.handleImported()" />
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { IUser } from '@/store/modules/user/types';
import MpPagination from '@/components/common/MpPagination.vue';
import { ManageListClass } from '../../model/ManageListClass';
import ExcelImportDialog from './ExcelImportDialog.vue';

defineProps<{
  listManager: ManageListClass
  localPermission?: IUser['PermissionList']['PermissionTaskChangePrice']['Obj']
}>();

const visible = ref(false);
</script>

<style scoped lang='scss'>
</style>
