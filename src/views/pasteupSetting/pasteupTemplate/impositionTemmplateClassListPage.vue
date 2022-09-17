<template>
  <div class="imposition-temmplate-class-page">
    <header>
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ path: '/foldWayTemplate' }">拼版模板</el-breadcrumb-item>
        <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="header-top">
        <el-button type="primary" @click="addClass">+ 添加分类</el-button>
      </div>
    </header>
    <main>
      <el-table fit stripe
      :data="PasteupSettingStore.ImpositionTemmplateClassList" style="width: 100%">
        <el-table-column
        show-overflow-tooltip prop="Name" label="名称" min-width="280" />
        <el-table-column prop="name" label="操作" min-width="280">
          <template #default="scope">
            <el-button type="primary" link @click="editClass(scope.row)">
              <i class="iconfont icon-bianji"></i>编辑</el-button>
            <el-button type="danger" link
              @click="delClass(scope.row)">
              <i class="iconfont icon-delete"></i>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <el-button type="primary" class="is-goback-button" @click="$goback">返回</el-button>
      <div class="bottom-count-box">
        <MpPagination :total="Data.DataTotal"/>
      </div>
    </footer>
    <DialogContainerComp
    :title="`${Data.addClassFrom.ID ? '修改' : '添加'}分类`"
    :visible='Data.addClassShow'
    :width="660"
    :primaryClick="addClassPrimaryClick"
    :closeClick="addClassCloseClick"
    :closed="addClassClosedClick"
    >
    <template #default>
      <div class="add-printing-color-dialog">
        <el-form :model="Data.addClassFrom" label-width="112px">
          <el-form-item label="分类名称：" class="form-item-required">
            <el-input :maxlength="100" v-model="Data.addClassFrom.Name" />
          </el-form-item>
        </el-form>
      </div>
    </template>
    </DialogContainerComp>
  </div>
</template>

<script lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import {
  reactive, onMounted,
} from 'vue';

import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { usePasteupSettingStore } from '@/store/modules/pasteupSetting';
import { FoldWayTemplateClassType } from '@/store/modules/pasteupSetting/types';

interface DataType {
  addClassShow:boolean,
  addClassFrom:FoldWayTemplateClassType
  DataTotal:number
}
export default {
  name: 'impositionTemmplateClassListPage',
  components: {
    DialogContainerComp,
    MpPagination,
  },
  setup() {
    const PasteupSettingStore = usePasteupSettingStore();
    const Data:DataType = reactive({
      addClassShow: false,
      addClassFrom: {
        Type: 0,
        CreateTime: '',
        ID: 0,
        Name: '',
      },
      DataTotal: 0,
    });

    function getClassList() {
      PasteupSettingStore.getImpositionTemmplateClassList((DataNumber) => {
        Data.DataTotal = DataNumber;
      });
    }
    function addClassCloseClick() {
      Data.addClassShow = false;
    }
    function addClassPrimaryClick() {
      if (!Data.addClassFrom.Name) {
        messageBox.failSingleError('保存失败', '请输入分类名称', () => null, () => null);
      } else {
        api.getImpositionTemmplateClassSave(Data.addClassFrom).then(res => {
          if (res.data.Status === 1000) {
            const cb = () => {
              addClassCloseClick();
              getClassList();
            };
            messageBox.successSingle(`${Data.addClassFrom.ID ? '修改' : '添加'}成功`, cb, cb);
          }
        });
      }
    }

    function editClass(item:FoldWayTemplateClassType) {
      Data.addClassFrom = { ...item };
      Data.addClassShow = true;
      //
    }
    function delClass(item) {
      messageBox.warnCancelBox('确定要删除此分类吗？', `${item.Name}`, () => {
        api.getImpositionTemmplateClassRemove(item.ID).then(res => {
          if (res.data.Status === 1000) {
          // 删除成功
            getClassList();
          }
        });
      }, () => undefined);
    }

    function addClassClosedClick() {
      Data.addClassFrom = {
        Type: 0,
        CreateTime: '',
        ID: 0,
        Name: '',
      };
    }
    // 添加印色
    async function addClass() {
      Data.addClassShow = true;
    }

    onMounted(() => {
      getClassList();
    });
    return {
      Data,
      PasteupSettingStore,
      addClass,
      addClassPrimaryClick,
      addClassCloseClick,
      addClassClosedClick,
      editClass,
      delClass,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.imposition-temmplate-class-page{
  display: flex;
  flex-direction: column;
  height: 100%;
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
    margin-top: 20px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    .el-table{
      flex: 1;
      max-width: 560px;
      &.el-table--border:after{
        width: 0;
      }
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
    }
  }
  .add-printing-color-dialog{
    .el-form{
      width: 370px;
      margin: 0 auto;
    }
  }
}
</style>
