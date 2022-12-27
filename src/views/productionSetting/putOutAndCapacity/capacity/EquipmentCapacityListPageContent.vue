<template>
  <section class="capacity-list-page" >
    <header>
      <MpBreadcrumb :list="props.BreadcrumbList"></MpBreadcrumb>
      <div class="header-top">
      </div>
    </header>
    <main>
      <template v-for="it in Object.values(CapacityTypeEnum)" :key="it">
        <ListTable v-if="typeof it === 'number'" :tableList="localTableList" :Type="it" @rowRemove="onRemoveClick" @rowSave="onSaveClick" />
      </template>
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
import { PropertyListClass } from '@/components/common/ConstraintsComps/TypeClass/PropertyListClass';
import { CapacityTypeEnum } from './enum';
import ListTable from './ListTable.vue';
import { CapacityConditionItemClass } from '../js/CapacityConditionItemClass';

const props = defineProps<{
  BreadcrumbList: IMpBreadcrumbItem[],
  list: CapacityConditionItemClass[],
  PropertyList: PropertyListItemType[]
  rightPropertyList: PropertyListItemType[]
}>();

const emit = defineEmits(['save', 'remove']);

const localTableList = computed(() => transformConstraintTableList({
  tableList: props.list,
  PropertyList: props.PropertyList,
}).map(it => ({ ...it, Property: PropertyListClass.getPerfectPropertyByImperfectProperty(it.Property, props.rightPropertyList || []) })));

const onSaveClick = (it: TransformConstraintTableItemType<CapacityConditionItemClass> | null, type: CapacityTypeEnum) => {
  emit('save', it, type);
};

const onRemoveClick = (it: TransformConstraintTableItemType<CapacityConditionItemClass> | null) => {
  emit('remove', it);
};
</script>

<style lang='scss'>

@import '@/assets/css/var.scss';
$row-hover-bg-color: lighten($color: #d8effc, $amount: 6);
$row-hover-border-color: #d6effc;
$row-active-bg-color: lighten($color: #d8effc, $amount: 6);
$row-active-border-color: darken($color: #d8effc, $amount: 15);

.capacity-list-page{
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
    }
  }
  >main{
    flex: 1;
    // margin-top: 20px;
    overflow-x: auto;
    padding-left: 20px;
    // padding-top: 20px;
    box-sizing: border-box;
    > .title{
      font-size: 14px;
      color: #444444;
      font-weight: 600;
      border-left: 3px solid #05C1FF;
      padding-left: 13px;
      line-height: 14px;
      margin: 20px 0;
      height: 16px;
      display: flex;
      align-items: center;
      &:first-of-type {
        margin-top: 8px;
      }
      >span{
        width: 100px;
        &.hint{
        font-size: 12px;
        line-height: 30px;
        color: #F4A307;
        position: relative;
        padding-left: 33px;
        margin-left: 20px;
        &::before{
          content: '';
          background-image: url('@/assets/images/warn.png');
          display: inline-block;
          background-size: 13px 13px;
          width: 13px;
          height: 13px;
          margin: 0 10px;
          position: absolute;
          left: 0;
          top: 8px;
        }
      }
      }
    }
    > ul {
      padding-bottom: 25px;
      &:last-of-type {
        padding-bottom: 10px;
      }
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
            width: 220px;
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
          background-color: #F5F5F5;
          &:hover{
            background-color: #F5F5F5;
          }
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
