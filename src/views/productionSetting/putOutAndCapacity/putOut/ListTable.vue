<template>
  <ul>
    <li class="item header">
      <div class="content">
        条件
      </div>
      <div class="pot-out">伸放</div>
      <div class="priority">优先级</div>
      <div class="ctrl">
        操作
      </div>
    </li>
    <li v-for="(it, i) in props.tableList" :key="it.ID" class="item">
      <div class="content">
        <i class="index">{{i + 1}}. </i>
        <ConditionTextDisplayComp :conditionObj="it.Constraint" :content="it._Content" />
      </div>
      <div class="pot-out">{{it.Value}}{{it.Type === 0 ? '张' : '%'}}</div>
      <div class="priority">{{it.Priority}}</div>
      <div class="ctrl">
        <mp-button type="info" class="menu" link @click="onSaveClick(it)">
          <i class="iconfont icon-bianji"></i>编辑
        </mp-button>
        <mp-button type="info" class="menu" link @click="onRemoveClick(it,i)">
          <i class="iconfont icon-delete"></i>删除
        </mp-button>
      </div>
    </li>
    <li class="empty" v-if="!props.tableList || props.tableList.length === 0">暂无数据</li>
  </ul>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import ConditionTextDisplayComp from '@/components/common/ConstraintsComps/ConstraintsTable/ConditionTextDisplayComp.vue';
import { TransformConstraintTableItemType } from '@/components/common/ConstraintsComps/ConstraintsTable/utils';
import { PutOutConditionItemClass } from '../js/PutOutConditionItemClass';

const props = defineProps<{
  tableList: TransformConstraintTableItemType<PutOutConditionItemClass>[]
}>();

const emit = defineEmits(['rowRemove', 'rowSave']);

const onSaveClick = (e) => {
  emit('rowSave', e);
};

const onRemoveClick = (it: TransformConstraintTableItemType<PutOutConditionItemClass>, i: number) => {
  MpMessage.warn({
    title: '确定要删除此伸放吗？',
    msg: `条目：第 [ ${i + 1} ] 条`,
    onOk: () => {
      emit('rowRemove', it);
    },
  });
};
</script>

<style scoped lang='scss'>
</style>
