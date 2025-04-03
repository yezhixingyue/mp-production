<template>
  <main class="main-comp-wrap" :class="{LaterCraft: Type === PlateTypeEnum.LaterCraft}">
    <table>
      <thead>
        <tr @mousedown="mousedown" @mousemove="mousemove">
          <th data-index="0" :style="`width:${widthList[0].width}px`">大版ID</th>
          <th data-index="1" :style="`width:${widthList[1].width}px`">翻版方式</th>
          <th data-index="2" :style="`width:${widthList[2].width}px`">序号</th>
          <th data-index="3" :style="`width:${widthList[3].width}px`">模板规格</th>
          <th data-index="4" :style="`width:${widthList[4].width}px`">开料尺寸</th>
          <th v-show="Type === PlateTypeEnum.Plate" data-index="5" :style="`width:${widthList[5].width}px`">物料</th>
          <th data-index="6" :style="`width:${widthList[6].width}px`">{{ Type === PlateTypeEnum.Plate ? '印刷数量' : '加工数量' }}</th>
          <th data-index="7" :style="`width:${widthList[7].width}px`">包含订单块</th>
          <th data-index="8" :style="`width:${widthList[8].width}px`">内容占比</th>
          <th data-index="9" :style="`width:${widthList[9].width}px`">拼版时间</th>
          <th data-index="10" :style="`width:${widthList[10].width}px`">拼版人员</th>
          <th data-index="11" :style="`width:${widthList[11].width}px`">最早发货时间</th>
          <th data-index="12" :style="`width:${widthList[12].width}px`">{{ Type === PlateTypeEnum.Plate ? '生产线' : '制版组' }}</th>
          <th data-index="13" :style="`width:${widthList[13].width}px`">当前位置</th>
          <th data-index="14" :style="`width:${widthList[14].width}px`">状态</th>
          <th data-index="15" :style="`width:${widthList[15].width}px`">操作</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="row in localList" :key="row.ID">
          <tr class="row-title" @click.self.stop="onSpreadClick(row)">
            <td :style="`width:${widthList[0].width}px`" :title="row.Code + ''">{{ row.Code || '' }}</td>
            <td :style="`width:${widthList[1].width}px`" :title="row.ReproductionType || ''">{{ row.ReproductionType || '' }}</td>
            <td :style="`width:${widthList[2].width}px`" :title="row.Index || ''">{{ row.Index || '' }}</td>
            <td :style="`width:${widthList[3].width}px`" :title="row._Size">{{ row._Size || '' }}</td>
            <td :style="`width:${widthList[4].width}px`" :title="row.MaterialSize">{{ row.MaterialSize || '' }}</td>
            <td v-show="Type === PlateTypeEnum.Plate" :style="`width:${widthList[5].width}px`" :title="row.Material">{{ row.Material || '' }}</td>
            <td :style="`width:${widthList[6].width}px`" :title="row._Number">{{ row._Number || '' }}</td>
            <td :style="`width:${widthList[7].width}px`" :title="row.ChunkNumber + ''">{{ row.ChunkNumber }}</td>
            <td :style="`width:${widthList[8].width}px`" :title="`${row._Percent}`">{{ row._Percent }}</td>
            <td :style="`width:${widthList[9].width}px`" :title="row._CreateTime">{{ row._CreateTime || '' }}</td>
            <td :style="`width:${widthList[10].width}px`" :title="row.Operator">{{ row.Operator || '' }}</td>
            <td :style="`width:${widthList[11].width}px`" :title="row._FastDepartureTime">{{ row._FastDepartureTime || '' }}</td>
            <td :style="`width:${widthList[12].width}px`" :title="row.Line">{{ row.Line || '' }}</td>
            <td :style="`width:${widthList[13].width}px`" :title="row._Position">{{ row._Position }}</td>
            <td :style="`width:${widthList[14].width}px`" :title="row._StatusText">{{ row._StatusText || '' }}</td>
            <td :style="`width:${widthList[15].width}px`">
              <mp-button link type="primary" v-if="user?.PermissionList.PermissionManagePlate.Obj.Print" :disabled="row._isCancelled"
               @click="onOrderPrintClick(row)">打印工单</mp-button>
              <mp-button link type="primary" v-if="user?.PermissionList.PermissionManagePlate.Obj.Print" @click="onBarCodePrintClick(row)"
               :disabled="!row.MapFilePath || row._isCancelled">打印条码稿</mp-button>
              <mp-button link type="primary" v-if="user?.PermissionList.PermissionManagePlate.Obj.Query && Type === PlateTypeEnum.Plate"
               @click="onProcessClick(row)">生产流程</mp-button>

              <mp-button link type="primary" class="ml-15" v-if="user?.PermissionList.PermissionManagePlate.Obj.Query && Type === PlateTypeEnum.LaterCraft"
              @click="onOrderContainClick(row)">包含订单</mp-button>

              <el-dropdown trigger="click" :disabled="row._moreIsDisabled">
                <span class="el-dropdown-link">
                  <mp-button link type="primary" :disabled="row._moreIsDisabled">更多</mp-button>
                </span>
                <template #dropdown>
                  <el-dropdown-menu >
                    <el-dropdown-item v-for="it in row._downloadList" :key="it.key">
                      <a :href="it.href" target="_blank" >
                        <span class="ft-12">下载{{ it.key }}</span>
                      </a>
                    </el-dropdown-item>

                    <el-dropdown-item v-if="row._showGenerateFile" @click="onGenerateFileClick(row)"
                     :disabled="row.Status===PlateStatusEnum.Finished || !row.MapFilePath">
                      <span class="ft-12">重新生成文件</span>
                    </el-dropdown-item>

                    <el-dropdown-item  @click="onFileErrorShowClick(row)" v-if="row.FileError">
                      <span class="ft-12">查看错误</span>
                    </el-dropdown-item>

                    <el-dropdown-item v-if="row._showGenerateFile" @click="onErrorFileTestClick(row)"
                     :disabled="row.Status===PlateStatusEnum.Finished || !row.MapFilePath">
                      <span class="ft-12">排查错误文件</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <mp-button link @click="onSpreadClick(row)" class="spread" :disabled="row.ChildList.length === 0" v-show="Type === PlateTypeEnum.Plate">
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
              <td class="detail size" :title="child._Size">{{ child._Size }}</td>
              <td class="detail" :title="child._Percent"> <span style="margin-left: 20px;">内容占比：{{ child._Percent }}</span> </td>
              <td class="detail" :title="child._Position">{{ child._Position }}</td>
              <td class="detail" :title="child._StatusText">{{ child._StatusText }}</td>
              <td class="menus">
                <mp-button link type="primary" v-if="user?.PermissionList.PermissionManagePlate.Obj.Query" @click="onProcessClick(row, child)">生产流程</mp-button>
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

    <!-- 展示包含订单弹窗 -->
    <OrderContainDialog v-model:visible="orderContainVisible" :item="curRow" />

    <!-- 工单打印弹窗 -->
    <WorkOrderPrintDialog :row="curRow" ref="oWorkOrderPrintDialog" />

    <!-- 测试文件弹窗 -->
    <ErrorFileTestDialog :row="fileTestState.row" v-model:visible="fileTestState.visible" />
  </main>
