<template>
  <div class="makeAn-inventory-page">

    <main>
      <!-- <MpCardContainer> -->
        <div class="title">
          <p>当前盘点仓库：
            <span>
              {{Data.StorehouseName}}
            </span>
          </p>
        </div>

        <div class="delivery-info" v-if="Data.InventoryDetail">
          <div class="last" v-if="Data.InventoryDetail?.PrevPositionMaterial">
            <mp-button type="danger" @click="ForcedEnd">X 强制完成</mp-button>

            <ul>
              <li class="position-name">
                <p class="dot">上一个：
                  <span>
                    {{Data.InventoryDetail.PrevUpperDimension}}
                    {{Data.InventoryDetail.PrevPositionName}}
                  </span>
                </p>
              </li>
              <el-scrollbar v-if="Data.InventoryDetail?.PrevPositionMaterial.length">
                <li v-for="(PrevItem,index) in Data.InventoryDetail.PrevPositionMaterial"
                :key="index" class="position-item">
                  <!-- 物料 -->
                  <div class="attribute">
                    <span class="delivery">
                      {{PrevItem.AttributeDescribe}}&nbsp;
                    </span>
                    <span class="size">{{PrevItem.SizeDescribe}}</span>
                  </div>
                  <div class="code">
                    <span class="code">{{PrevItem.Code}}</span> <br>
                    <span class="number is-red">{{PrevItem.Stock}}{{PrevItem.StockUnit}}</span>
                  </div>
                </li>

              </el-scrollbar>
            </ul>
            <div class="last-button-box">
              <mp-button link type="primary" :disabled="!Data.InventoryDetail?.PrevDetailID"
                @click="anewLast">重新盘点上一个 ></mp-button>
            </div>
          </div>
            <el-divider direction="vertical" />
            <div class="current">
              <div class="current-material">
                <p class="dot big">
                  <!-- <span class="label">当前货位：</span> -->
                  <span class="value">{{Data.InventoryDetail.CurrentUpperDimension}}
                    {{Data.InventoryDetail.CurrentPositionName}}</span>
                </p>
                <p v-if="!Data.InventoryDetail.Code">
                    <span class="label"></span>
                    <span class="value" style="color:#F4A307">空货位</span>
                </p>
                <template v-else>
                  <p>
                    <span class="value">
                      {{Data.InventoryDetail.AttributeDescribe}}&nbsp;
                      {{Data.InventoryDetail.SizeDescribe}}
                    </span>
                  </p>
                  <p class="code-num">
                    <span class="value code">{{Data.InventoryDetail.Code}}</span><br>
                    <span class="value num is-red" v-if="Data.InventoryDetail?.Code">
                      {{Data.InventoryDetail.Stock}}{{Data.InventoryDetail.StockUnit}}
                    </span>
                  </p>
                </template>
              </div>
            </div>
          </div>
          <div class="btn">
            <mp-button type="primary" @click="inventoryCorrect">正确</mp-button>
            <mp-button @click="inventoryError" :disabled="!Data.InventoryDetail?.Code">错误</mp-button>
          </div>
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

      <DialogContainerComp
      title="修改盘点库存"
      :visible='Data.inventoryCorrectDialog'
      :width="660"
      :closeClick="() => Data.inventoryCorrectDialog = false"
      :closed="() => Data.inventoryCorrectDialog = false"
      :appendToBody="true"
      class="inventory-correct-dialog"
      >
      <template #default>
        <div class="inventory-correct-main">
          <p>当前货位: <span>{{Data.InventoryDetail.CurrentPositionName}}</span></p>
          <p class="inventory-correct-title">
            <template v-if="Data.InventoryDetail?.IsLastMaterial && Data.InventoryDetail?.IsLastPosition">
              是否结束盘库
            </template>
            <template v-else>
              是否跳转到下一货位
            </template>
          </p>
          <p v-if="!Data.InventoryDetail.IsLastMaterial || !Data.InventoryDetail.IsLastPosition">
            下一货位: <span>{{Data.InventoryDetail.NextPositionName}}</span></p>
        </div>
      </template>
      <template #footer>
        <mp-button type="primary" @click="toNext">
          <template v-if="Data.InventoryDetail?.IsLastMaterial && Data.InventoryDetail?.IsLastPosition">
            结束盘库
          </template>
          <template v-else>
            确定跳转
          </template>
        </mp-button>
        <mp-button  @click="Data.addMaterialShow = true ">此货位还有物料</mp-button>
      </template>
      </DialogContainerComp>

  </div>
