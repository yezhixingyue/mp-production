<template>
  <div class="makeAn-inventory-page">

    <main :style="`height:${h}px`">
      <MpCardContainer>
        <el-scrollbar>
          <div class="delivery-info" v-if="Data.InventoryDetail">
            <div class="current">
              <div class="title">
                <p>当前盘点仓库：
                  <span>
                    {{Data.StorehouseName}}
                  </span>
                </p>
                <el-button type="danger" @click="ForcedEnd">强制完成</el-button>
              </div>
              <div class="current-material">
                <p>
                  <span class="label">当前货位：</span>
                  <span class="value">{{Data.InventoryDetail.CurrentUpperDimension}}
                    {{Data.InventoryDetail.CurrentPositionName}}</span>
                </p>
                <p>
                  <span class="label">SKU编码：</span>
                  <span class="value">{{Data.InventoryDetail.Code}}</span>
                </p>
                <p>
                  <span class="label">物料：</span>
                  <span class="value">
                    <template v-for="(item,index) in Data.InventoryDetail.MaterialAttributes"
                    :key="item.AttributeID">
                      <template v-if="item.NumericValue">
                        <span>{{item.NumericValue}}{{item.AttributeUnit}}</span>
                      </template>
                      <template v-else>
                        <span>{{item.InputSelectValue || item.SelectValue}}</span>
                      </template>
                      <template v-if="item.NumericValue||item.InputSelectValue || item.SelectValue">
                        {{index ===  Data.InventoryDetail.MaterialAttributes.length-1 ? '' : ' ' }}
                      </template>
                    </template>
                    {{Data.InventoryDetail.SizeDescribe}}
                  </span>
                </p>
                <p>
                  <span class="label">数量：</span>
                  <span class="value is-red">
                    {{Data.InventoryDetail.Stock}}{{Data.InventoryDetail.StockUnit}}
                  </span>
                </p>
              </div>
            </div>
            <div class="last" v-if="Data.InventoryDetail?.PrevPositionMaterial">
              <div class="title">
                <p>上一货位：
                  <span>
                    {{Data.InventoryDetail.PrevUpperDimension}}
                    {{Data.InventoryDetail.PrevPositionName}}
                  </span>
                </p>
                <el-button link type="primary" :disabled="!Data.InventoryDetail?.PrevDetailID"
                @click="anewLast">重新盘点上一个 ></el-button>
              </div>
              <ul v-if="Data.InventoryDetail?.PrevPositionMaterial.length">
                <li v-for="(PrevItem,index) in Data.InventoryDetail.PrevPositionMaterial"
                :key="index">
                <!-- 物料 -->
                  <span class="delivery">
                    <template v-for="(item) in PrevItem.MaterialAttributes"
                    :key="item.AttributeID">
                      <template v-if="item.NumericValue">
                        <span>{{item.NumericValue}}{{item.AttributeUnit}}</span>
                      </template>
                      <template v-else>
                        <span>{{item.InputSelectValue || item.SelectValue}}</span>
                      </template>
                      <template v-if="item.NumericValue||item.InputSelectValue || item.SelectValue">
                        {{index === PrevItem.MaterialAttributes.length-1 ? '' : ' ' }}
                      </template>
                    </template>
                  </span>
                  <span class="size">{{PrevItem.SizeDescribe}}</span>
                  <span class="code">{{PrevItem.Code}}</span>
                  <span class="number is-red">{{PrevItem.Stock}}{{PrevItem.StockUnit}}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="btn">
            <el-button type="primary" @click="inventoryCorrect">正确</el-button>
            <el-button @click="inventoryError">错误</el-button>
          </div>
        </el-scrollbar>
      </MpCardContainer>
    </main>

    <!-- 此货位还有物料时添加物料的弹框 -->
      <AddMaterialDialog
      :materialInfo="Data.InventoryDetail"
      :visible="Data.addMaterialShow"
      :changeVisible="(visble) => Data.addMaterialShow = visble"
      :dialogSaveMaterial="dialogSaveMaterial"
      ></AddMaterialDialog>
    <!-- 盘库错误的弹窗 -->
      <MakeAnInventoryErrorDialog
      :materialInfo="Data.InventoryDetail"
      :visible="Data.makeAnInventoryError"
      :changeVisible="(visble) => Data.makeAnInventoryError = visble"
      :dialogSaveInventoryError="dialogSaveInventoryError"
      ></MakeAnInventoryErrorDialog>

      <el-dialog
      custom-class='inventory-correct-dialog'
      :width="308"
      v-model='Data.inventoryCorrectDialog'
      @close="() => Data.inventoryCorrectDialog = false"
      @closed="() => Data.inventoryCorrectDialog = false"
      >

      <template #header>
        <p class="inventory-correct-title">
          是否跳转到下一货位
        </p>
      </template>
      <template #default>
        <div class="inventory-correct-main">
          <p>当前货位: <span>{{Data.InventoryDetail.CurrentPositionName}}</span></p>
          <p>下一货位: <span>{{Data.InventoryDetail.NextPositionName}}</span></p>
        </div>
      </template>
      <template #footer>
        <el-button type="primary" @click="toNext">确定跳转</el-button>
        <el-button  @click="Data.addMaterialShow = true ">此货位还有物料</el-button>
      </template>
      </el-dialog>

  </div>