</template>

<script setup lang='ts'>
import {
  computed, defineAsyncComponent, nextTick, onMounted, onUnmounted, ref,
} from 'vue';
import { storeToRefs } from 'pinia';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import { loadBarcode } from '@/views/ExceptionManage/_ExceptionCommonViews/SetupView/js/utils';
import NodePicDialog from '@/components/common/NodePicDialog/NodePicDialog.vue';
import { useUserStore } from '@/store/modules/user';
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IManagePlateInfo, IPlateListChild } from '../js/type';
import { PlateStatusEnumList } from '../js/EnumList';
import { PlateStatusEnum, PlateTypeEnum } from '../js/enum';
import WorkOrderPrintDialog from './WorkOrderPrintDialog.vue';
import { useErrorFileTest } from '../js/useErrorFileTest';
import ErrorFileTestDialog from './ErrorFileTestDialog/ErrorFileTestDialog.vue';

const OrderContainDialog = defineAsyncComponent(() => import('./OrderContainDialog.vue'));

const props = defineProps<{
  list: IManagePlateInfo[]
  loading: boolean
  Type: PlateTypeEnum
}>();

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const widthList = ref([
  { width: 63 },
  { width: 63 },
  { width: 80 },
  { width: props.Type === PlateTypeEnum.Plate ? 155 : 190 },
  { width: 80 },
  { width: 180 },
  { width: 90 }, // 数量
  { width: 78 },
  { width: props.Type === PlateTypeEnum.Plate ? 63 : 78 },
  { width: 106 },
  { width: 62 },
  { width: 106 },
  { width: props.Type === PlateTypeEnum.Plate ? 103 : 183 },
  { width: props.Type === PlateTypeEnum.Plate ? 125 : 200 },
  { width: 53 },
  { width: props.Type === PlateTypeEnum.LaterCraft ? 260 : 286 },
]);

