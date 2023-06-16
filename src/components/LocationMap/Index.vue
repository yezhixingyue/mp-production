<template>
  <section class="mp-pd-location-map-comp-wrap" :style="`width:${width + 270}px;height:${height + 70}px`">
    <div class="content">
      <template v-if="locationMap">
        <canvas id="location-map" ref="canvas" :width="`${width + 60}`" :height="`${height + 60}`">
        </canvas>
          <div class="location-tip" v-show="position.show" :class="position.hidden ? 'hidden':''" :style="`top:${position.y}px;left:${position.x}px`">
            <div class="main" v-if="locationMap.hoverHtml.length">
              <p v-for="(item,i) in locationMap.hoverHtml" :key="item+i">
                {{item}}
              </p>
            </div>
          </div>
        <LocationSetupDialog
          v-model:visible="visible"
          :locationSet="locationMap.locationSet"
          :curLocation="locationMap.selectedLocation"
          :isEdit="isEdit"
          @submit="onDialogSubmit"
        />
      </template>
    </div>
    <aside>
      <dl>
        <dt>图例</dt>
        <dd v-if="!isMultiSelect">
          <i :style="`background:${LocationColorEnums.squareEmptyColor};border-color:${LocationColorEnums.strokeStyle}`"></i>
          <span>可选</span>
        </dd>
        <dd v-if="isMultiSelect">
          <i :style="`background:${LocationColorEnums.vacancy};border-color:${LocationColorEnums.vacancy}`"></i>
          <span>空货位</span>
        </dd>
        <dd v-if="isMultiSelect">
          <i :style="`background:${LocationColorEnums.normal};border-color:${LocationColorEnums.normal}`"></i>
          <span>其他物料</span>
        </dd>
        <dd v-if="isMultiSelect">
          <i :style="`background:${LocationColorEnums.identical};border-color:${LocationColorEnums.identical}`"></i>
          <span>{{readonly?'当前物料':'与入库物料一致'}}</span>
        </dd>
        <dd v-if="!readonly">
          <i :style="`background:${LocationColorEnums.isSetSelected};border-color:${LocationColorEnums.isSetSelected}`"></i>
          <span v-if="isMultiSelect">已选择</span>
          <span v-else>选中已有货位</span>
        </dd>
        <dd>
          <i :style="`background:${LocationColorEnums.squareFillColor};border-color:${LocationColorEnums.squareFillColor}`"></i>
          <span v-if="isMultiSelect && !readonly">禁用</span>
          <span v-else-if="readonly && readonly">不可选</span>
          <span v-else>选中单元格</span>
        </dd>
      </dl>
      <template v-if="!isMultiSelect">
        <mp-button v-if="locationMap.newLocation.length" type="primary" @click="onSetNewClick">设置新货位</mp-button>
        <mp-button v-if="locationMap.selectedLocation.length" type="danger" @click="onRemoveClick">删除货位</mp-button>
      </template>
    </aside>
  </section>
</template>

<script lang='ts'>
import {
  onMounted, Ref, ref, watch,
} from 'vue';
import { message } from '@/assets/js/utils/message';
import { LocationMapClass } from './LocationMapClass';
import {
  IDialogRuleForm, ILocationMapOriginData, ILocationMapOriginPointData, IUsePositionDetailsItem, LocationColorEnums, MapConditionEnum,
} from './types';
import { Viewer } from './Viewer';
import LocationSetupDialog from './LocationSetupDialog.vue';
import { LocationSetClass } from './LocationSetClass';

