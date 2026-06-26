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

          <el-table-column show-overflow-tooltip label="拼版块裁切角线" width="160">
            <template #default="scope:any">
              <template v-if="scope.row.IsPrintingPlate && typeof scope.row.ShowAngularLine === 'boolean'">
                {{scope.row.ShowAngularLine ? '生成' : '不生成'}}
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
    :width="595"
    :primaryClick="addTemplatePrimaryClick"
    :closeClick="() => Data.addTemplateFromShow = false"
    :closed="addTemplateCloseedClick"
    :open="() => formRef?.clearValidate()"
    >
      <template #default>
        <div class="add-printing-color-dialog" style="min-height: 190px;">
          <el-form :model="Data.addTemplateFrom" label-width="145px" ref="formRef">
            <el-form-item label="名称：" class="form-item-required" prop="Name" :rules="[
              { required: true, message: '请输入拼版模板名称' },
            ]">
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

            <el-form-item label="拼版块裁切角线：" v-if="Data.addTemplateFrom.IsPrintingPlate" class="form-item-required" style="margin-top: -6px;"
             prop="ShowAngularLine" :rules="[
              { required: true, message: '请选择是否生成拼版块裁切角线' },
            ]">
              <el-radio-group style="margin-top: -4px;" v-model="Data.addTemplateFrom.ShowAngularLine">
                <el-radio size="large" :label="true" style="width: 62px;">生成</el-radio>
                <el-radio size="large" :label="false">不生成</el-radio>
              </el-radio-group>
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
  ref,
} from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';
import type { FormInstance } from 'element-plus';
import messageBox from '@/assets/js/utils/message';
import { usePasteupSettingStore } from '@/store/modules/pasteupSetting';
// import RadioGroupComp from '@/components/common/RadioGroupComp.vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { useUserStore } from '@/store/modules/user';
import { ImpositionTemmplate } from './types';

const formRef = ref<FormInstance>();

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
    /** 是否生成拼版块裁切角线 */
    ShowAngularLine: true,
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
  if (!formRef.value) return;

  formRef.value.validate((valid) => {
    if (valid) {
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
    }
  });
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
    ShowAngularLine: true,
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