const totalWidth = computed(() => {
  const _w = widthList.value.map(it => it.width).reduce((a, b) => a + b, 0);
  return props.Type === PlateTypeEnum.Plate ? _w : _w - widthList.value[3].width;
});

const spreadList = ref<string[]>([]);

const getDownloadList = (it: IManagePlateInfo) => {
  const arr: { key: string; href: string }[] = [];

  if (it.FileDic && typeof it.FileDic === 'object') {
    Object.entries(it.FileDic).forEach(([key, href]) => {
      if (key && href) {
        arr.push({ key, href });
      }
    });
  }

  return arr;
};

const localList = computed(() => props.list.map(it => {
  const _isCancelled = it.Status === PlateStatusEnum.HaveCancled;
  const _downloadList = _isCancelled ? [] : getDownloadList(it);
  // eslint-disable-next-line max-len
  const _showGenerateFile = user.value?.PermissionList.PermissionManagePlate.Obj.GenerateFile && [PlateTypeEnum.Plate, PlateTypeEnum.LaterCraft].includes(it.Type);

  const _moreIsDisabled = (_downloadList.length === 0 && !_showGenerateFile && !it.FileError) || _isCancelled;

  return {
    ...it,
    _Number: `${`${it.Number}`.replace(/(?=(\B)(\d{3})+$)/g, ',')}张`,
    _CreateTime: format2MiddleLangTypeDateFunc2(it.CreateTime),
    _FastDepartureTime: format2MiddleLangTypeDateFunc2(it.FastDepartureTime),
    // _Position: it.Equipment ? [it.Equipment.GroupName, it.Equipment.Name].filter(it => it).join('-') : '',
    _StatusText: getEnumNameByID(it.Status, PlateStatusEnumList) || '',
    _isSpread: spreadList.value.includes(it.ID),
    _Size: [it.Template, it.TemplateSize].filter(it => it).join(' '),
    _Position: it.Status !== PlateStatusEnum.Finished ? it.Position || '' : '',
    _Percent: typeof it.Percent === 'number' ? `${it.Percent}%` : '',
    _downloadList,
    _isCancelled,
    _showGenerateFile,
    _moreIsDisabled,
    ChildList: it.ChildList.map(child => ({
      ...child,
      _Size: child.Template || child.TemplateSize ? `尺寸规格：${[child.Template, child.TemplateSize].filter(it => it).join(' ')}` : '',
      _Position: it.Status === PlateStatusEnum.Finished && child.Position ? `当前位置：${child.Position}` : '',
      _StatusText: it.Status === PlateStatusEnum.Finished && getEnumNameByID(child.Status, PlateStatusEnumList)
        ? `状态：${getEnumNameByID(child.Status, PlateStatusEnumList)}` : '',
      _Percent: typeof child.Percent === 'number' ? `${child.Percent}%` : '',
    })),
  };
}));

