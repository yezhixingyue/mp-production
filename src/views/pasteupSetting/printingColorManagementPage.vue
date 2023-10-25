<template>
  <div class="printing-color-management-page">
    <header>
      <div class="header-top">
        <mp-button type="primary" v-if="localPermission?.Setup" @click="addPrintingColor">+ 添加印色</mp-button>
      </div>
    </header>
    <main>
      <el-table fit stripe
      :data="Data.PrintColorList" style="width: 100%">
        <el-table-column
        show-overflow-tooltip prop="Name" label="名称" min-width="154" />
        <el-table-column
        show-overflow-tooltip prop="Linkman" label="类型" min-width="144">
          <template #default="scope:any">
            <span v-if="scope.row.IsSpecialColor">专色</span>
            <span v-else>四色</span>
          </template>
        </el-table-column>
        <el-table-column
        show-overflow-tooltip prop="ShowColor" label="显示颜色" min-width="158" />
        <el-table-column prop="name" label="操作" min-width="240" v-if="localPermission?.Setup">
          <template #default="scope:any">
            <template v-if="scope.row.IsSpecialColor && scope.row.ID !== '00000000-0000-0000-0000-000000000000'">
              <mp-button type="info" link @click="editPrintColor(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</mp-button>
              <mp-button type="info" link
                @click="delPrintColor(scope.row)">
                <i class="iconfont icon-delete"></i>删除</mp-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <div class="bottom-count-box">
        <MpPagination
        :pageSize="Data.DataTotal"
        :total="Data.DataTotal"
        />
      </div>
    </footer>
    <DialogContainerComp
    :title="`${Data.addPrintingColorShowFrom.ID ? '修改' : '添加'}印色`"
    :visible='Data.addPrintingColorShow'
    :width="660"
    :primaryClick="addColorPrimaryClick"
    :closeClick="addColorCloseClick"
    :closed="addColorCloseedClick"
    >
    <template #default>
      <div class="add-printing-color-dialog">
        <el-form :model="Data.addPrintingColorShowFrom" label-width="112px">
          <el-form-item label="名称：" class="form-item-required">
            <el-input :maxlength="100" v-model="Data.addPrintingColorShowFrom.Name" />
          </el-form-item>
          <el-form-item label="显示颜色：" class="form-item-required">
            <el-input :maxlength="20" v-model="Data.addPrintingColorShowFrom.ShowColor" />
          </el-form-item>
        </el-form>
      </div>
    </template>
    </DialogContainerComp>
  </div>
</template>

<script setup lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import { reactive, onMounted, computed } from 'vue';

import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { useUserStore } from '@/store/modules/user';

interface addPrintingColorShowFromType {
IsSpecialColor:boolean,
ShowColor:string,
CreateTime:string,
ID:string,
Name:string,
}

interface DataType {
  addPrintingColorShow:boolean,
  addPrintingColorShowFrom:addPrintingColorShowFromType
  PrintColorList:addPrintingColorShowFromType[]
  DataTotal:number
}
const Data:DataType = reactive({
  addPrintingColorShow: false,
  addPrintingColorShowFrom: {
    IsSpecialColor: true,
    ShowColor: '',
    CreateTime: '',
    ID: '',
    Name: '',
  },
  PrintColorList: [],
  DataTotal: 0,
});

const getPrintColorList = () => {
  api.getPrintColorList().then(res => {
    if (res.data.Status === 1000) {
      Data.PrintColorList = res.data.Data as addPrintingColorShowFromType[];
      Data.DataTotal = res.data.DataNumber;
      //
    }
  });
};

const userStore = useUserStore();
const { user } = userStore;
const localPermission = computed(() => user?.PermissionList?.PermissionManageColor?.Obj);

const addColorCloseClick = () => {
  Data.addPrintingColorShow = false;
};
const addColorPrimaryClick = () => {
  if (!Data.addPrintingColorShowFrom.Name) {
    messageBox.failSingleError('保存失败', '请输入名称', () => null, () => null);
  } else if (!Data.addPrintingColorShowFrom.ShowColor) {
    messageBox.failSingleError('保存失败', '请输入显示颜色', () => null, () => null);
  } else {
    api.getPrintColorSave(Data.addPrintingColorShowFrom).then(res => {
      if (res.data.Status === 1000) {
        const cb = () => {
          addColorCloseClick();
          getPrintColorList();
        };
        MpMessage.dialogSuccess(`${Data.addPrintingColorShowFrom.ID ? '修改' : '添加'}成功`, cb, cb);
      }
    });
  }
  //
};

const editPrintColor = (item:addPrintingColorShowFromType) => {
  Data.addPrintingColorShowFrom = { ...item };
  Data.addPrintingColorShow = true;
  //
};
const delPrintColor = (item) => {
  messageBox.warnCancelBox('确定要删除此印色吗？', `${item.Name}`, () => {
    api.getPrintColorRemove(item.ID).then(res => {
      if (res.data.Status === 1000) {
        // 删除成功
        getPrintColorList();
      }
    });
  }, () => undefined);
};

const addColorCloseedClick = () => {
  Data.addPrintingColorShowFrom = {
    IsSpecialColor: true,
    ShowColor: '',
    CreateTime: '',
    ID: '',
    Name: '',
  };
};
// 添加印色
const addPrintingColor = () => {
  Data.addPrintingColorShow = true;
};

onMounted(() => {
  getPrintColorList();
});

</script>
<script lang="ts">
export default {
  name: 'printingColorManagementPage',
};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.printing-color-management-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  >header{
    padding: 20px;
    background-color: #fff;
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
      max-width: 700px;
      &.el-table--border:after, .el-table__inner-wrapper::before{
        width: 0;
      }
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
  .add-printing-color-dialog{
    .el-form{
      width: 370px;
      margin: 0 auto;
    }
  }
}
</style>
