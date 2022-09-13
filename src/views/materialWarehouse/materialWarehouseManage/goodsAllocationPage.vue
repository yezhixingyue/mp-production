<template>
  <div class="goods-allocation-page">
    <header>
      <el-breadcrumb style="margin-bottom:20px">
        <el-breadcrumb-item :to="{ path: '/materialWarehouseManage' }">仓库管理</el-breadcrumb-item>
        <el-breadcrumb-item>规划货位图：{{Data.StorehouseName}}</el-breadcrumb-item>
      </el-breadcrumb>
      <MpCardContainer :TopAndButtomPadding = '12' v-if="Data.selectData.length">
        <div class="top-main">
          <template v-for="(item, index) in Data.selectData" :key="item.id">
            <el-select
              no-data-text="无数据"
              v-model="item.inputValue"
              @change="getGoodsPosition(index)"
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
      </MpCardContainer>
    </header>
    <main :style="`height:${h}px`">
      <MpCardContainer>
        <el-scrollbar>
          <LocationMap
            v-if="Data.allDimensionData.UsePositionDetails"
            :allDimensionData="Data.allDimensionData"
            :add="handleAdd"
            :remove="handleRemove"
          />
        </el-scrollbar>
      </MpCardContainer>
    </main>
    <footer>
      <el-button type="primary" class="is-goback-button" @click="$goback">返回</el-button>
    </footer>
  </div>
</template>

<script lang='ts'>
import MpCardContainer from '@/components/common/MpCardContainerComp.vue';
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';

import {
  ref, reactive, onMounted, watch, computed, ComputedRef, onActivated, nextTick,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import api from '@/api/request/MaterialStorage';
import messageBox from '@/assets/js/utils/message';
import { useCommonStore } from '@/store/modules/common';
import LocationMap from '../../../components/LocationMap/Index.vue';
import Draw from './aaa';

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
  PositionID: number,
  DetailID: number,
  LeftTopX: number,
  LeftTopY: number,
  DimensionX: string,
  DimensionY: string
}
export interface DyadicArrayDimensionDataType {
  DimensionX: string,
  DimensionY: string
  xNum: number,
  yNum: number
}
export interface AllPositionDetailsType {
  DimensionXS: DimensionType[],
  DimensionYS: DimensionType[]
  DimensionUnitX: string,
  DimensionUnitY: string
}
export interface allDimensionDataType {
  AllPositionDetails:AllPositionDetailsType
  UsePositionDetails:DimensionDataType[]|null
  DyadicArrayDimensionData:DyadicArrayDimensionDataType[][]
}

interface DataType {
  PositionNameShow:boolean,
  GoodsPositionDimensionSelect:GoodsPositionDimensionSelectType | null,
  selectData:DimensionsFromType[]
  allDimensionData:allDimensionDataType
  // DyadicArrayDimensionData:DimensionDataType[][]
  actionCells:DimensionDataType[]
  GoodsPositionSaveData:any
  StorehouseName:string
}

export default {
  name: 'goodsAllocationPage',
  components: {
    MpCardContainer,
    // DialogContainerComp,
    LocationMap,
    // OneLevelSelect,
  },
  setup() {
    const h = ref(0);
    const CommonStore = useCommonStore();
    const MaterialWarehouseStore = useMaterialWarehouseStore();
    const route = useRoute();
    const Data:DataType = reactive({
      PositionNameShow: false,
      GoodsPositionDimensionSelect: null,
      StorehouseName: '',
      // 添加/修改货位的表单
      GoodsPositionSaveData: {
        PositionID: 0,
        StorehouseID: 0,
        PositionName: Math.random().toString(16).slice(-10),
        DetailSets: [
          {
            DimensionX: '4架',
            DimensionY: '1柜',
          },
        ],
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
        StorehouseID: Data.GoodsPositionSaveData.StorehouseID as number|string,
        DimensionIDS: [] as Array<string|number>,
      };
      temp.DimensionIDS = Data.selectData.map(res => res.inputValue);
      api.getGoodsPositionDetail(temp).then(res => {
        if (res.data.Status === 1000) {
          const t = res.data.Data as any;
          Data.allDimensionData.UsePositionDetails = null;
          setTimeout(() => {
            Data.allDimensionData.UsePositionDetails = t.UsePositionDetails;
          }, 30);
          // Data.allDimensionData.AllPositionDetails = t.AllPositionDetails;
        }
      });
    }
    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.goods-allocation-page header', 72);
    }
    //
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
        console.log(returnData, 'returnData');
      }
      console.log(Data.GoodsPositionDimensionSelect, 'Data.GoodsPositionDimensionSelect');

      getGoodsPosition();
      // 获取二维数组
      Data.allDimensionData.DyadicArrayDimensionData = [];
      getDyadicArray();

      nextTick(() => {
        setHeight();
      });
    });

    async function handleAdd(e) {
      const DimensionIDS = Data.selectData.map(res => res.inputValue);
      const StorehouseID = Number(route.params.StorehouseID);
      const temp = {
        StorehouseID,
        DimensionIDS,
        PositionID: e.PositionID,
        PositionName: e.PositionName,
        DimensionXYS: e.DimensionXYS,
      };

      // 此处是否需要调用接口验证空格是否连续 ??? 如需要 加至此处
      const resp = await api.getGoodsPositionSave(temp).catch(() => null);
      if (resp?.data.Status === 1000) {
        return {
          ...temp,
          PositionID: Number(resp.data.Data),
        };
      }
      return false;
    }

    async function handleRemove(id) {
      const resp = await api.getGoodsPositionRemove(id).catch(() => null);
      if (resp?.data.Status === 1000) {
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
        if (res.data.Status === 1000) {
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
    watch(() => CommonStore.size, () => {
      setHeight();
    });
    onActivated(() => {
      setHeight();
    });
    onMounted(() => {
      Data.StorehouseName = route.params.StorehouseName as string;
      Data.GoodsPositionSaveData.StorehouseID = Number(route.params.StorehouseID);
      setHeight();
      api.getGoodsPositionDimensionSelect(route.params.StorehouseID).then(res => {
        if (res.data.Status === 1000) {
          Data.GoodsPositionDimensionSelect = res.data.Data as GoodsPositionDimensionSelectType;
        }
      });
    });

    return {
      h,
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
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.goods-allocation-page{
  >header{
    padding: 20px;
    padding-bottom: 0;
    >.mp-card-container{
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
  }
  >main{
    margin-top: 20px;
    overflow-x: auto;
    padding-left: 20px;
    >.mp-card-container{
      display: flex;
      flex-direction: column;
      height: 100%;
      .el-table{
        flex: 1;
      }
    }
  }
  >footer{
    min-height: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
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
