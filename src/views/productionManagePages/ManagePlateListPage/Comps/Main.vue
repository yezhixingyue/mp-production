<template>
  <main class="main-comp-wrap">
    <table>
      <thead>
        <tr @mousedown="mousedown" @mousemove="mousemove">
          <th data-index="0" :style="`width:${widthList[0].width}px`">大版ID</th>
          <th data-index="0" :style="`width:${widthList[1].width}px`">序号</th>
          <th data-index="1" :style="`width:${widthList[2].width}px`">尺寸规格</th>
          <th data-index="2" :style="`width:${widthList[3].width}px`">物料</th>
          <th data-index="3" :style="`width:${widthList[4].width}px`">印刷数量</th>
          <th data-index="4" :style="`width:${widthList[5].width}px`">包含订单块</th>
          <th data-index="5" :style="`width:${widthList[6].width}px`">拼版时间</th>
          <th data-index="6" :style="`width:${widthList[7].width}px`">拼版人员</th>
          <th data-index="7" :style="`width:${widthList[8].width}px`">生产线</th>
          <th data-index="8" :style="`width:${widthList[9].width}px`">当前位置</th>
          <th data-index="9" :style="`width:${widthList[10].width}px`">状态</th>
          <th data-index="11" :style="`width:${widthList[11].width}px`">操作</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="row in localList" :key="row.ID">
          <tr class="row-title" @click.self.stop="onSpreadClick(row)">
            <td :style="`width:${widthList[0].width}px`" :title="row.Code + ''">{{ row.Code || '' }}</td>
            <td :style="`width:${widthList[1].width}px`" :title="row.Code + ''">{{ row.Index || '' }}</td>
            <td :style="`width:${widthList[2].width}px`" :title="row._Size">{{ row._Size || '' }}</td>
            <td :style="`width:${widthList[3].width}px`" :title="row.Material">{{ row.Material || '' }}</td>
            <td :style="`width:${widthList[4].width}px`" :title="row._Number">{{ row._Number || '' }}</td>
            <td :style="`width:${widthList[5].width}px`" :title="row.ChunkNumber + ''">{{ row.ChunkNumber }}</td>
            <td :style="`width:${widthList[6].width}px`" :title="row._CreateTime">{{ row._CreateTime || '' }}</td>
            <td :style="`width:${widthList[7].width}px`" :title="row.Operator">{{ row.Operator || '' }}</td>
            <td :style="`width:${widthList[8].width}px`" :title="row.Line">{{ row.Line || '' }}</td>
            <td :style="`width:${widthList[9].width}px`" :title="row.Position">{{ row.Position || '' }}</td>
            <td :style="`width:${widthList[10].width}px`" :title="row._StatusText">{{ row._StatusText || '' }}</td>
            <td :style="`width:${widthList[11].width}px`">
              <mp-button link type="primary" v-if="user?.PermissionList.PermissionManagePlate.Obj.Print" @click="onOrderPrintClick(row)">打印工单</mp-button>
              <mp-button link type="primary" v-if="user?.PermissionList.PermissionManagePlate.Obj.Print" @click="onBarCodePrintClick(row)"
               :disabled="!row.MapFilePath">打印条码稿</mp-button>
              <mp-button link type="primary" v-if="user?.PermissionList.PermissionManagePlate.Obj.Query" @click="onProcessClick(row)">进度详情</mp-button>
              <mp-button link @click="onSpreadClick(row)" class="spread" :disabled="row.ChildList.length === 0">
                <span class="mr-2">{{ row._isSpread ? '隐藏' : '展开' }}</span>
                <el-icon v-show="!row._isSpread"><CaretBottom /></el-icon>
                <el-icon v-show="row._isSpread"><CaretTop /></el-icon>
              </mp-button>
            </td>
          </tr>
          <template v-if="row._isSpread">
            <tr v-for="(child) in row.ChildList" :key="child.ID" class="child-list" :style="`width:${totalWidth}px`">
              <td class="name">
                <span class="m">{{ child.Code }}</span>
              </td>
              <td class="number">含订单：{{ child.ChunkNumber }}个</td>
              <td :style="`width:${widthList[10].width}px`">
                <mp-button link type="primary" v-if="user?.PermissionList.PermissionManagePlate.Obj.Query" @click="onProcessClick(row, child)">进度详情</mp-button>
                <!-- <mp-button link type="primary" @click="onBarCodePrintClick(row, child)" :disabled="!child.MapFilePath">打印条码稿</mp-button> -->
              </td>
            </tr>
          </template>
        </template>
        <tr class="empty" v-if="localList.length === 0 && !loading" :style="`width:${totalWidth}px`">
          <span>暂无数据</span>
        </tr>
      </tbody>
    </table>
    <NodePicDialog v-model:visible="processVisible" :item="curRowChildPlat || curRow" :targetType="ReportModeEnum.board" />

    <!-- 打印工单 -->
    <PrintDialog ref="oPrintDialog" :title="`${curRow?.Code}（大版）`">
      <div class="plate-print-content">
        <div class="img-box" v-if= 'curRow'>
          <img :src="imgSrc" v-show="imgSrc" alt="">
        </div>
        <div class="right" v-if= 'curRow'>
          <h2>大版ID：{{ curRow?.Code || '' }}</h2>
          <div class="remark">
            <p>{{ curRow?.Template || '' }} {{ curRow?.TemplateSize || '' }}</p>
            <p>{{ curRow?.Material || '' }}</p>
          </div>
          <h4>{{ curRow?.Number || '' }}{{ curRow?.Unit || '' }}</h4>
          <p class="time">打印时间：{{ curPrintData }}</p>
        </div>
        <embed type="application/pdf" v-if= 'previewUrl' :src="previewUrl" width="100%" height="100%" />
      </div>
    </PrintDialog>
  </main>
