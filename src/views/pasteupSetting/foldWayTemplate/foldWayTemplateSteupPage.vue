<template>
  <div class="foldWay-template-steup-page" >
    <header>
      <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
    </header>
    <main>
    <el-scrollbar class="main-scrollbar">
      <div class="left">
        <p class="title">{{Data.foldWayTemplateFrom.ID?'编辑' :'添加'}}折手模板</p>
        <el-form :model="Data.foldWayTemplateFrom" label-width="64px" hide-required-asterisk>
          <el-form-item :label="`分类：`" class="form-item-required">
            <OneLevelSelect
              :options='PasteupSettingStore.FoldWayTemplateClassList'
              :defaultProps="{
                value:'ID',
                label:'Name',
              }"
              :value='Data.foldWayTemplateFrom.ClassID'
              @change="(ID) => Data.foldWayTemplateFrom.ClassID = ID"
              @requestFunc='() => null'
              :width="200"
              ></OneLevelSelect>
          </el-form-item>
          <el-form-item :label="`名称：`" class="form-item-required input-name">
            <el-input v-model="Data.foldWayTemplateFrom.Name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item :label="`行数：`" class="form-item-required input-num">
            <el-input v-model.number="Data.foldWayTemplateFrom.RowNumber" placeholder="请输入行数"></el-input> 行
          </el-form-item>
          <el-form-item :label="`列数：`" class="form-item-required input-num">
            <el-input v-model.number="Data.foldWayTemplateFrom.ColumnNumber" placeholder="请输入列数"></el-input> 列
          </el-form-item>
          <div><mp-button type="primary" link @click="createMap">生成模板图</mp-button></div>
        </el-form>
      </div>
      <div class="right">
        <p><mp-button type="primary" link @click="rotatePage">翻转印面</mp-button></p>
        <div>
          <el-scrollbar>
          <ul class="rows">
            <li v-for="(PositionRow, RowIndex) in Data.FoldWayPositionList" :key="RowIndex">
              <ul class="cols" >
                <li :class="{ 'rotate':PositionCol.FrontRotate}"
                v-for="(PositionCol, ColIndex) in PositionRow" :key="`${RowIndex}-${ColIndex}`">
                  <!-- {{PositionCol.RowValue}}- {{PositionCol.ColumnValue}} -->
                  <span class="page" :class="{
                    'is-even': isEven(PositionCol.FrontPage),
                  }">
                    <!-- 如果翻转印面了 -->
                    {{PositionCol.FrontPage}}
                  </span>
                  <!-- <span v-else class="page" :class="{'is-even': isEven(PositionCol.FrontPage)}">{{PositionCol.FrontPage}}</span> -->

                  <div class="btns">
                    <p><mp-button type="primary" link @click="rotate(RowIndex,ColIndex)">旋转</mp-button></p>
                    <p><mp-button type="primary" link @click="setPage(RowIndex,ColIndex,PositionCol.FrontPage)">设置页码</mp-button></p>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
          </el-scrollbar>
        </div>
      </div>
    </el-scrollbar>
    </main>
    <DialogContainerComp
    title="设置页码"
    :visible='Data.setPageShow'
    :width="660"
    :primaryClick="setPagePrimaryClick"
    :closeClick="setPageCloseClick"
    :closed="setPageClosedClick"
    primaryText="确定"
    >
    <template #default>
      <div class="set-page-dialog">
        <el-form :model="Data" label-width="112px">
          <el-form-item label="页码：" class="form-item-required">
            <!-- <el-input-number :controls="false" :step="1" step-strictly v-model.number="Data.setPageInp" /> -->
            <el-input v-model.number="Data.setPageInp" />
          </el-form-item>
        </el-form>
      </div>
    </template>
    </DialogContainerComp>
    <footer>
      <mp-button type="primary" class="gradient" @click="foldWayTemplateSave">保存</mp-button>
      <mp-button class="blue" @click="$goback">返回</mp-button>
    </footer>
  </div>
</template>

<script setup lang='ts'>
import {
  reactive, onMounted, computed, getCurrentInstance,
} from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { useRoute } from 'vue-router';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { useRouterStore } from '@/store/modules/routerStore';
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';
import { usePasteupSettingStore } from '@/store/modules/pasteupSetting';
import { PositionListType, FoldWayTemplateType } from './type';

