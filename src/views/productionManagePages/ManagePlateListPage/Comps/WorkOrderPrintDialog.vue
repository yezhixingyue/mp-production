<template>
  <PrintDialog ref="oPrintDialog" onlyPrint :title="`${row?.Code}（大版）`">
    <section class="plate-work-order-print-wrap" v-if="localInfo.key && localInfo.data && row">
      <header>
        <h2>凌顶揽众大版流转工单</h2>
        <div class="code">
          <img :src="localInfo.codeUrl" v-show="localInfo.codeUrl" alt="">
          <p>{{ localInfo.data.Code }}</p>
        </div>
      </header>

      <main>
        <p class="line"> 生 产 线：{{ localInfo.data.ProductionLine.Name }}</p>

        <!-- 版头字 -->
        <div class="title"  style="margin-top: 8px;">{{ localInfo.data.Title }}</div>

        <!-- 印刷拼版表 -->
        <div class="item">
          <span class="title"><i>印刷拼版</i></span>
          <table>
            <thead>
              <tr>
                <th style="width: 30%;">拼版规格名称</th>
                <th style="width: 16%;">翻版方式</th>
                <th style="width: 21.5%;">拼版尺寸mm</th>
                <th style="width: 15%;">组合方式</th>
                <th style="width: 17.5%;">拼版人</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ localInfo.data.TemplateSize.Name }}</td>
                <td>{{ getEnumNameByID(localInfo.data.ReproductionType, ReproductionTypeEnumList) }}</td>
                <td>{{ localInfo.data.Width }}x{{ localInfo.data.Height }}</td>
                <td>{{ localInfo.data.ForbitUnionMakeup ? '专版' : '合拼' }}</td>
                <td>{{ row.Operator }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 印刷主料表 -->
        <div class="item" style="margin-top: 15px;">
          <span class="title"><i>印刷主料</i></span>
          <table>
            <thead>
              <tr>
                <th style="width: 30%;">物料信息</th>
                <th style="width: 16%;">领料尺寸mm</th>
                <th style="width: 15%;">数量</th>
                <th style="width: 12%;">开数</th>
                <th style="width: 16%;">开料尺寸mm</th>
                <th style="width: 11%;">物料来源</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ localInfo.data.Material.Name }}</td>
                <td>{{ localInfo.data.Material.Width }}x{{ localInfo.data.Material.Height }}</td>
                <td class="m-num">
                  <span>{{ localInfo.data.Material.Number }}{{ localInfo.data.Unit }}</span>
                  <span>({{ +((localInfo.data.Material.Number / 500).toFixed(2)) }}令)</span>
                </td>
                <td>{{ localInfo.data.Material.Multiple }}</td>
                <td>{{ localInfo.data.Material.OriginalWidth }}x{{ localInfo.data.Material.OriginalHeight }}</td>
                <td>{{ getEnumNameByID(localInfo.data.MaterialSource, PlaceOrderMaterialSourceEnumList) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 工序列表 与子版工序列表 -->
        <table style="margin-top: 20px;">
          <thead>
            <tr>
              <th style="width: 8%;">工序</th>
              <th style="width: 20%;">工序名称</th>
              <th style="width: 10%;">加工次数</th>
              <th style="width: 18%;">加工数量(张)</th>
              <th style="width: 10%;">工序放数</th>
              <th style="width: 34%;">加工设备</th>
            </tr>
          </thead>
          <tbody>
            <!-- 大版工序列表 -->
            <tr v-for="(work, index) in getHandleWorkList(localInfo.data.WorkingList)" :key="work.WorkingID">
              <td>{{ index + 1 }}</td>
              <td>{{ work.WorkingName }}</td>
              <td>{{ work.WorkTimes }}</td>
              <td>{{ work.Number }}</td>
              <td>{{ work.Wastage }}</td>
              <td>{{ work.Equipment.Name }}</td>
            </tr>
            <!-- 循环子版 -->
            <template v-for="(child, index) in (localInfo.data.ChildList || [])" :key="child.Code">
              <!-- 子版工序列表 -->
              <tr v-for="(cwork, cIndex) in getHandleWorkList(child.WorkingList)" :key="cwork.WorkingID">
                <td>{{ index + 1 }}-{{ cIndex + 1 }}</td>
                <td>{{ cwork.WorkingName }}</td>
                <td>{{ cwork.WorkTimes }}</td>
                <td>{{ cwork.Number }}</td>
                <td>{{ cwork.Wastage }}</td>
                <td>{{ cwork.Equipment.Name }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </main>

      <footer>
        <span>打单人：{{ user?.StaffName }}</span>
        <span>打印时间 {{ localInfo.time }}</span>
        <div class="code">
          <img :src="localInfo.codeUrl" v-show="localInfo.codeUrl" alt="">
          <p>{{ localInfo.data.Code }}</p>
        </div>
      </footer>
    </section>
  </PrintDialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import api from '@/api';
import PrintDialog from '@/components/common/General/Print/PrintDialog.vue';
import { getQRCodeSrc } from '@/components/common/General/Print/utils';
import { getTimeConvertFormat } from 'yezhixingyue-js-utils-4-mpzj';
import { format2LangTypeDate } from '@/assets/js/filters/dateFilters';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { ReproductionTypeEnumList } from '@/views/productionSetting/productionLine/js/enum';
import { useUserStore } from '@/store/modules/user';
import { storeToRefs } from 'pinia';
import { IManagePlateInfo } from '../js/type';
import { IDigitalOrderPlatePrintInfo } from '../../ManageDigitalListPage/js/types';
import { PlaceOrderMaterialSourceEnumList } from '../../ManualOrderHandlerPage/js/EnumList';

const props = defineProps<{
  row: IManagePlateInfo | null
}>();

const oPrintDialog = ref<InstanceType<typeof PrintDialog>>();

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const localInfo = ref<{key: boolean;data: null | IDigitalOrderPlatePrintInfo;time: string;codeUrl: string;}>({
  key: false,
  data: null,
  time: '',
  codeUrl: '',
});

const getHandleWorkList = (WorkingList?: IDigitalOrderPlatePrintInfo['WorkingList']) => {
  if (!WorkingList) return [];

  const list: IDigitalOrderPlatePrintInfo['WorkingList'] = [];

  WorkingList.forEach(working => {
    if (working.PlateMakingWorking) list.push(working.PlateMakingWorking);

    list.push(working);
  });

  return list;
};

const display = async () => {
  localInfo.value.key = false;

  if (!oPrintDialog.value || !props.row) return;

  const resp = await api.productionManageApis.getPlateDetail(props.row.ID);

  if (resp.data?.isSuccess) {
    localInfo.value.data = resp.data.Data;
    localInfo.value.time = format2LangTypeDate(getTimeConvertFormat({ withHMS: true }));
    localInfo.value.codeUrl = (await getQRCodeSrc(props.row.Code, 130)) || ''; // 获取二维码img src

    localInfo.value.key = true;

    oPrintDialog.value.print(`大版工单打印-${props.row.Code}`);
  }
};

defineExpose({ display });
</script>

<style scoped lang='scss'></style>
