<template>
    <DialogContainerComp
    title="查看货位"
    primaryText='确定'
    :visible='DialogVisible'
    :width="1300"
    :closeClick="(vis) => DialogVisible = vis"
    :closed="SelectGoodsClosed"
    :showPrimary="false"
    closeBtnText="关闭"
    top="3vh"
    >
    <template #default>
      <div class="see-goods-dialog">
        <p class="title">{{getGoodsPositionData.StorehouseGoodsPosition}}</p>
        <LocationMap
          v-if="Data.allDimensionData.UsePositionDetails"
          :allDimensionData="Data.allDimensionData"
          :isMultiSelect="true"
          :currentMaterialID="currentMaterialID"
          :width="800"
          :height="500"
          :readonly="true"
        />
      </div>
    </template>
    </DialogContainerComp>
</template>

<script lang='ts'>
import {
  reactive, computed, watch,
} from 'vue';

import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import api from '@/api';
import LocationMap from '@/components/LocationMap/Index.vue';

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
export interface getGoodsPositionType {
  UsePositionDetails:DimensionDataType[]|null
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

interface DataType {
  GoodsPositionDimensionSelect:GoodsPositionDimensionSelectType | null
  allDimensionData:allDimensionDataType
}

export default {
  name: 'materialManagePage',
  components: {
    DialogContainerComp,
    LocationMap,
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
    getGoodsPositionData: {
      type: Object,
      default: () => null,
    },
    currentMaterialID: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    // 入库数据表单
    const Data:DataType = reactive({
      GoodsPositionDimensionSelect: null,
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
    });
    // 选择仓库货位弹框的表单数据
    const DialogVisible = computed({
      get() {
        return props.visible;
      },
      set(val) {
        props.changeVisible(val);
      },
    });
    function SelectGoodsCloseClick() {
      props.changeVisible(false);
    }
    function SelectGoodsClosed() {
      // 清除
    }
    // 格式化单元格数据为二维数组
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
    // 获取货位详情
    function getGoodsPosition() {
      api.getGoodsPositionDetail(props.getGoodsPositionData).then(res => {
        if (res.data.Status === 1000) {
          const t = res.data.Data as getGoodsPositionType;
          setTimeout(() => {
            Data.allDimensionData.UsePositionDetails = t.UsePositionDetails;
          }, 30);
        }
      });
    }
    watch(() => Data.GoodsPositionDimensionSelect, () => {
      // 处理第二次进入时没有获取货位信息的情况
      getGoodsPosition();
      // 获取二维数组
      Data.allDimensionData.DyadicArrayDimensionData = [];
      getDyadicArray();
    });

    watch(() => props.visible, (val) => {
      if (val) {
        Data.allDimensionData.UsePositionDetails = null;
        api.getGoodsPositionDimensionPositionPlan(props.getGoodsPositionData.StorehouseID).then(res => {
          if (res.data.Status) {
            Data.GoodsPositionDimensionSelect = res.data.Data as GoodsPositionDimensionSelectType;
            getGoodsPosition();
          }
        });
      }
    });

    return {
      DialogVisible,
      Data,
      getGoodsPosition,
      SelectGoodsCloseClick,
      SelectGoodsClosed,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.see-goods-dialog{
  .title{
    text-align: left;
    font-size: 18px;
    font-weight: 600;
    padding-left: 50px;
  }
}
</style>
