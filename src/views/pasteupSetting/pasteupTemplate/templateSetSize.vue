<template>
  <div class="template-set-size-page" >
    <header>
      <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
      <div class="header-top">
        <mp-button type="primary" @click="ToPasteupTemplateSteupPagePage">添加规格</mp-button>
      </div>
    </header>
    <main>
        <el-table border fit stripe
          :data="sizeList" style="width: 100%">
          <el-table-column
          show-overflow-tooltip prop="Name" label="名称" min-width="200" />
          <el-table-column
          show-overflow-tooltip prop="ContactWay" label="翻版方式" min-width="108">
            <template #default="scope">
              <template v-if="pasteupTemplateData.IsPrintingPlate">
                <span v-if="scope.row.ReproductionType === 0">正反版</span>
                <span v-if="scope.row.ReproductionType === 1">自翻版</span>
                <span v-if="scope.row.ReproductionType === 2">滚翻版</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
          show-overflow-tooltip prop="MaterialTypeIDS" label="尺寸" min-width="172">
            <template #default="scope">
              <template v-if="!scope.row.IsSameSizeWithPrintingPlate">
              <span v-if="scope.row.SizeType===0">
                按模板尺寸
              </span>
              <span v-if="scope.row.SizeType===1">
                按实际拼版尺寸
              </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
          show-overflow-tooltip prop="MaterialTypeIDS" label="拼版方式" min-width="172">
            <template #default="scope">
              <template v-if="!scope.row.IsSameSizeWithPrintingPlate">
              <span v-if="scope.row.ModeSizeAttribute && scope.row.ModeSizeAttribute.UseMode">
                按模位（{{scope.row.ModeSizeAttribute.ModeItemList.length}}条记录）
              </span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
          show-overflow-tooltip prop="MaterialTypeIDS" label="白边（上下左右）" min-width="172">
            <template #default="scope">
              <template v-if="scope.row.ActualSizeAttribute">
                {{scope.row.ActualSizeAttribute.BleedTop}}、
                {{scope.row.ActualSizeAttribute.BleedBottom}}、
                {{scope.row.ActualSizeAttribute.BleedLeft}}、
                {{scope.row.ActualSizeAttribute.BleedRight}}
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" min-width="241">
            <template #default="scope">
              <mp-button type="info" link @click="ToPasteupTemplateSteupPagePage(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</mp-button>
              <mp-button type="info" link @click="delImpositionTemmplateSize(scope.row)">
                <i class="iconfont icon-delete"></i>删除</mp-button>
            </template>
          </el-table-column>
        </el-table>
    </main>
    <footer>
      <mp-button class="blue" @click="$goback">返回</mp-button>
      <div class="bottom-count-box">
        <MpPagination
        :nowPage="getTemmplateSize.Page"
        :pageSize="getTemmplateSize.PageSize"
        :total="getTemmplateSize.DataTotal"
        :handlePageChange="PaginationChange" />
      </div>
    </footer>
  </div>
</template>

<script setup lang='ts'>
import {
  onActivated, onMounted, computed, getCurrentInstance, ref,
} from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { usePasteupSettingStore } from '@/store/modules/pasteupSetting';
import MpPagination from '@/components/common/MpPagination.vue';
import { ImpositionTemmplate, SizeListType } from './types';

const { $goback } = getCurrentInstance()?.appContext.config.globalProperties || { $goback: () => null };
const route = useRoute();
const router = useRouter();
const PasteupSettingStore = usePasteupSettingStore();

// 上个页面传入的模板数据
const pasteupTemplateData = ref<ImpositionTemmplate>({
  ID: '',
  Name: '',
  // 印刷版
  IsPrintingPlate: false,
  // 和印刷版保持一致
  IsSameSizeWithPrintingPlate: false,
  List: [],
});
const sizeList = ref<SizeListType[]>([]);
const getTemmplateSize = ref({
  TemplateID: '',
  Page: 1,
  PageSize: 20,
  DataTotal: 0,
});

const BreadcrumbList = computed(() => [
  { to: { path: '/pasteupTemplate' }, name: '拼版模板' },
  {
    name: `模板规格：
          ${pasteupTemplateData.value.ID ? `${pasteupTemplateData.value.Name}` : ''}`,
  },
]);

function getImpositionTemmplateSizeList() {
  api.getImpositionTemmplateSizeList(getTemmplateSize.value).then(res => {
    if (res.data.Status === 1000) {
      sizeList.value = res.data.Data as SizeListType[];
      getTemmplateSize.value.DataTotal = res.data.DataNumber;
    }
  });
}
function ToPasteupTemplateSteupPagePage(item = null) {
  router.push({
    name: 'pasteupTemplateSteup',
    params: {
      Template: JSON.stringify(pasteupTemplateData.value),
      SizeItem: JSON.stringify(item),
    },
  });
}
function PaginationChange(newVal) {
  if (getTemmplateSize.value.Page === newVal) return;
  getTemmplateSize.value.Page = newVal;
  getImpositionTemmplateSizeList();
}

function delImpositionTemmplateSize(item) {
  messageBox.warnCancelBox('确定要删除此拼版模板尺寸吗？', `${item.Name}`, () => {
    api.getImpositionTemmplateSizeRemove(item.ID).then(res => {
      if (res.data.Status === 1000) {
        // 删除成功
        PasteupSettingStore.getImpositionTemmplateList();
      }
    });
  }, () => undefined);
}

onActivated(() => {
  const pasteupTemplateSteupPage = sessionStorage.getItem('templateSetSize') === 'true';
  if (pasteupTemplateSteupPage) {
    getImpositionTemmplateSizeList();
    sessionStorage.removeItem('templateSetSize');
  }
});
onMounted(() => {
  sessionStorage.removeItem('templateSetSize');
  const temp = JSON.parse(route.params.Template as string) as ImpositionTemmplate;
  pasteupTemplateData.value = { ...temp };
  getTemmplateSize.value.TemplateID = temp.ID;
  // TemplateID
  getImpositionTemmplateSizeList();
  // PaginationChange(nowPage.value);
});

</script>
<script lang="ts">
export default {
  name: 'templateSetSizePage',
};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.template-set-size-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  font-size: 12px;
  >header{
    padding: 20px;
    background-color: #fff;
    .el-breadcrumb{
      margin-bottom: 20px;
    }
    >.header-top{
      display: flex;
      justify-content: space-between;
    }
  }
  >main{
    flex: 1;
    margin-top: 10px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border: 1px solid #E5E5E5;
    .el-table{
      flex: 1;
    }
  }
  >footer{
    background-color: #fff;
    min-height: 50px;
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .bottom-count-box{
      width: calc((100% - 100px) / 2);
      justify-content: flex-end;
      display: flex;
      align-items: center;
      min-width: 639px;
    }
    .el-button{
      width: 100px;
    }
  }
}
</style>
