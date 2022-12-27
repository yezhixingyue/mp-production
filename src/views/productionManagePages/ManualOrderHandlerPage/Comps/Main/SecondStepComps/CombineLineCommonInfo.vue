<template>
  <div v-if="combineData && combineData._curCombineLine" class="combine-line-common-info-wrap">
    <p class="mt-10">
      <span class="title ft-14">成品尺寸:</span>
      <el-input v-model.trim="combineData.Attribute.Size" maxlength="40" style="width: 290px;"></el-input>
    </p>
    <RightSetupPanelComp v-model="combineData" index="" isCombine :WorkingProcedures="combineData._curCombineLine?.Detail.WorkingProcedures || []" />
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { ManualOrderHandlerPageData } from '../../../js';
import RightSetupPanelComp from './ProductionInstanceComps/RightSetupPanelComp.vue';

const combineData = computed(() => ManualOrderHandlerPageData.value?.CreateOrderInfo);

</script>

<style scoped lang='scss'>
.combine-line-common-info-wrap {
  width: 855px;
  margin: 0 auto;
  margin-bottom: 20px;
  .title {
    font-weight: 700;
    flex: none;
    margin-right: 10px;
    font-size: 14px;
  }
  > table {
    margin-top: 18px;
    width: 855px;
    border-collapse: collapse;
    > thead > tr {
      display: flex;
      align-items: center;
      padding-bottom: 4px;

      :deep(.el-checkbox__label) {
        font-size: 14px;
      }
      .empty {
        display: flex;
        align-items: center;
        position: relative;
        top: 1px;
        i {
          font-size: 14px;
          margin-right: 5px;
          margin-left: 25px;
        }
      }
    }
    > tbody {
      > tr {
        height: 40px;
        border: 1px solid #E5E5E5;
        transition: background-color 0.1s ease-in-out;
        &:nth-of-type(even) {
          background-color: #f5f5f5;
        }
        &:hover {
          background-color: lighten($color: #26bcf9, $amount: 40);
        }
        &.extra {
          border: none;
          background-color:rgba(0, 0, 0, 0);
          height: 20px;
          position: relative;
          > button {
            position: absolute;
            right: 2px;
            top: 6px;
            font-size: 13px;
          }
        }
        > td {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          box-sizing: border-box;
          padding: 0 10px;
          &.w-title {
            padding-left: 50px;
            width: 196px;
            max-width: 196px;
          }
          &.w-content {
            width: 420px;
            max-width: 420px;
            padding-right: 20px;
            text-align: left;
            &.file {
              > em {
                width: 72px;
              }
              > i {
                max-width: calc(100% - 72px);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                display: inline-block;
                vertical-align: top;
              }
            }
          }
          &.w-work-times {
            width: 150px;
            .el-input {
              width: 55px;
            }
          }
          &.w-operator {
            // width: 239px;
            padding-left: 10px;
            .remove {
              margin-left: 70px;
            }
            :deep(.select-file-button-dom) {
              font-size: 12px;
            }
          }
        }
      }
    }
    // &.work-table > tbody > tr > td {
    //   &.w-content {
    //     width: 475px;
    //     max-width: 475px;
    //   }
    // }
  }
}
</style>
