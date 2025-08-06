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
          <th data-index="10" :style="`width:${widthList[10].width}px`">状态</th>
          <th data-index="10" :style="`width:${widthList[11].width}px`">置顶</th>
          <th data-index="11" :style="`width:${widthList[12].width}px`">操作</th>
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
            <td :style="`width:${widthList[6].width}px`" :title="row._LineContent.replace(/-/g, '\r\n')">{{ row._LineContent }}</td>
            <td :style="`width:${widthList[7].width}px`" :title="row._Count">{{ row._Count || '' }}</td>
            <td :style="`width:${widthList[8].width}px`" :title="row._CreateTime">{{ row._CreateTime || '' }}</td>
            <td :style="`width:${widthList[9].width}px`" :title="row._ProduceEndTime">{{ row._ProduceEndTime || '' }}</td>
            <td :style="`width:${widthList[10].width}px`" :title="row._StatusDetail?.Name || ''">{{ row._StatusDetail?.Name || '' }}</td>
            <td :style="`width:${widthList[11].width}px`">
              <span class="top-text" v-show="row.IsTop" :class="{'v-hide': !row.IsTop}">已置顶</span>
              <mp-button link type="primary" v-if="user?.PermissionList.PermissionManageOrder.Obj.TopShow"
                :disabled="!row._StatusDetail || row._StatusDetail._CancelStatus === OrderCancelStatus.cannot"
               @click="onTopClick(row)" v-show="!row.IsTop">一键置顶</mp-button>
            </td>
            <td :style="`width:${widthList[12].width}px`">
              <mp-button link type="primary" @click="onProcessClick(row)">生产流程</mp-button>
              <mp-button link type="primary" @click="onTimeLineClick(row)">时间线</mp-button>

              <el-dropdown trigger="click">
                <mp-button link type="primary" class="el-dropdown-link">更多</mp-button>
                <template #dropdown>
                  <el-dropdown-menu class="mp-order-list-manage-table-menu--drop-down-wrap">
                    <el-dropdown-item link type="primary"
                      v-if="user?.PermissionList.PermissionManageOrder.Obj.Download"
                      :disabled="!row.CheckedFileList || row.CheckedFileList.length === 0"
                      @click="onDownloadClick(row)">下载（{{row.CheckedFileList?.length || 0}}）</el-dropdown-item>
                    <!-- 文件替换 -->
                    <el-dropdown-item link type="primary"
                      v-if="user?.PermissionList.PermissionManageOrder.Obj.Replace"
                      :disabled="!row.CheckedFileList || row.CheckedFileList.length === 0 || !row.IsReplaceable"
                      @click="onFileReplaceClick(row)">文件替换</el-dropdown-item>
                    <!-- 转自定义版 -->
                    <el-dropdown-item link type="primary"
                      v-if="user?.PermissionList.PermissionManageOrder.Obj.ToCustomizPlate"
                      :disabled="!row.ToCustomPlate"
                      @click="onToCustomizPlateClick(row)">转自定义版</el-dropdown-item>
                    <!-- 查看详情序列化字段 -->
                    <el-dropdown-item link type="primary" @click="onDetailDisplayClick(row)">加工信息</el-dropdown-item>
                    <!-- 取消 -->
                    <el-dropdown-item link type="primary"
                      v-if="user?.PermissionList.PermissionManageOrder.Obj.Cancle"
                      :disabled="!row._StatusDetail || row._StatusDetail._CancelStatus === OrderCancelStatus.cannot || !row.IsManualOrder"
                      @click="onCancelClick(row)">取消</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <mp-button link @click="onSpreadClick(row)" class="spread" :disabled="!row._isCombineLine">
                <span class="mr-2">{{ row._isSpread ? '隐藏' : '展开' }}</span>
                <el-icon v-show="!row._isSpread"><CaretBottom /></el-icon>
                <el-icon v-show="row._isSpread"><CaretTop /></el-icon>
              </mp-button>
            </td>
          </tr>
          <tr class="combine-line-info" :style="`width:${totalWidth}px`" v-show="row._isSpread">
            <td>
              <span>组合生产线：</span>
              <h4>{{ row.Line || '' }}</h4>
            </td>
          </tr>
          <tr v-for="(instance, i) in row.InstanceList" :key="i" class="instance-list" :style="`width:${totalWidth}px`" v-show="row._isSpread">
            <td class="name">
              <span class="title">{{ instance.SemiFinishedName ? `${instance.SemiFinishedName}：` : ''}}</span>
              <span class="m">{{ instance.Material }}</span>
            </td>
            <td class="number">{{ instance.Number }}{{ instance.Unit }}</td>
            <td class="line" :title="_getNormalOrderLineContent(instance).replace(/-/g, '\r\n')">
              <span>{{ _getNormalOrderLineContent(instance) }}</span>
            </td>
          </tr>
        </template>
        <tr class="empty" v-show="localList.length === 0 && !loading" :style="`width:${totalWidth}px`">
          <span>暂无数据</span>
        </tr>
      </tbody>
    </table>
    <SetOrderTopDialog v-model:visible="topVisible" @submit="onTopSubmit" />
    <TimeLineDisplayDialog v-model:visible="timeLineVisible" :row="curRow" />
    <NodePicDialog v-model:visible="processVisible" :item="curRow" :targetType="ReportModeEnum.order" />
    <!-- 订单取消弹窗 -->
    <OrderCancelDialog v-model:visible="cancelOrderVisible" :row="curRow" @submit="handleCancel" />
    <!-- 文件替换弹窗 -->
    <FileReplaceDialog v-model:visible="replaceFileVisible" :row="curRow" />
    <!-- 加工信息 -->
    <OrderDetailInfoDialog v-model:visible="describeVisible" :Describe="currentDescribe" />
  </main>
