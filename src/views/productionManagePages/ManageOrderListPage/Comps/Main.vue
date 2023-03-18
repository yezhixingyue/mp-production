<template>
  <main class="main-comp-wrap">
    <table>
      <thead>
        <tr @mousedown="mousedown" @mousemove="mousemove">
          <th data-index="0" :style="`width:${widthList[0].width}px`">销售端</th>
          <th data-index="1" :style="`width:${widthList[1].width}px`">订单ID</th>
          <th data-index="2" :style="`width:${widthList[2].width}px`">销售端产品</th>
          <th data-index="3" :style="`width:${widthList[3].width}px`">内容</th>
          <th data-index="4" :style="`width:${widthList[4].width}px`">尺寸</th>
          <th data-index="5" :style="`width:${widthList[5].width}px`">物料</th>
          <th data-index="6" :style="`width:${widthList[6].width}px`">生产线</th>
          <th data-index="7" :style="`width:${widthList[7].width}px`">数量</th>
          <th data-index="8" :style="`width:${widthList[8].width}px`">下单时间</th>
          <th data-index="9" :style="`width:${widthList[9].width}px`">预计生产完成时间</th>
          <th data-index="10" :style="`width:${widthList[10].width}px`">置顶</th>
          <th data-index="11" :style="`width:${widthList[11].width}px`">操作</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="row in localList" :key="row.ID">
          <tr class="row-title" @click.self.stop="onSpreadClick(row)">
            <td :style="`width:${widthList[0].width}px`" :title="row.ServerName">{{ row.ServerName || '' }}</td>
            <td :style="`width:${widthList[1].width}px`" :title="row.OrderCode">{{ row.OrderCode || '' }}</td>
            <td :style="`width:${widthList[2].width}px`" :title="row._SellSideProductName">{{ row._SellSideProductName || '' }}</td>
            <td :style="`width:${widthList[3].width}px`" :title="row.Content">{{ row.Content || '' }}</td>
            <td :style="`width:${widthList[4].width}px`" :title="row._Size">{{ row._Size }}</td>
            <td :style="`width:${widthList[5].width}px`" :title="row._Material">{{ row._Material }}</td>
            <td :style="`width:${widthList[6].width}px`" :title="row._LineContent">{{ row._LineContent }}</td>
            <td :style="`width:${widthList[7].width}px`" :title="row._Count">{{ row._Count || '' }}</td>
            <td :style="`width:${widthList[8].width}px`" :title="row._CreateTime">{{ row._CreateTime || '' }}</td>
            <td :style="`width:${widthList[9].width}px`" :title="row._ProduceEndTime">{{ row._ProduceEndTime || '' }}</td>
            <td :style="`width:${widthList[10].width}px`">
              <span class="top-text" v-show="row.IsTop" :class="{'v-hide': !row.IsTop}">已置顶</span>
              <mp-button link type="primary" @click="onTopClick(row)" v-show="!row.IsTop">一键置顶</mp-button>
              <mp-button link type="primary" style="margin-left:8px"
               :disabled="row._isMakeuped"
               @click="onTestClick(row)" >_临时拼版</mp-button>
            </td>
            <td :style="`width:${widthList[11].width}px`">
              <mp-button link type="primary" @click="onProcessClick(row)">生产流程</mp-button>
              <mp-button link type="primary" @click="onTimeLineClick(row)">时间线</mp-button>
              <mp-button link @click="onSpreadClick(row)" class="spread" :disabled="!row._isCombineLine">
                <span class="mr-2">{{ row._isSpread ? '隐藏' : '展开' }}</span>
                <el-icon v-show="!row._isSpread"><CaretBottom /></el-icon>
                <el-icon v-show="row._isSpread"><CaretTop /></el-icon>
              </mp-button>
            </td>
          </tr>
          <template v-if="row._isSpread">
            <tr class="combine-line-info" :style="`width:${totalWidth}px`">
              <td>
                <span>组合生产线：</span>
                <h4>{{ row.Line || '未知生产线' }}</h4>
              </td>
            </tr>
            <tr v-for="(instance, i) in row.InstanceList" :key="i" class="instance-list" :style="`width:${totalWidth}px`">
              <td class="name">
                <span class="title">{{ instance.SemiFinishedName ? `${instance.SemiFinishedName}：` : ''}}</span>
                <span class="m">{{ instance.Material }}</span>
              </td>
              <td class="number">{{ instance.Number }}{{ instance.Unit }}</td>
              <td v-for="line in instance.LineList" :key="line.ID" v-show="line.PlateList.length > 0" class="line"
                :title="`${line.Name}\r\n大版ID：\r\n${line.PlateList.join('\r\n')}`">
                <h4>{{ line.Name }}</h4>
                <span class="ml-15">大版ID：</span>
                <span>{{ line.PlateList.join('、') }}</span>
              </td>
            </tr>
          </template>
        </template>
        <tr class="empty" v-if="localList.length === 0 && !loading" :style="`width:${totalWidth}px`">
          <span>暂无数据</span>
        </tr>
      </tbody>
    </table>
    <SetOrderTopDialog v-model:visible="topVisible" @submit="onTopSubmit" />
    <TimeLineDisplayDialog v-model:visible="timeLineVisible" :row="curRow" />
    <ProcessDisplayDialog v-model:visible="processVisible" :item="curRow" :targetType="ReportModeEnum.order" />
  </main>
