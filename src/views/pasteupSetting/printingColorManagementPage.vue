<template>
  <div class="material-supplier-manage-page">
    <header>
      <div class="header-top">
        <el-button type="primary" @click="addPrintingColor">+ 添加印色</el-button>
      </div>
    </header>
    <main :style="`height:${h}px`">
      <el-table fit stripe
      :data="Data.PrintColorList" style="width: 100%">
        <el-table-column
        show-overflow-tooltip prop="Name" label="名称" min-width="154" />
        <el-table-column
        show-overflow-tooltip prop="Linkman" label="类型" min-width="144">
          <template #default="scope">
            <span v-if="!scope.row.IsSpecialColor">专色</span>
            <span v-else>四色</span>
          </template>
        </el-table-column>
        <el-table-column
        show-overflow-tooltip prop="ShowColor" label="显示颜色" min-width="158" />
        <el-table-column prop="name" label="操作" min-width="240">
          <template #default="scope">
            <template v-if="!scope.row.IsSpecialColor">
              <el-button type="primary" link @click="editPrintColor(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</el-button>
              <el-button type="danger" link
                @click="delPrintColor(scope.row)">
                <i class="iconfont icon-delete"></i>删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <div class="bottom-count-box">
        <MpPagination :total="Data.DataTotal"/>
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
          <el-form-item label="颜色名：" class="form-item-required">
            <el-input :maxlength="20" v-model="Data.addPrintingColorShowFrom.ShowColor" />
          </el-form-item>
        </el-form>
      </div>
    </template>
    </DialogContainerComp>
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
export default {
  name: 'printingColorManagementPage',
  components: {
    DialogContainerComp,
    MpPagination,
  },
  setup() {
    const h = ref(0);
    const CommonStore = useCommonStore();
    const { getDistrictByParentID } = getDistrictMixins();
    const MaterialWarehouseStore = useMaterialWarehouseStore();
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

    function getPrintColorList() {
      api.getPrintColorList().then(res => {
        if (res.data.Status === 1000) {
          Data.PrintColorList = res.data.Data as addPrintingColorShowFromType[];
          Data.DataTotal = res.data.DataNumber;
          //
        }
      });
    }
    function addColorCloseClick() {
      Data.addPrintingColorShow = false;
    }
    function addColorPrimaryClick() {
      if (!Data.addPrintingColorShowFrom.Name) {
        messageBox.failSingleError('保存失败', '请输入名称', () => null, () => null);
      } else if (!Data.addPrintingColorShowFrom.ShowColor) {
        messageBox.failSingleError('保存失败', '请输入颜色名', () => null, () => null);
      } else {
        api.getPrintColorSave(Data.addPrintingColorShowFrom).then(res => {
          if (res.data.Status === 1000) {
            const cb = () => {
              addColorCloseClick();
              getPrintColorList();
            };
            messageBox.successSingle(`${Data.addPrintingColorShowFrom.ID ? '修改' : '添加'}成功`, cb, cb);
          }
        });
      }
      //
    }

    function editPrintColor(item:addPrintingColorShowFromType) {
      Data.addPrintingColorShowFrom = { ...item };
      Data.addPrintingColorShow = true;
      //
    }
    function delPrintColor(item) {
      messageBox.warnCancelBox('确定要删除此印色吗？', `${item.Name}`, () => {
        api.getPrintColorRemove(item.ID).then(res => {
          if (res.data.Status === 1000) {
          // 删除成功
            getPrintColorList();
          }
        });
      }, () => undefined);
    }

    function addColorCloseedClick() {
      Data.addPrintingColorShowFrom = {
        IsSpecialColor: true,
        ShowColor: '',
        CreateTime: '',
        ID: '',
        Name: '',
      };
    }
    // 添加印色
    async function addPrintingColor() {
      Data.addPrintingColorShow = true;
    }

    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.material-supplier-manage-page > header', 72);
    }
    watch(() => CommonStore.size, () => {
      setHeight();
    });
    onActivated(() => {
      setHeight();
    });
    onMounted(() => {
      setHeight();
      getPrintColorList();
    });
    return {
      h,
      Data,
      addPrintingColor,
      addColorPrimaryClick,
      addColorCloseClick,
      addColorCloseedClick,
      editPrintColor,
      delPrintColor,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.material-supplier-manage-page{
  >header{
    padding: 20px;
    padding-bottom: 0;
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
      max-width: 700px;
      &.el-table--border:after{
        width: 0;
      }
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
