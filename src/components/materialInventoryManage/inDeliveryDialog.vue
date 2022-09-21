<template>
<div class="select-goods-dialog">

    <DialogContainerComp
    title="选择货位"
    primaryText='确定'
    :visible='DialogVisible'
    :width="1300"
    :primaryClick="SelectGoodsPrimaryClick"
    :closeClick="SelectGoodsCloseClick"
    :closed="SelectGoodsClosed"
    top="3vh"

    >
    <template #default>
      <div class="select-goods-dialog-main">
        <el-scrollbar>
          <div class="goods-position-select">
            <el-radio-group @change="getGoodsPositionDimensionSelect" v-model="Data.StorehouseID">
              <el-radio-button v-for="item in StorehouseList" :key="item.StorehouseID"
              :label="item.StorehouseID">
                {{item.StorehouseName}}
              </el-radio-button>
            </el-radio-group>
             <el-button type="primary" link
              @click="seeImg()">查看平面布局图</el-button>
          </div>
        </el-scrollbar>
        <div class="top-main">
          <template v-if="selectStorehouseGoodsPosition[Data.StorehouseID]">
            <template v-for="(item, index) in selectStorehouseGoodsPosition[Data.StorehouseID].selectData" :key="item.id">
              <el-select
                v-model="item.inputValue"
                placeholder="请选择"
                no-data-text="无数据"
                @change="getGoodsPosition(index)"
                :filterable='true'>
                <el-option
                  v-for="optionitem in (index === 0 ? item.list :
                  selectStorehouseGoodsPosition[Data.StorehouseID].selectData[index-1].inputValue ? item.list : [])"
                  :key="optionitem.DimensionID"
                  :label="`${optionitem.Dimension}`"
                  :value="optionitem.DimensionID"
                />
              </el-select>
            </template>
          </template>
        </div>
        <div class="canvas-main">
          <LocationMap
            v-if="Data.allDimensionData.UsePositionDetails"
            :allDimensionData="Data.allDimensionData"
            :selectedLocationChange="selectedLocationChange"
            :isMultiSelect="true"
            :DefaultAction="selectStorehouseGoodsPosition[Data.StorehouseID]?.selectedLocation[getDimensionIDS.join('')] "
            :currentMaterialID="currentMaterialID"
            :width="800"
            :height="500"
          />
        </div>
        <div class="bottom" >
          <span>已选：</span>
          <span class="location" v-for="(item,i) in getSelectedLocationList" :key="item.PositionID">
            {{item.LocationName}} {{item.PositionName}}{{i<getSelectedLocationList.length-1 ? '，' : ''}}
          </span>
        </div>
      </div>
    </template>
    </DialogContainerComp>
    <SeeImageDialogComp
    title="仓库货位平面图"
    :visible='Data.LookImgShow'
    :imgUrl="Data.SeeimgUrl"
    :closeClick="() => Data.LookImgShow = false"
    >
    </SeeImageDialogComp>
</div>
</template>

<script lang='ts'>
import {
  reactive, computed, watch,
} from 'vue';
import SeeImageDialogComp from '@/components/common/DialogComps/SeeImageDialogComp.vue';

import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import api from '@/api';
import LocationMap from '@/components/LocationMap/Index.vue';
import { LocationSetClass } from '@/components/LocationMap/LocationSetClass';
import messageBox from '@/assets/js/utils/message';

