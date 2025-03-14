<template>
  <div class="goods-allocation-page">
    <header>
      <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
        <div class="top-main" v-if="Data.selectData.length">
          <template v-for="(item, index) in Data.selectData" :key="item.id">
            <el-select
              no-data-text="无数据"
              v-model="item.inputValue"
              @change="getGoodsPosition()"
              :filterable='true'>
              <!-- 如果前一个选择的有，就显示下拉数据，否则不显示 -->
              <el-option
                v-for="optionitem in (index === 0 ? item.list : Data.selectData[index-1].inputValue ? item.list : [])"
                :key="optionitem.DimensionID"
                :label="`${optionitem.Dimension}`"
                :value="optionitem.DimensionID"
              />
            </el-select>
          </template>
        </div>
    </header>
    <main>
      <LocationMap
        v-if="Data.allDimensionData.UsePositionDetails"
        :allDimensionData="Data.allDimensionData"
        :add="handleAdd"
        :remove="handleRemove"
      />
    </main>
    <footer>
      <mp-button class="blue" @click="getGoBackFun">返回</mp-button>
    </footer>
  </div>
</template>

<script lang='ts'>
import {
  reactive, onMounted, watch, computed,
} from 'vue';
import { useRoute } from 'vue-router';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import api from '@/api';
import { getGoBackFun } from '@/router';
import messageBox from '@/assets/js/utils/message';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import LocationMap from '../../../components/LocationMap/Index.vue';

interface DimensionsType {
  Dimension: string
  DimensionID: number
}
interface DimensionSelectsType {
  DimensionUnit: string
  Dimensions: DimensionsType[]
}
interface DimensionType {
  Dimension:string
  DimensionNumber: number
}
interface GoodsPositionDimensionSelectType {
  Dimensions: DimensionsType[]
  DimensionSelects:DimensionSelectsType[]
  DimensionXS:DimensionType[]
  DimensionYS:DimensionType[]
  DimensionUnitX:string
  DimensionUnitY:string
}
interface DimensionsFromType {
  id: string,
  inputValue: string,
  list: DimensionsType[],
}
export interface DimensionDataType {
  PositionID: string,
  DetailID: string,
  LeftTopX: number,
  LeftTopY: number,
  DimensionX: string,
  DimensionY: string
}
export interface getGoodsPositionType {
  UsePositionDetails:DimensionDataType[]|null
}
interface DyadicArrayDimensionDataType {
  DimensionX: string,
  DimensionY: string
  xNum: number,
  yNum: number
}
interface AllPositionDetailsType {
  DimensionXS: DimensionType[],
  DimensionYS: DimensionType[]
  DimensionUnitX: string,
  DimensionUnitY: string
}
interface allDimensionDataType {
  AllPositionDetails:AllPositionDetailsType
  UsePositionDetails:DimensionDataType[]|null
  DyadicArrayDimensionData:DyadicArrayDimensionDataType[][]
}
interface DetailSetsType {
  DimensionX: string,
  DimensionY: string,
}
interface GoodsPositionSaveDataType {
  PositionID: string,
  StorehouseID: string,
  PositionName: string,
  DetailSets: DetailSetsType[],
  DimensionIDS:string[]
}

interface DataType {
  PositionNameShow:boolean,
  GoodsPositionDimensionSelect:GoodsPositionDimensionSelectType | null,
  selectData:DimensionsFromType[]
  allDimensionData:allDimensionDataType
  // DyadicArrayDimensionData:DimensionDataType[][]
  actionCells:DimensionDataType[]
  GoodsPositionSaveData:GoodsPositionSaveDataType
  StorehouseName:string
}

