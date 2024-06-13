<template>
  <div class="pasteup-template-page">
    <header>
      <div class="header-top">
        <mp-button type="primary" v-if="localPermission?.Setup" @click="Data.addTemplateFromShow = true">+ 添加拼版模板</mp-button>
      </div>
    </header>
    <main>
        <el-table border fit stripe
        :data="PasteupSettingStore.ImpositionTemmplateList" style="width: 100%">
          <el-table-column
          show-overflow-tooltip prop="Name" label="名称" min-width="280" />
          <el-table-column
          show-overflow-tooltip prop="ContactWay" label="类型" min-width="308">
            <template #default="scope:any">
              <span v-if="scope.row.IsPrintingPlate">
                印刷版
              </span>
              <span v-if="scope.row.IsSameSizeWithPrintingPlate">
                和印刷版布局保持一致
              </span>
              <span v-if="scope.row.IsDigital">
                数码版
              </span>
            </template>
          </el-table-column>
          <el-table-column
          show-overflow-tooltip prop="MaterialTypeIDS" label="尺寸" min-width="272">
            <template #default="scope:any">
              <template v-if="scope.row.List.length">
                {{scope.row.List.length}}条记录
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" min-width="241">
            <template #default="scope:any">
              <mp-button type="info" v-if="localPermission?.SpecQuery" link
              @click="ToTemplateSetSize(scope.row)"
              :disabled="scope.row.IsSameSizeWithPrintingPlate">
                <i class="iconfont icon-shengchanxian" :class="{'disabled':scope.row.IsSameSizeWithPrintingPlate}"></i>模板规格</mp-button>
              <mp-button type="info" v-if="localPermission?.Setup" link @click="EditTemplate(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</mp-button>
              <mp-button type="info" v-if="localPermission?.Setup" link
                @click="delImpositionTemmplate(scope.row)">
                <i class="iconfont icon-delete"></i>删除</mp-button>
            </template>
          </el-table-column>
        </el-table>
    </main>
    <DialogContainerComp
    :title="`${Data.addTemplateFrom.ID ? '修改' : '添加'}拼版模板`"
    :visible='Data.addTemplateFromShow'
    :width="530"
    :primaryClick="addTemplatePrimaryClick"
    :closeClick="() => Data.addTemplateFromShow = false"
    :closed="addTemplateCloseedClick"
    >
      <template #default>
        <div class="add-printing-color-dialog">
          <el-form :model="Data.addTemplateFrom" label-width="82px">
            <el-form-item label="名称：" class="form-item-required">
              <el-input :maxlength="100" style="width: 360px;" v-model="Data.addTemplateFrom.Name" />
            </el-form-item>
            <el-form-item label="" >
              <el-checkbox :disabled="!!Data.addTemplateFrom.List?.length || Data.addTemplateFrom.IsDigital"
                v-model="Data.addTemplateFrom.IsPrintingPlate" label="印刷版" size="large" />
              <el-checkbox :disabled="!!Data.addTemplateFrom.List?.length || Data.addTemplateFrom.IsDigital"
                v-model="Data.addTemplateFrom.IsSameSizeWithPrintingPlate" label="和印刷版布局保持一致" size="large" />
              <el-checkbox :disabled="!!Data.addTemplateFrom.List?.length"
                v-model="Data.addTemplateFrom.IsDigital" label="数码版" size="large" />
              <p>注意：每个生产线仅允许有一个印刷版，请不要把非印刷版设置为印刷版。</p>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </DialogContainerComp>
    <footer>
      <MpPagination
      style="width: 100%;"
      center
      :nowPage="PasteupSettingStore.getImpositionTemmplateData.Page"
      :pageSize="PasteupSettingStore.getImpositionTemmplateData.PageSize"
      :total="Data.DataTotal"
      :handlePageChange="PaginationChange" />
    </footer>
  </div>
</template>

<script setup lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import {
  reactive, onMounted, onActivated, watch, computed,
} from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { usePasteupSettingStore } from '@/store/modules/pasteupSetting';
// import RadioGroupComp from '@/components/common/RadioGroupComp.vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { useUserStore } from '@/store/modules/user';
import { ImpositionTemmplate } from './types';

