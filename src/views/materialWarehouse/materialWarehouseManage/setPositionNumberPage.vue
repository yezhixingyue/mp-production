<template>
  <div class="set-position-number-page">
    <header>
      <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
      <div class="header-top">
        <mp-button type="primary"
        :disabled="Data.LockStatus"
        @click="Data.addPalletDimensionsShow = true">+ 添加货位维度</mp-button>
        <p class="lock">
          <span v-if="Data.LockStatus" class="isLock">
            <i class="iconfont icon-suoding"></i>
            已锁定
          </span>
          <mp-button type="primary" link v-if="!Data.LockStatus"
          @click="PalletDimensionsLockCode">
          <i class="iconfont icon-suoding"></i>
          锁定货位编号</mp-button>
          <mp-button type="danger" link v-else
          @click="PalletDimensionsUnlockCode">解锁</mp-button>
        </p>
      </div>
    </header>
    <main>
        <el-table border fit stripe
        :data="Data.PalletDimensionsList" style="width: 100%">
          <el-table-column prop="DimensionUnit" label="维度单位" min-width="399" />
          <el-table-column prop="StorehouseName" label="起止编号" min-width="399">
            <template #default="scope">
              <span>
                {{scope.row.StartCode}} 至 {{scope.row.EndCode}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="Sort" label="显示顺序" min-width="399" />
          <el-table-column prop="name" label="操作" min-width="371">
            <template #default="scope">
              <mp-button type="info"
              :disabled="Data.LockStatus" link @click="editStorehouse(scope.row)">
              <i class="iconfont icon-bianji"></i>
              编辑</mp-button>
              <mp-button type="info"
              :disabled="Data.LockStatus" link
                @click="delStorehouse(scope.row)">
                <i class="iconfont icon-delete"></i>删除</mp-button>
            </template>
          </el-table-column>
        </el-table>
        <p class="hint">
          1:只有锁定货位编号后才可以进行“设置禁用货位”、“规划货位图”、”入库“操作；2:锁定后再进行解锁，将清空所有已设置的禁用货位、规划货位；3:库存不为空时解锁失败；
        </p>
    </main>
    <footer>
      <mp-button type="primary" class="is-goback-button" @click="$goback">返回</mp-button>
    </footer>
    <DialogContainerComp
    :title="`${Data.addPalletDimensionsForm.DimensionID ? '修改': '添加'}货位维度`"
    :visible='Data.addPalletDimensionsShow'
    :width="660"
    :primaryClick="addPalletDimensionsPrimaryClick"
    :closeClick="addPalletDimensionsCloseClick"
    :closed="addPalletDimensionsCloseedClick"
    >
    <template #default>
      <div class="add-pallet-dimensions-dialog">
        <el-form :model="Data.addPalletDimensionsForm" label-width="112px">
          <el-form-item label="维度单位：">
            <el-input :maxlength="16"
            v-model="Data.addPalletDimensionsForm.DimensionUnit"  style="width:300px"/>
          </el-form-item>
          <el-form-item label="起止编号：">
            <el-input :maxlength="4" v-model="Data.addPalletDimensionsForm.StartCode"
            style="width:100px" />
            <span class="to">至</span>
            <el-input :maxlength="4" v-model="Data.addPalletDimensionsForm.EndCode"
            style="width:100px"/>
          </el-form-item>
          <el-form-item label="显示顺序：">
            <el-input :maxlength="3" v-model.number="Data.addPalletDimensionsForm.Sort"
            style="width:100px" />
            <span class="hint">数字越小显示越靠前</span>
          </el-form-item>
          <div class="explain">

            <p>起止编号为 1 到 4位的字母或数字组成，开始和结束编号组成形式必须一致。
            </p>
            <p>
                例如：001 至 179，AA 至 ZZ，等等。
            </p>
            <p>
              中间所有顺序编号和起止编号都为此货位维度的可取编号，如果起止编号相同，则仅含一个可取编号。
            </p>
          </div>
        </el-form>
      </div>
    </template>
    </DialogContainerComp>
    <DialogContainerComp
    title="查看图片"
    :visible='Data.LookImgShow'
    :showPrimary="false"
    :closeClick="() => Data.LookImgShow = false"
    >
    <template #default>
      {{Data.SeeimgUrl}}
    </template>
    </DialogContainerComp>
  </div>
</template>

<script lang='ts'>
import { reactive, onMounted, computed } from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import api from '@/api';
import { useRoute } from 'vue-router';
import messageBox from '@/assets/js/utils/message';

interface getLockStatusType {
  LockStatus: boolean,
}
interface addPalletDimensionsFormType {
  DimensionID: string,
  StorehouseID: string,
  DimensionUnit: string,
  StartCode: string,
  EndCode: string,
  Sort: number,
}
interface getPalletDimensionsListDataType {
  StorehouseID: string,
}
interface DataType {
  LookImgShow: boolean,
  SeeimgUrl: string,
  StorehouseName: string,
  LockStatus: boolean,
  addPalletDimensionsShow: boolean,
  addPalletDimensionsForm:addPalletDimensionsFormType,
  getPalletDimensionsListData:getPalletDimensionsListDataType,
  PalletDimensionsList:addPalletDimensionsFormType[]
}
export default {
  name: 'setPositionNumberPage',
  components: {
    DialogContainerComp,
    MpBreadcrumb,
  },
  setup() {
    const route = useRoute();
    const MaterialWarehouseStore = useMaterialWarehouseStore();
    const Data:DataType = reactive({
      LookImgShow: false,
      SeeimgUrl: '',
      LockStatus: false,
      StorehouseName: '',
      addPalletDimensionsShow: false,
      addPalletDimensionsForm: {
        DimensionID: '',
        StorehouseID: '',
        DimensionUnit: '',
        StartCode: '',
        EndCode: '',
        Sort: 0,
      },
      getPalletDimensionsListData: {
        StorehouseID: '',
      },
      PalletDimensionsList: [],
    });
    const BreadcrumbList = computed(() => [
      { to: { path: '/materialWarehouseManage' }, name: '仓库管理' },
      { name: `设置货位编号：${Data.StorehouseName}` },
    ]);
    function getPalletDimensionsList() {
      api.getGoodsPositionDimensionList(Data.getPalletDimensionsListData).then(res => {
        if (res.data.Status === 1000) {
          Data.PalletDimensionsList = res.data.Data as addPalletDimensionsFormType[];
        }
      });
    }
    function setStorage() { // 设置会话存储
      sessionStorage.setItem('updataMaterialWarehouseManagePage', 'true');
    }
    function seeImg(imgUrl:string) {
      Data.SeeimgUrl = imgUrl;
      Data.LookImgShow = true;
    }
    function addPalletDimensionsCloseedClick() {
      Data.addPalletDimensionsForm = {
        DimensionID: '',
        StorehouseID: Data.addPalletDimensionsForm.StorehouseID,
        DimensionUnit: '',
        StartCode: '',
        EndCode: '',
        Sort: 0,
      };
    }
    function addPalletDimensionsCloseClick() {
      Data.addPalletDimensionsShow = false;
    }
    function editStorehouse(item) {
      Data.addPalletDimensionsForm = { ...item };
      Data.addPalletDimensionsShow = true;
    }
    function delStorehouse(item) {
      messageBox.warnCancelBox('确定要删除此仓库吗？', `${item.StartCode}-${item.EndCode}${item.DimensionUnit}`, () => {
        api.getGoodsPositionDimensionRemove(item.DimensionID).then(res => {
          if (res.data.Status === 1000) {
          // 删除成功
            getPalletDimensionsList();
            setStorage();
          }
        });
      }, () => undefined);
    }
    function addPalletDimensionsPrimaryClick() {
      if (!Data.addPalletDimensionsForm.DimensionUnit) {
        messageBox.failSingleError('保存失败', '请输入维度单位', () => null, () => null);
        // 报错
      } else if (!Data.addPalletDimensionsForm.StartCode || !Data.addPalletDimensionsForm.EndCode) {
        messageBox.failSingleError('保存失败', '请输入起止编号', () => null, () => null);
      } else {
        // messageBox.failSingleError('保存失败', '请输入起止编号', () => null, () => null);
        api.getGoodsPositionDimensionSave(Data.addPalletDimensionsForm).then(res => {
          if (res.data.Status === 1000) {
          // 保存成功
            const cb = () => {
              getPalletDimensionsList();
              addPalletDimensionsCloseClick();
              setStorage();
            };
            messageBox.successSingle('保存成功', cb, cb);
          }
        });
      }
    }

    function getLockStatus() {
      api.getGoodsPositionDimensionLockStatus(
        Data.getPalletDimensionsListData.StorehouseID,
      ).then((res) => {
        if (res.data.Status) {
          const t = res.data.Data as getLockStatusType;
          Data.LockStatus = t.LockStatus as boolean;
        }
      });
    }
    function PalletDimensionsLockCode() {
      messageBox.warnCancelNullMsg('确定要锁定货位编号吗？', () => {
        api.getGoodsPositionDimensionLockCode(
          Data.getPalletDimensionsListData.StorehouseID,
        ).then((res) => {
          if (res.data.Status === 1000) {
            setStorage();
            getLockStatus();
          }
        });
      }, () => undefined);
    }
    function PalletDimensionsUnlockCode() {
      const html = `
        <p class="danger-content">解锁后，将清除所有已设置的禁用货位、清空已规划的货位图</p>
        <p class="danger-content">如果此仓库存放有任何物料，将会解锁失败；</p>
        <p class="danger-content">请谨慎操作！！！！！</p>
      `;
      messageBox.dangerCancelBox('确定要解锁吗？', html, () => {
        api.getGoodsPositionDimensionUnlockCode(
          Data.getPalletDimensionsListData.StorehouseID,
        ).then((res) => {
          if (res.data.Status === 1000) {
            setStorage();
            getLockStatus();
          }
        });
      }, () => undefined);
    }

    onMounted(() => {
      Data.StorehouseName = route.params.StorehouseName as string;
      Data.getPalletDimensionsListData.StorehouseID = route.params.StorehouseID as string;
      Data.addPalletDimensionsForm.StorehouseID = route.params.StorehouseID as string;
      getLockStatus();
      getPalletDimensionsList();
    });
    return {
      BreadcrumbList,
      Data,
      MaterialWarehouseStore,
      seeImg,
      editStorehouse,
      delStorehouse,
      PalletDimensionsLockCode,
      PalletDimensionsUnlockCode,
      addPalletDimensionsCloseClick,
      addPalletDimensionsCloseedClick,
      addPalletDimensionsPrimaryClick,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.set-position-number-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  >header{
    background-color: #fff;
    padding: 20px;
    padding-bottom: 0;
    >.el-breadcrumb{
      margin-bottom: 20px;
    }
    >.header-top{
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
    }
    .lock{
        display: flex;
        align-items: center;
      .isLock{
        display: flex;
        align-items: center;
        color: #f56c6c;
        font-size: 14px;
        margin-right: 20px;
      }
    }
  }
  >main{
    flex: 1;
    margin-top: 10px;
    background-color: #fff;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
      .hint{
        font-size: 12px;
        line-height: 30px;
        color: #F4A307;
        position: relative;
        padding-left: 33px;
        &::before{
          content: '';
          background-image: url('@/assets/images/warn.png');
          display: inline-block;
          background-size: 13px 13px;
          width: 13px;
          height: 13px;
          margin: 0 10px;
          position: absolute;
          left: 0;
          top: 9px;
        }
      }
    .el-table{
      // height: 100%;
      flex: 1;
      .el-table__inner-wrapper{
        height: 100%;
      }
    }
  }
  >footer{
    background-color: #fff;
    min-height: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .add-pallet-dimensions-dialog{
    padding: 0 65px 0 110px;
    .el-dialog__body{
      padding-left: 130px;
      padding-right: 85px;
    }
    .el-form{
      .el-input{
        width: 200px;
      }
      .to{
        margin: 0 10px;
      }
      // .span{
      //   margin-left: 10px;
      //   color: #F4A307;
      // }
      .hint, .explain{
        font-size: 12px;
        line-height: 30px;
        color: #F4A307;
        position: relative;
        padding-left: 33px;
        &::before{
          content: '';
          background-image: url('@/assets/images/warn.png');
          display: inline-block;
          background-size: 13px 13px;
          width: 13px;
          height: 13px;
          margin: 0 10px;
          position: absolute;
          left: 0;
          top: 9px;
        }
      }
      // .explain{
      //   color: #F4A307;
      //   &::before{
      //     content: '说明：';
      //     position: absolute;
      //   }
      //   p{
      //     padding: 0 30px;
      //     padding-left: 3em;
      //   }
      // }
    }
  }
}
</style>