interface setPageObjType{
  RowIndex:number|string
  ColIndex:number|string
}
interface DataType {
  foldWayTemplateFrom:FoldWayTemplateType
  FoldWayPositionList:PositionListType[][]
  setPageObj:setPageObjType
  setPageShow:boolean
  setPageInp:number | ''
}
const { $goback } = getCurrentInstance()?.appContext.config.globalProperties || { $goback: () => null };
const route = useRoute();
const RouterStore = useRouterStore();
const PasteupSettingStore = usePasteupSettingStore();
const Data:DataType = reactive({
  setPageShow: false,
  setPageInp: '',
  foldWayTemplateFrom: {
    ClassID: '',
    RowNumber: '',
    ColumnNumber: '',
    PositionList: [
      // {
      //   RowValue: 0,
      //   ColumnValue: 0,
      //   FrontPage: 0,
      //   ShowType: 0,
      // },
    ],
    CreateTime: '',
    ID: '',
    Name: '',
  },
  // 折手模板图的行列数组
  FoldWayPositionList: [],
  setPageObj: {
    RowIndex: '',
    ColIndex: '',
  },
});
const BreadcrumbList = computed(() => [
  { to: { path: '/foldWayTemplate' }, name: '折手模板' },
  {
    name: `${Data.foldWayTemplateFrom.ID ? '编辑' : '添加'}折手模板：
          ${Data.foldWayTemplateFrom.ID ? `${Data.foldWayTemplateFrom.Name}` : ''}`,
  },
]);
// 是否是双数
function isEven(num) {
  return num % 2 === 0;
}
//
function setBackPage() {
  Data.FoldWayPositionList.map((item, index) => {
    const reverseItem:PositionListType[] = [];
    item.forEach((element) => {
      reverseItem.unshift(element);
    });
    return item.map((res, i) => {
      const temp = res;
      const { FrontPage } = reverseItem[i];
      temp.BackPage = isEven(FrontPage) ? FrontPage - 1 : FrontPage + 1;
      return temp;
    });
  });
}
function createMap() {
  const r = /^\+?[1-9][0-9]*$/; // 正整数
  if (!Data.foldWayTemplateFrom.RowNumber) {
    messageBox.failSingleError('生成失败', '请输入行数', () => null, () => null);
  } else if (!Data.foldWayTemplateFrom.ColumnNumber) {
    messageBox.failSingleError('生成失败', '请输入列数', () => null, () => null);
  // } else if (Number(Data.foldWayTemplateFrom.ColumnNumber) === 1 && Number(Data.foldWayTemplateFrom.RowNumber) === 1) {
  //   messageBox.failSingleError('生成失败', '行数列数不能同时为1', () => null, () => null);
  } else if (!r.test(String(Data.foldWayTemplateFrom.RowNumber)) || !r.test(String(Data.foldWayTemplateFrom.ColumnNumber))) {
    messageBox.failSingleError('生成失败', '请输入正整数的行列数', () => null, () => null);
  } else if (+Data.foldWayTemplateFrom.RowNumber > 8 || +Data.foldWayTemplateFrom.ColumnNumber > 8) {
    messageBox.failSingleError('生成失败', '请输入8以内的行数或列数', () => null, () => null);
  } else {
    let FrontPage = 1;
    // 行
    const Row:PositionListType[][] = [];
    for (let Rowindex = 0; Rowindex < +Data.foldWayTemplateFrom.RowNumber; Rowindex++) {
      // 列
      const Col:PositionListType[] = [];
      for (let Colindex = 0; Colindex < +Data.foldWayTemplateFrom.ColumnNumber; Colindex++) {
        const PositionItem:PositionListType = {
          RowValue: Rowindex + 1,
          ColumnValue: Colindex + 1,
          FrontPage,
          FrontRotate: false,
          BackPage: 0,
          BackRotate: false,
        };
        FrontPage += 2;
        Col.push(PositionItem);
      }
      Row.push(Col);
    }
    Data.FoldWayPositionList = Row;
    setBackPage();
  }
}
// 旋转
function rotate(RowIndex, ColIndex) {
  const Rotate = !Data.FoldWayPositionList[RowIndex][ColIndex].FrontRotate;
  Data.FoldWayPositionList[RowIndex][ColIndex].FrontRotate = Rotate;
  const Col = Data.FoldWayPositionList[RowIndex];
  const setBackRotateIndex = Col.length - 1 - ColIndex;
  Data.FoldWayPositionList[RowIndex][setBackRotateIndex].BackRotate = Rotate;
}
// 设置页码
function setPage(RowIndex, ColIndex, FrontPage) {
  Data.setPageInp = FrontPage;
  Data.setPageObj = {
    RowIndex,
    ColIndex,
  };
  Data.setPageShow = true;
}
function setPageCloseClick() {
  Data.setPageShow = false;
}
function setPageClosedClick() {
  Data.setPageInp = '';
  Data.setPageObj = {
    RowIndex: '',
    ColIndex: '',
  };
}
function setStorage() { // 设置会话存储
  sessionStorage.setItem('foldWayTemplateSteupPage', 'true');
}
function foldWayTemplateSave() {
  if (!Data.foldWayTemplateFrom.ClassID) {
    messageBox.failSingleError('保存失败', '请选择分类', () => null, () => null);
  } else if (!Data.foldWayTemplateFrom.Name) {
    messageBox.failSingleError('保存失败', '请输入名称', () => null, () => null);
  } else if (!Data.foldWayTemplateFrom.RowNumber || Number(Data.foldWayTemplateFrom.RowNumber) > 8) {
    messageBox.failSingleError('保存失败', `请输入${Number(Data.foldWayTemplateFrom.RowNumber) > 8 ? '小于8的' : ''}行数`, () => null, () => null);
  } else if (!Data.foldWayTemplateFrom.ColumnNumber || Number(Data.foldWayTemplateFrom.ColumnNumber) > 8) {
    messageBox.failSingleError('保存失败', `请输入${Number(Data.foldWayTemplateFrom.ColumnNumber) > 8 ? '小于8的' : ''}列数`, () => null, () => null);
  } else if (!Data.FoldWayPositionList.length) {
    messageBox.failSingleError('保存失败', '请生成模板图', () => null, () => null);
  } else if (Data.FoldWayPositionList.length !== Data.foldWayTemplateFrom.RowNumber
            || Data.FoldWayPositionList[0].length !== Data.foldWayTemplateFrom.ColumnNumber) {
    messageBox.failSingleError('保存失败', '行/列数已改变，请重新生成模板图', () => null, () => null);
  } else {
    Data.foldWayTemplateFrom.PositionList = [];
    Data.FoldWayPositionList.forEach(res => {
      Data.foldWayTemplateFrom.PositionList.push(...res);
    });
    api.getFoldWayTemplateSave(Data.foldWayTemplateFrom).then(res => {
      if (res.data.Status === 1000) {
        const cb = () => {
          Data.foldWayTemplateFrom = {
            ClassID: '',
            RowNumber: '',
            ColumnNumber: '',
            PositionList: [],
            CreateTime: '',
            ID: '',
            Name: '',
          };
          Data.FoldWayPositionList = [];
          setStorage();
          RouterStore.goBack();
        };
        // 保存成功
        messageBox.successSingle('保存成功', cb, cb);
      }
    });
  }
}
function setPagePrimaryClick() {
  // Number.isInteger(3)
  if (!Data.setPageInp) {
    messageBox.failSingleError('设置失败', '请输入页码', () => null, () => null);
  } else if (Number(Data.setPageInp) < 1 || !Number.isInteger(3)) {
    messageBox.failSingleError('设置失败', '请输入正整数的页码', () => null, () => null);
  } else if (Data.setPageInp > Number(Data.foldWayTemplateFrom.RowNumber) * Number(Data.foldWayTemplateFrom.ColumnNumber) * 2) {
    messageBox.failSingleError(
      '设置失败',
      `请输入小于等于${Number(Data.foldWayTemplateFrom.RowNumber) * Number(Data.foldWayTemplateFrom.ColumnNumber) * 2}的页码`,
      () => null,
      () => null,
    );
  } else {
    Data.FoldWayPositionList.forEach((item, index) => {
      item.forEach((it, i) => {
        const tempNum = isEven(it.FrontPage) ? it.FrontPage - 1 : it.FrontPage + 1;
        if (Data.setPageInp === it.FrontPage || Data.setPageInp === tempNum) {
          // 当前设置页码格子的页码
          const nowPageNum = Data.FoldWayPositionList[Data.setPageObj.RowIndex][Data.setPageObj.ColIndex].FrontPage;
          // 和已经有此页码（组）交换页码
          Data.FoldWayPositionList[index][i].FrontPage = nowPageNum;
        }
      });
    });
    Data.FoldWayPositionList[Data.setPageObj.RowIndex][Data.setPageObj.ColIndex].FrontPage = Data.setPageInp as number;
    setBackPage();
    setPageCloseClick();
  }
}