interface DataType {
  DataTotal: number,
  addTemplateFromShow:boolean,
  addTemplateFrom:ImpositionTemmplate,
}

const userStore = useUserStore();
const { user } = userStore;
const localPermission = computed(() => user?.PermissionList?.PermissionManageImposition?.Obj);

const router = useRouter();
const PasteupSettingStore = usePasteupSettingStore();
const Data:DataType = reactive({
  DataTotal: 0,
  addTemplateFromShow: false,
  addTemplateFrom: {
    ID: '',
    Name: '',
    // 印刷版
    IsPrintingPlate: false,
    // 和印刷版保持一致
    IsSameSizeWithPrintingPlate: false,
    // 数码版
    IsDigital: false,
    List: [],
  },
});

function getImpositionTemmplateList() {
  PasteupSettingStore.getImpositionTemmplateList((DataNumber) => {
    Data.DataTotal = DataNumber as number;
  });
}

// 添加修改拼版模板
function ToTemplateSetSize(item = null) {
  router.push({
    name: 'templateSetSize',
    params: { Template: JSON.stringify(item) },
  });
}
// 添加修改拼版模板
// function ToPasteupTemplateSteupPagePage(item = null) {
//   router.push({
//     name: 'pasteupTemplateSteup',
//     params: { Template: JSON.stringify(item) },
//   });
// }
// 编辑拼版模板
function EditTemplate(item) {
  Data.addTemplateFrom = { ...item };
  Data.addTemplateFromShow = true;
}
function PaginationChange(newVal) {
  if (PasteupSettingStore.getImpositionTemmplateData.Page === newVal) return;
  PasteupSettingStore.getImpositionTemmplateData.Page = newVal;
  getImpositionTemmplateList();
}

function delImpositionTemmplate(item) {
  messageBox.warnCancelBox('确定要删除此拼版模板吗？', `${item.Name}`, () => {
    api.getImpositionTemmplateRemove(item.ID).then(res => {
      if (res.data?.Status === 1000) {
        // 删除成功
        getImpositionTemmplateList();
      }
    });
  }, () => undefined);
}

function addTemplatePrimaryClick() {
  if (Data.addTemplateFrom.Name) {
    api.getImpositionTemmplateSave(Data.addTemplateFrom).then(res => {
      if (res.data?.Status === 1000) {
        const cb = () => {
          getImpositionTemmplateList();
          Data.addTemplateFromShow = false;
        };
        // 保存成功
        MpMessage.dialogSuccess('保存成功', cb, cb);
      }
    });
  } else {
    messageBox.failSingleError('保存失败', '请输入名称', () => null, () => null);
  }
  //
}
function addTemplateCloseedClick() {
  Data.addTemplateFrom = {
    ID: '',
    Name: '',
    // 印刷版
    IsPrintingPlate: false,
    // 和印刷版保持一致
    IsSameSizeWithPrintingPlate: false,
    IsDigital: false,
    List: [],
  };
}
// function getClassName(ClassID) {
//   const ClassItem = PasteupSettingStore.ImpositionTemmplateClassList.find(it => it.ID === ClassID);
//   return ClassItem?.Name;
// }
watch(() => Data.addTemplateFrom.IsPrintingPlate, (newVal) => {
  if (newVal) {
    Data.addTemplateFrom.IsSameSizeWithPrintingPlate = false;
  }
});
watch(() => Data.addTemplateFrom.IsSameSizeWithPrintingPlate, (newVal) => {
  if (newVal) {
    Data.addTemplateFrom.IsPrintingPlate = false;
  }
});
watch(() => Data.addTemplateFrom.IsDigital, (newVal) => {
  if (newVal) {
    Data.addTemplateFrom.IsPrintingPlate = true;
    Data.addTemplateFrom.IsSameSizeWithPrintingPlate = false;
  } else {
    Data.addTemplateFrom.IsPrintingPlate = false;
  }
});
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
});

</script>
<script lang="ts">
export default {
  name: 'pasteupTemplatePage',
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
        .icon-shengchanxian{
          color: #26bcf9;
        }
        .disabled{
          color: #cbcbcb !important;
        }
      }
  }
  >footer{
    min-height: 50px;
    background-color: #fff;
    height: 50px;
    display: flex;
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