export default {
  name: 'LocationMap',
  props: {
    allDimensionData: {
      type: Object,
      default: () => ({}) as ILocationMapOriginData,
    },
    add: { // 添加货位函数
      type: Function,
      default: () => null,
    },
    remove: { // 删除货位函数
      type: Function,
      default: () => null,
    },
    locationClick: { // 货位点击处理函数 （仅出入库模式可用 - 暂未实现）
      type: Function,
      default: () => null,
    },
    width: { // canvas显示区域的宽度
      type: Number,
      default: 1000,
    },
    height: { // canvas显示区域的高度
      type: Number,
      default: 600,
    },
    isMultiSelect: { // 是否多选
      type: Boolean,
      default: false,
    },
    selectedLocationChange: { // 选中货位改变
      type: Function,
      default: () => null,
    },
    DefaultAction: { // 默认选择的货位
      type: Array,
      default: () => [],
    },
    currentMaterialID: { // 当前物料
      type: String,
      default: '',
    },
    readonly: { // 只读
      type: Boolean,
      default: false,
    },
  },
  components: {
    LocationSetupDialog,
  },
  setup(props) {
    const originData = JSON.parse(JSON.stringify(props.allDimensionData)) as ILocationMapOriginData;

    const canvas: Ref<HTMLCanvasElement | null> = ref(null);

    const position = ref({
      x: 50,
      y: 50,
      hidden: true,
      show: false,
    });
    const mapOption = {
      width: props.width,
      height: props.height,
    };

    const locationMap: Ref<LocationMapClass> = ref(new LocationMapClass(
      originData,
      mapOption,
      props.isMultiSelect,
      props.DefaultAction as LocationSetClass[],
      props.currentMaterialID,
    ));
    const initDraw = () => {
      if (canvas.value) {
        const viewer = new Viewer(canvas.value);
        // 画单元格 货位
        viewer.draw(locationMap.value, props.isMultiSelect, originData.DyadicArrayDimensionData); // 渲染

        canvas.value.onclick = (e) => {
          if (!props.readonly) {
            locationMap.value.onMapClick(e, viewer);
          }
        };
        canvas.value.onmouseout = () => {
          position.value.show = false;
        };
        let a = true;

        canvas.value.onmousemove = (e) => {
          const x = Math.floor((e.offsetX - MapConditionEnum.labelGapWidth) / locationMap.value.squareWidth);
          const y = Math.floor((e.offsetY - MapConditionEnum.labelGapHeight) / locationMap.value.squareHeight);
          // 如果不在图标内部则不往后执行
          if (x < 0 || y < 0 || y > locationMap.value.rows.length - 1 || x > locationMap.value.rows[y].length - 1) {
            position.value.show = false;
            return;
          }
          position.value.show = true;

          position.value.x = e.clientX;
          position.value.y = e.clientY;
          position.value.hidden = true;
          locationMap.value.onMapMove(e, viewer, locationMap.value.DimensionUnit);
          if (a) { // 节流
            a = false;
            setTimeout(() => {
              position.value.hidden = false;
              a = true;
            }, 500);
          }
        };
        // 设置默认选中的货位 （入库）
        locationMap.value.setDefaultAction(viewer);
      }
    };

    onMounted(() => {
      initDraw();
    });

    const visible = ref(false);
    const isEdit = ref(false);

    const onSetNewClick = () => {
      isEdit.value = false;
      visible.value = true; // locationMap.addLocationSet.call(locationMap)
    };

    const reflowOnLocationChange = async (l: IUsePositionDetailsItem | LocationSetClass, isRemove = false) => { // 由于货位变动 导致的重绘
      const i = originData.UsePositionDetails.findIndex(it => it.PositionID === l.PositionID);
      if (i > -1) {
        if (isRemove) {
          originData.UsePositionDetails.splice(i, 1);
        } else if (!(l instanceof LocationSetClass)) {
          originData.UsePositionDetails.splice(i, 1, l);
        }
      } else if (!isRemove && !(l instanceof LocationSetClass)) {
        originData.UsePositionDetails.push(l);
      }
      locationMap.value.init(originData);
      initDraw();
    };

    const onDialogSubmit = async (ruleForm: IDialogRuleForm) => { // 货位添加|编辑提交
      let PositionDetails: ILocationMapOriginPointData[]|undefined;
      if (!isEdit.value) {
        PositionDetails = locationMap.value.newLocation.map(it => ({
          DimensionX: it.DimensionX,
          DimensionY: it.DimensionY,
          LeftTopX: it.x,
          LeftTopY: it.y,
        }));
      } else {
        PositionDetails = [];
        locationMap.value.selectedLocation?.forEach(item => {
          const temp = item.squares.map(it => ({
            DimensionX: it.DimensionX,
            DimensionY: it.DimensionY,
            LeftTopX: it.x,
            LeftTopY: it.y,
          }) || []);
          PositionDetails?.push(...temp);
        });
        // PositionDetails = locationMap.value.selectedLocation?.squares.map(it => ({
        //   DimensionX: it.DimensionX,
        //   DimensionY: it.DimensionY,
        //   LeftTopX: it.x,
        //   LeftTopY: it.y,
        //   GridID: it.GridID,
        // })) || [];
      }
      const DimensionXYS = PositionDetails.map(res => ({ DimensionX: res.DimensionX, DimensionY: res.DimensionY }));
      const temp = {
        PositionID: ruleForm.PositionID,
        PositionName: ruleForm.PositionName,
        DimensionXYS,
      };
      const res = await props.add(temp);

      if (res || res === 0) {
        const { PositionID } = res;
        const l = {
          PositionID,
          PositionName: ruleForm.PositionName,
          PositionDetails,
        };

        reflowOnLocationChange(l);

        visible.value = false;
      }
    };
    watch(() => locationMap.value.selectedLocation, (val) => {
      props.selectedLocationChange(val);
    });
    const onRemoveClick = () => {
      if (!locationMap.value.selectedLocation.length) return;
      message.warnCancelBox(
        '确定删除该货位吗',
        `货位名称: [ ${locationMap.value.selectedLocation[0].PositionName} ]`,
        async () => {
          if (locationMap.value.selectedLocation) {
            const res = await props.remove(locationMap.value.selectedLocation[0].PositionID);
            if (res && locationMap.value.selectedLocation) {
              reflowOnLocationChange(locationMap.value.selectedLocation[0], true);
            }
          }
        },
        null,
      );
    };

    return {
      canvas,
      position,
      locationMap,
      LocationColorEnums,
      visible,
      onSetNewClick,
      isEdit,
      onDialogSubmit,
      onRemoveClick,
      MapConditionEnum,
    };
  },
};
</script>
<style lang='scss'>
.mp-pd-location-map-comp-wrap {
  // #location-map{
  //   // background-color: #efefef;
  // }
  margin: 0px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  > .content {
    position: relative;
    canvas {
      cursor: pointer;
    }
    .location-tip{
      position: fixed;
      background-color: rgb(243, 235, 235);
      border-radius: 4px;
      transform: translateX(-50%) translateY(-120%) ;
      transition-property: width, height;
      transition-duration: 200ms;
      transition-delay:200ms;
      .main{
        padding: 5px;
      }
      &.hidden{
        width: 0;
        height: 0;
        overflow: hidden;
      }
    }
    .el-dialog__body {
      padding-right: 40px;
    }
  }
  > aside {
    width: 150px;
    height: 100%;
    padding-top: 6px;
    box-sizing: border-box;
    // border: 1px solid #eee;
    display: flex;
    flex-direction: column;
    > dl {
      padding-bottom: 50px;
      > dt {
        font-weight: 700;
      }
      > dd {
        display: flex;
        align-items: center;
        margin-top: 15px;
        > i {
          display: inline-block;
          width: 36px;
          height: 18px;
          border: 1px solid #888;
          margin-right: 10px;
          border-radius: 2px;
        }
      }
    }
    .el-button {
      width: 120px;
      padding: 0;
      height: 30px;
      margin: 0;
      & + .el-button {
        margin-top: 10px;
      }
    }
  }
}
</style>
