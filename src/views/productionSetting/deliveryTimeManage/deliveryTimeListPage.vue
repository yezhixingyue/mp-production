<template>
  <section class="delivery-time-list-page">
    <header>
      <mp-button type="primary" sizi='small' @click="onItemSetupClick('')">添加发货班次</mp-button>
      <EpCascaderWithLevel3
        title="区域"
        :setCondition='setCondition'
        :levelTreeList='DistrictTreeList'
        :First='getShiftTimeLisData.ProvinceName'
        :Second='getShiftTimeLisData.CityName'
        :Third='getShiftTimeLisData.CountyName'
        :getList="() => getTableDataList()"
        :typeList="[['ProvinceName', ''],['CityName', ''],['CountyName', '']]"
        :defaultProps="{
          ID: 'Name',
          Name: 'Name',
          children: 'children',
        }"
        class="mr-20"
      />
      <div>
        <span class="title bold mr-10">配送方式：</span>
        <el-select v-model="ExpressVal" class="mp-select">
          <el-option v-for="item in ExpressList" :key="item.ID" :label="item.Name" :value="item.ID" />
        </el-select>
      </div>
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
      <MpPagination center
        :nowPage="getShiftTimeLisData.Page" :pageSize="getShiftTimeLisData.PageSize" :total="ShiftTimeListNumber" :handlePageChange="getTableDataList" />
    </footer>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import {
  reactive, onActivated, onMounted, computed, ref, Ref,
} from 'vue';
import api from '@/api';
import { useCommonStore } from '@/store/modules/common/index';
import messageBox from '@/assets/js/utils/message';
import { storeToRefs } from 'pinia';
import CommonClassType, { ISetConditionParams } from '@/store/modules/formattingTime/CommonClassType';
import EpCascaderWithLevel3 from '@/components/common/EpCascader/EpCascaderWrap/EpCascaderWithLevel3.vue';
import MpPagination from '@/components/common/MpPagination.vue';

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
const ShiftTimeListNumber = ref(0);
const getShiftTimeLisData:getRecordDataType = reactive({
  ProvinceName: '不限',
  CityName: '',
  CountyName: '',
  CompanyID: 0,
  Page: 1,
  PageSize: 20,
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

const { DistrictTreeList } = storeToRefs(commonStore);

const setCondition = ([[key1, key2], value]: ISetConditionParams) => {
  CommonClassType.setCondition([[key1, key2], value], getShiftTimeLisData);
};

const ExpressVal = computed({
  get() {
    return getShiftTimeLisData.CompanyID;
  },
  set(val) {
    getShiftTimeLisData.CompanyID = val;
    getTableDataList();
  },
});

const getTableDataList = (Page = 1) => {
  getShiftTimeLisData.Page = Page;
  const temp = { ...getShiftTimeLisData };
  if (getShiftTimeLisData.ProvinceName === '不限') temp.ProvinceName = '';
  api.getShiftTimeList(temp).then(res => {
    if (res.data.Status === 1000) {
      ShiftTimeList.value = res.data.Data as ShiftTimeListType[];
      ShiftTimeListNumber.value = res.data.DataNumber;
    }
  });
};
const onRemoveClick = (item) => {
  messageBox.warnCancelBox('确定要删除此发货班次吗？', `${item.ItemName}`, () => {
    api.getShiftTimeRemove(item.ItemID).then(res => {
      if (res.data.Status === 1000) {
        // 删除成功
        getTableDataList();
      }
    });
  }, () => undefined);
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
  commonStore.getDistrictList();
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
    box-sizing: border-box;
    padding-top: 6px;
    .blue {
      color: #26BCF9;
      margin: 0 3px;
    }
  }
}
</style>
