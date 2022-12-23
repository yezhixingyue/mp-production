<template>
  <section class="put-out-page" >
    <header>
      <MpBreadcrumb :list="props.BreadcrumbList"></MpBreadcrumb>
      <div class="header-top">
        <mp-button type="primary" @click="onSaveClick(null)">+ 添加条件</mp-button>
        <span class="tips-box"><el-icon><WarningFilled /></el-icon> 匹配一条作为伸放设置</span>
      </div>
    </header>
    <main>
      <ListTable :tableList="localTableList" @rowRemove="onRemoveClick" @rowSave="onSaveClick" />
    </main>
    <footer>
      <mp-button class="blue" @click="getGoBackFun">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { getGoBackFun } from '@/router';
import { IMpBreadcrumbItem } from '@/assets/Types/common';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { computed } from 'vue';
import { TransformConstraintTableItemType, transformConstraintTableList } from '@/components/common/ConstraintsComps/ConstraintsTable/utils';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import ListTable from './ListTable.vue';
import { PutOutConditionItemClass } from '../js/PutOutConditionItemClass';

const props = defineProps<{
  BreadcrumbList: IMpBreadcrumbItem[],
  list: PutOutConditionItemClass[],
  PropertyList: PropertyListItemType[]
}>();

const emit = defineEmits(['save', 'remove']);

const localTableList = computed(() => transformConstraintTableList({
  tableList: props.list,
  PropertyList: props.PropertyList,
}));

const onSaveClick = (it: TransformConstraintTableItemType<PutOutConditionItemClass> | null) => {
  emit('save', it);
};

const onRemoveClick = (it: TransformConstraintTableItemType<PutOutConditionItemClass> | null) => {
  emit('remove', it);
};
</script>

<style lang='scss'>
@import '@/assets/css/var.scss';
$row-hover-bg-color: lighten($color: #d8effc, $amount: 6);
$row-hover-border-color: #d6effc;
$row-active-bg-color: lighten($color: #d8effc, $amount: 6);
$row-active-border-color: darken($color: #d8effc, $amount: 15);

.put-out-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  font-size: 12px;
  >header{
    padding: 20px;
    padding-bottom: 0;
    .header-top{
      margin-top: 20px;
      .tips-box {
        margin-left: 20px;
        i {
          vertical-align: -2px;
        }
      }
    }
  }
  >main{
    flex: 1;
    margin-top: 20px;
    overflow-x: auto;
    padding-left: 20px;
    // padding-top: 20px;
    box-sizing: border-box;
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
          >.pot-out{
            width: 150px;
            text-align: center;
          }
          >.priority{
            width: 150px;
            text-align: center;
          }
          > .ctrl {
            padding-left: 15px;
            width: 220px;
            min-width: 150px;
          }
          transition: 0.1s ease-in-out;
          &:hover {
            cursor: pointer;
            background-color: $row-hover-bg-color;
            border-color: $row-hover-border-color;
            & + li {
              border-top-color: $row-hover-border-color;
            }
            & + li.active {
              border-top-color: $row-active-border-color;
            }
          }
          &.active {
            background-color: $row-active-bg-color;
            border-color: $row-active-border-color;
            & + li {
              border-top-color: $row-active-border-color;
            }
          }
        }
        &.header{
          color: #444;
          font-weight: 700;
          font-size: 14px;
          background-color: #f8f8f8 !important;
          border-color: #eee!important;
          > .content{
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
  }
  >footer{
    min-height: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 50px;
    .el-button{
      width: 120px;
    }
    .el-button + .el-button{
      margin-left: 30px;
    }
  }
  .add-equipment-dialog{
    .one-list{
      min-height: 350px;
      p{
        font-size: 14px;
        font-weight: 700;
        padding: 10px 0;
      }
      .one{
        padding-left: 1em;
      }
      .tow{
        padding-left: 2em;
      }
      .checkbox{
        padding-left: 3em;
      }
    }
  }
}
</style>