</template>

<script setup lang='ts'>
// import api from '@/api';
// import { MpMessage } from '@/assets/js/utils/MpMessage';
import {
  computed, onMounted, onUnmounted, ref,
} from 'vue';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import NodePicDialog from '@/components/common/NodePicDialog/NodePicDialog.vue';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import SetOrderTopDialog from './SetOrderTopDialog.vue';
import TimeLineDisplayDialog from './TimeLineDisplayDialog.vue';
import OrderCancelDialog from './OrderCancelDialog.vue';
import FileReplaceDialog from './FileReplaceDialog.vue';
import { IManageOrderListItem, IOrderCancelRelation } from '../js/type';
import { OrderCancelStatus } from '../js/enum';
import { getOrderTableListItem, _getNormalOrderLineContent } from '../js/getOrderTableList';
import OrderDetailInfoDialog from './OrderDetailInfoDialog.vue';

const props = defineProps<{
  list: IManageOrderListItem[]
  loading: boolean
}>();

const emit = defineEmits(['top', 'cancel', 'toCustomizPlate']);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const widthList = ref([
  { width: 110 },
  { width: 85 },
  { width: 190 },
  { width: 130 },
  { width: 140 },
  { width: 140 },
  { width: 160 },
  { width: 120 },
  { width: 110 },
  { width: 135 },
  { width: 75 },
  { width: 65 },
  { width: 225 },
]);

const totalWidth = computed(() => widthList.value.map(it => it.width).reduce((a, b) => a + b, 0));

// const noMoreMenuPermission = computed(() => {
//   if (user.value?.PermissionList.PermissionManageOrder.Obj) {
//     const { Cancle, Download, Replace, ToCustomizPlate } = user.value.PermissionList.PermissionManageOrder.Obj;

//     return !Cancle && !Download && !Replace && !ToCustomizPlate;
//   }

//   return false;
// });

const spreadList = ref<string[]>([]);

const localList = computed(() => props.list.map(it => getOrderTableListItem(it, spreadList.value)));

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

/** 订单下载 */
const onDownloadClick = (row: typeof localList.value[number]) => {
  if (!row.CheckedFileList || row.CheckedFileList.length === 0) return;
  const _download = (href) => {
    if (!href) return;

    const link = document.createElement('a');

    link.target = '_blank';
    link.style.display = 'none';
    link.href = href;

    document.body.appendChild(link);

    link.click();
  };

  row.CheckedFileList.forEach(it => _download(it.FilePath));
};

/** 订单文件替换 */
const replaceFileVisible = ref(false);
const onFileReplaceClick = (row: typeof localList.value[number]) => {
  curRow.value = row;
  replaceFileVisible.value = true;
};

/** 转自定义版 */
const onToCustomizPlateClick = (row: typeof localList.value[number]) => {
  MpMessage.warn('确定该订单转自定义版吗 ?', `订单ID: [ ${row.OrderCode} ]`, () => {
    emit('toCustomizPlate', row.ID);
  });
};

const currentDescribe = ref('');
const describeVisible = ref(false);
const onDetailDisplayClick = (row: typeof localList.value[number]) => {
  currentDescribe.value = row.Describe;
  describeVisible.value = true;
};

/** 订单取消 */
const cancelOrderVisible = ref(false);
const handleCancel = async (e: IOrderCancelRelation) => {
  const cb = () => {
    if (cancelOrderVisible.value) cancelOrderVisible.value = false;
  };
  emit('cancel', e, cb);
};
const onCancelClick = (row: typeof localList.value[number]) => {
  if (!row._StatusDetail) return;

  if (row._StatusDetail._CancelStatus === OrderCancelStatus.candirect) { // 可以直接取消
    MpMessage.warn('确定要取消该订单吗 ?', `订单ID: [ ${row.OrderCode} ]`, () => {
      const temp: IOrderCancelRelation = {
        ID: row.ID,
        PlateList: [],
      };
      handleCancel(temp);
    });
  }
  if (row._StatusDetail._CancelStatus === OrderCancelStatus.needplate) { // 需要选择大版
    curRow.value = row;
    cancelOrderVisible.value = true;
  }
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
          padding: 0 2px;
          box-sizing: border-box;
          button {
            font-size: 12px;
            padding: 0;
            margin-top: -4px;
            & + .el-button  {
              margin-left: 20px;
            }
            &.spread {
              color: #989898;
              margin-left: 20px;
              .el-icon {
                font-size: 14px;
              }
            }
          }
          :deep(.el-dropdown) {
            vertical-align: middle;
            margin-left: 20px;
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
              min-width: 320px;
              margin-right: 15px;
              .title {
                margin-right: 8px;
              }
            }
            &.number {
              min-width: 80px;
              margin-right: 25px;
              text-align: center
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
            > span {
              flex-shrink: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
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

.mp-order-list-manage-table-menu--drop-down-wrap {
  --el-font-size-base: 12px;
}
</style>