</template>

<script setup lang='ts'>
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import {
  computed, onMounted, onUnmounted, ref,
} from 'vue';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import SetOrderTopDialog from './SetOrderTopDialog.vue';
import TimeLineDisplayDialog from './TimeLineDisplayDialog.vue';
import ProcessDisplayDialog from './ProcessDisplayDialog/ProcessDisplayDialog.vue';
import { IManageOrderListItem } from '../js/type';

const props = defineProps<{
  list: IManageOrderListItem[]
  loading: boolean
}>();

const emit = defineEmits(['top']);

const getSellSideProductName = (it: IManageOrderListItem) => {
  const { FirstLevel, SecondLevel, ProductName } = it;
  const list = [FirstLevel || '', SecondLevel || '', ProductName || ''];
  return list.filter(it => it).join('-');
};

const widthList = ref([
  { width: 120 },
  { width: 85 },
  { width: 200 },
  { width: 140 },
  { width: 140 },
  { width: 140 },
  { width: 160 },
  { width: 120 },
  { width: 110 },
  { width: 140 },
  { width: 120 },
  { width: 230 },
]);

const totalWidth = computed(() => widthList.value.map(it => it.width).reduce((a, b) => a + b, 0));

const spreadList = ref<string[]>([]);

const getIsMakeuped = (it: IManageOrderListItem) => {
  const t = it.InstanceList.find(ins => ins.LineList.find(l => l.PlateList.length > 0));

  return !!t;
};

const localList = computed(() => props.list.map(it => ({
  ...it,
  /** 销售端产品 */
  _SellSideProductName: getSellSideProductName(it),
  _Count: `${`${it.Number}`.replace(/(?=(\B)(\d{3})+$)/g, ',')}${it.Unit}`,
  _CreateTime: format2MiddleLangTypeDateFunc2(it.CreateTime),
  _ProduceEndTime: format2MiddleLangTypeDateFunc2(it.WishFinishTime),
  _isSpread: spreadList.value.includes(it.ID),
  _isCombineLine: it.InstanceList.length > 1,
  _Size: it.InstanceList.length > 1 ? it.Size || '' : it.InstanceList[0]?.Size || '',
  _Material: it.InstanceList.length > 1 ? '' : it.InstanceList[0]?.Material || '',
  _LineContent: it.InstanceList.length > 1 ? '' : it.InstanceList[0]?.LineList
    .map(l => (l.PlateList.length > 0 ? `${l.Name} 大版ID:${l.PlateList.join('、')}` : ''))
    .filter(it => it)
    .join('；\r\n') || '',
  _isMakeuped: getIsMakeuped(it),
})));

const onTestClick = async (it: typeof localList.value[number]) => {
  const resp = await api.productionManageApis.getOrderDistributeWithTest(it.ID).catch(() => null);

  if (resp?.data.isSuccess) {
    MpMessage.success('拼版成功，自行刷新');
  }
};

const onSpreadClick = (it: typeof localList.value[number]) => {
  if (!it._isCombineLine) return;
  if (spreadList.value.includes(it.ID)) {
    spreadList.value = spreadList.value.filter(id => id !== it.ID);
  } else {
    spreadList.value.push(it.ID);
  }
};

/** 当前设置对象条目 3弹窗共用 */
const curRow = ref<null | typeof localList.value[number]>(null);

/** 置顶 */
const topVisible = ref(false);

const onTopClick = (row: typeof localList.value[number]) => {
  curRow.value = row;
  topVisible.value = true;
};

const onTopSubmit = () => {
  if (!curRow.value) return;
  emit('top', curRow.value.ID);
};

/** 时间线 */
const timeLineVisible = ref(false);
const onTimeLineClick = (row: typeof localList.value[number]) => {
  curRow.value = row;
  timeLineVisible.value = true;
};

/** 生产流程 */
const processVisible = ref(false);
const onProcessClick = (row: typeof localList.value[number]) => {
  curRow.value = row;
  processVisible.value = true;
};

/** 拖动事件 */
let curIndex = -1;
let start = 0;

