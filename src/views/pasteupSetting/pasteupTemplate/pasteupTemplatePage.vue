<template>
  <div class="pasteup-template-page">
    <header>
      <div class="classs">
        <RadioGroupComp
          :level1Options='ImpositionTemmplateClassList'
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
        <el-button type="primary" @click="ToPasteupTemplateSteupPagePage">+ 添加拼版模板</el-button>
      </div>
    </header>
    <main>
        <el-table border fit stripe
        :data="Data.ImpositionTemmplateList" style="width: 100%">
          <el-table-column show-overflow-tooltip prop="SupplierName" label="分类" min-width="224">
            <template #default="scope">
              <span >
                {{getClassName(scope.row.ClassID) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
          show-overflow-tooltip prop="Name" label="名称" min-width="280" />
          <el-table-column
          show-overflow-tooltip prop="ContactWay" label="类型" min-width="308">
            <template #default="scope">
              <span v-if="scope.row.IsPrintingPlate">
                印刷版
              </span>
              <span v-if="scope.row.IsSameSizeWithPrintingPlate">
                和印刷版布局保持一致
              </span>
            </template>
          </el-table-column>
          <el-table-column
          show-overflow-tooltip prop="MaterialTypeIDS" label="尺寸" min-width="272">
            <template #default="scope">
              <span v-if="scope.row.SizeType===0">
                按模板尺寸
              </span>
              <span v-if="scope.row.SizeType===1">
                按实际拼版尺寸
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="Address" label="拼版方式" show-overflow-tooltip min-width="280" >
            <template #default="scope">
              <span v-if="scope.row.ModeSizeAttribute">
                按模位（{{scope.row.ModeSizeAttribute.PlateInfo.AreaList.length}}条记录）
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" min-width="241">
            <template #default="scope">
              <el-button type="info" link @click="ToPasteupTemplateSteupPagePage(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</el-button>
              <el-button type="info" link
                @click="delImpositionTemmplate(scope.row)">
                <i class="iconfont icon-delete"></i>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </main>
    <footer>
      <div class="bottom-count-box">
        <MpPagination
        :nowPage="Data.getImpositionTemmplateData.Page"
        :pageSize="Data.getImpositionTemmplateData.PageSize"
        :total="Data.DataTotal"
        :handlePageChange="PaginationChange" />
      </div>
    </footer>
  </div>
</template>

<script lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import {
  reactive, onMounted, onActivated, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { usePasteupSettingStore } from '@/store/modules/pasteupSetting';
import RadioGroupComp from '@/components/common/RadioGroupComp.vue';
import { ImpositionTemmplate } from './types';

interface getImpositionTemmplateDataType {
  Page: number,
  PageSize: number,
  ClassID: number|string,
}
interface DataType {
  DataTotal: number,
  getImpositionTemmplateData:getImpositionTemmplateDataType,
  ImpositionTemmplateList:ImpositionTemmplate[],
}
export default {
  name: 'pasteupTemplatePage',
  components: {
    MpPagination,
    RadioGroupComp,
  },
  setup() {
    const router = useRouter();
    const PasteupSettingStore = usePasteupSettingStore();
    const Data:DataType = reactive({
      DataTotal: 0,
      getImpositionTemmplateData: {
        ClassID: '',
        Page: 1,
        PageSize: 20,
      },
      ImpositionTemmplateList: [],
    });
    const ImpositionTemmplateClassList = computed(() => [{
      ID: '',
      Name: '所有分类',
    }, ...PasteupSettingStore.ImpositionTemmplateClassList]);
    const RadioGroupCompValue = computed(() => ({
      level1Val: Data.getImpositionTemmplateData.ClassID,
      level2Val: '',
    }));

    function getImpositionTemmplateList() {
      api.getImpositionTemmplateList(Data.getImpositionTemmplateData).then(res => {
        if (res.data.Status === 1000) {
          Data.ImpositionTemmplateList = res.data.Data as ImpositionTemmplate[];
          Data.DataTotal = res.data.DataNumber as number;
        }
      });
    }
    function RadioGroupCompChange(levelData) {
      const { level1Val } = levelData;
      if (level1Val !== undefined) {
        Data.getImpositionTemmplateData.ClassID = level1Val;
        getImpositionTemmplateList();
      }
    }
    // 管理分类
    function ManagementClass() {
      router.push({
        name: 'impositionTemmplateClass',
      });
    }
    // 添加修改拼版模板
    function ToPasteupTemplateSteupPagePage(item = null) {
      console.log(item, 'item');

      router.push({
        name: 'pasteupTemplateSteup',
        params: { Template: JSON.stringify(item) },
      });
    }
    function PaginationChange(newVal) {
      if (Data.getImpositionTemmplateData.Page === newVal) return;
      Data.getImpositionTemmplateData.Page = newVal;
      getImpositionTemmplateList();
    }

    function delImpositionTemmplate(item) {
      messageBox.warnCancelBox('确定要删除此拼版模板吗？', `${item.Name}`, () => {
        api.getImpositionTemmplateRemove(item.ID).then(res => {
          if (res.data.Status === 1000) {
          // 删除成功
            getImpositionTemmplateList();
          }
        });
      }, () => undefined);
    }
    function getClassName(ClassID) {
      const ClassItem = PasteupSettingStore.ImpositionTemmplateClassList.find(it => it.ID === ClassID);
      return ClassItem?.Name;
    }

    onActivated(() => {
      const pasteupTemplateSteupPage = sessionStorage.getItem('pasteupTemplateSteupPage') === 'true';
      if (pasteupTemplateSteupPage) {
        getImpositionTemmplateList();
        sessionStorage.removeItem('pasteupTemplateSteupPage');
      }
    });
    onMounted(() => {
      sessionStorage.removeItem('pasteupTemplateSteupPage');
      getImpositionTemmplateList();
      // 获取所有分类
      PasteupSettingStore.getImpositionTemmplateClassList();
    });
    return {
      Data,
      ImpositionTemmplateClassList,
      PasteupSettingStore,
      RadioGroupCompValue,
      getClassName,
      ManagementClass,
      RadioGroupCompChange,
      getImpositionTemmplateList,
      PaginationChange,
      delImpositionTemmplate,
      ToPasteupTemplateSteupPagePage,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.pasteup-template-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  >header{
    padding: 20px;
    background-color: #fff;
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
      display: flex;
      justify-content: space-between;
    }
  }
  >main{
    flex: 1;
    margin-top: 10px;
    overflow-x: auto;
    background-color: #fff;
      display: flex;
      flex-direction: column;
      .el-table{
        flex: 1;
      }
  }
  >footer{
    min-height: 50px;
    background-color: #fff;
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .add-material-supplier-dialog{
    .el-form{
      width: 370px;
      margin: 0 auto;
    }
    .material-type{
      padding: 0 36px;
      p{
        line-height: 32px;
      }
      .el-checkbox-group{
        display: flex;
        flex-wrap: wrap;
        .el-checkbox{
          width: 25%;
          margin: 0;
          .el-checkbox__label{
            display: inline-block;
            width: calc(100% - 14px - 10px);
            .el-only-child__content{
              max-width: 100%;
              display: inline-block;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
}
</style>
