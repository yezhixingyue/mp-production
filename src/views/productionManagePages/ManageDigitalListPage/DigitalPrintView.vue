<template>
  <section class="digital-print-view-wrap">
    <header v-if="pageTips">
      <div class="err">{{ pageTips }}</div>
    </header>

    <main>
      <div class="print-area">
        <PrintListArea :list="printDataList" />
      </div>
    </main>
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { generateDigitalOrderPlatePrintInfoQrcode } from './js/utils';
import { ILocalDigitalOrderPlatePrintInfoWithQrCode } from './js/types';
import PrintListArea from './components/print/PrintListArea.vue';

const pageTips = ref('');

const route = useRoute();

const getIdAndToken = () => {
  const { id, token } = route.query;
  if (!id) {
    pageTips.value = '参数不完整，id未传递';
    return null;
  }

  if (typeof id !== 'string' || !/^\d+$/.test(id)) {
    pageTips.value = 'id不正确';
    return null;
  }

  if (!token) {
    pageTips.value = '参数不完整，token未传递';
    return null;
  }

  if (typeof token !== 'string') {
    pageTips.value = 'id不正确';
    return null;
  }

  return { id: Number(id), token };
};

const getPrintData = async (id: number, token: string) => {
  const response = await fetch('/Api/OfflinePlate/Print', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ List: [id], IsPrint: false }),
  });
  if (!response.ok) {
    if (response.status === 401) {
      pageTips.value = 'token无效';
      return null;
    }
    pageTips.value = `HTTP error! status: ${response.status}`;
    return null;
  }

  const result = await response.json(); // 解析返回的 JSON
  if (result.Status !== 1000) {
    pageTips.value = result.Message || '数据请求失败';
    return null;
  }

  let data = result.Data?.[0];
  if (!data || typeof data !== 'object') {
    pageTips.value = '数据为空';
    return null;
  }

  data = {
    ...data,
    _PlateQcCode: '',
    _ChunkQcCode: '',
    _StartBarCode: '',
  };

  await generateDigitalOrderPlatePrintInfoQrcode(data);

  return data as ILocalDigitalOrderPlatePrintInfoWithQrCode;
};

const printDataList = ref<ILocalDigitalOrderPlatePrintInfoWithQrCode[]>([]);

onMounted(async () => {
  const urlData = getIdAndToken();
  if (!urlData) return;

  const { id, token } = urlData;

  const data = await getPrintData(id, token);
  if (!data) return;

  printDataList.value = [data];
});
</script>

<style scoped lang='scss'>
.print-area {
  page-break-inside: auto;
  :deep(.digital-list-print-item) {
    // max-width: 210mm;
    background-color: #fff;
    margin: 0;
    page-break-inside: auto !important;
  }
}
</style>
