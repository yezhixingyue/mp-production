<template>
  <div class="digital-list-print-item">
    <!-- 页头 -->
    <div class="header">
      <div class="left">
        <p class="SemiFinished b">
          {{ item.UploadFile.SemiFinished }}
          <i v-if="item.UploadFile.SemiFinished && ChunkInfo && OrderInfo" style="font-size: 0.7em"
            > - {{ ChunkInfo.IndexInOrder }} / {{ OrderInfo.InstanceNumber }}</i>
        </p>
        <p class="title b">
          <span class="station">{{ OrderInfo?.StationName || '' }}</span>
          <span>凌顶揽众数码流转工单</span>
        </p>
        <p>生 产 线：{{ item.ProductionLine.Name }}</p>
      </div>
      <div class="code">
        <img :src="item._ChunkQcCode" alt="">
        <span class="c">{{ ChunkInfo?.Code }}</span>
      </div>
    </div>

    <!-- 生产工期与下单时间 -->
    <p class="time">
      <span>生产工期：{{ _ProduceEndTime }}</span>
      <span>下单时间：{{ format2LangTypeDate(getTimeConvertFormat({ withHMS: true, date: OrderInfo?.CreateTime })) }}</span>
    </p>

    <!-- 订单信息 -->
    <div class="order-info">
      <div class="top row">
        <div class="title">订单信息</div>
        <div class="main">
          <table>
            <thead>
              <tr>
                <th style="width: 25%;">客户信息</th>
                <th style="width: 23%;">产品名称</th>
                <th style="width: 26%;">下单尺寸</th>
                <th style="width: 10%;">款数</th>
                <th>每款数量</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ OrderInfo?.CustomerSN }}{{ OrderInfo?.CustomerName }}</td>
                <td>{{ OrderInfo?.ProductName }}</td>
                <td>{{ OrderInfo?.Size }}</td>
                <td>{{ OrderInfo?.KindCount }}</td>
                <td>{{ OrderInfo?.Number }}{{ OrderInfo?.Unit }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="bottom row">
        <div class="title">订单需求</div>
        <div class="main content">{{ OrderInfo?.Describe || '' }}</div>
      </div>
    </div>

    <!-- 文件信息 -->
    <div class="file-info">
      <div class="top row" :style="`height: ${item.UploadFile.AppendFilePath ? 7 : 5}em;`">
        <div class="title">文件信息</div>
        <div class="main">
          <table>
            <thead>
              <tr>
                <th style="width: 16%;">半成品名称</th>
                <th style="width: 32%;">文件尺寸</th>
                <th>文件页数</th>
                <th>单双面</th>
                <th>打印份数</th>
                <th>上传人</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ item.UploadFile.SemiFinished }}</td>
                <td>{{ item.UploadFile.FileSize }}</td>
                <td>{{ item.UploadFile.PageNumber }}</td>
                <td>{{ getEnumNameByID(item.UploadFile.PrintSide, PrintSideEnumList) }}</td>
                <td>
                  <template v-if="typeof item.UploadFile.Number === 'number'">
                    {{ item.UploadFile.AppendFilePath ? item.UploadFile.Number - 1 : item.UploadFile.Number }}{{ item.UploadFile.Unit }}
                  </template>
                </td>
                <td>{{ item.UploadFile.Operator }}</td>
              </tr>
              <tr v-if="item.UploadFile.AppendFilePath">
                <td>{{ item.UploadFile.SemiFinished }}</td>
                <td>{{ item.UploadFile.FileSize }}</td>
                <td>{{ item.UploadFile.AppendPageNumber }}</td>
                <td>{{ getEnumNameByID(item.UploadFile.PrintSide, PrintSideEnumList) }}</td>
                <td>1份</td>
                <td>{{ item.UploadFile.Operator }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="bottom">
        <div>文件备注：{{ item.UploadFile.Remark }}</div>
      </div>
    </div>

    <!-- 打印物料 -->
    <div class="material-info row">
      <div class="title">打印物料</div>
      <div class="main">
        <table>
          <thead>
            <tr>
              <th style="width: 48%;">物料信息</th>
              <th style="width: 32%;">用料尺寸</th>
              <th>用料数量</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div>{{ item.Material.Name }}</div>
              </td>
              <td>
                <div>{{ [item.Material.Width, item.Material.Height].filter(it => it).join('×') }}</div>
              </td>
              <td>
                <div>{{ typeof item.Material.Number === 'number' ? item.Material.Number + item.Unit || '' : '' }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 工序列表信息 -->
    <div class="working-table">
      <table>
        <thead>
          <tr>
            <th style="width: 4em;">工序</th>
            <th style="width: 15%;">工序名称</th>
            <th style="width: 39%;">加工信息</th>
            <th style="width: 10%;">报工类型</th>
            <th style="width: 8%;">申放</th>
            <th>加工设备</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(working, index) in WorkingList" :key="index" :class="{gray: working._IsCombine}">
            <td>{{ index + 1 }}</td>
            <td>{{ working.WorkingName }}</td>
            <td>{{ getAssistInfo(working.AssistList || []) }}</td>
            <td>{{ getEnumNameByID(working.ReportMode, ReportModeEnumList) }}</td>
            <td>
              <template v-if="working.Wastage">{{ working.Wastage }}张</template>
            </td>
            <td>{{ [working.Equipment.Name].filter(it => it).join('-') }}</td>
            <!-- <td>{{ [working.Equipment.GroupName, working.Equipment.Name].filter(it => it).join('-') }}</td> -->
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 页底 -->
    <div class="footer">
      <div class="print">
        <div class="bar-code">
          <img :src="item._StartBarCode" alt="">
          <span>{{ item.StartCode }}</span>
        </div>
        <span>打单人：{{ user?.StaffName || '' }}</span>
        <span>打印时间： {{ item.UploadFile.LastPrintTime
         ? format2LangTypeDate(getTimeConvertFormat({ withHMS: true, date: item.UploadFile.LastPrintTime }))
         : '-' }}</span>
      </div>
      <div class="code">
        <img :src="item._PlateQcCode" alt="">
        <span class="c">{{ item.Code }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { format2LangTypeDate } from '@/assets/js/filters/dateFilters';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { useUserStore } from '@/store/modules/user';
import { PrintSideEnumList } from '@/views/productionManagePages/ManualOrderHandlerPage/js/enums';
import { ReportModeEnumList } from '@/views/productionSetting/process/enums';
import { getDateYmdmsFormat } from '@/assets/js/utils/ConvertTimeFormat';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { ILocalDigitalOrderPlatePrintInfoWithQrCode } from '../../js/types';

const props = defineProps<{
  item: ILocalDigitalOrderPlatePrintInfoWithQrCode
}>();

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const ChunkInfo = computed(() => props.item.ChunkList[0]);

const OrderInfo = computed(() => ChunkInfo.value?.OrderInfo);

const _ProduceEndTime = computed(() => {
  const ProduceEndTime = OrderInfo.value?.ProduceEndTime;

  return getDateYmdmsFormat(ProduceEndTime || '');
});

const WorkingList = computed(() => {
  const list: (ILocalDigitalOrderPlatePrintInfoWithQrCode['WorkingList'][number] & { _IsCombine: boolean })[] = [];

  if (props.item.WorkingList?.length > 0) {
    list.push(...props.item.WorkingList.map(it => ({ ...it, _IsCombine: false })));
  }
  if (ChunkInfo.value && ChunkInfo.value.WorkingList?.length > 0) {
    list.push(...ChunkInfo.value.WorkingList.map(it => ({ ...it, _IsCombine: false })));
  }
  if (ChunkInfo.value && ChunkInfo.value.CombineLine?.WorkingList?.length > 0) {
    list.push(...ChunkInfo.value.CombineLine.WorkingList.map(it => ({ ...it, _IsCombine: true })));
  }

  // list.push(...list);
  // list.push(...list);
  // list.push(...list);
  // list.push(...list);
  // list.push(...list.map(it => ({ ...it, _IsCombine: true })));

  return list;
});

const getAssistInfo = (AssistList: ILocalDigitalOrderPlatePrintInfoWithQrCode['WorkingList'][0]['AssistList']) => {
  // const list = AssistList.filter(it => it.Content).map(it => `${it.Name}:${it.Content}`);
  const list = AssistList.filter(it => it.Content).map(it => `${it.Content}`);

  return list.join('；');
};
</script>

<style scoped lang='scss'>
</style>