</template>

<script setup lang='ts'>
import {
  computed, onMounted, onUnmounted, ref,
} from 'vue';
import { storeToRefs } from 'pinia';
import { getQRCodeSrc } from '@/components/common/General/Print/utils';
import { format2LangTypeDate, format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { loadBarcode } from '@/views/ExceptionManage/_ExceptionCommonViews/SetupView/js/utils';
import PrintDialog from '@/components/common/General/Print/PrintDialog.vue';
import NodePicDialog from '@/components/common/NodePicDialog/NodePicDialog.vue';
import { useUserStore } from '@/store/modules/user';
import { IManagePlateInfo, IPlateListChild } from '../js/type';
import { PlateStatusEnumList } from '../js/EnumList';

const props = defineProps<{
  list: IManagePlateInfo[]
  loading: boolean
}>();

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const widthList = ref([
  { width: 85 },
  { width: 120 },
  { width: 190 },
  { width: 200 },
  { width: 140 },
  { width: 85 },
  { width: 115 },
  { width: 85 },
  { width: 110 },
  { width: 180 },
  { width: 75 },
  { width: 325 },
]);

const totalWidth = computed(() => widthList.value.map(it => it.width).reduce((a, b) => a + b, 0));

const spreadList = ref<string[]>([]);

const localList = computed(() => props.list.map(it => ({
  ...it,
  _Number: `${`${it.Number}`.replace(/(?=(\B)(\d{3})+$)/g, ',')}张`,
  _CreateTime: format2MiddleLangTypeDateFunc2(it.CreateTime),
  // _Position: it.Equipment ? [it.Equipment.GroupName, it.Equipment.Name].filter(it => it).join('-') : '',
  _StatusText: getEnumNameByID(it.Status, PlateStatusEnumList) || '',
  _isSpread: spreadList.value.includes(it.ID),
  _Size: [it.Template, it.TemplateSize].filter(it => it).join(' '),
})));

const onSpreadClick = (it: typeof localList.value[number]) => {
  if (it.ChildList.length === 0) return;
  if (spreadList.value.includes(it.ID)) {
    spreadList.value = spreadList.value.filter(id => id !== it.ID);
  } else {
    spreadList.value.push(it.ID);
  }
};

/** 当前设置对象条目 3弹窗共用 */
// const curRow = ref<null | typeof localList.value[number]>(null);

/** 事件 */
const curRow = ref<null | typeof localList.value[number]>(null);
const curRowChildPlat = ref<null | IPlateListChild>(null);

const processVisible = ref(false);
const onProcessClick = (row: typeof localList.value[number], childPlat: IPlateListChild | null = null) => {
  curRow.value = row;
  curRowChildPlat.value = childPlat;
  processVisible.value = true;
};

const imgSrc = ref('');
const curPrintData = ref('');
const oPrintDialog = ref<InstanceType<typeof PrintDialog>>();
const onOrderPrintClick = async (row: typeof localList.value[number]) => {
  if (!row || !oPrintDialog.value) return;

  curRow.value = row;
  imgSrc.value = '';

  const src = await getQRCodeSrc(row.Code); // 获取img src

  if (src) {
    imgSrc.value = src;
    curPrintData.value = format2LangTypeDate(getTimeConvertFormat({ withHMS: true }));
    // oPrintDialog.value.print(`${row.Code}（大版工单）`);
    oPrintDialog.value.open();
  }
};

const previewUrl = ref('');
const onBarCodePrintClick = (row: typeof localList.value[number], childPlat: IPlateListChild | null = null) => {
  const item = childPlat || row;

  loadBarcode(item);
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
  if (num >= 30) widthList.value[curIndex].width = num;
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
          text-overflow: ellipsis;
          user-select: none;
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
          box-sizing: border-box;
          padding: 0 6px;
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
              margin-right: 10px;
              &.v-hide {
                visibility: hidden;
              }
            }
          }
          &:hover {
            background-color: #f0f0f0;
          }
        }

        &.child-list {
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
              margin-left: 44px;
              min-width: 150px;
              margin-right: 13px;
            }
            &.number {
              min-width: 150px;
              margin-right: 13px;
            }
          }
        }
        &.child-list {
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
