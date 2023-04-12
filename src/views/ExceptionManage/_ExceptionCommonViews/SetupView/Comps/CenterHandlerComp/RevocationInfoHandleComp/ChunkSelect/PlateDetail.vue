<template>
  <div class="plate-detail" :class="{p: !!parentPlate}">
    <div class="f">
      <h4 v-if="!parentPlate">{{ plate.Line }}</h4>
      <span>{{ parentPlate ? '子版' : '大版' }}ID：{{ plate.Code }}</span>
      <span v-if="!!parentPlate">
        涉及{{ plate.OrderNumber }}个订单
        <template v-if="plate.ChunkNumber"> (共{{ plate.ChunkNumber }}个订单块)</template>
      </span>
      <span class="is-blue-span" :disabled="!plate.MapFilePath" @click="loadBarcode(plate)">下载条码稿</span>
    </div>
    <div class="s" v-if="!parentPlate">
      <div class='l'>
        <span v-if="plate.Template">{{ plate.Template }}</span>
        <span v-if="plate.TemplateSize">{{ plate.TemplateSize }}</span>
        <span v-if="plate.Material">{{ plate.Material }}</span>
      </div>
      <h4 class="num">{{ `${`${plate.Number}`.replace(/(?=(\B)(\d{3})+$)/g, ',')}${plate.Unit}` }}</h4>
    </div>
    <div v-if="!parentPlate">
      <span>
        涉及{{ plate.OrderNumber }}个订单
        <template v-if="plate.ChunkNumber"> (共{{ plate.ChunkNumber }}个订单块)</template>
      </span>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { IExceptionPlate } from '@/views/ExceptionManage/_ExceptionCommonViews/js/type';
import { IExceptionPlate4Form } from '../../../../js/ruleFormType';
import { loadBarcode } from '../../../../js/utils';

defineProps<{
  plate: IExceptionPlate | IExceptionPlate4Form
  parentPlate?: IExceptionPlate4Form
}>();

</script>

<style scoped lang='scss'>
.plate-detail {
  width: 100%;
  padding: 10px 30px;
  box-sizing: border-box;
  background-color: #f5f5f5;
  border: 1px solid #e5e5e5;
  font-size: 12px;
  margin-bottom: 10px;
  &.p {
    border-top: none;
  }
  > div {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    line-height: 20px;
    > .l {
      > span {
        & + span {
          margin-left: 6px;
        }
      }
    }
    h4 {
      font-size: 13px;
      letter-spacing: 0.5px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    }

    .num {
      position: relative;
      top: 2px;
    }
  }
}
</style>
