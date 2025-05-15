<template>
  <div class="stores-requisition-page">
    <header>
      <div class="top-main flex-box">
        <!-- :level2Options='MaterialTypeList' -->
          <RadioGroupComp
            :title='"物料筛选"'
            :level1Options='CategoryList'
            :defaultProps="{
              value:'CategoryID',
              label:'CategoryName',
            }"
            :lv2DefaultProps="{
              value:'TypeID',
              label:'TypeName',
            }"
            :value='twoSelecValue'
            @change="twoSelectChange"
            @requestFunc='()=>storesRequisition.getList()'
            ></RadioGroupComp>
          <span>
            <b>状态：</b>
            <RadioGroupComp
              :title='"物料筛选"'
              :level1Options='StatesList'
              :defaultProps="{
                value:'StatusID',
                label:'StatusName',
              }"
              :value='StatesValue'
              @change="StatesChange"
              @requestFunc='()=>storesRequisition.getList()'
              ></RadioGroupComp>
          </span>
      </div>
      <div class="top-main flex-between">
          <LineDateSelectorComp
          :changePropsFunc='storesRequisition.setCondition4DataList'
          :requestFunc='()=>storesRequisition.getList()'
          :isFull="true"
          :typeList="[['DateType', ''], ['CreateTime', 'First'], ['CreateTime', 'Second']]"
          :dateValue='storesRequisition.getListData.DateType'
          :UserDefinedTimeIsActive='UserDefinedTimeIsActive'
          :label="'时间筛选'"
          >
          <!-- :dateList="dateList" -->
          </LineDateSelectorComp>
            <SearchInputComp
              :word='storesRequisition.getListData.KeyWords'
              title="关键词搜索"
              placeholder="请输入搜索关键词"
              resetWords="清空所有筛选条件"
              :changePropsFunc="(words) => storesRequisition.ChangeCondition(['KeyWords', words])"
              :requestFunc='()=>storesRequisition.getList()'
              @reset='clearCondition'
              >
            </SearchInputComp>
      </div>
    </header>
    <main>
      <el-table border fit stripe
        :data="storesRequisition.List" style="width: 100%">
        <el-table-column show-overflow-tooltip prop="Code" label="领料编号" min-width="133">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="PlateCode" label="大版ID" min-width="90">
        </el-table-column>
        <el-table-column
        show-overflow-tooltip prop="SKU" label="SKU编码" min-width="146">
        </el-table-column>
        <el-table-column
        show-overflow-tooltip prop="Material.ClassName" label="分类" min-width="100">
        </el-table-column>

        <el-table-column
        show-overflow-tooltip prop="Material.TypeName" label="类型" min-width="110"/>
        <el-table-column
        show-overflow-tooltip prop="Material.MaterialName" label="物料" min-width="178"/>
        <el-table-column
        show-overflow-tooltip prop="SizeName" label="尺寸规格" min-width="200">
        </el-table-column>

        <el-table-column prop="Number" label="数量" min-width="90">
          <template #default="scope:any">
            {{scope.row.Number}}{{scope.row.Unit}}
          </template>
        </el-table-column>
        <el-table-column
        show-overflow-tooltip prop="OperaterName" label="机器设备" min-width="270">
          <template #default="scope:any">
            {{scope.row.ReceiveEquipment.ClassName}}
            {{scope.row.ReceiveEquipment.GroupName}}
            <b>{{scope.row.ReceiveEquipment.Name}}</b>
          </template>
        </el-table-column>
        <el-table-column
        show-overflow-tooltip prop="CreateTime" label="下单时间" min-width="130">
          <template #default="scope:any">
            {{format2MiddleLangTypeDateFunc2(scope.row.CreateTime)}}
          </template>
        </el-table-column>
        <el-table-column
        show-overflow-tooltip prop="CreateTime" label="状态" min-width="80">
          <template #default="scope:any">
            <template v-if="scope.row.Status === 0">
              待出库
            </template>
            <template v-if="scope.row.Status === 1">
              已出库
            </template>
            <template v-if="scope.row.Status === 255">
              已取消
            </template>
          </template>
        </el-table-column>
        <el-table-column
        show-overflow-tooltip prop="CreateTime" label="操作" min-width="163">
          <template #default="scope:any">
            <mp-button v-if="localPermission?.Setup" type="primary" :disabled="!scope.row.Status" link @click="toOut(scope.row)">查看领料单</mp-button>
            <mp-button v-if="localPermission?.Setup" type="primary" :disabled="scope.row.Status" link @click="toOut(scope.row)">出库</mp-button>
            <!-- <el-button :disabled="scope.row.Status" type="primary" link @click="toOut(scope.row)">出库</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <MpPagination
      style="width: 100%;"
      center
      :nowPage="storesRequisition.getListData.Page"
      :pageSize="storesRequisition.getListData.PageSize"
      :total="storesRequisition.DataTotal"
      :handlePageChange="PaginationChange" />
    </footer>
  </div>
