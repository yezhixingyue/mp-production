<template>
 <DialogContainerComp
   :visible='visible'
   :width='775'
   title='生产资源状态'
   top='10vh'
   @open='onOpen'
   @cancel='visible = false'
   @submit='visible = false'
   :showClose="false"
   primaryText="确定"
   class="partial-delivery-list-dialog"
   >
   <div class='dialog-content' v-if="row">
    <h4 class="mp-common-title-wrap" style="color: #444;" :title="row._DetailText">{{ row._DetailText || row.Code }}</h4>

    <el-table :data="MaterialList" border stripe class="table-wrap">
      <mp-table-column width="80px" label="序号">
        <template #default="scope:{ $index: number }">
          <span >{{ scope.$index + 1 }}</span>
        </template>
      </mp-table-column>
      <mp-table-column prop="Name" label="生产资源" />
      <mp-table-column width="190px" label="状态">
        <template #default="scope:{ row: IPartialDeliveryMaterial }">
          <span>
            <i class="success" v-if="scope.row.Status === WorkingMaterialStatusEnum.HaveReceived">已送达</i>
            <i class="gray" v-if="scope.row.Status === WorkingMaterialStatusEnum.WaiteReceive && scope.row.Percentage === 0">未送达</i>
            <i class="blue" v-if="scope.row.Status === WorkingMaterialStatusEnum.WaiteReceive && scope.row.Percentage > 0">部分送达（{{ scope.row.Percentage }}%）</i>
            <i class="orange" v-if="scope.row.Status === WorkingMaterialStatusEnum.WaiteImposition && scope.row.Percentage === 0">未拼版</i>
            <i class="orange" v-if="scope.row.Status === WorkingMaterialStatusEnum.WaiteImposition && scope.row.Percentage > 0"
              >部分未拼版（剩余{{ Number((100 - scope.row.Percentage).toFixed(0)) }}%）</i>
          </span>
        </template>
      </mp-table-column>
      <template #empty>
        <span class="ft-12" v-show="!loading">暂无数据</span>
      </template>
    </el-table>
   </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import api from '@/api';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { getLocalTaskList } from '@/views/ProductionClient/Comps/EquipmentPageContent/TaskActivateAndList/BatchReport/getLocalTaskList';
import { ref } from 'vue';
import { IPartialDeliveryMaterial } from './types';
import { WorkingMaterialStatusEnum } from './enum';

const props = defineProps<{
  row: null | ReturnType<typeof getLocalTaskList>[number]
}>();

const visible = defineModel<boolean>('visible');

const MaterialList = ref<IPartialDeliveryMaterial[]>([]);
const loading = ref(false);

const onOpen = async () => {
  MaterialList.value = [];

  if (!props.row) return;

  loading.value = true;
  const resp = await api.productionManageApis.getTaskMaterialList(props.row.ID);
  loading.value = false;

  if (resp.data?.isSuccess) {
    MaterialList.value = resp.data.Data;
  }
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
  margin-top: -15px;
  height: 485px;
  margin-left: 20px;
  margin-right: 20px;

  > .mp-common-title-wrap {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 24px;
    width: 100%;
  }

  .table-wrap {
    height: calc(100% - 25px);

    :deep(.cell) {
      .success {
        color: #28D200;
      }

      .blue {
        color: #26BCF9;
      }

      .gray {
        color: #888888;
      }

      .orange {
        color: #F6B437;
      }
    }
  }
}

</style>

<style lang="scss">
.partial-delivery-list-dialog {
  .el-dialog__footer {
    border-top: 1px solid #eee;
    margin: 0 10px;
    padding-bottom: 30px;
  }
}
</style>
