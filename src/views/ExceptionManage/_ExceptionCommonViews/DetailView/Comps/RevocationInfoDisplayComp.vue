<template>
  <div>
    <!-- 撤销类型 -->
    <p>{{ getEnumNameByID(RevocationInfo.Type, RevocationTypeEnumList) }}</p>

    <!-- 1. 订单报工时 此订单 -->
    <div class="current-order" v-if="RevocationInfo.Type === RevocationTypeEnum.CurrentOrder && ReportMode === ReportModeEnum.order">
      <span>订单块：{{ RevocationInfo.IsAllSelected ? '全部块' : RevocationInfo.ChunkList.map(it => it.Name).join('、') }}</span>
    </div>

    <!-- 2. 指定大版显示内容 -->
    <div class="plate-list" v-if="RevocationInfo.Type === RevocationTypeEnum.FixedPlate">
      <span>大版编号：{{ RevocationInfo.PlateList.map(it => it.Code).join('、') }}</span>
    </div>

    <!-- 3. 其它块显示内容 -->
    <div class="chunk-list" v-if="RevocationInfo.Type === RevocationTypeEnum.OtherChunk">
      块：
      <template v-for="it, i in RevocationInfo.ChunkList" :key="it.Code">
        <span>{{ it.Name }}</span>
        <i class="is-gray"> ({{it.Code}})</i>
        <template v-if="i < RevocationInfo.ChunkList.length - 1">、</template>
      </template>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import { RevocationTypeEnum } from '../../SetupView/js/enum';
import { RevocationTypeEnumList } from '../../SetupView/js/EnumList';
import { IRevocationDetail } from '../../SetupView/js/type';

defineProps<{
  RevocationInfo: IRevocationDetail
  ReportMode: ReportModeEnum
}>();

</script>

<style scoped lang='scss'>
</style>
