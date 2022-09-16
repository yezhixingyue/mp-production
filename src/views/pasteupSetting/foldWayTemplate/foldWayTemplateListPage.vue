<template>
  <div class="foldWay-template-page">
    <header>
      <div class="classs">
        <RadioGroupComp
          :level1Options='FoldWayTemplateClassList'
          :level2Options='[]'
          :defaultProps="{
            value:'ID',
            label:'Name',
          }"
          :value='RadioGroupCompValue'
          @change="RadioGroupCompChange"
          ></RadioGroupComp>
        <el-button type="primary" link @click="ManagementClass">管理分类</el-button>
      </div>
      <div class="header-top">
        <el-button type="primary" @click="TofoldWayTemplate">+ 添加折手模板</el-button>
      </div>
    </header>
    <main :style="`height:${h}px`">
      <el-table fit stripe
      :data="Data.FoldWayTemplateList" style="width: 100%">
        <el-table-column
        show-overflow-tooltip prop="Name" label="分类" min-width="180">
          <template #default="scope">
            {{getClassName(scope.row.ClassID)}}
          </template>
        </el-table-column>
        <el-table-column
        show-overflow-tooltip prop="Name" label="名称" min-width="200">
        </el-table-column>
        <el-table-column
        show-overflow-tooltip prop="ShowColor" label="行列数" min-width="160">
          <template #default="scope">
            {{scope.row.RowNumber}}行 {{scope.row.ColumnNumber}}列
          </template>
        </el-table-column>
        <el-table-column
        show-overflow-tooltip prop="Linkman" label="适用设备" min-width="505">
        <!-- show-overflow-tooltip prop="Linkman" label="适用设备" min-width="895"> -->
          <!-- <template #default="scope">
          </template> -->
        </el-table-column>
        <el-table-column prop="name" label="操作" min-width="277">
          <template #default="scope">
            <el-button type="primary" link @click="setApplyEquipment(scope.row)">
              <i class="iconfont icon-bianji"></i>适用设备</el-button>
            <el-button type="primary" link @click="TofoldWayTemplate(scope.row)">
              <i class="iconfont icon-bianji"></i>编辑</el-button>
            <el-button type="danger" link
              @click="delFoldWayTemplate(scope.row)">
              <i class="iconfont icon-delete"></i>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <DialogContainerComp
    title="适用设备"
    :visible='Data.ApplyEquipmentShow'
    :width="660"
    :primaryClick="ApplyEquipmentPrimaryClick"
    :closeClick="ApplyEquipmentCloseClick"
    :closed="ApplyEquipmentClosedClick"
    >
    <template #default>
      <div class="add-printing-color-dialog">
        <el-form :model="Data" label-width="112px">
          <el-form-item label="页码：" class="form-item-required">
            <!-- <el-input :maxlength="100" v-model.number="Data.setPageInp" /> -->
          </el-form-item>
        </el-form>
      </div>
    </template>
    </DialogContainerComp>
    <footer>
      <div class="bottom-count-box">
        <MpPagination :total="Data.DataTotal"/>
      </div>
    </footer>
  </div>
</template>

<script lang='ts'>
import MpCardContainer from '@/components/common/MpCardContainerComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import {
  ref, reactive, onMounted, computed, watch, onActivated,
} from 'vue';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';

import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import getDistrictMixins from '@/assets/js/mixins/getDistrictByParentID';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import TowLevelSelect from '@/components/common/SelectComps/TowLevelSelect.vue';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { useCommonStore } from '@/store/modules/common';
import { useRouter } from 'vue-router';
import { usePasteupSettingStore } from '@/store/modules/pasteupSetting';
import RadioGroupComp from '@/components/common/RadioGroupComp.vue';
import { PositionListType, FoldWayTemplateType } from './type';