const bodymousemove = (e: MouseEvent) => {
  if (curIndex === -1) return;
  if (start === 0) {
    start = e.clientX;
    return;
  }
  const diff = e.clientX - start;
  const num = widthList.value[curIndex].width + diff;
  if (num >= 45) widthList.value[curIndex].width = num;
  start = e.clientX;
};

const bodymouseup = () => {
  document.body.removeEventListener('mousemove', bodymousemove);
};

const mousedown = (e: MouseEvent) => { // 处理开始拖动
  const dom = e.target as HTMLElement;
  if (dom.nodeName !== 'TH') return;
  let index = +(dom.dataset.index || -1);
  if (!widthList.value?.[index]) return;
  if (widthList.value && widthList.value[index] && (e.offsetX < 10 || e.offsetX > widthList.value[index].width - 10)) {
    if (e.offsetX < 10) {
      index -= 1;
    }
    start = 0;
    curIndex = index;
    document.body.addEventListener('mousemove', bodymousemove);
  }
};

const mousemove = (e: MouseEvent) => { // 处理鼠标指针样式变化
  // 找到所在方格位置 及 是否移动至可拖动位置
  const dom = e.target as HTMLElement;
  if (dom.nodeName !== 'TH') return;
  const index = +(dom.dataset.index || -1);
  if (!widthList.value?.[index]) return;
  if (e.offsetX < 10 || e.offsetX > widthList.value[index].width - 10) {
    dom.style.cursor = 'col-resize';
  } else {
    dom.style.cursor = '';
  }
};

onMounted(() => {
  document.body.addEventListener('mouseup', bodymouseup);
});

onUnmounted(() => {
  document.body.removeEventListener('mouseup', bodymouseup);
});

</script>

<style scoped lang='scss'>
.main-comp-wrap {
  overflow: hidden;
  width: 100%;
  > table {
    width: 100%;
    border-collapse: collapse;
    border-left: 1px solid #E5E5E5;
    border-right: 1px solid #E5E5E5;
    display: block;
    height: 100%;
    overflow: auto;
    overflow-y: overlay;
    > thead {
      height: 38px;
      box-sizing: border-box;
      display: block;
      position: sticky;
      top: 0;
      z-index: 9;
      min-width: 100%;
      tr {
        line-height: 36px;
        background-color: #f5f5f5;
        display: inline-block;
        border-top: 1px solid #E5E5E5;
        border-bottom: 1px solid #E5E5E5;
        white-space: nowrap;
        min-width: 100%;
        th {
          display: inline-block;
          text-align: center;
          font-weight: 700;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
          min-width: 30px;
          user-select: none;
          text-overflow: ellipsis;
          &:not(:last-of-type)::after {
            content: '';
            height: 15px;
            width: 1px;
            background-color: #d0d0d0;
            position: absolute;
            right: 0;
            top: 10px;
          }
        }
      }
    }
    > tbody {
      display: block;
      tr {
        display: inline-block;
        white-space: nowrap;
        min-width: 100%;
        transition: background-color 0.15s ease-in-out;
        td {
          display: inline-block;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          button {
            font-size: 12px;
            padding: 0;
            & + .el-button  {
              margin-left: 30px;
            }
            &.spread {
              color: #989898;
              .el-icon {
                font-size: 14px;
              }
            }
          }
        }

        &.row-title {
          background-color: #f8f8f8;
          line-height: 40px;
          border-top: 1px solid #E5E5E5;
          border-bottom: 1px solid #E5E5E5;
          margin-top: 15px;
          > td {
            text-align: center;
            .top-text {
              vertical-align: middle;
              // margin-right: 10px;
              // display: inline-block;
              // width: 100%;
              // margin: 0;
              &.v-hide {
                visibility: hidden;
              }
            }
          }
          &:hover {
            background-color: #f0f0f0;
          }
        }

        &.instance-list, &.combine-line-info {
          border-bottom: 1px solid #E5E5E5;
          line-height: 39px;
          text-align: left;
          &:hover {
            background-color: #d8effc;
          }
          > td {
              overflow: hidden;
              text-overflow: ellipsis;
              display: inline-block;
              vertical-align: top;
              flex: none;
            &.name {
              margin-left: 36px;
              min-width: 240px;
              margin-right: 15px;
              .title {
                margin-right: 8px;
              }
            }
            &.number {
              min-width: 65px;
              margin-right: 25px;
            }
          }
        }
        &.combine-line-info {
          td {
            margin-left: 36px;
            h4 {
              display: inline-block;
            }
          }
        }
        &.instance-list {
          display: flex;
          .line {
            display: flex;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex-shrink: 1;
            > span:last-of-type {
              flex-shrink: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            & + .line {
              padding-left: 60px;
            }
          }
        }
        &.empty {
          font-size: 12px;
          color: #989898;
          text-align: center;
          padding: 40px;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>
