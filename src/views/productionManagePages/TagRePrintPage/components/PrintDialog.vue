<template>
  <PrintDialog ref="oPrintDialog" onlyPrint>
    <ul class="tag-reprint-print-wrap-list" v-if="result.data">
      <li class="mp-prod-condition-prop-select-dialogwrap" v-for="it in Number(result.count)" :key="it">
        <section>
          <header>
            <span>{{ result.data.OrderInfo.ProduceEndTime.slice(0, 16).replace('T', ' ') }}</span>
            <span>
              <i style="color: #888;">{{ result.code.match(/^\d+-/)?.[0] || '' }}</i>
              <i>{{ result.code.match(/\d+-\d+(?=-\d+$)/)?.[0] || '' }}</i>
              <i style="color: #888;">{{ result.code.match(/-\d+$/)?.[0] || '' }}</i>
            </span>
          </header>

          <main>
            <div class="left">
              <h2>{{ result.data.OrderInfo.StationSN }}</h2>
              <p style="font-size: 1.4em;padding-bottom: 0.2em;">{{ [result.data.OrderInfo.StationName,result.data.OrderInfo.DistrictSN].join('-') }}</p>
              <p>{{ result.data.OrderInfo.CustomerSN }}</p>
              <p>{{ result.data.OrderInfo.CustomerName }}</p>
              <p class="r2 s">
                {{ result.data.WorkingList?.map(it => `[${it.WorkingName}]`).join('') || '' }}
              </p>
              <p class="r2" style="margin-top: 0.5em;">{{ [
                result.data.OrderInfo.ProductName,
                `${result.data.OrderInfo.KindCount}款`,result.data.OrderInfo.Size ? `尺寸:${result.data.OrderInfo.Size}` : '',
                `数量:${result.data.OrderInfo.Number}`,
                ].filter(it => it).join('-') }}</p>
              <p class="r2 s">{{ result.data.OrderInfo.Content }}</p>
            </div>

            <div class="right">
              <img :src="result.QRCodeSrc" alt="">
              <p>{{ result.data.OrderInfo.Number }}</p>
              <h3>{{ result.data.KindIndex }}/{{ result.data.OrderInfo.KindCount }}</h3>
            </div>
          </main>
        </section>
      </li>
    </ul>
  </PrintDialog>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import PrintDialog from '@/components/common/General/Print/PrintDialog.vue';
import { ManageTagRePrintClass } from '../js/ManageTagRePrintClass';

const props = defineProps<{
  result: ManageTagRePrintClass['result']
}>();

const oPrintDialog = ref<InstanceType<typeof PrintDialog>>();

const print = async () => {
  if (!oPrintDialog.value || !props.result.code) return;

  oPrintDialog.value.print(`补打标签:${props.result.code}`);
};

defineExpose({ print });
</script>

<style scoped lang='scss'></style>