</template>

<script lang='ts'>
import MpCardContainer from '@/components/common/MpCardContainerComp.vue';
import AddMaterialDialog from '@/components/materialInventoryManage/addMaterialDialog.vue';
import MakeAnInventoryErrorDialog from '@/components/materialInventoryManage/makeAnInventoryErrorDialog.vue';

import {
  ref, reactive, onMounted, watch, onActivated,
} from 'vue';
import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import { useCommonStore } from '@/store/modules/common';
import api from '@/api/request/MaterialStorage';
import messageBox from '@/assets/js/utils/message';

interface MaterialAttributesType {
  MaterialID: string,
  AttributeID: string,
  SelectID: string,
  NumericValue: number,
  InputSelectValue: string,
  SelectValue: string,
  AttributeUnit: string,
  IsBrand: boolean
}
interface InventoryDetailType {
  MaterialID: string,
  PositionID: string,
  Code: string,
  SizeDescribe: string,
  MaterialAttributes: MaterialAttributesType[],
  StockUnit: string,
  Stock: number,
  CurrentPositionName: string
  IsLastMaterial:boolean
  IsLastPosition:boolean
  DetailID:string
  PrevDetailID:number|null
}
interface DataType {
  StorehouseName:string
  DetailID:string
  inventoryCorrectDialog: boolean,
  makeAnInventoryError: boolean,
  addMaterialShow: boolean,
  InventoryDetail: InventoryDetailType|null,
}

