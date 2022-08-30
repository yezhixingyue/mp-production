<template>
  <section class="mp-pd-location-map-comp-wrap" :style="`width:${width + 270}px;height:${height + 90}px`">
    <div class="content">
      <template v-if="locationMap">
        <canvas id="location-map" ref="canvas" :width="`${width + 60}`" :height="`${height + 60}`">
        </canvas>
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
        <dd>
          <i :style="`background:${LocationColorEnums.squareEmptyColor};border-color:${LocationColorEnums.strokeStyle}`"></i>
          <span>可选</span>
        </dd>
        <dd>
          <i :style="`background:${LocationColorEnums.squareFillColor};border-color:${LocationColorEnums.squareFillColor}`"></i>
          <span>选中单元格</span>
        </dd>
        <dd>
          <i :style="`background:${LocationColorEnums.isSetSelected};border-color:${LocationColorEnums.isSetSelected}`"></i>
          <span>选中已有货位</span>
        </dd>
      </dl>
      <el-button :disabled="locationMap.newLocation.length===0" type="primary" @click="onSetNewClick">设置新货位</el-button>
      <!-- <el-button :disabled="!locationMap.selectedLocation" type="primary" @click="onRenameClick">修改货位名称</el-button> -->
      <el-button :disabled="!locationMap.selectedLocation" type="danger" @click="onRemoveClick">删除货位</el-button>
    </aside>
  </section>
</template>

<script lang='ts'>
import {
  onMounted, Ref, ref,
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
  },
  components: {
    LocationSetupDialog,
  },
  setup(props) {
    const originData = JSON.parse(JSON.stringify(props.allDimensionData)) as ILocationMapOriginData;

    const canvas: Ref<HTMLCanvasElement | null> = ref(null);

    const mapOption = {
      width: props.width,
      height: props.height,
    };

    const locationMap: Ref<LocationMapClass> = ref(new LocationMapClass(originData, mapOption));

    const initDraw = () => {
      if (canvas.value) {
        const viewer = new Viewer(canvas.value);
        viewer.draw(locationMap.value); // 渲染

        canvas.value.onclick = (e) => {
          locationMap.value.onMapClick(e, viewer);
        };
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
        PositionDetails = locationMap.value.selectedLocation?.squares.map(it => ({
          DimensionX: it.DimensionX,
          DimensionY: it.DimensionY,
          LeftTopX: it.x,
          LeftTopY: it.y,
        })) || [];
      }
      const DetailSets = PositionDetails.map(it => ({ DimensionX: it.DimensionX, DimensionY: it.DimensionY }));
      const temp = {
        PositionID: ruleForm.PositionID,
        PositionName: ruleForm.PositionName,
        DetailSets,
      };

      const res = await props.add(temp);

      if (res || res === 0) {
        const PositionID = res;
        const l = {
          PositionID,
          PositionName: ruleForm.PositionName,
          PositionDetails,
        };

        reflowOnLocationChange(l);

        visible.value = false;
      }
    };

    const onRemoveClick = () => {
      if (!locationMap.value.selectedLocation) return;
      message.warnCancelBox(
        '确定删除该货位吗',
        `货位名称: [ ${locationMap.value.selectedLocation.PositionName} ]`,
        async () => {
          const res = await props.remove(locationMap.value.selectedLocation?.PositionID);
          if (res && locationMap.value.selectedLocation) {
            reflowOnLocationChange(locationMap.value.selectedLocation, true);
          }
        },
        null,
      );
    };

    return {
      canvas,
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
  margin: 0px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  > .content {
    canvas {
      cursor: pointer;
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