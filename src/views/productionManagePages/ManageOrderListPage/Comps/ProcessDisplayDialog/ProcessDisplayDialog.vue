<template>
  <DialogContainerComp
    :visible='localVisible'
    title="生产流程"
    :showPrimary="false"
    top='8vh'
    @open="onOpen"
    @cancel="onClose"
    @closed="onClosed"
    closeBtnText="关闭"
    class="mp-prod-erp-flowchart-manage-dialog-comp-wrap"
    :class="{'loading': localOrderFlowchart.loading || !opened, 'loaded': loaded}"
    >
    <RowDetailComp :item="item" :ReportMode="targetType" v-if="item && !localOrderFlowchart.loading" />

    <div class="process-content" v-loading="localOrderFlowchart.loading"
     :class="{single: localOrderFlowchart.LineFlowchartList.length === 1 && !localOrderFlowchart.UnionFlowchartData}"
     ref="oWrapRef">
      <div class="left">
        <LineFlowchartComp v-for="(it, i) in localOrderFlowchart.LineFlowchartList" :key="i" :FlowchartData="it" />
      </div>
      <div class="right" v-if="localOrderFlowchart.UnionFlowchartData">
        <LineFlowchartComp :FlowchartData="localOrderFlowchart.UnionFlowchartData" />
      </div>
      <div class="empty" v-if="localOrderFlowchart._originalList.length === 0 && !localOrderFlowchart.loading">暂无流程</div>
    </div>

    <div class="legend" v-show="!localOrderFlowchart.loading">
      <span>图例：</span>
      <div v-for="it in FlowchartNodeStatusEnumList" :key="it.ID" class="item">
        <div :style="`background-color:${it.Color}`"></div>
        <h4>{{ it.Name }}</h4>
      </div>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import LineFlowchartComp from './LineFlowchartComp/LineFlowchartComp.vue';
import { OrderFlowchartManageClass } from '../../js/OrderFlowchart/OrderFlowchartManageClass';
import { FlowchartNodeStatusEnumList } from '../../js/OrderFlowchart/EnumList';
import { IManageChunkInfo } from '../../../ManageChunkListPage/js/type';
import { IManageOrderListItem } from '../../js/type';
import { IManagePlateInfo, IPlateListChild } from '../../../ManagePlateListPage/js/type';
import RowDetailComp from './RowDetailComp.vue';

const props = defineProps<{
  visible: boolean
  item: IManageChunkInfo | IManageOrderListItem | IManagePlateInfo | IPlateListChild | null
  targetType: ReportModeEnum
}>();

const emit = defineEmits(['update:visible']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const oWrapRef = ref<InstanceType<typeof HTMLElement>>();

const localOrderFlowchart = ref(new OrderFlowchartManageClass());

const loaded = ref(false);

const opened = ref(false);

const onOpen = async () => {
  if (!props.item) return;
  const id = props.item.ID;
  await localOrderFlowchart.value.getProcessListAndGenerateData(id, props.targetType, oWrapRef.value);

  loaded.value = true;

  opened.value = true;

  setTimeout(() => {
    loaded.value = false;
  }, 300);
};

const onClose = () => {
  if (localOrderFlowchart.value.loading) return;
  localVisible.value = false;
};

const onClosed = () => {
  opened.value = false;
};

</script>

<style lang='scss'>
.mp-prod-erp-flowchart-manage-dialog-comp-wrap {
  display: table;
  width: auto;
  margin-bottom: 25px;
  .el-dialog__body {
    // overflow: auto;
    // max-width: 1450px;
    // max-height: 550px;
    min-width: 535px;
    min-height: 220px;
    padding: 14px 28px 10px 24px;
    .process-content {
      display: flex;
      justify-content: center;
      min-height: 145px;
      position: relative;
      // overflow: auto;
      // max-width: 80vw;
      // max-height: 56vh;

      > .left {
        z-index: 9;
        .mp-line-flow-chart-comp-wrap {
          margin-left: 0;
          & + .mp-line-flow-chart-comp-wrap {
            margin-top: 20px;
          }
        }
      }

      > .right {
        margin-left: 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .mp-line-flow-chart-comp-wrap {
          background-color: #fff;
          .mp-line-flow-chart-line-comp-wrap::before {
            background-color: #fff;
          }
        }
      }

      > .empty {
        font-size: 13px;
        color: #989898;
        margin-top: 30px;
      }

      &.single {
        background: #F2F2F2;
        justify-content: flex-start;
      }
    }

    .legend {
      display: flex;
      justify-content: center;
      margin-top: 50px;
      > span {
        margin-right: 15px;
      }
      > div.item {
        display: flex;
        > div {
          width: 35px;
          height: 22px;
          border-radius: 2px;
          margin-right: 10px;
        }

        > h4 {
          color: #444;
        }

        & + .item {
          margin-left: 50px;
        }
      }
    }
  }

  .el-dialog__footer {
    padding-bottom: 35px;
  }

  &.loading {
    pointer-events: none;
    opacity: 0;
    // .el-dialog__footer {
    //   display: none;
    // }
    // .el-dialog__body {
    //   min-height: 150px;
    //   min-width: 360px;
    //   .close {
    //     display: none;
    //   }
    // }
    transform: translateY(-20px);
  }
  &.loaded {
    opacity: 1;
    transform: translateY(0px);
    transition: 0.3s ease-in-out;
  }
}
</style>
