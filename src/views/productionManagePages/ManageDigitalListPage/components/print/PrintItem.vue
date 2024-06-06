<template>
  <div class="digital-list-print-item">
    <!-- 页头 -->
    <div class="header">
      <div class="left">
        <p class="SemiFinished b">{{ item.UploadFile.SemiFinished }}</p>
        <p class="title b" style="text-align: center;">凌顶揽众数码流转工单</p>
        <p>生 产 线：{{ item.ProductionLine.Name }}</p>
      </div>
      <div class="code">
        <img :src="item._PlateQcCode" alt="">
        <span class="c">{{ item.Code }}</span>
      </div>
    </div>

    <!-- 生产工期与下单时间 -->
    <p class="time">
      <span>生产工期：{{ _ProduceEndTime }}</span>
      <span>下单时间：{{ format2LangTypeDate(getTimeConvertFormat({ withHMS: true, date: item.ChunkList[0]?.OrderInfo.CreateTime })) }}</span>
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
      <div class="top row">
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
                <td>{{ item.UploadFile.Size }}</td>
                <td>{{ item.UploadFile.PageNumber }}</td>
                <td>{{ getEnumNameByID(item.UploadFile.PrintSide, PrintSideEnumList) }}</td>
                <td>{{ item.UploadFile.Number }}</td>
                <td>{{ item.UploadFile.Operator }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="bottom">
        <div>订单备注：{{ item.UploadFile.Remark }}</div>
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
            <th style="width: 17%;">工序名称</th>
            <th style="width: 44%;">加工信息</th>
            <th style="width: 11%;">报工类型</th>
            <th>加工设备</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(working, index) in WorkingList" :key="index" :class="{gray: working._IsCombine}">
            <td>{{ index + 1 }}</td>
            <td>{{ working.WorkingName }}</td>
            <td>{{ getAssistInfo(working.AssistList || []) }}</td>
            <td>{{ getEnumNameByID(working.ReportMode, ReportModeEnumList) }}</td>
            <td>{{ [working.Equipment.Name].filter(it => it).join('-') }}</td>
            <!-- <td>{{ [working.Equipment.GroupName, working.Equipment.Name].filter(it => it).join('-') }}</td> -->
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 页底 -->
    <div class="footer">
      <div class="print">
        <span>打单人：{{ user?.StaffName || '' }}</span>
        <span>打印时间：{{ format2LangTypeDate(getTimeConvertFormat({ withHMS: true })) }}</span>
      </div>
      <div class="code">
        <img :src="item._ChunkQcCode" alt="">
        <span class="c">{{ ChunkInfo?.Code }}</span>
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
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { ILocalDigitalOrderPlatePrintInfoWithQrCode } from '../../js/types';

const props = defineProps<{
  item: ILocalDigitalOrderPlatePrintInfoWithQrCode
}>();

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const _ProduceEndTime = computed(() => {
  const ProduceEndTime = props.item.ChunkList[0]?.OrderInfo.ProduceEndTime;

  if (ProduceEndTime) {
    const date = new Date(ProduceEndTime.replace('Z', ''));
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hour = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');

    return `${year}年${month}月${day}日 ${hour}点${minutes}分前`;
  }

  return '';
});

const ChunkInfo = computed(() => props.item.ChunkList[0]);

const OrderInfo = computed(() => ChunkInfo.value?.OrderInfo);

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
