<template>
  <div class="foldWay-template-class-list-page">
    <header>
      <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
      <div class="header-top">
        <mp-button type="primary" @click="addClass">+ 添加分类</mp-button>
      </div>
    </header>
    <main>
      <el-table fit stripe
      :data="PasteupSettingStore.FoldWayTemplateClassList" style="width: 100%">
        <el-table-column
        show-overflow-tooltip prop="Name" label="名称" min-width="280" />
        <el-table-column prop="name" label="操作" min-width="280">
          <template #default="scope">
              <mp-button type="info" link @click="editClass(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</mp-button>
              <mp-button type="info" link
                @click="delClass(scope.row)">
                <i class="iconfont icon-delete"></i>删除</mp-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <mp-button type="primary" class="is-goback-button" @click="$goback">返回</mp-button>
      <div class="bottom-count-box">
        <MpPagination :pageSize="Data.DataTotal" :total="Data.DataTotal"/>
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
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
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
  name: 'printingColorManagementPage',
  components: {
    DialogContainerComp,
    MpPagination,
    MpBreadcrumb,
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
    const BreadcrumbList = [
      { to: { path: '/foldWayTemplate' }, name: '折手模板' },
      { name: '分类管理' },
    ];
    function getClassList() {
      PasteupSettingStore.getFoldWayTemplateClassList((DataNumber) => {
        Data.DataTotal = DataNumber;
      });
      // api.getFoldWayTemplateClassList().then(res => {
      //   if (res.data.Status === 1000) {
      //     Data.ClassList = res.data.Data as addClassFromType[];
      //     //
      //   }
      // });
    }
    function addClassCloseClick() {
      Data.addClassShow = false;
    }
    function addClassPrimaryClick() {
      if (!Data.addClassFrom.Name) {
        messageBox.failSingleError('保存失败', '请输入分类名称', () => null, () => null);
      } else {
        api.getFoldWayTemplateClassSave(Data.addClassFrom).then(res => {
          if (res.data.Status === 1000) {
            const cb = () => {
              addClassCloseClick();
              getClassList();
            };
            messageBox.successSingle(`${Data.addClassFrom.ID ? '修改' : '添加'}成功`, cb, cb);
          }
        });
      }
      //
    }

    function editClass(item:FoldWayTemplateClassType) {
      Data.addClassFrom = { ...item };
      Data.addClassShow = true;
      //
    }
    function delClass(item) {
      messageBox.warnCancelBox('确定要删除此分类吗？', `${item.Name}`, () => {
        api.getFoldWayTemplateClassRemove(item.ID).then(res => {
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
      BreadcrumbList,
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
.foldWay-template-class-list-page{
  border: 1px solid #E5E5E5;
  box-sizing: border-box;

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
    border-bottom: 1px solid #E5E5E5;
    box-sizing: border-box;
    // margin-top: 10px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    .el-table{
      flex: 1;
      max-width: 560px;
      &.el-table--border:after, .el-table__inner-wrapper::before{
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
