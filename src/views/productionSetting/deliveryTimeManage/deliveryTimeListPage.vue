<template>
  <section class="delivery-time-list-page">
    <header>
      <mp-button type="primary" sizi='small' @click="onItemSetupClick('')">添加发货班次</mp-button>
      <CascaderByArea/>
      <OneLevelSelect
      :title='"出库类型"'
      :options='ExpressList'
      :value='getShiftTimeLisData.CompanyID'
      :defaultProps="{
        value:'ID',
        label:'Name',
      }"
      :showLine='true'
      @change="(ID) => getShiftTimeLisData.CompanyID = ID"
      @requestFunc='getTableDataList'
      ></OneLevelSelect>
    </header>
    <main>
      <el-table fit stripe style="width: 100%" :data="ShiftTimeList">
        <el-table-column
        show-overflow-tooltip prop="ItemName" label="名称" min-width="260" />
        <el-table-column
        show-overflow-tooltip prop="AreaDescribe" label="区域" min-width="220"/>
        <el-table-column
        show-overflow-tooltip prop="ExpressList" label="配送方式" min-width="220" >
          <template #default="scope">
            {{}}
            {{scope.row.ExpressList.map(item => commonStore.ExpressList.find(it => it.ID === item.ID)?.Name).join('、')}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="Shift" label="发货班次" min-width="260">
        <template #default="scope">
            {{JSON.parse(scope.row.Shift).map(item => `${item.S.F}:${item.S.S} 运输时长：${item.D}天${item.H}小时`).join('|')}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" min-width="240">
          <template #default="scope">
            <!-- {{JSON.parse(scope.row.Shift)}} -->
            <template v-if="!scope.row.IsSpecialColor">
              <mp-button type="info" link @click="onItemSetupClick(scope.row.ItemID)">
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
import {
  reactive, onActivated, onMounted, computed, ref, Ref,
} from 'vue';
import CascaderByArea from '@/components/common/SelectComps/CascaderByArea.vue';
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';
import api from '@/api';
import { useCommonStore } from '@/store/modules/common/index';

interface getRecordDataType {
  ProvinceName: string,
  CityName:string,
  CountyName: string,
  CompanyID: number,
  Page: number,
  PageSize: number,
}
interface ExpressListType {
  ID: number,
  Name: string,
}
interface ShiftTimeListType {
  ItemID: string,
  ItemName: string,
  AreaDescribe: string,
  Shift: string,
  ExpressList: ExpressListType[],
}

const commonStore = useCommonStore();
const router = useRouter();
const ShiftTimeList:Ref<ShiftTimeListType[]> = ref([]);
const getShiftTimeLisData:getRecordDataType = reactive({
  ProvinceName: '',
  CityName: '',
  CountyName: '',
  CompanyID: 0,
  Page: 0,
  PageSize: 0,
});
const ExpressList = computed(() => ([{
  Name: '不限',
  ID: 0,
}, ...commonStore.ExpressList]));
const onItemSetupClick = (ItemID) => {
  router.push({
    name: 'deliveryTimeListSteup',
    params: { deliveryTimeID: ItemID || '' },
  });
};
const onRemoveClick = (item) => {
  console.log('aaa');
};
const getTableDataList = (Page = 1) => {
  api.getShiftTimeList(getShiftTimeLisData).then(res => {
    if (res.data.Status === 1000) {
      console.log(res.data.Data);
      ShiftTimeList.value = res.data.Data as ShiftTimeListType[];
    }
  });
  console.log('aaa');
};
const setCondition2ListData = (e) => {
  console.log('aaa');
};
onActivated(() => {
  const deliveryTimeListSteupPage = sessionStorage.getItem('deliveryTimeListSteupPage') === 'true';
  if (deliveryTimeListSteupPage) {
    getTableDataList();
    sessionStorage.removeItem('deliveryTimeListSteupPage');
  }
});
onMounted(() => {
  getTableDataList();
  sessionStorage.removeItem('deliveryTimeListSteupPage');
  if (!commonStore.ExpressList.length) {
    commonStore.getExpressList();
  }
});
</script>
<script lang="ts">
export default {
  name: 'deliveryTimeListPage',
};
</script>
<style lang='scss'>
.delivery-time-list-page {
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
