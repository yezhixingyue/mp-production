<template>
  <div class="goods-allocation-page">
    <header>
      <MpCardContainer :TopAndButtomPadding = '12'>
        {{Data.StorehouseName}}
        <div class="top-main">
          <template v-for="(item, index) in Data.selectData" :key="item.id">
            <el-select
              v-model="item.inputValue"
              @change="getGoodsPosition(index)"
              :filterable='true'>
              <el-option
                v-for="optionitem in item.list"
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
        <LocationMap
          v-if="Data.allDimensionData"
          :allDimensionData="Data.allDimensionData"
          :add="handleAdd"
          :remove="handleRemove"
        />
        <!-- <el-button @click="Data.PositionNameShow = true"
        :disabled="Data.actionCells.length === 0">设置新货位</el-button>
        <div>
          <el-checkbox-group v-model="Data.actionCells">
            <p v-for="(rowLine,index) in Data.DyadicArrayDimensionData"
            :key="index">
                <el-checkbox v-for="(col,i) in rowLine" :key="`${index}-${i}`" :label="col"
                :disabled="disCheck(col)">
                  {{col.DimensionX}}-{{col.DimensionY}}
                </el-checkbox>
            </p>
          </el-checkbox-group>
          <canvas id="setposition" width="1000" height="600"></canvas>
        </div> -->
      </MpCardContainer>
    </main>
    <footer>
      <el-button type="primary" @click="$goback">返回</el-button>
    </footer>
    <!-- <DialogContainerComp
    title="货位名"
    :visible='Data.PositionNameShow'
    :width="440"
    :primaryClick="setPositionNamePrimaryClick"
    :closeClick="setPositionNameCloseClick"
    :closed="setPositionNameClosed"
    :top="'10vh'"
    >
    <template #default>
      <div class="name-dialog">
        <el-form :model="Data.GoodsPositionSaveData" label-width="120px">
          <el-form-item :label="`货位名：`" class="form-item-required">
            <el-input
            v-model="Data.GoodsPositionSaveData.PositionName" />
          </el-form-item>
        </el-form>
      </div>
    </template>
    </DialogContainerComp> -->
  </div>
</template>

<script lang='ts'>
import MpCardContainer from '@/components/common/MpCardContainerComp.vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';

import {
  ref, reactive, onMounted, watch, onActivated, nextTick,
} from 'vue';
import { useRoute } from 'vue-router';
import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import api from '@/api/request/MaterialStorage';
import { useCommonStore } from '@/store/modules/common';
import LocationMap from '../../../components/LocationMap/Index.vue';
import Draw from './aaa';

interface DimensionsType {
  CodeID: number
  Dimension: string
  DimensionID: number
}
interface GoodsPositionDimensionSelectType {
  Dimensions: DimensionsType[]
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
  LeftDownX: number,
  LeftDownY: number,
  RightTopX: number,
  RightTopY: number,
  RightDownX: number,
  RightDownY: number,
  GridID: number,
  DimensionX: string,
  DimensionY: string
}
export interface allDimensionDataType {
  AllPositionDetails:DimensionDataType[]
  UsePositionDetails:DimensionDataType[]
}

