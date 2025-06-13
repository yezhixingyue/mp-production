<template>
  <ul class="list-table">
    <li class="item header">
      <div class="content">
        条件
      </div>
      <div class="pot-out">申放</div>
      <div class="priority">优先级</div>
      <div class="ctrl" v-if="!hideCtrl">
        操作
      </div>
    </li>
    <li v-for="(it, i) in props.tableList" :key="it.ID" class="item">
      <div class="content">
        <i class="index">{{ i + 1 }}. </i>
        <ConditionTextDisplayComp :conditionObj="it.Constraint" :content="it._Content" />
      </div>
      <div class="pot-out">{{ it.Value }}{{ it.Type === 0 ? '张' : '%' }}</div>
      <div class="priority">{{ it.Priority }}</div>
      <div class="ctrl" v-if="!hideCtrl">
        <mp-button type="info" class="menu" link @click="onSaveClick(it)">
          <i class="iconfont icon-bianji"></i>编辑
        </mp-button>
        <mp-button type="info" class="menu" link @click="onRemoveClick(it, i)">
          <i class="iconfont icon-delete"></i>删除
        </mp-button>
      </div>
    </li>
    <li class="empty" v-if="!props.tableList || props.tableList.length === 0">{{ emptyText || '暂无数据' }}</li>
  </ul>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import ConditionTextDisplayComp from '@/components/common/ConstraintsComps/ConstraintsTable/ConditionTextDisplayComp.vue';
import { TransformConstraintTableItemType } from '@/components/common/ConstraintsComps/ConstraintsTable/utils';
import { PutOutConditionItemClass } from '../js/PutOutConditionItemClass';

const props = defineProps<{
  tableList: TransformConstraintTableItemType<PutOutConditionItemClass>[]
  hideCtrl?: boolean
  emptyText?: string
}>();

const emit = defineEmits(['rowRemove', 'rowSave']);

const onSaveClick = (e) => {
  emit('rowSave', e);
};

const onRemoveClick = (it: TransformConstraintTableItemType<PutOutConditionItemClass>, i: number) => {
  MpMessage.warn({
    title: '确定要删除此申放吗？',
    msg: `条目：第 [ ${i + 1} ] 条`,
    onOk: () => {
      emit('rowRemove', it);
    },
  });
};
</script>

<style scoped lang='scss'>
@import '@/assets/css/var.scss';
$row-hover-bg-color: lighten($color: #d8effc, $amount: 6);
$row-hover-border-color: #d6effc;
$row-active-bg-color: lighten($color: #d8effc, $amount: 6);
$row-active-border-color: darken($color: #d8effc, $amount: 15);

.list-table {
  >li {
    border: 1px solid #eee;
    border-bottom: none;
    line-height: 40px;
    display: flex;
    white-space: nowrap;

    &.item {
      >.content {
        flex: 1;
        padding: 0 15px;
        font-size: 12px;
        display: flex;
        align-items: center;
        overflow: hidden;

        >.index {
          margin-right: 3px;
          min-width: 25px;
        }
      }

      >.pot-out {
        width: 150px;
        text-align: center;
      }

      >.priority {
        width: 150px;
        text-align: center;
      }

      >.ctrl {
        padding-left: 15px;
        width: 220px;
        min-width: 150px;
      }

      transition: 0.1s ease-in-out;

      &:hover {
        cursor: pointer;
        background-color: $row-hover-bg-color;
        border-color: $row-hover-border-color;

        &+li {
          border-top-color: $row-hover-border-color;
        }

        &+li.active {
          border-top-color: $row-active-border-color;
        }
      }

      &.active {
        background-color: $row-active-bg-color;
        border-color: $row-active-border-color;

        &+li {
          border-top-color: $row-active-border-color;
        }
      }
    }

    &.header {
      color: #444;
      font-weight: 700;
      font-size: 14px;
      background-color: #f8f8f8 !important;
      border-color: #eee !important;

      >.content {
        justify-content: center;
        font-size: 14px;
      }
    }

    &:last-of-type {
      border: 1px solid #eee;
    }

    &.empty {
      height: 60px;
      font-size: 12px;
      text-align: center;
      color: #aaa;
      justify-content: center;
      padding-top: 6px;
    }
  }
}
</style>