// 转换为显示的列表
function toFoldWayPositionList(PositionList:PositionListType[]) {
  PositionList.forEach(res => {
    const temp = Data.FoldWayPositionList.find(item => item[0].RowValue === res.RowValue);
    if (!temp) {
      const row = PositionList.filter(item => res.RowValue === item.RowValue);
      row.sort((a, b) => a.ColumnValue - b.ColumnValue);
      Data.FoldWayPositionList.push(row);
    }
  });
}
// 翻转印面
function rotatePage() {
  Data.FoldWayPositionList.map((item, index) => item.reverse().map((res, i) => {
    const temp = res;
    temp.RowValue = index + 1;
    temp.ColumnValue = i + 1;
    temp.FrontPage = isEven(res.FrontPage) ? res.FrontPage - 1 : res.FrontPage + 1;
    temp.BackPage = isEven(res.BackPage) ? res.BackPage - 1 : res.BackPage + 1;
    return temp;
  }));
}
onMounted(() => {
  const temp = JSON.parse(route.params.Template as string) as FoldWayTemplateType;
  if (temp.ID) {
    Data.foldWayTemplateFrom = temp;
    Data.FoldWayPositionList = [];
    toFoldWayPositionList(temp.PositionList);
  }
  if (!PasteupSettingStore.FoldWayTemplateClassList.length) {
    PasteupSettingStore.getFoldWayTemplateClassList();
  }
});