</template>

<script lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import AddMaterialDialog from '@/components/materialInventoryManage/addMaterialDialog.vue';
import MakeAnInventoryErrorDialog from '@/components/materialInventoryManage/makeAnInventoryErrorDialog.vue';

import {
  reactive, onMounted,
} from 'vue';
import api from '@/api';
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
interface PrevPositionMaterialType {
  Code:string
  MaterialAttributes:MaterialAttributesType[]
  MaterialID:string
  PositionID:string
  SizeDescribe:string
  Stock:number
  StockUnit:string
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
  PrevDetailID:string|null
  PrevPositionMaterial:PrevPositionMaterialType[]
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
    // MpCardContainer,
    AddMaterialDialog,
    MakeAnInventoryErrorDialog,
    DialogContainerComp,
  },
  setup() {
    // const h = ref(0);
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
    }

    // 获取盘库详情
    function getInventoryDetail() {
      const errorCb = (msg = '请重新打开此标签') => {
        messageBox.failSingleError('错误', msg, () => {
          window.close();
        }, () => {
          window.close();
        });
      };
      if (Data.DetailID) {
        api.getInventoryDetail(Data.DetailID).then(res => {
          if (res?.data?.Status === 1000) {
            Data.InventoryDetail = res.data.Data as InventoryDetailType;
            Data.InventoryDetail.DetailID = Data.DetailID as string;
          } else {
            errorCb(res?.data?.Message as string);
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
    }
    // 重新盘点上一个
    function anewLast() {
      messageBox.warnCancelBox('操作确认', '确定要重新盘点上一个', () => {
        api.getInventoryAgainPrev(Data.InventoryDetail?.DetailID).then(res => {
          if (res?.data?.Status === 1000) {
            setDetail(Data.InventoryDetail?.PrevDetailID);
            getInventoryDetail();
          }
        });
      }, () => null);
    }
    // 去下一个
    function toNext() {
      api.getInventoryRight(Data.DetailID).then(res => {
        if (res?.data?.Status === 1000) {
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
      // Data.InventoryDetail.IsLastMaterial;
      // 如果是最后一个货物
      if (Data.InventoryDetail?.IsLastMaterial) {
        // if (Data.InventoryDetail?.IsLastPosition) { // 最后一个货位的话直接去下一个
        //   toNext();
        // } else {
        // }
        Data.inventoryCorrectDialog = true;
      } else {
        // 下一个
        toNext();
      }
    }
    // 库存错误 点击
    function inventoryError() {
      Data.makeAnInventoryError = true;
    }

    // 此货位还有物料时添加物料的弹框 确定
    function dialogSaveMaterial(data) {
      const temp = { ...data };

      temp.PositionID = Data.InventoryDetail?.PositionID;
      api.getInventoryOmission(temp).then(res => {
        if (res?.data?.Status === 1000) {
          const cb = () => {
            Data.addMaterialShow = false;
            if (Data.InventoryDetail) {
              Data.InventoryDetail.PrevDetailID = Data.InventoryDetail.DetailID as string;
            }
          };
          // 补货成功
          messageBox.successSingle('添加成功', cb, cb);
        }
      });
    }
    // 物料错误的修改保存
    function dialogSaveInventoryError(data) {
      const temp = { ...data };
      temp.DetailID = Data.InventoryDetail?.DetailID;
      api.getInventoryError(temp).then(res => {
        if (res?.data?.Status === 1000) {
          // 货物修改成功
          if (res.data.Data) {
            // 货位最后一个物料的时候要弹框确认是否还有其他物料
            if (Data.InventoryDetail?.IsLastMaterial) {
              inventoryCorrect();
              Data.makeAnInventoryError = false;
            } else {
              Data.makeAnInventoryError = false;
              setDetail(res.data.Data);
              getInventoryDetail();
            }
          }
        }
      });
    }

    onMounted(() => {
      Data.StorehouseName = localStorage.getItem('StorehouseName') as string;
      if (localStorage.getItem('DetailID')) {
        Data.DetailID = localStorage.getItem('DetailID') as string;
      }
      getInventoryDetail();
    });

    return {
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
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.mp-erp-layout-page-content-comp-wrap{
  margin: 0;
  background-color: #F5F5F5;
  // padding: 50px;
  max-height: 100vh;
  >div{
    margin: 0;
  }
}
.makeAn-inventory-page{
  height: 100%;
  main{
    height: 100%;
    overflow-x: auto;
    background-color: #fff;
    // padding: 40px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    >.title{
      display: flex;
      justify-content: center;
      align-items: center;
      height: 70px;
      background-color: #222B3A;
      font-weight: 600;
      >p{
        line-height: 70px;
        font-size: 20px;
        color: #fff;
      }
    }
      .delivery-info{
        display: flex;
        color: #7A8B9C;
        font-weight: 600;
        flex: 1;
        padding: 30px 50px;
        padding-bottom: 50px;
        justify-content: center;
        // width: 1024px;
        margin: 0 auto;

        // background-color: #f8d9d9;
        .el-divider{
          height: 100%;
          margin: 0 30px;
        }
        .dot{
          padding-left: 1em;
          position: relative;
          &::before{
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            background-color: #444444;
            border-radius: 50%;
            position: absolute;
            top: calc(50% - 4px);
            left: 0;
          }
          &.big{
            &::before{
              width: 14px;
              height: 14px;
              top: calc(50% - 7px);
            }
          }
        }
        .current{
          font-size: 35px;
          width: 540px;
          padding-top: 20px;
          .current-material{
            p{
              display: flex;
              line-height: 56px;
              .label{
                width: 45%;
                text-align: right;
              }
              .value{
                color: #444;
              }
              .is-red{
                color: #FF3769;
              }
            }
            .code-num{
              display: block;
              .code{
                font-weight: 400;
              }
              .num{
                font-size: 45px;
              }
            }
            p+p{
              margin-top: 50px;
            }
          }
        }
        .last{
          width: 325px;
          padding-top: 20px;
          >.el-button{
            width: 120px;
            height: 35px;
            margin-bottom: 30PX;
          }
          .last-button-box{
            text-align: right;
            margin-top: 10px;
          }
          ul{
            // 最大高度为 100vh - 页面内边距（100px）-main内边距高度（80px）-下方按钮（90）-物料（160）-上一货位（20）外边距（24）
            max-height: calc(100vh - 100px - 80px - 90px - 160px - 20px - 24px);
            overflow-y: auto;
            font-size: 14px;
            color: #444444;
            font-weight: 600;
            li{
              border: 1px solid #E5E5E5;
              line-height: 25px;
              display: flex;
              padding: 13px 10px;
              justify-content: space-between;
              &.position-item{
                height: 8;
              }
              .is-red{
                color: #FF3769;
              }
              >div{
                &.attribute{
                  width: calc(100% - 110px);
                }
                &.code{
                  text-align: right;
                  font-weight: 400;
                  width: 110px;
                }
              }
              border-bottom: 1px solid #F2F6FC;
            }
            // li:last-child{
            //   border: none;
            // }
            .position-name,.position-item:nth-child(even){
              background-color: #F5F5F5;
            }
            .position-item:nth-child(even){
              border: none;
            }
          }
        }
      }
      .btn{
        text-align: center;
        margin-bottom: 48px;
        .el-button{
          width: 270px;
          height: 85px;
          font-size: 45px;
          border-radius: 10px;
        }
        .el-button+.el-button{
          margin-left: 150px;
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
      width: 240px;
      height: 60px;
      font-size: 30px;
    }
  }
  .inventory-correct-main{
    p{
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 38px;
      color: #444444;
      font-size: 30px;
    }
    .inventory-correct-title{
      font-weight: 600;
      font-size: 50px;
      margin-top: 8px;
      line-height: 86px;
    }
  }
}
</style>