export default {
  name: 'goodsAllocationPage',
  components: {
    // DialogContainerComp,
    LocationMap,
    MpBreadcrumb,
  },
  setup() {
    const MaterialWarehouseStore = useMaterialWarehouseStore();
    const route = useRoute();
    const Data:DataType = reactive({
      PositionNameShow: false,
      GoodsPositionDimensionSelect: null,
      StorehouseName: '',
      // 添加/修改货位的表单
      GoodsPositionSaveData: {
        PositionID: '',
        StorehouseID: '',
        PositionName: Math.random().toString(16).slice(-10),
        DetailSets: [
          {
            DimensionX: '4架',
            DimensionY: '1柜',
          },
        ],
        DimensionIDS: [],
      },
      actionCells: [],
      // 货位编号选择
      selectData: [],
      //
      allDimensionData: {
        DyadicArrayDimensionData: [],
        UsePositionDetails: null,
        AllPositionDetails: {
          DimensionXS: [],
          DimensionYS: [],
          DimensionUnitX: '',
          DimensionUnitY: '',
        },
      },
      // 二维单元格数据
      DyadicArrayDimensionData: [],
    });
    const BreadcrumbList = computed(() => [
      { to: { path: '/materialWarehouseManage' }, name: '仓库管理' },
      { name: `规划货位图：${Data.StorehouseName}` },
    ]);
    // 格式化单元格数据为二维数组
    function getDyadicArray() {
      const temp:DyadicArrayDimensionDataType[][] = [];
      const x = Data.GoodsPositionDimensionSelect?.DimensionXS;
      const y = Data.GoodsPositionDimensionSelect?.DimensionYS;
      Data.allDimensionData.AllPositionDetails.DimensionXS = x as DimensionType[];
      Data.allDimensionData.AllPositionDetails.DimensionYS = y as DimensionType[];
      if (Data.GoodsPositionDimensionSelect) {
        Data.allDimensionData.AllPositionDetails.DimensionUnitX = Data.GoodsPositionDimensionSelect.DimensionUnitX;
        Data.allDimensionData.AllPositionDetails.DimensionUnitY = Data.GoodsPositionDimensionSelect.DimensionUnitY;
      }
      y?.forEach(element => {
        const xArr:DyadicArrayDimensionDataType[] = [];
        x?.forEach(item => {
          xArr.push({
            DimensionX: item.Dimension,
            DimensionY: element.Dimension,
            xNum: item.DimensionNumber,
            yNum: element.DimensionNumber,
          });
        });
        temp?.push(xArr);
      });

      Data.allDimensionData.DyadicArrayDimensionData = temp;
    }
    // 判断是否被占用
    function disCheck(col) {
      const temp = Data.allDimensionData.UsePositionDetails?.find(res => {
        const x = res.DimensionX === col.DimensionX;
        const y = res.DimensionY === col.DimensionY;
        return x && y;
      });
      return !!temp;
    }
    // 获取货位详情
    function getGoodsPosition() {
      // 最后一个没有值则不请求
      if (Data.selectData.length && !Data.selectData[Data.selectData.length - 1].inputValue) return;

      const temp = {
        StorehouseID: Data.GoodsPositionSaveData.StorehouseID as string,
        DimensionIDS: [] as Array<string>,
      };
      temp.DimensionIDS = Data.selectData.map(res => res.inputValue);
      api.getGoodsPositionDetail(temp).then(res => {
        if (res?.data?.Status === 1000) {
          const t = res.data.Data as getGoodsPositionType;
          Data.allDimensionData.UsePositionDetails = null;
          setTimeout(() => {
            Data.allDimensionData.UsePositionDetails = t.UsePositionDetails;
          }, 30);
          // Data.allDimensionData.AllPositionDetails = t.AllPositionDetails;
        }
      });
    }

    watch(() => Data.GoodsPositionDimensionSelect, (newValue) => {
      const returnData:DimensionsFromType[] = [];
      if (newValue && newValue.DimensionSelects) {
        newValue.DimensionSelects.forEach(res => {
          returnData.push({
            id: Math.random().toString(16).slice(-10),
            inputValue: '',
            list: res.Dimensions.map(it => ({
              Dimension: `${it.Dimension}${res.DimensionUnit}`,
              DimensionID: it.DimensionID,
            })) as DimensionsType[],
          });
        });
        Data.selectData = returnData;
      }

      getGoodsPosition();
      // 获取二维数组
      Data.allDimensionData.DyadicArrayDimensionData = [];
      getDyadicArray();
    });

    async function handleAdd(e) {
      const DimensionIDS = Data.selectData.map(res => res.inputValue);
      const StorehouseID = route.params.StorehouseID as string;
      const temp = {
        StorehouseID,
        DimensionIDS,
        PositionID: e.PositionID,
        PositionName: e.PositionName,
        DimensionXYS: e.DimensionXYS,
      };

      // 此处是否需要调用接口验证空格是否连续 ??? 如需要 加至此处
      const resp = await api.getGoodsPositionSave(temp).catch(() => null);
      if (resp?.data?.Status === 1000) {
        return {
          ...temp,
          PositionID: resp.data.Data,
        };
      }
      return null;
    }

    async function handleRemove(id): Promise<boolean> {
      const resp = await api.getGoodsPositionRemove(id).catch(() => null);
      if (resp?.data?.Status === 1000) {
        return new Promise((resolve) => {
          const cb = () => {
            resolve(true);
          };
          messageBox.successSingle('删除成功', cb, cb);
        });
      }
      return false;
    }

    // 设置货位
    function setNewPosition() {
      if (!Data.selectData[Data.selectData.length - 1].inputValue) return;
      Data.GoodsPositionSaveData.DimensionIDS = Data.selectData.map(res => res.inputValue);
      const temp = Data.actionCells.map(res => ({
        DimensionX: res.DimensionX,
        DimensionY: res.DimensionY,
      }));

      Data.GoodsPositionSaveData.DetailSets = temp;
      api.getGoodsPositionSave(Data.GoodsPositionSaveData).then(res => {
        if (res?.data?.Status === 1000) {
          getGoodsPosition();
          Data.actionCells = [];
        }
      });
    }

    // 设置货位名
    function setPositionNameCloseClick() {
      Data.PositionNameShow = false;
    }
    // 设置货位名

    function setPositionNameClosed() {
      Data.GoodsPositionSaveData.PositionName = '';
    }
    // 设置货位名
    function setPositionNamePrimaryClick() {
      setNewPosition();
      setPositionNameCloseClick();
    }

    onMounted(() => {
      Data.StorehouseName = route.params.StorehouseName as string;
      Data.GoodsPositionSaveData.StorehouseID = route.params.StorehouseID as string;
      api.getGoodsPositionDimensionSelect(route.params.StorehouseID).then(res => {
        if (res?.data?.Status === 1000) {
          Data.GoodsPositionDimensionSelect = res.data.Data as GoodsPositionDimensionSelectType;
        }
      });
    });

    return {
      BreadcrumbList,
      Data,
      disCheck,
      setNewPosition,
      getGoodsPosition,
      MaterialWarehouseStore,
      setPositionNamePrimaryClick,
      setPositionNameCloseClick,
      setPositionNameClosed,
      handleAdd,
      handleRemove,
      getGoBackFun,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.goods-allocation-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  >header{
    background-color: #fff;
    padding: 20px;
    .el-breadcrumb{
      margin-bottom: 20px;
    }
    >.top-main{
      display: flex;
      // justify-content: space-between;
      .el-select+.el-select{
        margin-left: 20px;
      }
      .mp-search-input-comp{
        display: flex;
      }
    }
  }
  >main{
    flex: 1;
    margin-top: 10px;
    overflow-x: auto;
    padding-left: 20px;
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
    justify-content: center;
    align-items: center;
    .el-button{
      width: 100px;
    }
  }
  .add-material-manage-dialog{
    .el-form{
      .el-form-item{
        margin: 0 auto;
        margin-bottom: 20px;
        width: 370px;
        &.attributes {

          .el-input, .el-select{
            width: 100px;
          }
        }
      }
      >p{
        margin-bottom:10px;
        line-height: 30px;
        color: #F4A307;
      }
    }
  }
}
</style>
