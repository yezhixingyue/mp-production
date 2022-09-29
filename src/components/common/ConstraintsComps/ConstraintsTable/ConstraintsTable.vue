<template>
  <section class="constraints-table-wrap">
    <header>
      <div class="t-box">
        <span class="mp-common-title-wrap black">{{props.title}}</span>
        <span class="is-blue-span" v-if="props.operateTitle" @click="onConditionEditClick(null)" >{{props.operateTitle}}</span>
      </div>
      <div class="center">
        <MpTips v-if="props.headerIntroText" :msg="props.headerIntroText" />
      </div>
      <div class="d-box">
        <span class="is-pink-span" v-if="props.removeTitle" @click="onTableRemoveClick">{{props.removeTitle}}</span>
      </div>
    </header>
    <ul>
      <li v-for="(it, i) in localTableList" :key="it.ID" class="item">
        <div class="content">
          <i class="index">{{i + 1}}. </i>
          <ConditionTextDisplayComp :conditionObj="it.Constraint" />
        </div>
        <!-- <div class="p" v-if="it."></div>
        <div class="n"></div> -->
        <div class="ctrl">
          <mp-button type="info" class="menu" link @click="onConditionEditClick(it)">
            <i class="iconfont icon-bianji"></i>编辑
          </mp-button>
          <mp-button type="info" class="menu" link @click="onConditionRemoveClick(it, i)">
            <i class="iconfont icon-delete"></i>删除
          </mp-button>
        </div>
      </li>
      <li class="empty" v-if="!localTableList || localTableList.length === 0">暂无数据</li>
    </ul>
  </section>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { computed } from 'vue';
import { ConditionItemClass } from '../ConditionSetupPanel/ConditionItemClass';
import { PropertyListItemType } from '../TypeClass/Property';
import { transformConstraintTableList } from './utils';
import ConditionTextDisplayComp from './ConditionTextDisplayComp.vue';
import MpTips from '../../ElementPlusContainners/MpTips.vue';

const props = defineProps<{
  tableList: ConditionItemClass[] | null,
  PropertyList: PropertyListItemType[],
  title: string,
  operateTitle?: string // 不传值则不展示操作按钮
  removeTitle?: string // 不传值则不展示操作按钮
  headerIntroText?: string
}>();

const emit = defineEmits(['removeTable', 'removeCondition', 'saveCondition']);

const localTableList = computed(() => transformConstraintTableList({ tableList: props.tableList, PropertyList: props.PropertyList }));

const onConditionEditClick = (e) => {
  emit('saveCondition', e);
};

const onTableRemoveClick = () => {
  emit('removeTable');
};

const onConditionRemoveClick = (it, i) => {
  MpMessage.warn({
    title: '确定删除该条件项吗 ?',
    onOk() {
      emit('removeCondition', [it, i]);
    },
  });
};

</script>

<style scoped lang='scss'>
.constraints-table-wrap {
  > header {
    display: flex;
    align-items: center;
    line-height: 18px;
    margin-bottom: 10px;
    > .t-box {
      flex: none;
      display: flex;
      align-items: center;
      .mp-common-title-wrap {
        display: inline-block;
        min-width: 10em;
        margin-right: 12px;
        position: relative;
        top: -1px;
      }
      .is-blue-span {
        font-size: 13px;
      }
    }
    > .center {
      flex: 1;
      font-size: 12px;
      margin-left: 40px;
      color: #989898;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    > .d-box {
      flex: none;
      padding: 0 20px;
      font-size: 13px;
    }
  }
  > ul {
    > li {
      border: 1px solid #eee;
      border-bottom: none;
      line-height: 40px;
      display: flex;
      &.item {
        > .content {
          flex: 1;
          padding: 0 15px;
          font-size: 12px;
          display: flex;
          align-items: center;
          overflow: hidden;
          > .index {
            margin-right: 13px;
          }
        }
        > .ctrl {
          padding-left: 15px;
          width: 220px;
          min-width: 150px;
        }
        transition: 0.05s ease-in-out;
        &:hover {
          cursor: pointer;
          background-color: #f5f5f5;
          border-color: #ccc;
          & + li {
            border-top-color: #ccc;
          }
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
  & + .constraints-table-wrap {
    margin-top: 40px;
  }
}
</style>
