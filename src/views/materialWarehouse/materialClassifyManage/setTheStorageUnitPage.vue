<template>
  <div class="set-the-storage-unit-page">
    <header>
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ path: '/materialClassifyManage' }">物料类型管理</el-breadcrumb-item>
        <el-breadcrumb-item>出入库单位：{{Data.CategoryName}}-{{Data.TypeName}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="header-top">
        <el-button type="primary" @click="addStorageUnit">+ 添加单位</el-button>
        <el-button link type="primary" @click="setStoreUnit">设置库存单位</el-button>
        <span>当前库存单位：{{Data.currentStoreUnit}}</span>
      </div>
    </header>
    <main :style="`height:${h}px`">
      <MpCardContainer>
        <el-table border fit
        :data="Data.unitList" style="width: 600px">
          <el-table-column prop="date" label="单位换算" min-width="195">
            <template #default="scope">
              <span>
                {{scope.row.ProportionUp}}
                {{scope.row.Unit}} = {{scope.row.ProportionDown}}
                {{Data.currentStoreUnit}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="单位用途" min-width="195">
            <template #default="scope">
                <span>{{scope.row.UnitPurpose === 1 ? '入库' : '出库'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" min-width="167">
            <template #default="scope">
              <el-button type="primary" link @click="editStorageUnit(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</el-button>
              <el-button type="danger" link @click="delStorageUnit(scope.row)">
                <i class="iconfont icon-delete"></i>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="bottom-count-box">
          <MpPagination
          :nowPage="Data.getUnitListData.Page"
          :pageSize="Data.getUnitListData.PageSize"
          :total="Data.DataTotal"
          :handlePageChange="PaginationChange"/>
        </div>
      </MpCardContainer>
    </main>
    <footer>
      <el-button type="primary" @click="$goback">返回</el-button>
    </footer>
    <!-- 添加单位 -->
    <DialogContainerComp
    :title="`${Data.addUnitForm.UnitID ? '修改' : '添加'}单位`"
    :visible='Data.addUnitDialogShow'
    :width="660"
    :primaryClick="addUnitPrimaryClick"
    :closeClick="addUnitCloseClick"
    >
    <template #default>
      <div class="add-unit-dialog">
        <el-form :model="Data.addUnitForm" label-width="100px">
          <el-form-item label="单位：" class="form-item-required">
            <el-input :maxlength="8" v-model="Data.addUnitForm.Unit" />
          </el-form-item>
          <el-form-item label="单位用途：" class="form-item-required">
            <el-radio-group v-model="Data.addUnitForm.UnitPurpose">
              <el-radio :label="1" size="large">入库</el-radio>
              <el-radio :label="2" size="large">出库</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="单位换算：" class="form-item-required">
            <el-input-number :maxlength="4"
             v-model="Data.addUnitForm.ProportionUp" :controls="false"/>
            <span class="unit">{{Data.addUnitForm.Unit}}</span>
            <span>=</span>
            <el-input-number :maxlength="4"
             v-model="Data.addUnitForm.ProportionDown" :controls="false"/>
            <span class="unit">{{Data.currentStoreUnit}}</span>
          </el-form-item>
        </el-form>
      </div>
    </template>
    </DialogContainerComp>
    <!-- 设置库存单位 -->
    <DialogContainerComp
    title="设置库存单位"
    :visible='Data.setStoreUnitDialogShow'
    :width="660"
    :primaryClick="setStoreUnitPrimaryClick"
    :closeClick="setStoreUnitCloseClick"
    >
    <template #default>
      <div class="set-storage-unit-dialog">
        <el-form :model="Data.setStoreUnitForm" label-width="100px">
          <el-form-item label="库存单位：">
            <el-input v-model="Data.setStoreUnitForm.StockUnit" />
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
  ref, reactive, onMounted, watch, onActivated,
} from 'vue';
import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import api from '@/api/request/MaterialStorage';
import { useRoute } from 'vue-router';
import messageBox from '@/assets/js/utils/message';
import { useCommonStore } from '@/store/modules/common';

export default {
  name: 'setTheStorageUnitPage',
  components: {
    MpCardContainer,
    MpPagination,
    DialogContainerComp,
  },
  setup() {
    const h = ref(0);
    const CommonStore = useCommonStore();
    const route = useRoute();
    const Data = reactive({
      CategoryName: '',
      TypeName: '',
      addUnitTitle: '添加单位',
      addUnitDialogShow: false,
      setStoreUnitTitle: '设置库存单位',
      setStoreUnitDialogShow: false,
      // 当前库存单位
      currentStoreUnit: '',
      addUnitForm: {
        TypeID: '',
        UnitID: '',
        Unit: '',
        UnitPurpose: 1,
        ProportionUp: 1,
        ProportionDown: 1,
      },
      DataTotal: 0,
      getUnitListData: {
        TypeID: '',
        Page: 1,
        PageSize: 20,
      },
      unitList: [],
      setStoreUnitForm: {
        TypeID: '',
        StockUnit: '',
      },
    });

    function getUnitList() {
      api.getMaterialTypeUnitList(Data.getUnitListData).then(res => {
        if (res.data.Status === 1000) {
          Data.unitList = res.data.Data as never[];
          Data.DataTotal = res.data.DataNumber as number;
        }
      });
    }
    function setStorage() { // 设置会话存储
      sessionStorage.setItem('updataMaterialClassifyManagePage', 'true');
    }
    function PaginationChange(newVal) {
      if (Data.getUnitListData.Page === newVal) return;
      Data.getUnitListData.Page = newVal;
      getUnitList();
    }
    function addUnitCloseClick() {
      Data.addUnitDialogShow = false;
      Data.addUnitForm = {
        TypeID: Data.addUnitForm.TypeID,
        UnitID: '',
        Unit: '',
        UnitPurpose: 1,
        ProportionUp: 1,
        ProportionDown: 1,
      };
    }
    function setStoreUnitCloseClick() {
      Data.setStoreUnitDialogShow = false;
      Data.setStoreUnitForm.StockUnit = '';
    }
    function addStorageUnit() {
      Data.addUnitDialogShow = true;
    }

    function editStorageUnit(item) {
      Data.addUnitDialogShow = true;
      Data.addUnitForm = Object.assign(Data.addUnitForm, item);
    }
    function delStorageUnit(item) {
      messageBox.warnCancelBox('确定要删除此单位吗？', `${item.Unit}`, () => {
        api.getMaterialTypeUnitRemove(item.UnitID).then(res => {
          if (res.data.Status === 1000) {
          // 删除成功
            getUnitList();
            setStorage();
          }
        });
      }, () => undefined);
    }

    function setStoreUnit() {
      Data.setStoreUnitForm.StockUnit = Data.currentStoreUnit;
      Data.setStoreUnitDialogShow = true;
    }
    function addUnitPrimaryClick() {
      if (!Data.addUnitForm.Unit) {
        // 报错
        messageBox.failSingle('请输入单位', () => null, () => null);
      } else if (!Data.addUnitForm.ProportionUp) {
        // 报错
        messageBox.failSingle('请输入单位换算', () => null, () => null);
      } else if (!Data.addUnitForm.ProportionDown) {
        // 报错
        messageBox.failSingle('请输入单位换算', () => null, () => null);
      } else {
        api.getMaterialTypeUnitSave(Data.addUnitForm).then(res => {
          if (res.data.Status === 1000) {
            // 提示成功
            const cb = () => {
              addUnitCloseClick();
              getUnitList();
              setStorage();
            };
            // 成功
            messageBox.successSingle(`${Data.addUnitForm.UnitID ? '修改' : '添加'}成功`, cb, cb);
          }
        });
      }
    }
    function setStoreUnitPrimaryClick() {
      if (!Data.setStoreUnitForm.StockUnit) {
        // 报错
        messageBox.failSingle('请输入库存单位', () => null, () => null);
      } else {
        api.getMaterialTypeSetStockUnit(Data.setStoreUnitForm).then(res => {
          if (res.data.Status === 1000) {
            // 设置成功
            const cb = () => {
              Data.currentStoreUnit = Data.setStoreUnitForm.StockUnit;
              setStoreUnitCloseClick();
              setStorage();
            };
            // 成功
            messageBox.successSingle('设置成功', cb, cb);
          }
        });
      }
    }
    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.set-the-storage-unit-page header', 72);
    }
    watch(() => CommonStore.size, () => {
      setHeight();
    });
    onActivated(() => {
      setHeight();
    });
    onMounted(() => {
      Data.CategoryName = route.params.CategoryName as string;
      Data.TypeName = route.params.TypeName as string;
      Data.setStoreUnitForm.TypeID = route.params.TypeID as string;
      Data.getUnitListData.TypeID = route.params.TypeID as string;
      Data.addUnitForm.TypeID = route.params.TypeID as string;
      Data.currentStoreUnit = route.params.StockUnit as string;
      setHeight();
      getUnitList();
    });
    return {
      h,
      Data,
      addStorageUnit,
      editStorageUnit,
      delStorageUnit,
      setStoreUnit,
      PaginationChange,
      setStoreUnitCloseClick,
      setStoreUnitPrimaryClick,
      addUnitPrimaryClick,
      addUnitCloseClick,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.set-the-storage-unit-page{
  >header{
    >.el-breadcrumb{
      margin-bottom: 20px;
    }
    >.header-top{
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      >span{
        line-height: 32px;
        margin-left: 12px;
      }
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
    >.mp-card-container{
      display: flex;
      flex-direction: column;
      height: 100%;
      .el-table{
        flex: 1;
        max-height: calc(100% - 21px);
      }
      >.bottom-count-box{
        display: flex;
      }
    }
  }
  >footer{
    padding-top: 20px;
    text-align: center;
  }
  .add-unit-dialog{
    .el-form{
      width: 370px;
      margin: 0 auto;
      .el-form-item{
        .el-form-item__content{
          .el-input-number{
            width: 100px;
            flex: 1;
          }
          >span{
            padding: 0 10px;
            line-height: 32px;
          }
          .unit{
            min-width: 1em;
            text-align: center;
          }
        }
      }
    }
  }
  .set-storage-unit-dialog{
    .el-form{
      margin: 0 auto;
      width: 370px;
    }
  }
}
</style>