export default {
  name: 'makeAnInventoryPage',
  components: {
    MpCardContainer,
    AddMaterialDialog,
    MakeAnInventoryErrorDialog,
    // DialogContainerComp,
  },
  setup() {
    const h = ref(0);
    const CommonStore = useCommonStore();
    const Data:DataType = reactive({
      StorehouseName: '',
      // 还有物料 添加物料弹窗
      addMaterialShow: false,
      // 物料错误弹窗
      makeAnInventoryError: false,
      // 正确弹窗
      inventoryCorrectDialog: false,
      DetailID: '',
      InventoryDetail: null,

    });
    function editState() { // 修改盘库状态
      localStorage.setItem('updataInventoryState', 'true');
    }
    // 盘库结束 关闭标签
    function over() {
      const cb = () => {
        window.close();
        editState();
      };
      messageBox.successSingle('盘库结束', cb, cb);
    }
    function setDetail(DetailID) {
      Data.DetailID = DetailID;
      localStorage.setItem('DetailID', DetailID);
      console.log(localStorage.getItem('DetailID'), 'localStorage');
    }

    // 获取盘库详情
    function getInventoryDetail() {
      const errorCb = () => {
        messageBox.failSingleError('错误', '请重新打开此标签', () => {
          window.close();
        }, () => {
          window.close();
        });
      };
      if (Data.DetailID) {
        api.getInventoryDetail(Data.DetailID).then(res => {
          if (res.data.Status === 1000) {
            Data.InventoryDetail = res.data.Data as InventoryDetailType;
            Data.InventoryDetail.DetailID = Data.DetailID as string;
          } else {
            errorCb();
          }
        });
      } else {
        errorCb();
      }
    }

    // 此货位还有物料时添加物料的弹框
    function addMaterialCloseClick() {
      Data.addMaterialShow = false;
    }
    function addMaterialClosed() {
      // 清空表单
    }
    // 此货位还有物料时添加物料的弹框
    function addMaterialPrimaryClick() {
      console.log('addMaterialPrimaryClick');
    }
    // 盘库强制结束
    function ForcedEnd() {
      const html = `
        <p class="danger-content">强制结束后将不能再继续盘点库存，请谨慎操作！！！</p>
      `;
      messageBox.dangerCancelBox('确定结束盘库吗?', html, () => {
        api.getInventoryForcedEnd(Data.InventoryDetail?.DetailID).then(() => {
          over();
        });
      }, () => null);
      console.log('addMaterialPrimaryClick');
    }
    // 重新盘点上一个
    function anewLast() {
      messageBox.warnCancelBox('操作确认', '确定要重新盘点上一个', () => {
        setDetail(Data.InventoryDetail?.PrevDetailID);
        getInventoryDetail();
      }, () => null);
      console.log('addMaterialPrimaryClick');
    }
    // 去下一个
    function toNext() {
      api.getInventoryRight(Data.DetailID).then(res => {
        if (res.data.Status === 1000) {
          if (res.data.Data) {
            setDetail(res.data.Data);
            getInventoryDetail();
            Data.inventoryCorrectDialog = false;
          } else {
            over();

            // 盘库完成
          }
        }
      });
    }
    // 库存正确 点击
    function inventoryCorrect() {
      console.log('selectStorehouseGoodsPosition');
      // Data.InventoryDetail.IsLastMaterial;
      // 如果是最后一个货物
      if (Data.InventoryDetail?.IsLastMaterial) {
        if (Data.InventoryDetail?.IsLastPosition) {
          toNext();
        } else {
          Data.inventoryCorrectDialog = true;
        }
      } else {
        // 下一个
        toNext();
      }
    }
    // 库存错误 点击
    function inventoryError() {
      console.log('selectStorehouseGoodsPosition');
      Data.makeAnInventoryError = true;
    }

    // 此货位还有物料时添加物料的弹框 确定
    function dialogSaveMaterial(data) {
      console.log(data);
      const temp = { ...data };

      temp.PositionID = Data.InventoryDetail?.PositionID;
      api.getInventoryOmission(temp).then(res => {
        if (res.data.Status === 1000) {
          // 补货成功
          messageBox.successSingle('添加成功', () => {
            Data.addMaterialShow = false;
          }, () => null);
        }
      });
    }
    // 物料错误的修改保存
    function dialogSaveInventoryError(data) {
      console.log(data, 'dialogSaveInventoryError');
      const temp = { ...data };
      temp.DetailID = Data.InventoryDetail?.DetailID;
      api.getInventoryError(temp).then(res => {
        if (res.data.Status === 1000) {
          // 货物修改成功
          if (res.data.Data) {
            Data.makeAnInventoryError = false;
            setDetail(res.data.Data);
            getInventoryDetail();
          } else {
            over();
          }
        }
      });
    }

    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.makeAn-inventory-page header', 100);
    }
    watch(() => CommonStore.size, () => {
      setHeight();
    });
    onActivated(() => {
      setHeight();
    });
    onMounted(() => {
      setHeight();
      Data.StorehouseName = localStorage.getItem('StorehouseName') as string;
      if (localStorage.getItem('DetailID')) {
        Data.DetailID = localStorage.getItem('DetailID') as string;
      }
      getInventoryDetail();
    });

    return {
      h,
      Data,
      toNext,
      anewLast,
      ForcedEnd,
      inventoryCorrect,
      inventoryError,
      dialogSaveMaterial,
      dialogSaveInventoryError,
      addMaterialCloseClick,
      addMaterialClosed,
      addMaterialPrimaryClick,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.mp-erp-layout-page-content-comp-wrap{
  margin: 0;
  background-color: #F5F5F5;
  padding: 50px 50px 0 50px;
  .makeAn-inventory-page{
    margin: 0;
  }
}
.makeAn-inventory-page{
  main{
    overflow-x: auto;
    .mp-card-container{
      background-color: #fff;
      border-radius: 20px;
      padding: 40px;
      box-sizing: border-box;
      .delivery-info{
        flex: 1;
        display: flex;
        flex-direction: column;
        color: #7A8B9C;
        font-weight: 600;

        >div{
          >.title{
            display: flex;
            justify-content: space-between;
            align-items: center;
            >p{
              border-left: 3px solid #428DFA;
              padding-left: 10px;
              line-height: 14px;
              font-size: 14px;
              // color: #7A8B9C;
              >span{
                color: #566176;
              }
            }
          }
        }
        .current{
          font-size: 16px;
          .current-material{
            p{
              display: flex;
              line-height: 32px;
              .label{
                width: 45%;
                text-align: right;
              }
              .value{
                color: #566176;
              }
              .is-red{
                color: #FF3769;
              }
            }
          }
        }
        .last{
          >ul{
            border: 1px solid #A6B6C6;
            border-radius: 8px;
            padding: 0 40px;
            margin-top: 24px;
            li{
              display: flex;
              justify-content: space-between;
              line-height: 50px;
              .delivery{
                width: 33%;
              }
              .size,.code,.number{
                width: 22%;
                text-align: center;
              }
              .is-red{
                color: #FF3769;
              }
              border-bottom: 1px solid #F2F6FC;
            }
            li:last-child{
              border: none;
            }
          }
        }
      }
      .btn{
        padding: 40px;
        padding-bottom: 20px;
        text-align: center;
        .el-button{
          width: 100px;
          height: 30px;
          font-size: 14px;
        }
      }
    }
  }
  .inventory-correct-dialog{
    .el-dialog__body{
      padding: 20px;
    }
    .el-dialog__footer{
      text-align: center;
      .el-button{
        width: 100px;
        font-size: 12px;
      }
    }
    .inventory-correct-title{
      line-height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-weight: 600;
      color: #566176;
      padding-top: 20px;
      &::before{
        content: '';
        width: 30px;
        height: 30px;
        background-image: url('@/assets/images/warn.png') !important;
        background-size: 30px 30px;
        display: inline-block !important;
        margin-right: 25px;
      }
    }
    .inventory-correct-main{
      p{
        text-indent: 4em;
        line-height: 28px;
        font-weight: 600;
        color: #7A8B9C;
        span{
          color: #566176;
        }
      }
    }
  }
}
</style>