interface DataType {
  PositionNameShow:boolean,
  GoodsPositionDimensionSelect:GoodsPositionDimensionSelectType[],
  selectData:DimensionsFromType[]
  allDimensionData:allDimensionDataType|null
  DyadicArrayDimensionData:DimensionDataType[][]
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
    let setDraw;
    const Data:DataType = reactive({
      PositionNameShow: false,
      GoodsPositionDimensionSelect: [],
      StorehouseName: '',
      // 添加/修改货位的表单
      GoodsPositionSaveData: {
        PositionID: 0,
        StorehouseID: 0,
        PositionName: '', // Math.random().toString(16).slice(-10),
        // DetailSets: [
        //   {
        //     DimensionX: '4架',
        //     DimensionY: '1柜',
        //   },
        // ],
      },
      actionCells: [],
      // 货位编号选择
      selectData: [],
      // 所有单元格数据（无序）
      allDimensionData: null,
      // 二维单元格数据
      DyadicArrayDimensionData: [],
    });
    // 格式化单元格数据为二维数组
    function getDyadicArray(rowNum) {
      // 获取所有x轴为0的数据 （）
      let temp = Data.allDimensionData?.AllPositionDetails.filter(res => res.LeftTopX === rowNum);
      if (!temp || !temp.length) return;
      temp = temp.sort((a, b) => a.LeftTopY - b.LeftTopY);
      Data.DyadicArrayDimensionData.push(temp);
      getDyadicArray(rowNum + 1);
    }
    // 判断是否被占用
    function disCheck(col) {
      let temp = false;
      Data.allDimensionData?.UsePositionDetails.forEach(item => {
        item.PositionDetails.forEach(it => {
          const x = it.DimensionX === col.DimensionX;
          const y = it.DimensionY === col.DimensionY;
          if (x && y) {
            temp = true;
          }
        });
      });
      return !!temp;
    }
    // 获取货位详情
    function getGoodsPosition() {
      // 最后一个没有值则不请求
      if (Data.GoodsPositionDimensionSelect.length !== 0 && !Data
        .selectData[Data.selectData.length - 1].inputValue) return;

      const temp = {
        StorehouseID: Data.GoodsPositionSaveData.StorehouseID as number|string,
        DimensionIDS: [] as Array<string|number>,
      };
      temp.DimensionIDS = Data.selectData.map(res => res.inputValue);
      Data.allDimensionData = null;
      api.getGoodsPositionDetail(temp).then(res => {
        if (res.data.Status === 1000) {
          Data.allDimensionData = res.data.Data as allDimensionDataType;
          Data.DyadicArrayDimensionData = [];
          getDyadicArray(0);
          // 渲染单元格
          setDraw.tableCell(Data.DyadicArrayDimensionData, true);
        }
      });
    }
    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.goods-allocation-page header', 72);
    }
    // 根据货位编号的sort值分组
    watch(() => Data.GoodsPositionDimensionSelect, (newValue) => {
      const returnData:DimensionsFromType[] = [];
      newValue.forEach(res => {
        returnData.push({
          id: Math.random().toString(16).slice(-10),
          inputValue: '',
          list: res.Dimensions as DimensionsType[],
        });
      });
      Data.selectData = returnData;
      console.log(returnData, 'returnData');

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
        DetailSets: e.DetailSets,
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
      if (Data.selectData.length && !Data.selectData[Data.selectData.length - 1].inputValue) return;
      Data.GoodsPositionSaveData.DimensionIDS = Data.selectData.map(res => res.inputValue);
      console.log(Data.actionCells);

      const temp = Data.actionCells.map(res => res.GridID);
      // ({
      //   PlaneID: res.PlaneID,
      //   DimensionX: res.DimensionX,
      //   DimensionY: res.DimensionY,
      // })

      Data.GoodsPositionSaveData.GridIDS = temp;
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
      // 创建画图的实例
      setDraw = new Draw(document.querySelector('#setposition'));
      Data.StorehouseName = route.params.StorehouseName as string;
      Data.GoodsPositionSaveData.StorehouseID = Number(route.params.StorehouseID);
      setHeight();
      api.getGoodsPositionDimensionSelect(route.params.StorehouseID).then(res => {
        if (res.data.Status === 1000) {
          Data.GoodsPositionDimensionSelect = res.data.Data as GoodsPositionDimensionSelectType[];
          if (Data.GoodsPositionDimensionSelect.length === 0) {
            getGoodsPosition();
          }
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
    >.mp-card-container{
      >.top-main{
        display: flex;
        justify-content: space-between;
        .mp-search-input-comp{
          display: flex;
        }
      }
    }
  }
  >main{
    margin-top: 20px;
    overflow-x: auto;
    >.mp-card-container{
      display: flex;
      flex-direction: column;
      height: 100%;
      .el-table{
        flex: 1;
        max-height: calc(100% - 21px);
      }
    }
  }
  >footer{
    padding-top: 20px;
    text-align: center;
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
        font-size: 12px;
        line-height: 30px;
        color: #F4A307;
      }
    }
  }
}
</style>