const submitGenerateFile = async (row: typeof localList.value[number]) => {
  const resp = await api.productionManageApis.getPlateGenreateFile(row.ID);

  if (resp.data?.isSuccess) {
    MpMessage.success('生成成功!');
  }
};

const onGenerateFileClick = (row: typeof localList.value[number]) => {
  MpMessage.warn('确定重新生成大版文件吗 ?', `<ul class='generate-file-msg-section'>
    <li>大版ID：[ ${row.Code} ]</li>
    <li>拼版人员：[ ${row.Operator} ]</li>
  </ul>`, () => {
    submitGenerateFile(row);
  }, undefined, true);
};

const onFileErrorShowClick = (row: typeof localList.value[number]) => {
  MpMessage.error(`大版 [${row.Code}] 错误信息`, `<h4 class='plate-file-err-msg-dialog'>${row.FileError}</h4>`, undefined, undefined, true);
};

const { onErrorFileTestClick, fileTestState } = useErrorFileTest();

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

const orderContainVisible = ref(false);
const onOrderContainClick = (row: typeof localList.value[number]) => {
  curRow.value = row;
  orderContainVisible.value = true;
};

const oWorkOrderPrintDialog = ref<InstanceType<typeof WorkOrderPrintDialog>>();
const onOrderPrintClick = async (row: typeof localList.value[number]) => { // 打印大版工单
  if (!row || !oWorkOrderPrintDialog.value) return;

  curRow.value = row;

  await nextTick();

  oWorkOrderPrintDialog.value.display();
};

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
          padding: 0 2px;
          button {
            font-size: 12px;
            padding: 0;
            margin-top: -4px;
            & + :deep(.el-button)  {
              margin-left: 10px;
            }
            &.spread {
              color: #989898;
              margin-left: 17px;
              .el-icon {
                font-size: 14px;
              }
            }
          }

          :deep(.el-dropdown) {
            margin-left: 15px;
            line-height: 40px;
            top: 1px;
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
          display: flex;
          align-items: center;
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
              margin-left: 24px;
              min-width: 150px;
              margin-right: 13px;
            }
            &.number {
              min-width: 150px;
              margin-right: 13px;
            }

            &.detail {
              flex: 1;
              padding-right: 10px;
              &.size {
                flex: 2;
              }
            }

            &.menus {
              width: 286px;
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

  &.LaterCraft {
    button + :deep(.el-button)  {
      margin-left: 18px;
    }
  }
}
</style>

<style lang="scss">
ul.generate-file-msg-section {
  line-height: 24px;
  text-align: left;
  margin: 0 auto;
  display: inline-block;

  > li:first-of-type {
    margin-left: 14px;
  }
}

.mp-message:has(h4.plate-file-err-msg-dialog) {
  width: 420px !important;
  // max-width: 420px;
  .el-message-box__header {
    .el-message-box__title {
      > span {
        justify-content: flex-start;
        position: relative;
        margin: 0 10px;
        padding-left: 4px;
        top: -25px;
        // font-weight: 400;
        color: #585858;
        border-bottom: 1px solid #eee;
        padding-bottom: 7px;
        font-size: 15px;
        letter-spacing: 0.5px;
        &::before {
          // display: none !important;
          width: 20px;
          height: 20px;
          margin-right: 9px;
        }
      }
    }
  }

  .plate-file-err-msg-dialog {
    text-align: left;
    margin-top: -32px;
    font-weight: 400;
    color:#585858;
    letter-spacing: 1px;
    text-indent: 2em;
  }
}

</style>
