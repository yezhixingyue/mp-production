<template>
  <p class="title">
    <span>{{options.title}}：</span>
    <mp-button type="primary" link @click="onSaveClick(null)">+ 添加条件</mp-button>
    <span class="hint">仅匹配一条</span>
  </p>
  <ul>
    <li class="item header">
      <div class="content">
        条件
      </div>
      <div class="pot-out">{{options.rowTitle}}</div>
      <div class="priority">优先级</div>
      <div class="ctrl">
        操作
      </div>
    </li>
    <li v-for="(it, i) in localTableList" :key="it.ID" class="item">
      <div class="content">
        <i class="index">{{i + 1}}. </i>
        <ConditionTextDisplayComp :conditionObj="it.Constraint" :content="it._Content" />
      </div>
      <!-- 计算数量添加进去 -->
      <div class="pot-out">
        {{it.Value}}
        {{it.Property && Property.getPropertyName(it.Property) ? ` ( ${Property.getPropertyName(it.Property)} )` : ''}}
        {{options.unit}}
      </div>
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
    <li class="empty" v-if="!localTableList || localTableList.length === 0">暂无数据</li>
  </ul>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import ConditionTextDisplayComp from '@/components/common/ConstraintsComps/ConstraintsTable/ConditionTextDisplayComp.vue';
import { TransformConstraintTableItemType } from '@/components/common/ConstraintsComps/ConstraintsTable/utils';
import { Property } from '@/components/common/ConstraintsComps/TypeClass/Property';
import { computed } from 'vue';
import { CapacityConditionItemClass } from '../js/CapacityConditionItemClass';
import { CapacityTypeEnum } from './enum';

const props = defineProps<{
  tableList: TransformConstraintTableItemType<CapacityConditionItemClass>[],
  Type: CapacityTypeEnum
}>();

const emit = defineEmits(['rowRemove', 'rowSave']);

const localTableList = computed(() => props.tableList.filter(it => it.Type === props.Type));

const options = computed(() => {
  const temp = {
    title: '',
    rowTitle: '',
    unit: '',
  };
  switch (props.Type) {
    case CapacityTypeEnum.preparation:
      temp.title = '准备时间';
      temp.unit = '分钟';
      temp.rowTitle = '每次作业准备时间';
      break;
    case CapacityTypeEnum.capacity:
      temp.title = '产能';
      temp.unit = '/每小时';
      temp.rowTitle = '产能';
      break;
    case CapacityTypeEnum.dry:
      temp.title = '干燥时间';
      temp.unit = '分钟';
      temp.rowTitle = '下次作业前干燥时间';
      break;
    default:
      break;
  }

  return temp;
});

const onSaveClick = (e) => {
  emit('rowSave', e, props.Type);
};

const onRemoveClick = (it: TransformConstraintTableItemType<CapacityConditionItemClass>, i: number) => {
  MpMessage.warn({
    title: '确定要删除该设置吗？',
    msg: `${options.value.title}的第${i + 1}个条件`,
    onOk: () => {
      emit('rowRemove', it);
    },
  });
};
</script>

<style scoped lang='scss'>
</style>
