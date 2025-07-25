<template>
  <el-table :data="localList" border stripe class="table-wrap">
    <!-- <mp-table-column width="110px" prop="ServerName" label="销售端" /> -->
    <mp-table-column width="100px" prop="OrderCode" label="订单ID" />
    <mp-table-column width="180px" prop="_FullProductName" label="销售端产品" />
    <mp-table-column min-width="240px" prop="Content" label="内容" />
    <mp-table-column width="230px" prop="_Line" label="生产线" />
    <mp-table-column width="115px" prop="_Number" label="数量" />
    <mp-table-column width="130px" prop="_CreateTime" label="下单时间" />
    <mp-table-column width="140px" prop="_WishFinishTime" label="预计生产完成时间" />
    <mp-table-column width="100px" prop="_Status" label="状态">
      <template #default="scope:{ row: ItemType }">
        <span v-if="scope.row._Status" :class="scope.row._Status.className">{{ scope.row._Status.Name }}</span>
      </template>
    </mp-table-column>
    <mp-table-column width="90px" prop="Operator" label="操作人" />
    <mp-table-column width="280px" label="操作" class-name="ctrl">
      <template #default="scope:{ row: ItemType }">
        <mp-button type="primary" class="ft-12" link @click="onDetailClick(scope.row)" :disabled="!scope.row.HaveDetail">
          <span style="display: inline-block;text-align: center;width: 4em;">详情</span>
        </mp-button>
        <mp-button type="primary" class="ft-12" link @click="onDownloadClick(scope.row)" :disabled="scope.row.Status === PDOStatusEnum.create">下载文件</mp-button>
        <mp-button type="primary" class="ft-12" link @click="onEditClick(scope.row)"
         :disabled="![PDOStatusEnum.haveDownload, PDOStatusEnum.pending].includes(scope.row.Status)">
          <span style="display: inline-block;text-align: center;width: 4em;">
            <template v-if="[PDOStatusEnum.haveDownload, PDOStatusEnum.create].includes(scope.row.Status)">开始审核</template>
            <template v-if="scope.row.Status === PDOStatusEnum.pending">编辑</template>
            <template v-if="scope.row.Status === PDOStatusEnum.finish">已提交</template>
            <template v-if="scope.row.Status === PDOStatusEnum.cancelled && !scope.row.HaveDetail">开始审核</template>
            <template v-if="scope.row.Status === PDOStatusEnum.cancelled && scope.row.HaveDetail">编辑</template>
          </span>
        </mp-button>
      </template>
    </mp-table-column>
    <template #empty>
      <span class="ft-12" v-show="!loading">暂无数据</span>
    </template>
  </el-table>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { router } from '@/router';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { IPDOrderItem } from '../types/types';
import { PDOStatusEnum, PDOStatusEnumList } from '../types/enum';
import { initPDOSetupViewStore } from '../childrenPages/PDOSetupView/store/PDOSetupViewStore';
import { TProductionLineListData } from '../js/getProductionLineList';
import { initPDODetailViewStore } from '../childrenPages/PDODetailView/store';

const props = defineProps<{
  list: IPDOrderItem[]
  loading: boolean
  lineListData: TProductionLineListData | null
}>();

const localList = computed(() => props.list.map(it => ({
  ...it,
  _FullProductName: [it.FirstLevel, it.ProductName].filter(_it => _it).join('-'),
  _Line: it.LineList.filter(_it => _it).join('，'),
  _Number: `${it.Number}${it.Unit || ''}/${it.KindCount}款`,
  _CreateTime: format2MiddleLangTypeDateFunc2(it.CreateTime),
  _WishFinishTime: format2MiddleLangTypeDateFunc2(it.WishFinishTime),
  _Status: PDOStatusEnumList.find(_it => _it.ID === it.Status),
})));

type ItemType = typeof localList.value[number];

/** 查看详情 */
const onDetailClick = (item: ItemType) => {
  initPDODetailViewStore(item);
  router.push({ path: '/ProcessDecompositionOrderDetail' });
};

/** 文件下载 */
const onDownloadClick = (item: ItemType) => {
  if (!item.FileList || item.FileList.length === 0) return;

  const _download = (href: string, filename: string) => {
    if (!href) return;

    const link = document.createElement('a');

    link.target = '_blank';
    link.style.display = 'none';
    link.href = href;
    link.download = filename;

    document.body.appendChild(link);

    link.click();
  };

  item.FileList.forEach(it => _download(it.FilePath, [item.OrderCode, it.PartName, it.FileName].filter(it => it).join('-')));
};

/** 开始审核|编辑 */
const onEditClick = (item: ItemType) => {
  if (!props.lineListData) return;

  initPDOSetupViewStore(item, props.lineListData);

  router.push({ path: '/ProcessDecompositionOrderSetup' });
};
</script>

<style scoped lang='scss'>
</style>
