<template>
  <ul class="row-detail-box">
    <!-- 订单类型 -->
    <li v-if="orderInfo">
      <div>
        <span>订单：{{ orderInfo.OrderCode }}</span>
        <span>{{ orderInfo.Size }}</span>
        <span>{{ `${orderInfo.Number}`.replace(reg, ',') }}{{ orderInfo.Unit }}</span>
        <span v-if="orderInfo.KindCount">{{ orderInfo.KindCount }}款</span>
        <span>销售端产品名称：
          <template v-if="orderInfo.FirstLevel">{{ orderInfo.FirstLevel }}</template>
          <template v-if="orderInfo.FirstLevel">-</template>
          <template v-if="orderInfo.SecondLevel">{{ orderInfo.SecondLevel }}</template>
          <template v-if="orderInfo.SecondLevel">-</template>
          {{ orderInfo.ProductName || '未知' }}
        </span>
      </div>
      <div>
        <span>文件内容：{{ orderInfo.Content }}</span>
        <span>
          最晚生产完成时间：
          <h4>{{ format2MiddleLangTypeDateFunc2(orderInfo.WishFinishTime) }}
            <i v-if="TimeoutPeriod" :class="{'is-red': TimeoutPeriod.isTimeout}">（{{ TimeoutPeriod.content }}）</i>
          </h4>
        </span>
      </div>
    </li>
    <!-- 大版类型 -->
    <li v-if="plateInfo">
      <div>
        <span>大版ID：{{ plateInfo.Code }}</span>
        <span>{{ plateInfo.Template }}{{ plateInfo.TemplateSize }}</span>
        <span>{{ plateInfo.Material }}</span>
        <span>{{ `${plateInfo.Number}`.replace(reg, ',') }}{{ plateInfo.Unit }}</span>
      </div>
      <div>
        <span>拼版：{{ format2MiddleLangTypeDateFunc2(plateInfo.CreateTime) }}
          <template v-if="plateInfo.Operator">（{{ plateInfo.Operator }}）</template>
        </span>
        <span>{{ plateInfo.Line }}</span>
      </div>
    </li>
    <!-- 块类型 -->
    <li v-if="chunkInfo">
      <div>
        <span>{{ chunkInfo.ChunkID }}</span>
        <span>{{ chunkInfo.ChunkCode }}</span>
        <span>{{ chunkInfo.Material }}</span>
        <span>{{ chunkInfo.Size }}</span>
        <span>{{ `${chunkInfo.Number}`.replace(reg, ',') }}{{ chunkInfo.Unit }}</span>
        <h4 class="ml-40">{{ chunkInfo.Line }}</h4>
      </div>
    </li>
  </ul>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { OrderStatus } from '@/views/productionManagePages/ManageOrderListPage/js/enum';
import {
  INodePicManageChunkInfo, format2MiddleLangTypeDateFunc2, INodePicManageOrderListItem, INodePicManagePlateInfo, INodePicPlateListChild, ReportModeEnum,
} from '../_difference';

const props = defineProps<{
  item: INodePicManageChunkInfo | INodePicManageOrderListItem | INodePicManagePlateInfo | INodePicPlateListChild
  ReportMode: ReportModeEnum
}>();

const orderInfo = computed(() => (props.ReportMode === ReportModeEnum.order && props.item as INodePicManageOrderListItem) || null);

const TimeoutPeriod = computed(() => { // 超时时间信息
  if (!orderInfo.value || !orderInfo.value.WishFinishTime || [OrderStatus.HaveCancled].includes(orderInfo.value.Status)) return null;

  if ([OrderStatus.Finished].includes(orderInfo.value.Status) && (!orderInfo.value.FinishTime)) return { content: '订单已完成', isTimeout: false };

  /** 参照时间节点 */
  const nodeTime = [OrderStatus.Finished].includes(orderInfo.value.Status) ? new Date(orderInfo.value.FinishTime.replace('Z', '')).getTime() : Date.now();

  /** 预计完成时间点 */
  const targetTime = new Date(orderInfo.value.WishFinishTime.replace('Z', '')).getTime();

  if ([OrderStatus.Finished].includes(orderInfo.value.Status) && targetTime >= nodeTime) return { content: '订单已完成', isTimeout: false };

  let text = [OrderStatus.Finished].includes(orderInfo.value.Status) ? '超时' : '已超时';
  if (targetTime > nodeTime) text = '剩余';

  const d = Math.abs(targetTime - nodeTime);

  if (d < 60 * 1000) return { content: '剩余0分钟', isTimeout: targetTime < nodeTime };

  const day = Math.floor(d / (1000 * 60 * 60 * 24));

  const hour = Math.floor((d - day * 1000 * 60 * 60 * 24) / (1000 * 60 * 60));

  const minute = Math.floor((d - day * 1000 * 60 * 60 * 24 - hour * 1000 * 60 * 60) / (60 * 1000));

  return { content: `${text}${day ? `${day}天` : ''}${hour ? `${hour}小时` : ''}${minute}分钟`, isTimeout: targetTime < nodeTime };
});

const reg = /(?=(\B)(\d{3})+$)/g;

/** 版信息  可能为大版 也可能为大版上的子版 */
const plateInfo = computed(() => (props.ReportMode === ReportModeEnum.board && props.item as INodePicPlateListChild | INodePicManagePlateInfo) || null);

const chunkInfo = computed(() => (props.ReportMode === ReportModeEnum.block && props.item as INodePicManageChunkInfo) || null);

</script>

<style scoped lang='scss'>
.row-detail-box {
  padding-bottom: 14px;
  color: #444;

  > li {
    line-height: 24px;
    > div {
      > span {

        & + span {
          margin-left: 30px;
        }
      }
      h4 {
        display: inline;
      }
    }
  }
}
</style>
