<template>
  <section class="mp-pd-location-map-comp-wrap">
    <div class="content" @mousedown="onwrapmousedown" ref="oWrap" :class="{loading: !inited}">
      <span class="loading" v-if="!inited"><el-icon><Loading /></el-icon>加载中，请稍候...</span>
      <template v-if="locationMap">
        <!-- 货位图 图片 -->
        <div class="canvas-box" :class="{moving: config.isKeydown.space || config.moving}">
          <canvas id="location-map" ref="canvas" :style="canvasStyle" :width="`${config.mapSize.width}`" :height="`${config.mapSize.height}`"></canvas>
        </div>

        <!-- 滚动条 -->
        <ScrollBar :config="config" />

        <!-- 划片选中区域 -->
        <SelectArea :position="selectArea" />

        <!-- 悬浮文字展示 -->
        <div class="location-tip" v-show="config.tipBoxPosition.show" :class="config.tipBoxPosition.hidden ? 'hidden' : ''"
          :style="`top:${config.tipBoxPosition.y}px;left:${config.tipBoxPosition.x}px`">
          <div class="main" v-if="locationMap.hoverHtml.length">
            <p v-for="(item, i) in locationMap.hoverHtml" :key="item + i">
              {{ item }}
            </p>
          </div>
        </div>

        <!-- 设置货位弹窗 -->
        <LocationSetupDialog v-model:visible="visible" :locationSet="locationMap.locationSet"
          :curLocation="locationMap.selectedLocation" :isEdit="isEdit" @submit="onDialogSubmit" />
      </template>
    </div>
    <aside>
      <div class="menu-box">
        <dl>
          <dt>图例</dt>
          <dd v-if="!isMultiSelect">
            <i
              :style="`background:${LocationColorEnums.squareEmptyColor};border-color:${LocationColorEnums.strokeStyle}`"></i>
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
            <span>{{ readonly ? '当前物料' : '与入库物料一致' }}</span>
          </dd>
          <dd v-if="!readonly">
            <i
              :style="`background:${LocationColorEnums.isSetSelected};border-color:${LocationColorEnums.isSetSelected}`"></i>
            <span v-if="isMultiSelect">已选择</span>
            <span v-else>选中已有货位</span>
          </dd>
          <dd>
            <i
              :style="`background:${LocationColorEnums.squareFillColor};border-color:${LocationColorEnums.squareFillColor}`"></i>
            <span v-if="isMultiSelect && !readonly">禁用</span>
            <span v-else-if="readonly && readonly">不可选</span>
            <span v-else>选中单元格</span>
          </dd>
        </dl>
        <template v-if="!isMultiSelect">
          <mp-button v-if="locationMap.newLocation.length" type="primary" @click="onSetNewClick">设置新货位</mp-button>
          <mp-button v-if="locationMap.selectedLocation.length" type="danger" @click="onRemoveClick">删除货位</mp-button>
        </template>
      </div>
      <!-- 快捷键介绍 -->
      <ul class="shortcut-key">
        <li>
          <h4>快捷键：</h4>
        </li>
        <li v-show="!locationMap.isMultiSelect">
          <label for="">批量选中：</label>
          <span>shift <i class="gray">+</i> 鼠标</span>
        </li>
        <li v-show="!locationMap.isMultiSelect">
          <label for="">批量清除：</label>
          <span>ctrl <i class="gray">+</i> shift <i class="gray">+</i> 鼠标</span>
        </li>
        <li>
          <label for="">拖动：</label>
          <span>空格 <i class="gray">+</i> 鼠标</span>
        </li>
        <li class="m">
          <label for="">缩放：</label>
          <div>
            <span>ctrl <i class="gray">+</i> +<i class="gray">/</i>-<i class="gray">/</i>1 ;</span>
            <span>alt <i class="gray">+</i> 滚轮</span>
          </div>
        </li>
        <li>
          <label for="">左右滚动：</label>
          <span>ctrl <i class="gray">+</i> 滚轮</span>
        </li>
      </ul>
    </aside>
  </section>
</template>

<script setup lang='ts'>
import {
  Ref, computed, onMounted, ref, watch,
} from 'vue';
import { message } from '@/assets/js/utils/message';
import { LocationMapClass } from './LocationMapClass';
import {
  IDialogRuleForm, ILocationMapOriginData, ILocationMapOriginPointData, IUsePositionDetailsItem, LocationColorEnums,
} from './types';
import LocationSetupDialog from './LocationSetupDialog.vue';
import ScrollBar from './ScrollBar/ScrollBar.vue';
import SelectArea from './SelectArea.vue';
import { LocationSetClass } from './LocationSetClass';
import { useConfigForMap } from './useConfigForMap';

// eslint-disable-next-line no-undef
defineOptions({
  name: 'LocationMap',
});

const props = withDefaults(defineProps<{
  allDimensionData: object,
  /** 添加货位函数 */
  add?:(e: { PositionID: string, PositionName: string, DimensionXYS: { DimensionX: string, DimensionY: string }[] }) => Promise<null | { PositionID: string }>,
  /** 删除货位函数 */
  remove?: (id: string) => Promise<boolean>,
  /** 货位点击处理函数 （仅出入库模式可用 - 暂未实现） */
  locationClick?: () => null,
  /** 选中货位改变 */
  selectedLocationChange?: (list: LocationSetClass[]) => void,
  /** 是否多选 */
  isMultiSelect?: boolean,
  /** 默认选中的货位 */
  DefaultAction?: LocationSetClass[],
  /** 当前物料 */
  currentMaterialID?: string
  /** 只读 默认false */
  readonly?: boolean
}>(), {
  readonly: false,
  isMultiSelect: false,
  DefaultAction: () => [],
  currentMaterialID: '',
});

