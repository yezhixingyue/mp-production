<template>
  <PageContent v-if="processInfo" :BreadcrumbList="BreadcrumbList" :cur-edit-item="processInfo" @saved="setStorage" />
</template>

<script lang="ts" setup>
import {
  onMounted, computed, ref, Ref,
} from 'vue';
import { useRoute } from 'vue-router';
import { IProductionLineWorkings } from '@/store/modules/productionSetting/types';
import PageContent from '../MaterialSource/PageContent.vue';

const route = useRoute();
const processInfo:Ref<IProductionLineWorkings|null> = ref(null);

const BreadcrumbList = computed(() => [
  { to: { path: '/combinationProductionLine' }, name: '组合生产线' },
  // { to: { path: '/productionLine' }, name: '生产线' },
  {
    name: '物料来源',
  },
]);

function setStorage() { // 设置会话存储
  sessionStorage.setItem('combinationProductionLinePage', 'true');
  // sessionStorage.setItem('productionLinePage', 'true');
}

onMounted(() => {
  const temp = JSON.parse(route.params.processInfo as string) as IProductionLineWorkings;
  if (temp) {
    processInfo.value = temp;
  }
});
</script>
<script lang="ts">
export default {
  name: 'combinationMaterialSourcePage',
};
</script>
<style lang='scss'>
// materialSourcePage
@import '@/assets/css/var.scss';
.material-source-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  font-size: 12px;
  >header{
    padding: 20px;
    padding-bottom: 0;
  }
  >main{
    flex: 1;
    margin-top: 20px;
    overflow-x: auto;
    padding-left: 20px;
    padding-top: 20px;
    box-sizing: border-box;
    .el-table{
      height: 100%;
      .source{
        display: flex;
        line-height: 32px;
        .el-radio-group{
          margin-left: 16px;
        }
        .max-margin-left{
          margin-left: 200px;
        }
        .Process-list{
          padding: 0 20px;
          padding-right: 0;
          max-width: calc(100% - 63px - 238px);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          height: 32px;
          color: #F4A307;
          span{
            color: #444;
          }
        }
        .el-button{
          margin-left: 20px;
        }
      }
      .el-table__header-wrapper, .el-table__body-wrapper{
        tr{
          th:nth-child(2)>.cell{
            padding-left: 150px !important;
          }
          .el-table__cell:nth-child(2)>.cell{
            box-sizing: border-box;
            text-align: left;
            padding-left: 50px;
          }
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
}
</style>