</script>
<script lang="ts">
export default {
  name: 'foldWayTemplateSteupPage',
};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.foldWay-template-steup-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  font-size: 12px;
    background-color: #fff;
  >header{
    padding: 20px;
  }
  >main{
    flex: 1;
    margin-top: 10px;
    overflow-x: auto;
    >.main-scrollbar{
      >.el-scrollbar__wrap{
        >.el-scrollbar__view{
          padding-left: 40px;
          padding-top: 20px;
          box-sizing: border-box;
          display: flex;
          justify-content: flex-start;
        }
      }
    }
    .left{
      width: 430px;
      .title{
        font-size: 14px;
        color: #444444;
        font-weight: 600;
        border-left: 3px solid #05C1FF;
        padding-left: 13px;
        line-height: 14px;
      }
      >.el-form{
        margin-top: 36px;
        margin-left: 68px;
        .el-form-item__label {
          white-space: nowrap;
        }
        .el-form-item__content{
          font-size: 12px;
        }
        .input-name{
          .el-form-item__content{
            flex-direction: column;
            align-items: flex-start;
            .el-input{
              width: 300px;
            }
          }
        }
        .input-num{
          .el-input{
            margin-right: 10px;
            width: 100px;
          }

        }
      }
    }
    .right{
      margin-left: 150px;
      padding-right: 50px;
      >p{
        line-height: 32px;
      }
      >div{
        display: inline-block;
        width: 100%;
        max-width: 1010px;
        // 40 便签 54 header 32 翻转印面 100 footer 50 预留50px
        height: calc(100vh - 40px - 54px - 32px - 100px - 50px);
      }
      .rows{
        display: inline-block;
        margin: 2px;
      }
      .cols{
        display: flex;
        >li{
          box-sizing: border-box;
          width: 200px;
          height: 300px;
          border: 1px solid #DCDFE6;
          margin-left: -1px;
          margin-top: -1px;
          position: relative;
          display: flex;
          align-items: flex-end;
          padding: 10px;
          .page{
            line-height: 14px;
            width: 100%;
            // 不旋转单数居右 双数居左
            text-align: right;
            &.is-even{
              text-align: left;
            }
          }
          &.rotate{
            align-items: flex-start;
            .page{
              transform: rotateZ(180deg);
              line-height: 14px;
              // 旋转单数居左 双数居右
              text-align: right;
              &.is-even{
                text-align: left;
              }

            }
          }
          .btns{
            text-align: center;
            position: absolute;
            line-height: 14px;
            width: calc(100% - 20px);
            top: calc(50% - 34px);
            p+p{
              margin-top: 28px;
            }
          }
        }
      }
    }
  }
  .set-page-dialog{
    .el-form{
      width: 370px;
      margin: 0 auto;
      .el-input-number{
        width: 100%;
        input{
          text-align: left;
        }
      }
    }
  }
  >footer{
    min-height: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 50px;
    .el-button{
      width: 120px;
    }
    .el-button + .el-button{
      margin-left: 30px;
    }
  }
}
</style>
