<template>
  <el-table :data="list" border stripe class="table-wrap">
    <mp-table-column width="110px" prop="OrderCode" label="订单号" />
    <mp-table-column width="100px" prop="KindRemark" label="款序" />
    <mp-table-column width="140px" prop="FactoryCreateTime" label="生产订单创建时间">
      <template #default="scope:{ row: IAdjustInfo }">
        <span>{{ format2MiddleLangTypeDateFunc2(scope.row.FactoryCreateTime) }}</span>
      </template>
    </mp-table-column>
    <mp-table-column width="140px" prop="LastImpositionTime" label="最晚拼版时间">
      <template #default="scope:{ row: IAdjustInfo }">
        <span>{{ format2MiddleLangTypeDateFunc2(scope.row.LastImpositionTime) }}</span>
      </template>
    </mp-table-column>
    <mp-table-column width="80px" prop="ImpositionLevel" label="优先级" />
    <mp-table-column width="80px" prop="Number" label="原始数量" v-if="type===AdjustTabTypeEnum.AddNumber" />
    <mp-table-column width="160px" prop="RemainNumber" label="追加数量" v-if="type===AdjustTabTypeEnum.AddNumber">
      <template #default="scope:{ row: IAdjustInfo }">
        <span>{{ scope.row.AddNumber }}（{{ Number((scope.row.AddNumber*100/scope.row.Number).toFixed(1)) }}%）</span>
      </template>
    </mp-table-column>
    <mp-table-column width="160px" prop="RemainNumber" label="当前剩余数量" v-if="type===AdjustTabTypeEnum.UnionPlate">
      <template #default="scope:{ row: IAdjustInfo }">
        <span>{{ scope.row.RemainNumber }}/{{ [scope.row.Number, scope.row.AddNumber].filter(Boolean).join('+') }}</span>
      </template>
    </mp-table-column>
    <mp-table-column min-width="140px" prop="Remark" :label="type === AdjustTabTypeEnum.AddNumber ? '追加印刷数量原因' : '提前入尾版原因'" />
    <mp-table-column width="125px" prop="CurrentNumber" label="登记时数量"></mp-table-column>
    <mp-table-column width="80px" prop="OperatorName" label="登记人" />
    <mp-table-column width="140px" prop="CreateTime" label="登记时间">
      <template #default="scope:{ row: IAdjustInfo }">
        <span>{{ format2MiddleLangTypeDateFunc2(scope.row.CreateTime) }}</span>
      </template>
    </mp-table-column>
    <mp-table-column width="200px" label="操作" class-name="ctrl" v-if="(type === AdjustTabTypeEnum.AddNumber && Permission?.Obj.AddNumberSetup)
     || (type === AdjustTabTypeEnum.UnionPlate && Permission?.Obj.UnionPlateSetup)">
      <template #default="scope:{ row: IAdjustInfo }">
        <template v-if="type === AdjustTabTypeEnum.UnionPlate">
          <mp-button type="primary" class="ft-12" link v-if="!scope.row.CreateTime" @click="emit('advEnter', scope.row)">提前转入</mp-button>
          <mp-button type="danger" class="ft-12" link v-else
           :disabled="scope.row.OperatorID!==localPrepressAdjModel.user?.StaffID"
           :title="scope.row.OperatorID!==localPrepressAdjModel.user?.StaffID ? '非本人转入订单不可撤回' : ''"
           @click="onCancelAdvClick(scope.row)">撤回</mp-button>
        </template>

        <template v-if="type === AdjustTabTypeEnum.AddNumber && Permission?.Obj.AddNumberSetup">
          <mp-button type="danger" class="ft-12" link
           :disabled="scope.row.OperatorID!==localPrepressAdjModel.user?.StaffID"
           :title="scope.row.OperatorID!==localPrepressAdjModel.user?.StaffID ? '非本人追加数据不可删除' : ''"
           @click="onRemoveAddClick(scope.row)">删除</mp-button>
        </template>
      </template>
    </mp-table-column>
    <template #empty>
      <span class="ft-12" v-show="!loading">暂无数据</span>
    </template>
  </el-table>
</template>

<script setup lang='ts'>
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { AdjustTabTypeEnum } from '@/views/productionManagePages/PrepressAdjustment/types/enum';
import { PrepressAdjustmentManageModel } from '@/views/productionManagePages/PrepressAdjustment/model/PrepressAdjustmentManageModel';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { localPrepressAdjModel } from '@/views/productionManagePages/PrepressAdjustment/store';
import { IAdjustInfo } from '../../../../types';

defineProps<{
  type: AdjustTabTypeEnum
  list: IAdjustInfo[]
  loading: boolean
  Permission: PrepressAdjustmentManageModel['Permission']
}>();

const emit = defineEmits(['advEnter', 'cancelAdv', 'removeAdd']);

// 非自己订单不可撤回和删除
const onCancelAdvClick = (row: IAdjustInfo) => {
  MpMessage.warn('确定撤回转尾版操作吗？', `订单号：[${row.OrderCode}]`, () => {
    emit('cancelAdv', row);
  });
};

const onRemoveAddClick = (row: IAdjustInfo) => {
  MpMessage.warn('确定删除该条追加数据吗？', `订单号：[${row.OrderCode}]`, () => {
    emit('removeAdd', row);
  });
};

</script>

<style scoped lang='scss'>
</style>