const originData = JSON.parse(JSON.stringify(props.allDimensionData)) as ILocationMapOriginData;

const locationMap = ref(new LocationMapClass(
  originData,
  props.isMultiSelect,
  props.DefaultAction as LocationSetClass[],
  props.currentMaterialID,
)) as Ref<LocationMapClass>;

const { config, oWrap, canvas, initDraw, onwrapmousedown, selectArea } = useConfigForMap(locationMap, props.readonly);

const canvasStyle = computed(() => `
  transform: 
    translate(${-config.value.position.left}px,${-config.value.position.top}px)
    scale(${config.value.scale});
`);

const inited = ref(false);

onMounted(() => {
  setTimeout(() => {
    initDraw();

    inited.value = true;
  }, 0);
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

  locationMap.value.init();
  initDraw();
};

const onDialogSubmit = async (ruleForm: IDialogRuleForm) => { // 货位添加|编辑提交
  if (!props.add) return;

  let PositionDetails: ILocationMapOriginPointData[] | undefined;
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
  if (props.selectedLocationChange) props.selectedLocationChange(val);
});
const onRemoveClick = () => {
  if (!locationMap.value.selectedLocation.length) return;
  message.warnCancelBox(
    '确定删除该货位吗',
    `货位名称: [ ${locationMap.value.selectedLocation[0].PositionName} ]`,
    async () => {
      if (locationMap.value.selectedLocation && props.remove) {
        const res = await props.remove(locationMap.value.selectedLocation[0].PositionID);
        if (res && locationMap.value.selectedLocation) {
          reflowOnLocationChange(locationMap.value.selectedLocation[0], true);
        }
      }
    },
    null,
  );
};
</script>
<style lang='scss' scoped>
@import '@/assets/css/mixins.scss';

.mp-pd-location-map-comp-wrap {
  // #location-map{
  //   // background-color: #efefef;
  // }
  margin: 0px;
  width: 100%;
  height: 100%;
  // margin-bottom: 10px;
  display: flex;
  overflow: hidden;

  >.content {
    position: relative;
    flex: 1;
    height: 100%;
    overflow: auto;
    @include scroll;
    padding-right: 16px;
    padding-bottom: 16px;
    box-sizing: border-box;

    overflow: hidden;
    span.loading {
      top: 60px;
      font-size: 12px;
      display: block;
      width: 100%;
      text-align: center;
      position: absolute;
      z-index: 9;
      color: #585858;

      i {
        font-size: 17px;
        color: #428dfa;
        vertical-align: -3px;
        margin-right: 4px;
        animation: rotate 2s infinite steps(60,end);
        transform: rotate(0deg);
        font-weight: 700;

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      }
    }
    .canvas-box {
      width: 100%;
      height: 100%;
      white-space: nowrap;
      overflow: hidden;

      // 当采用renderScale方式进行缩放时，保留下方几行样式（至伪元素结尾）
      // text-align: center;

      // canvas {
      //   cursor: pointer;
      //   vertical-align: middle;
      // }

      // &::after {
      //   content: '';
      //   width: 1px;
      //   height: 100%;
      //   display: inline-block;
      //   vertical-align: middle;
      // }

      &.moving canvas {
        cursor: grab;
      }
    }

    .location-tip {
      position: fixed;
      background-color: rgb(243, 235, 235);
      border-radius: 4px;
      transform: translateX(-50%) translateY(-120%);
      transition-property: width, height;
      transition-duration: 200ms;
      transition-delay: 200ms;

      .main {
        padding: 5px;
      }

      &.hidden {
        width: 0;
        height: 0;
        overflow: hidden;
      }
    }

    .el-dialog__body {
      padding-right: 40px;
    }

    &.loading {
      :deep(.scroll-bar) {
        visibility: hidden;
      }
    }
  }

  >aside {
    width: 172px;
    height: 100%;
    padding-top: 6px;
    box-sizing: border-box;
    flex: none;
    // border: 1px solid #eee;
    display: flex;
    flex-direction: column;
    padding-left: 10px;
    user-select: none;

    > .menu-box {
      flex: 1;
      overflow: auto;
      @include scroll;

      dl {
        padding-bottom: 50px;

        >dt {
          font-weight: 700;
        }

        >dd {
          display: flex;
          align-items: center;
          margin-top: 15px;

          >i {
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

        &+.el-button {
          margin-top: 10px;
        }
      }
    }

    > .shortcut-key {
      flex: none;
      font-size: 12px;
      white-space: nowrap;
      color: #585858;
      padding-bottom: 20px;
      line-height: 18px;

      > li {
        padding: 4px 0;

        .gray {
          color: #aaa;
          font-size: 12px;
        }

        label {
          display: inline-block;
          width: 5em;
          text-align: right;
        }

        &.m {
          display: flex;

          label {
            flex: none;
          }

          span {
            display: block;
          }
        }
      }
    }
  }
}</style>
