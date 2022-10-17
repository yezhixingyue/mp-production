<template>
  <section class="mp-erp-period-manage-delivery-time-manage-list-page">
    <header>
      <mp-button type="primary" sizi='small' @click="onItemSetupClick(null)">添加发货班次</mp-button>
      <CascaderByArea/>
      <OneLevelSelect
      :title='"出库类型"'
      :options='[]'
      :value='getRecordData.areaList'
      :defaultProps="{
        value:'SupplierID',
        label:'SupplierName',
      }"
      :showLine='true'
      @change="(ID) => getRecordData.way = ID"
      @requestFunc='() => null'
      ></OneLevelSelect>
    </header>
    <main>
      <el-table fit stripe style="width: 100%">
        <el-table-column
        show-overflow-tooltip prop="Name" label="名称" min-width="260" />
        <el-table-column
        show-overflow-tooltip prop="Linkman" label="区域" min-width="220">
          <template #default="scope">
            <span v-if="!scope.row.IsSpecialColor">专色</span>
            <span v-else>四色</span>
          </template>
        </el-table-column>
        <el-table-column
        show-overflow-tooltip prop="ShowColor" label="配送方式" min-width="220" />
        <el-table-column
        show-overflow-tooltip prop="ShowColor" label="发货班次" min-width="260" />
        <el-table-column prop="name" label="操作" min-width="240">
          <template #default="scope">
            <template v-if="!scope.row.IsSpecialColor">
              <mp-button type="info" link @click="onItemSetupClick(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</mp-button>
              <mp-button type="info" link
                @click="onRemoveClick(scope.row)">
                <i class="iconfont icon-delete"></i>删除</mp-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <!-- <CountComp
        :count='DeliveryTimeDataNumber'
        :watchPage='Condition4DeliveryTimeList.Page'
        :handlePageChange='getTableDataList'
        :pageSize='20'
        center
      /> -->
    </footer>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { reactive } from 'vue';
import CascaderByArea from '@/components/common/SelectComps/CascaderByArea.vue';
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';

interface getRecordDataType {
  areaList: undefined|number,
  way:string
}

const router = useRouter();
const getRecordData:getRecordDataType = reactive({
  areaList: undefined,
  way: '',
});
const onItemSetupClick = (item) => {
  console.log('aaa');
  router.push({
    name: 'deliveryTimeListSteup',
    // params: { TypeID: IDs.TypeID, CategoryID: IDs.CategoryID },
  });
};
const onRemoveClick = (item) => {
  console.log('aaa');
};
const getTableDataList = (Page = 1) => {
  console.log('aaa');
};
const setCondition2ListData = (e) => {
  console.log('aaa');
};

</script>
<script lang="ts">
export default {
  name: 'deliveryTimeListPage',
};
</script>
<style lang='scss'>
.mp-erp-period-manage-delivery-time-manage-list-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 900px;
  > header {
    flex: none;
    height: 60px;
    padding: 0 20px;
    background-color: #fff;
    display: flex;
    align-items: center;
    // flex-wrap: wrap;
    > button {
      width: 140px;
      flex: none;
      height: 30px;
      padding: 0;
      border-radius: 2px;
      margin-right: 30px;
    }
    >.cascader-by-area{
      margin-right: 30px;
    }
    // > ul {
    //   margin-right: 30px;
    // }
  }
  > main {
    flex: 1;
    background-color: #fff;
    margin-top: 10px;
    .el-table{
      flex: 1;
      height: 100%;
    }
  }
  > footer {
    flex: none;
    min-height: 50px;
    background-color: #fff;
    height: 50px;
    text-align: right;
    color: #585858;
    .blue {
      color: #26BCF9;
      margin: 0 3px;
    }
  }
}
</style>