interface getFoldWayTemplateDataType {
  ClassID:number|string,
  Page:number,
  PageSize:number,
}
interface DataType {
  ApplyEquipmentShow:boolean,
  getFoldWayTemplateData:getFoldWayTemplateDataType,
  FoldWayTemplateList:FoldWayTemplateType[]
  DataTotal:number
}
export default {
  name: 'foldWayTemplateListPage',
  components: {
    MpPagination,
    RadioGroupComp,
    DialogContainerComp,
  },
  setup() {
    const h = ref(0);
    const router = useRouter();
    const CommonStore = useCommonStore();
    const PasteupSettingStore = usePasteupSettingStore();
    const Data:DataType = reactive({
      ApplyEquipmentShow: false,
      FoldWayTemplateList: [],
      getFoldWayTemplateData: {
        ClassID: '',
        Page: 1,
        PageSize: 20,
      },
      DataTotal: 0,
    });

    const FoldWayTemplateClassList = computed(() => [{
      ID: '',
      Name: '所有分类',
    }, ...PasteupSettingStore.FoldWayTemplateClassList]);
    const RadioGroupCompValue = computed(() => ({
      level1Val: Data.getFoldWayTemplateData.ClassID,
      level2Val: '',
    }));

    // 获取折手模板列表
    function getFoldWayTemplateList() {
      api.getFoldWayTemplateList(Data.getFoldWayTemplateData).then(res => {
        if (res.data.Status === 1000) {
          Data.FoldWayTemplateList = res.data.Data as FoldWayTemplateType[];
          Data.DataTotal = res.data.DataNumber;
          //
        }
      });
    }
    function RadioGroupCompChange(levelData) {
      const { level1Val } = levelData;
      if (level1Val !== undefined) {
        Data.getFoldWayTemplateData.ClassID = level1Val;
        getFoldWayTemplateList();
      }
    }

    function delFoldWayTemplate(item) {
      messageBox.warnCancelBox('确定要删除此折手模板吗？', `${item.Name}`, () => {
        api.getPrintColorRemove(item.ID).then(res => {
          if (res.data.Status === 1000) {
          // 删除成功
            getFoldWayTemplateList();
          }
        });
      }, () => undefined);
    }
    function ApplyEquipmentCloseClick() {
      Data.ApplyEquipmentShow = false;
    }
    // 设置适用设备
    function setApplyEquipment() {
      Data.ApplyEquipmentShow = true;
    }
    // 添加/编辑折手模板
    function TofoldWayTemplate(item = null) {
      router.push({
        name: 'foldWayTemplateSteup',
        params: { Template: JSON.stringify(item) },
      });
    }
    // 管理分类
    function ManagementClass() {
      router.push({
        name: 'foldWayTemplateClass',
        // params: { TypeID: IDs.TypeID, CategoryID: IDs.CategoryID },
      });
    }
    function getClassName(ClassID) {
      const ClassItem = PasteupSettingStore.FoldWayTemplateClassList.find(it => it.ID === ClassID);
      return ClassItem?.Name;
    }
    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.foldWay-template-page > header', 72);
    }
    watch(() => CommonStore.size, () => {
      setHeight();
    });
    onActivated(() => {
      setHeight();
      const foldWayTemplateSteupPage = sessionStorage.getItem('foldWayTemplateSteupPage') === 'true';
      if (foldWayTemplateSteupPage) {
        getFoldWayTemplateList();
        sessionStorage.removeItem('foldWayTemplateSteupPage');
      }
    });
    onMounted(() => {
      sessionStorage.removeItem('foldWayTemplateSteupPage');
      setHeight();
      getFoldWayTemplateList();
      // 获取所有分类
      PasteupSettingStore.getFoldWayTemplateClassList();
    });
    return {
      h,
      Data,
      RadioGroupCompValue,
      PasteupSettingStore,
      FoldWayTemplateClassList,
      getClassName,
      RadioGroupCompChange,
      ManagementClass,
      TofoldWayTemplate,
      setApplyEquipment,
      delFoldWayTemplate,
      ApplyEquipmentCloseClick,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.foldWay-template-page{
  >header{
    padding: 20px;
    padding-bottom: 0;
    .classs{
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;
      .el-button{
        height: 30px;
        margin-left: 20px;
      }
    }
    >.header-top{
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
    }
    >.mp-card-container{
      >.top-main{
        display: flex;
        justify-content: space-between;
        .mp-search-input-comp{
          display: flex;
        }
      }
    }
  }
  >main{
    margin-top: 20px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    height: 100%;
    .el-table{
      flex: 1;
    }
  }
  >footer{
    min-height: 50px;
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .add-printing-color-dialog{
    .el-form{
      width: 370px;
      margin: 0 auto;
    }
  }
}
</style>