</template>

<script lang='ts'>
import RadioGroupComp from '@/components/common/RadioGroupComp.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import LineDateSelectorComp from '@/components/common/LineDateSelectorComp.vue';
import {
  onMounted, computed, ComputedRef,
} from 'vue';
import { useRouter } from 'vue-router';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import { useStoresRequisition } from '@/store/modules/storesRequisition';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
// import type { IMaterial, IList } from '@/store/modules/materialWarehouse/StoresRequisitionTypes';
import { useUserStore } from '@/store/modules/user';

interface twoSelecValueType {
  level1Val:null|string|number,
  level2Val:null|string|number,
}

// interface IgetListData {
//   DateType:string
//   Material: IMaterial,
//   CreateTime: {
//     First: string,
//     Second: string,
//   },
//   Status:number | string,
//   Page:number,
//   KeyWords: string,
//   PageSize:number,
// }

// interface DataType {
//   DataTotal: number,
//   List:IList[],
//   getListData: IgetListData,
// }

export default {
  name: 'storesRequisitionPage',
  components: {
    RadioGroupComp,
    SearchInputComp,
    MpPagination,
    LineDateSelectorComp,
  },
  setup() {
    const userStore = useUserStore();
    const { user } = userStore;
    const localPermission = computed(() => user?.PermissionList?.PermissionRequisition?.Obj);
    const router = useRouter();
    const MaterialWarehouseStore = useMaterialWarehouseStore();
    const storesRequisition = useStoresRequisition();
    // function setCondition4DataList([[key1, key2], value]) {
    //   if (key2) storesRequisition.getListData[key1][key2] = value;
    //   else storesRequisition.getListData[key1] = value;
    // }

    const UserDefinedTimeIsActive = computed(() => storesRequisition.getListData.DateType === ''
      && !!storesRequisition.getListData.CreateTime.First && !!storesRequisition.getListData.CreateTime.Second);

    const twoSelecValue:ComputedRef<twoSelecValueType> = computed(() => ({
      level1Val: storesRequisition.getListData.Material.ClassID,
      level2Val: '',
    }));
    const StatesValue:ComputedRef<twoSelecValueType> = computed(() => ({
      level1Val: storesRequisition.getListData.Status,
      level2Val: '',
    }));

    function PaginationChange(newVal) {
      // if (Data.getListData.Page === newVal) return;
      // Data.getListData.Page = newVal;
      storesRequisition.getList(newVal);
    }

    const StatesList = computed(() => [{ StatusID: '', StatusName: '不限' },
      { StatusID: 0, StatusName: '待出库' },
      { StatusID: 1, StatusName: '已出库' },
      { StatusID: 255, StatusName: '已取消' }]);
    const CategoryList = computed(() => [{ CategoryID: '', CategoryName: '全部分类' },
      ...MaterialWarehouseStore.MaterialTypeGroup]);
    // const MaterialTypeList = computed(() => {
    //   const noType = {
    //     TypeID: '',
    //     TypeName: '全部类型',
    //   };
    //   const MaterialType = CategoryList.value.find(it => it.CategoryID === Data.getListData.CategoryID);
    //   if (MaterialType && MaterialType.CategoryID) {
    //     const temp = MaterialType as MaterialTypeGroupType;
    //     return [noType, ...temp.MaterialTypes] || [];
    //   }
    //   return [noType];
    // });
    // 清空筛选项
    function clearCondition() {
      storesRequisition.clearCondition();
    }

    function twoSelectChange(levelData) {
      const { level1Val } = levelData;
      if (level1Val !== undefined) {
        storesRequisition.ChangeMaterialClassID(level1Val);
        // Data.getListData.TypeID = level2Val;
      }
    }
    function StatesChange(levelData) {
      const { level1Val } = levelData;
      if (level1Val !== undefined) {
        storesRequisition.ChangeCondition(['Status', level1Val]);
        // Data.getListData.TypeID = level2Val;
      }
    }
    function toOut(item) {
      const routeData = router.resolve({
        name: 'outDelivery',
        query: { StoresRequisitionInfo: JSON.stringify(item || '') },
      });
      window.open(routeData.href, '_blank');
    }

    onMounted(() => {
      if (!MaterialWarehouseStore.MaterialTypeGroup.length) {
        MaterialWarehouseStore.getMaterialTypeGroup();
      }
      storesRequisition.getList();
      MaterialWarehouseStore.getSupplierSelectList();
      setInterval(() => {
        const bool = localStorage.getItem('getStoresRequisitionList') === 'true';
        if (!bool) return;
        storesRequisition.getList();
        localStorage.removeItem('getStoresRequisitionList');
      }, 800);
    });

    return {
      localPermission,
      storesRequisition,
      StatesValue,
      StatesChange,
      // setCondition4DataList,
      UserDefinedTimeIsActive,
      StatesList,
      twoSelecValue,
      CategoryList,
      // MaterialTypeList,
      PaginationChange,
      twoSelectChange,
      clearCondition,
      MaterialWarehouseStore,
      format2MiddleLangTypeDateFunc2,
      toOut,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.stores-requisition-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  >header{
    background-color: #fff;
    >.header-top{
      margin-bottom: 20px;
  > .el-tabs {
    border: none;
    .el-tabs__content{
      display: none;
    }
    > .el-tabs__header {
      background-color: rgb(245, 245, 245);
      padding-left: 30px;
      padding-top: 13px;
      .el-tabs__nav {
        margin-left: 1px;
        margin-top: 1px;
        .el-tabs__item{
          border-color: #E4E7ED;
        }
        .el-tabs__item:first-child{
          border-radius: 3px 0 0 0;
        }
        .el-tabs__item:last-child{
          border-radius: 0 3px 0 0;
        }
        > div {
          height: 38px;
          line-height: 36px;
          &.is-active {
            position: relative;
            background-color: #fff;
            border-bottom: none;
            &::before {
              content: "";
              position: absolute;
              height: 2px;
              width: calc(100%);
              background-color: rgb(38, 188, 249);
              left: 0px;
              top: -1px;
              border-radius: 2px;
            }
          }
          font-size: 13px;
          // font-weight: 600;
        }
      }
    }
  }
    }
      >.top-main{
        padding: 0 20px;
        display: flex;
        flex-wrap: wrap;
        &.flex-between{
          justify-content: space-between;
          align-items: flex-start;
          .mp-line-date-selector-wrap{
            margin-bottom: 18px;
          }
          .mp-common-comps-search-box{
            margin-bottom: 18px;
          }
        }
        &.flex-box{
          justify-content: space-between;
          align-items: flex-start;
          padding-top: 20px;
          >.mp-tow-level-radio-group{
            flex: 1;
          }
          >span{
            display: flex;
            align-items: center;
            .mp-tow-level-radio-group{
              margin-left: 10px;
            }
          }
        }
        .mp-search-input-comp{
          display: flex;
        }
        // &+.top-main{
        // }
        >ul{
          margin-right: 60px;
          margin-bottom: 18px;
          .text{
            width: 5em;
          }
        }
      }
  }
  >main{
    flex: 1;
    margin-top: 10px;
    overflow-x: auto;
    background-color: #fff;
      .el-table{
        height: 100%;
        flex: 1;
      }
  }
  >footer{
    background-color: #fff;
    min-height: 50px;
    height: 50px;
    display: flex;
    align-items: center;
  }
  .storehouse-stock-dialog{
    > p{
      font-size: 18px;
      padding: 0 10px;
      padding-top: 15px;
    }
    &.storehouse-stock-dialog{
      display: flex;
      flex-direction: column;
      height: 100%;
      .material-manage{
        font-size: 14px;
        p{
          padding: 0 10px;
        }
      }
      .warehouse{
        height: calc(100% - 37px);
        overflow-x: auto;
        flex: 1;
        padding-top: 10px;
        padding-right: 10px;
        .warehouse-item{
          .title{
            font-size: 20px;
            font-weight: 400;
            // line-height: 17px;
            display: flex;
            justify-content: space-between;
            span{
              color: #566176;
            }
            margin-bottom: 10px;
            padding: 0 10px;
          }
            &.warehouse-item + .warehouse-item {
              .title{
                margin-top: 20px;
              }
            }
          ul{
            border: 1px solid #A6B6C6;
            border-radius: 8px;
            padding: 0 20px;
            li{
              display: flex;
              border-bottom: 1px solid #F2F6FC;
              min-height: 70px;
              align-items: center;
              text-align: center;
              justify-content: space-between;
              &li:last-child{
                display: flex;
                border-bottom: none;
                height: 70px;
              }
              .ranks{
                width: 180px;
              }
              .PCS{
                width: 125px;
              }
              .el-button{
                width: 100px;
                margin: 0 20px;
              }
            }
          }
        }
        p{
          font-size: 18px;
          padding: 0 10px;
          padding-top: 15px;
        }
      }
      .total{
        font-size: 20px;
        font-weight: 400;
        line-height: 17px;
        margin-top: 20px;
        padding: 0 10px;
      }
    }
  }
}
</style>
