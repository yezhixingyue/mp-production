<template>
  <productionLinePage type="combine" />
</template>

<script lang="ts" setup>
import productionLinePage from './productionLinePageView.vue';
</script>
<script lang="ts">
export default {
  name: 'combinationProductionLinePage',
};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.combination-production-line-page{
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
  }
  >main{
    flex: 1;
    margin-top: 10px;
    overflow-x: auto;
    background-color: #fff;
    display: flex;
    >.left{
      flex: 1;
      display: flex;
      flex-direction: column;
      >ul{
        flex: 1;
        border: 1px solid #D0D0D0;
        >li{
          >.process-item{
            display: flex;
            font-size: 14px;
            align-items: center;
            // height: 37px;
            line-height: 15px;
            // padding: 0 20px;
            .equipment{
              flex: 1;
            }
            .process{
              width: 155px;
            }
            .operate{
              width: 300px;
            }
            // border: 1px solid red;
            border-bottom: 1px solid #D0D0D0;
          }
        }
        .table-title{
          .process-item{
            height: 37px;
            align-items: center;
            text-align: center;
            border-top:none;
            font-weight: 700;
            >span+span{
              border-left: 1px solid #D0D0D0;
              height: 15px;
              text-align: center;
            }
          }
        }
        .table-main:nth-child(2n-1){
          background-color: #F5F5F5;
        }
        .table-main:hover{
          background-color: #F0F9FE;
        }
        .table-main{
          .process-item{
            height: 45px;
            align-items: center;
            border-top:none;
            .process{
              font-weight: 700;
              padding-left: 20px;
            }
            .equipment{
              padding-left: 4em;
            }
            .operate{
              display: flex;
              padding: 0 2em;
              box-sizing: border-box;
              justify-content: space-between;
            }
          }
          .material-source{
            padding-left: 30px;
            font-size: 14px;
            display: flex;
            height: 45px;
            display: flex;
            align-items: center;
            p+p{
              margin-left: 30px;
            }
            span{
              font-size: 12px;
              line-height: 14px;
            }
          }
        }
      }
      >.matters-need-attention{
        margin: 12px 0 12px 32px;
        display: flex;
        span{
          min-width: 5em;
        }
        li::before{
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #444;
          position: absolute;
          top: 7px;
          left: 1em;
        }
        li{
          position: relative;
          padding-left: 2em;
          line-height: 1.5em;
          font-size: 12px;
          color: #444;
        }
      }
    }
    >.right{
      box-sizing: border-box;
      width: 317px;
      padding: 45px 20px;
      .status{
        margin-top: 2em;
        font-size: 14px;
        color: #444;
        display: flex;
        align-items: center;
        font-weight: 700;
        >span{
          margin-left: 10px;
        }
        .el-button{
          font-size: 14px;
          margin-left: 10px;
        }
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
  .add-line-dialog{
    .text{
      font-size: 14px;
      margin-left: 112px;
      margin-bottom: 18px;
    }
    .notice{
      font-size: 14px;
      text-align: center;
      span{
        font-weight: 700;
      }
    }
    .el-form-item{
      .name{
        flex: 1;
        display: flex;
        padding-right: 40px;
        .el-input{
          margin-right: 32px;
          flex: 1;
        }
      }
    }
  }
}
</style>