interface DimensionType {
  Dimension:string
  DimensionNumber: number
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
export interface DimensionDataType {
  PositionID: string,
  DetailID: string,
  LeftTopX: number,
  LeftTopY: number,
  DimensionX: string,
  DimensionY: string
}
export interface allDimensionDataType {
  AllPositionDetails:AllPositionDetailsType
  UsePositionDetails:DimensionDataType[]|null
  DyadicArrayDimensionData:DyadicArrayDimensionDataType[][]
}

interface DimensionsType {
  Dimension: string
  DimensionID: number
}
interface DimensionSelectsType {
  DimensionUnit: string
  Dimensions: DimensionsType[]
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
  DimensionUnit: string,
  id: string,
  inputValue: number | string,
  list: DimensionsType[],
}
// 上方为新的
interface StorehouseType {
  StorehouseID: string,
  StorehouseName: string,
  StorehouseImg: string,
}
interface DataType {
  SeeimgUrl: string,
  LookImgShow: boolean,
  SelectGoods: boolean,
  StorehouseID: string,
  // 仓库列表
  StorehouseList:StorehouseType[]
  GoodsPositionDimensionSelect:GoodsPositionDimensionSelectType | null
  selectData:DimensionsFromType[]
  allDimensionData:allDimensionDataType
  selectedLocation: object
}

export default {
  name: 'materialManagePage',
  components: {
    DialogContainerComp,
    LocationMap,
    SeeImageDialogComp,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    primaryClick: {
      type: Function,
      default: () => null,
    },

    changeVisible: {
      type: Function,
      default: () => null,
    },
    StorehouseList: {
      type: Array,
      default: () => [],
    },
    currentMaterialID: {
      type: String,
      default: '',
    },
    _selectStorehouseGoodsPosition: {
      type: Object,
      default: () => null,
    },
  },
  setup(props) {
    // 入库数据表单
    const Data:DataType = reactive({
      SeeimgUrl: '',
      LookImgShow: false,
      SelectGoods: false,
      // 当前选择的仓库id
      StorehouseID: '',
      // 仓库列表
      StorehouseList: [], //

      // 仓库的区域选择项原数据
      GoodsPositionDimensionSelect: null,
      // 仓库的区域选择项格式化后的
      selectData: [],
      // 获取货位的详情
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
      // 选中的货位 主要用于选中货位的显示
      selectedLocation: {},
    });
    // 选择仓库货位弹框的表单数据
    const selectStorehouseGoodsPosition = reactive({});
    const DialogVisible = computed({
      get() {
        return props.visible;
      },
      set(val) {
        props.changeVisible(val);
      },
    });
    const getDimensionIDS = computed(() => {
      if (selectStorehouseGoodsPosition[Data.StorehouseID]) {
        if (selectStorehouseGoodsPosition[Data.StorehouseID].selectData.map(res => res.inputValue).length) {
          return selectStorehouseGoodsPosition[Data.StorehouseID].selectData.map(res => res.inputValue);
        }
        return [Data.StorehouseID];
      }
      return [];
    });
    function seeImg() {
      let imgUrl = '';
      props.StorehouseList.forEach(res => {
        const temp = res as StorehouseType;

        if (temp.StorehouseID === Data.StorehouseID) {
          imgUrl = temp.StorehouseImg;
        }
      });
      Data.SeeimgUrl = imgUrl;
      Data.LookImgShow = true;
    }
    const getSelectedLocationList = computed(() => {
      const list:LocationSetClass[] = [];

      const StorehouseKeys = Object.keys(selectStorehouseGoodsPosition);
      StorehouseKeys.forEach(StorehouseKey => {
        if (selectStorehouseGoodsPosition[StorehouseKey].selectedLocation) {
          const selectedLocationKeys = Object.keys(selectStorehouseGoodsPosition[StorehouseKey].selectedLocation);
          selectedLocationKeys.forEach(selectedLocationKey => {
            if (selectStorehouseGoodsPosition[StorehouseKey].selectedLocation[selectedLocationKey]) {
              list.push(...selectStorehouseGoodsPosition[StorehouseKey].selectedLocation[selectedLocationKey]);
            }
          });
        }
      });
      return list;
    });

    function SelectGoodsCloseClick() {
      props.changeVisible(false);
    }
    function SelectGoodsClosed() {
      // 清除
    }
    function SelectGoodsPrimaryClick() {
      if (!getSelectedLocationList.value.length) {
        messageBox.failSingle('请选择货位', () => null, () => null);
      } else {
        props.primaryClick(selectStorehouseGoodsPosition);
        SelectGoodsCloseClick();
      }
    }
    function getLocaName() {
      const msg:string[] = [];
      selectStorehouseGoodsPosition[Data.StorehouseID].selectData.forEach(item => {
        item.list.forEach(it => {
          if (it.DimensionID === item.inputValue) {
            msg.push(`${it.Dimension}`);
          }
        });
      });
      return msg;
    }
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
    //
    function selectedLocationChange(list:LocationSetClass[]) {
      const temp = list.map(res => ({ ...res, LocationName: getLocaName().join(' '), selectedLocationID: getDimensionIDS.value.join('') }));
      // 设置选中的仓库;

      selectStorehouseGoodsPosition[Data.StorehouseID].selectedLocation[getDimensionIDS.value.join('')] = temp;
    }
    // 获取货位详情
    function getGoodsPosition() {
      // 如果有选择维度的项
      if (selectStorehouseGoodsPosition[Data.StorehouseID]
      && selectStorehouseGoodsPosition[Data.StorehouseID].selectData.length) {
        // 最后一个没有值则不请求
        if (!selectStorehouseGoodsPosition[Data.StorehouseID]
          .selectData[selectStorehouseGoodsPosition[Data.StorehouseID].selectData.length - 1].inputValue) return;
      }
      const temp = {
        StorehouseID: Data.StorehouseID as string,
        DimensionIDS: [] as Array<string>,
      };
      temp.DimensionIDS = getDimensionIDS.value;
      api.getGoodsPositionDetail(temp).then(res => {
        if (res.data.Status === 1000) {
          Data.allDimensionData.UsePositionDetails = null;
          const t = res.data.Data as any;
          Data.allDimensionData.UsePositionDetails = null;
          setTimeout(() => {
            Data.allDimensionData.UsePositionDetails = t.UsePositionDetails;
          }, 30);
        }
      });
    }
    watch(() => Data.GoodsPositionDimensionSelect, (newValue) => {
      // 根据选择项给选择货位的表单赋值
      if (!selectStorehouseGoodsPosition[Data.StorehouseID]) {
        selectStorehouseGoodsPosition[Data.StorehouseID] = {};
      }
      if (!selectStorehouseGoodsPosition[Data.StorehouseID].selectData) {
        const returnData:DimensionsFromType[] = [];

        if (newValue && newValue.DimensionSelects) {
          newValue.DimensionSelects.forEach(res => {
            returnData.push({
              DimensionUnit: res.DimensionUnit,
              id: Math.random().toString(16).slice(-10),
              inputValue: '',
              list: res.Dimensions.map(it => ({
                Dimension: `${it.Dimension}${res.DimensionUnit}`,
                DimensionID: it.DimensionID,
              })) as DimensionsType[],
            });
          });
        }
        selectStorehouseGoodsPosition[Data.StorehouseID].selectData = returnData;
      }
      // 初始化选中的数据
      if (!selectStorehouseGoodsPosition[Data.StorehouseID].selectedLocation) {
        selectStorehouseGoodsPosition[Data.StorehouseID].selectedLocation = {};
        // 如果没有维度选择项 直接把仓库的id作为选项的key值
        if (!selectStorehouseGoodsPosition[Data.StorehouseID].selectData.length) {
          selectStorehouseGoodsPosition[Data.StorehouseID].selectedLocation[getDimensionIDS.value.join('')] = [];
        }
      }
      // 处理第二次进入时没有获取货位信息的情况
      getGoodsPosition();
      // 获取二维数组
      Data.allDimensionData.DyadicArrayDimensionData = [];
      getDyadicArray();
    });
    // 获取区域的选择项
    function getGoodsPositionDimensionSelect() {
      Data.allDimensionData.UsePositionDetails = null;
      api.getGoodsPositionDimensionSelect(Data.StorehouseID).then(res => {
        if (res.data.Status === 1000) {
          Data.GoodsPositionDimensionSelect = res.data.Data as GoodsPositionDimensionSelectType;
          if (!Data.GoodsPositionDimensionSelect.DimensionSelects) {
            // 获取货位信息
            getGoodsPosition();
          }
        }
      });
    }
    // 获取仓库列表
    // function getStorehouseAll() {
    //   api.getStorehouseAll().then(res => {
    //     if (res.data.Status === 1000) {
    //       Data.StorehouseList = res.data.Data as StorehouseType[];
    //       if (Data.StorehouseList.length) {
    //         Data.StorehouseID = Data.StorehouseList[Data.StorehouseList.length - 1].StorehouseID;
    //         getGoodsPositionDimensionSelect();
    //       }
    //     }
    //   });
    // }
    watch(() => props.visible, (val) => {
      if (val) {
        const _StorehouseList:StorehouseType[] = props.StorehouseList as StorehouseType[];
        Data.StorehouseID = _StorehouseList[0].StorehouseID;
        if (props._selectStorehouseGoodsPosition) {
          Object.keys(props._selectStorehouseGoodsPosition).forEach(res => {
            selectStorehouseGoodsPosition[res] = { ...props._selectStorehouseGoodsPosition[res] };
          });
        }
        getGoodsPositionDimensionSelect();
      }
    });

    return {
      DialogVisible,
      Data,
      seeImg,
      getSelectedLocationList,
      selectStorehouseGoodsPosition,
      getDimensionIDS,
      getGoodsPosition,
      selectedLocationChange,
      SelectGoodsCloseClick,
      SelectGoodsPrimaryClick,
      SelectGoodsClosed,
      getGoodsPositionDimensionSelect,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.select-goods-dialog{
  .el-dialog__body{
    padding: 20px;
  }
  .select-goods-dialog-main{
    .goods-position-select{
      display: flex;
      .el-radio-group{
        flex-wrap: nowrap;
        padding-bottom: 8px;
      }
      .el-button{
        height: 32px;
        margin-left: 20px;
        min-width: 105px;
      }
    }
    .top-main{
      min-height: 32px;
      .el-select+.el-select{
        margin-left: 20px;
      }
    }
    .canvas-main{
      min-height: 580px;
    }
    .bottom{
      min-height: 30px;
      font-weight: 600;
      line-height: 30px;
      margin-top: -30px;
      .location+.location{
        margin-left: 20px;
      }
    }
  }
}
</style>
