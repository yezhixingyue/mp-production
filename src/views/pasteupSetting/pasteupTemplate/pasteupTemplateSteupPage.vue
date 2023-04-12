<template>
  <div class="pasteup-template-steup-page" >
    <header>
      <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
    </header>
    <main>
      <el-scrollbar>
      <p class="title">{{Data.addPasteupTemplateFrom.ID?'编辑' :'添加'}}尺寸</p>
      <el-form :model="Data.addPasteupTemplateFrom" label-width="100px">
        <!-- <el-form-item :label="`分类：`" class="form-item-required">
          <OneLevelSelect
            :options='PasteupSettingStore.ImpositionTemmplateClassList'
            :defaultProps="{
              value:'ID',
              label:'Name',
            }"
            :value='Data.addPasteupTemplateFrom.ClassID'
            @change="(ID) => Data.addPasteupTemplateFrom.ClassID = ID"
            @requestFunc='() => null'
            :width="200"
            ></OneLevelSelect>
        </el-form-item> -->
        <el-form-item :label="`名称：`" class="form-item-required template-name">
          <el-input v-model="Data.addPasteupTemplateFrom.Name" placeholder="请输入"></el-input>
          <!-- <div>
            <p>
              <el-checkbox v-model="Data.addPasteupTemplateFrom.IsPrintingPlate"
              @change="Data.addPasteupTemplateFrom.IsSameSizeWithPrintingPlate = false" label="印刷版"/>
              <el-checkbox v-model="Data.addPasteupTemplateFrom.IsSameSizeWithPrintingPlate"
              @change="Data.addPasteupTemplateFrom.IsPrintingPlate = false"
              label="和印刷版保持一致" style="--el-checkbox-font-size: 12px"/>
            </p>
            <p class="hint">
              每个生产线仅允许有一个印刷版，请不要把非印刷版设置为印刷版。
            </p>
          </div> -->
        </el-form-item>
        <!-- 是否为 印刷版 -->
        <template v-if="pasteupTemplateData.IsPrintingPlate">
          <el-form-item :label="`翻版方式：`" class="form-item-required">
            <el-radio-group v-model="Data.addPasteupTemplateFrom.ReproductionType">
              <el-radio :label="0">正反版</el-radio>
              <el-radio :label="1">自翻版</el-radio>
              <el-radio :label="2">滚翻版</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <el-form-item :label="`尺寸：`" class="form-item-required">
          <el-radio-group v-model="Data.addPasteupTemplateFrom.SizeType">
            <el-radio :label="0">按模板尺寸</el-radio>
            <el-radio :label="1">按实际拼版尺寸</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 是否为 按模板尺寸 -->
        <template v-if="Data.addPasteupTemplateFrom.SizeType === 0">
          <el-form-item :label="`模板文件：`" class="form-item-required upload-form">
            <!-- Data.addPasteupTemplateFrom.ModeSizeAttribute.FilePath -->
            <div v-if="Data.addPasteupTemplateFrom.ModeSizeAttribute">

              <el-upload
                ref="upload"
                class="upload-demo"
                action="/Api/Upload/PlateTemplate"
                accept=".pdf"
                :on-success='handlleUploaded'
                :before-upload='beforeUpload'
              >
                <template #trigger>
                  <mp-button type="primary" :loading="Data.uploadBtnLoading">选择文件</mp-button>
                </template>
                <template #tip>
                  <div class="el-upload__tip text-red">
                    {{Data.addPasteupTemplateFrom.ModeSizeAttribute.PlateInfo.FilePath? '已上传模板文件':'未上传'}}
                  </div>
                </template>
              </el-upload>
              <el-link type="primary" :href="Data.addPasteupTemplateFrom.ModeSizeAttribute.PlateInfo.FilePath" target="_blank">
                下载当前模板文件</el-link>
            </div>
            <p class="hint">
              模板制作说明：版芯使用 PANTONE 804C 标记
            </p>
            <!-- <div class="error-range">
              <p v-if="Data.addPasteupTemplateFrom.LengthErrorRange">
                宽允许误差：
                + <el-input v-model.number="Data.addPasteupTemplateFrom.LengthErrorRange.MaxValue"/> mm&nbsp;&nbsp;
                - <el-input v-model.number="Data.addPasteupTemplateFrom.LengthErrorRange.MinValue"/> mm
              </p>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <p v-if="Data.addPasteupTemplateFrom.WidthErrorRange">
                高允许误差：
                + <el-input v-model.number="Data.addPasteupTemplateFrom.WidthErrorRange.MaxValue"/> mm&nbsp;&nbsp;
                - <el-input v-model.number="Data.addPasteupTemplateFrom.WidthErrorRange.MinValue"/> mm
              </p>
            </div> -->
            <p class="template-info" v-if="Data.addPasteupTemplateFrom.ModeSizeAttribute?.PlateInfo.FilePath">
              <ul>
                <li>模板：<span>宽:{{Data.addPasteupTemplateFrom.ModeSizeAttribute.PlateInfo.Width}}mm</span>
                          <span>高:{{Data.addPasteupTemplateFrom.ModeSizeAttribute.PlateInfo.Height}}mm</span></li>
                <el-scrollbar max-height="100px">
                <li v-for="(Area,index) in Data.addPasteupTemplateFrom.ModeSizeAttribute.PlateInfo.AreaList" :key="index">
                版芯：<span>X:{{Area.XCoordinate}}mm</span>
                <span>Y:{{Area.YCoordinate}}mm</span>
                <span>宽:{{Area.Width}}mm</span>
                <span>高:{{Area.Height}}mm</span></li>
                </el-scrollbar>
              </ul>
            </p>
          </el-form-item>
          <el-form-item :label="`拼版方式：`">
            <el-checkbox v-if="Data.addPasteupTemplateFrom.ModeSizeAttribute" v-model="Data.addPasteupTemplateFrom.ModeSizeAttribute.UseMode" label="按模位" />
          </el-form-item>
          <div v-if="Data.addPasteupTemplateFrom.ModeSizeAttribute?.UseMode" class="template-location-list">
            <mp-button type="primary" link @click="addModeItem">+ 添加一行</mp-button>
            <div class="table-title">
              <span class="coord">
                起始坐标
              </span>
              <span class="size">
                模位尺寸
              </span>
              <span class="row">
                行数
              </span>
              <span class="col">
                列数
              </span>
              <span class="handle"></span>
            </div>
            <ul v-if="Data.addPasteupTemplateFrom.ModeSizeAttribute?.ModeItemList.length">
              <li v-for="(ModeItem,index) in Data.addPasteupTemplateFrom.ModeSizeAttribute.ModeItemList" :key="ModeItem.key">
                <span class="coord">
                  <span class="coord-item">
                    <span class="dark">x：</span>
                    <el-input v-model.number="ModeItem.XCoordinate"/> mm
                  </span>
                  <span class="coord-item">
                    <span class="dark">y：</span>
                    <el-input v-model.number="ModeItem.YCoordinate"/> mm
                  </span>
                </span>
                <span class="size">
                  <span class="dark">宽：</span>
                  <el-input v-model.number="ModeItem.Width"/>
                  mm <i>X</i> <span class="dark">高：</span>
                  <el-input v-model.number="ModeItem.Height"/> mm
                </span>
                <span class="row">
                  <el-input v-model.number="ModeItem.RowNumber"/> 行
                </span>
                <span class="col">
                  <el-input v-model.number="ModeItem.ColumnNumber"/> 列
                </span>
                <span class="handle">
                  <mp-button type="danger" link @click="delModeItem(index)">删除</mp-button>
                </span>
              </li>
            </ul>
          </div>
        </template>
        <!-- 是否为 按实际拼版尺寸 -->
        <template v-if="Data.addPasteupTemplateFrom.SizeType === 1">
          <el-form-item :label="`白边：`" class="form-item-required white-edge">
            <ul v-if="Data.addPasteupTemplateFrom.ActualSizeAttribute">
              <li>上: <el-input v-model.number="Data.addPasteupTemplateFrom.ActualSizeAttribute.BleedTop" /> mm</li>
              <li>左: <el-input v-model.number="Data.addPasteupTemplateFrom.ActualSizeAttribute.BleedLeft" /> mm</li>
              <li>右: <el-input v-model.number="Data.addPasteupTemplateFrom.ActualSizeAttribute.BleedRight" /> mm</li>
              <li>下: <el-input v-model.number="Data.addPasteupTemplateFrom.ActualSizeAttribute.BleedBottom" /> mm</li>
            </ul>
          </el-form-item>
        </template>
      </el-form>
      </el-scrollbar>
    </main>
    <footer>
      <mp-button type="primary" class="gradient" @click="savePasteupTemplateSize">保存</mp-button>
      <mp-button class="blue" @click="$goback">返回</mp-button>
    </footer>
  </div>
</template>

<script setup lang='ts'>
import {
  reactive, onMounted, computed, getCurrentInstance, ref,
} from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { useRoute } from 'vue-router';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { useRouterStore } from '@/store/modules/routerStore';
import { usePasteupSettingStore } from '@/store/modules/pasteupSetting';
import { ImpositionTemmplate, SizeListType } from './types';

interface DataType {
  uploadBtnLoading: boolean
  addPasteupTemplateFrom: SizeListType
}

const { $goback } = getCurrentInstance()?.appContext.config.globalProperties || { $goback: () => null };
const route = useRoute();
const RouterStore = useRouterStore();
const PasteupSettingStore = usePasteupSettingStore();

// 上个页面传入的模板数据
const pasteupTemplateData = ref<ImpositionTemmplate>({
  ID: '',
  Name: '',
  // 印刷版
  IsPrintingPlate: false,
  // 和印刷版保持一致
  IsSameSizeWithPrintingPlate: false,
  List: [],
});
const Data: DataType = reactive({
  uploadBtnLoading: false,
  addPasteupTemplateFrom: {
    TemplateID: '',
    // 翻版方式
    ReproductionType: 0,
    // 尺寸
    SizeType: 0,
    ModeSizeAttribute: {
      PlateInfo: {
        FilePath: '',
        Width: 0,
        Height: 0,
        AreaList: [
          // {
          //   XCoordinate: 0,
          //   YCoordinate: 0,
          //   Length: 0,
          //   Width: 0,
          // },
        ],
      },
      // 是否按模位
      UseMode: false,
      ModeItemList: [
        {
          XCoordinate: null,
          YCoordinate: null,
          Width: null,
          Height: null,
          RowNumber: null,
          ColumnNumber: null,
          key: '1',
        },
      ],
    },
    ActualSizeAttribute: {
      BleedTop: null,
      BleedBottom: null,
      BleedLeft: null,
      BleedRight: null,
    },
    LengthErrorRange: {
      MinValue: null,
      MaxValue: null,
    },
    WidthErrorRange: {
      MinValue: null,
      MaxValue: null,
    },
    CreateTime: '',
    ID: '',
    Name: '',
  },
});
const BreadcrumbList = computed(() => [
  { to: { path: '/pasteupTemplate' }, name: '拼版模板' },
  { to: { path: '/templateSetSize' }, name: '设置尺寸' },
  {
    name: `${Data.addPasteupTemplateFrom.ID ? '编辑' : '添加'}尺寸：
          ${pasteupTemplateData.value.ID ? `${pasteupTemplateData.value.Name}` : ''}`,
  },
]);
function addModeItem() {
  Data.addPasteupTemplateFrom.ModeSizeAttribute?.ModeItemList.push({
    XCoordinate: null,
    YCoordinate: null,
    Width: null,
    Height: null,
    RowNumber: null,
    ColumnNumber: null,
    key: Math.random().toString(16).slice(-10),
  });
}
function delModeItem(i) {
  Data.addPasteupTemplateFrom.ModeSizeAttribute?.ModeItemList.splice(i, 1);
}
function verification() {
  if (!Data.addPasteupTemplateFrom.Name) {
    messageBox.failSingleError('保存失败', '请输入名称', () => null, () => null);
    return false;
  }

  // 不和印刷版保持一致
  if (!pasteupTemplateData.value.IsSameSizeWithPrintingPlate) {
    // 按实际拼版尺寸 上
    if (Data.addPasteupTemplateFrom.SizeType === 1) {
      if (Data.addPasteupTemplateFrom.ActualSizeAttribute?.BleedTop === null
          || Data.addPasteupTemplateFrom.ActualSizeAttribute?.BleedTop === '') {
        messageBox.failSingleError('保存失败', '请输入上白边', () => null, () => null);
      } else if (Data.addPasteupTemplateFrom.ActualSizeAttribute?.BleedLeft === null
          || Data.addPasteupTemplateFrom.ActualSizeAttribute?.BleedLeft === '') {
        messageBox.failSingleError('保存失败', '请输入左白边', () => null, () => null);
      } else if (Data.addPasteupTemplateFrom.ActualSizeAttribute?.BleedRight === null
          || Data.addPasteupTemplateFrom.ActualSizeAttribute?.BleedRight === '') {
        messageBox.failSingleError('保存失败', '请输入右白边', () => null, () => null);
      } else if (Data.addPasteupTemplateFrom.ActualSizeAttribute?.BleedBottom === null
          || Data.addPasteupTemplateFrom.ActualSizeAttribute?.BleedBottom === '') {
        messageBox.failSingleError('保存失败', '请输入下白边', () => null, () => null);
      } else {
        return true;
      }
      return false;
    }
    // 按模板尺寸 没有上传模板
    if (Data.addPasteupTemplateFrom.SizeType === 0 && !Data.addPasteupTemplateFrom.ModeSizeAttribute?.PlateInfo.FilePath) {
      messageBox.failSingleError('保存失败', '请上传模板文件', () => null, () => null);
      return false;
    }
    // 按模板尺寸 没有输入允许误差
    // if (Data.addPasteupTemplateFrom.SizeType === 0
    // && (typeof Data.addPasteupTemplateFrom.LengthErrorRange?.MaxValue !== 'number'
    // || typeof Data.addPasteupTemplateFrom.LengthErrorRange?.MinValue !== 'number')) {
    //   messageBox.failSingleError('保存失败', '请输入宽允许误差', () => null, () => null);
    //   return false;
    // }
    // if (Data.addPasteupTemplateFrom.SizeType === 0
    // && (typeof Data.addPasteupTemplateFrom.WidthErrorRange?.MaxValue !== 'number'
    // || typeof Data.addPasteupTemplateFrom.WidthErrorRange?.MinValue !== 'number')) {
    //   messageBox.failSingleError('保存失败', '请输入高允许误差', () => null, () => null);
    //   return false;
    // }
    // 按模板尺寸 并且按模位
    if (Data.addPasteupTemplateFrom.SizeType === 0 && Data.addPasteupTemplateFrom.ModeSizeAttribute?.UseMode) {
      // 验证模位合法性
      for (let index = 0; index < Data.addPasteupTemplateFrom.ModeSizeAttribute.ModeItemList.length; index++) {
        const ModeItem = Data.addPasteupTemplateFrom.ModeSizeAttribute.ModeItemList[index];
        if (
          ModeItem.XCoordinate === null
            || ModeItem.YCoordinate === null
            || !ModeItem.Width
            || !ModeItem.Height
            || !ModeItem.RowNumber
            || !ModeItem.ColumnNumber
        ) {
          messageBox.failSingleError('保存失败', `请输入第${index + 1}行的数据`, () => null, () => null);
          return false;
        }

        const { AreaList } = Data.addPasteupTemplateFrom.ModeSizeAttribute ? Data.addPasteupTemplateFrom.ModeSizeAttribute.PlateInfo : { AreaList: [] };
        // 当前模位起点所在可拼版区域
        const Area = AreaList.find(area => {
          // 分别找到横轴和竖轴的起点是否都在此可拼版区域
          const xinclude = Number(ModeItem.XCoordinate) >= Number(area.XCoordinate)
           && Number(ModeItem.XCoordinate) <= Number(area.XCoordinate) + Number(area.Width);
          const yinclude = Number(ModeItem.YCoordinate) >= Number(area.YCoordinate)
           && Number(ModeItem.YCoordinate) <= Number(area.YCoordinate) + Number(area.Height);
          return xinclude && yinclude;
        });
        // 没找到说明起点不在可拼版区域
        if (!Area) {
          messageBox.failSingleError('保存失败', `第${index + 1}行数据起始坐标不在可拼版区域`, () => null, () => null);
          return false;
        }
        // 横轴结束点是否在可拼版区域
        const xEndInclude = Number(ModeItem.XCoordinate) + ModeItem.Width * ModeItem.ColumnNumber <= Number(Area.XCoordinate) + Number(Area.Width);
        const yEndInclude = Number(ModeItem.YCoordinate) + ModeItem.Height * ModeItem.RowNumber <= Number(Area.YCoordinate) + Number(Area.Height);
        if (!xEndInclude) {
          messageBox.failSingleError('保存失败', `第${index + 1}行数据宽度超出可拼版区域`, () => null, () => null);
          return false;
        }
        if (!yEndInclude) {
          messageBox.failSingleError('保存失败', `第${index + 1}行数据高度超出可拼版区域`, () => null, () => null);
          return false;
        }
      }
    }
  }
  return true;
}
function setStorage() { // 设置会话存储
  sessionStorage.setItem('templateSetSize', 'true');
}
function savePasteupTemplateSize() {
  if (verification()) {
    if (Data.addPasteupTemplateFrom.SizeType === 0) {
      Data.addPasteupTemplateFrom.ActualSizeAttribute = null;
    }
    if (Data.addPasteupTemplateFrom.SizeType === 1) {
      Data.addPasteupTemplateFrom.ModeSizeAttribute = null;
      Data.addPasteupTemplateFrom.LengthErrorRange = null;
      Data.addPasteupTemplateFrom.WidthErrorRange = null;
    }
    api.getImpositionTemmplateSizeSave(Data.addPasteupTemplateFrom).then(resp => {
      if (resp.data.Status === 1000) {
        const cb = () => {
          PasteupSettingStore.getImpositionTemmplateList();
          setStorage();
          RouterStore.goBack();
        };
        // 保存成功
        messageBox.successSingle('保存成功', cb, cb);
      }
    });
  }
}
function handlleUploaded(e) {
  if (e.Status === 1000) {
    if (Data.addPasteupTemplateFrom.ModeSizeAttribute) {
      Data.addPasteupTemplateFrom.ModeSizeAttribute.PlateInfo.FilePath = e.Data.FilePath;
      Data.addPasteupTemplateFrom.ModeSizeAttribute.PlateInfo.AreaList = e.Data.AreaList;
      Data.addPasteupTemplateFrom.ModeSizeAttribute.PlateInfo.Width = e.Data.Width;
      Data.addPasteupTemplateFrom.ModeSizeAttribute.PlateInfo.Height = e.Data.Height;
    }
  } else {
    messageBox.failSingleError('上传失败', e.Message, () => null, () => null);
  }
  Data.uploadBtnLoading = false;
}
function beforeUpload(file) {
  const maxMbit = 15; // 文件尺寸限制 最大可上传多少兆的文件

  const isLessthenMax = file.size < maxMbit * 1024 * 1024;

  if (!isLessthenMax) {
    // 文件过大上传失败
    messageBox.failSingleError('上传失败', `上传文件过大，请上传小于${maxMbit}M的文件`, () => null, () => null);
  } else {
    Data.uploadBtnLoading = true;
  }

  return isLessthenMax;
}

onMounted(() => {
  // pasteupTemplateData
  pasteupTemplateData.value = JSON.parse(route.params.Template as string) as ImpositionTemmplate;
  const temp = JSON.parse(route.params.SizeItem as string) as SizeListType;

  if (temp.ID) {
    Data.addPasteupTemplateFrom = temp;
  }
  Data.addPasteupTemplateFrom.TemplateID = pasteupTemplateData.value.ID;
  if (!temp.ModeSizeAttribute) {
    Data.addPasteupTemplateFrom.ModeSizeAttribute = {
      PlateInfo: {
        FilePath: '',
        Width: 0,
        Height: 0,
        AreaList: [
          {
            XCoordinate: 0,
            YCoordinate: 0,
            Width: 0,
            Height: 0,
          },
        ],
      },
      // 是否按模位
      UseMode: false,
      ModeItemList: [
        {
          XCoordinate: null,
          YCoordinate: null,
          Width: null,
          Height: null,
          RowNumber: null,
          ColumnNumber: null,
          key: '1',
        },
      ],
    };
  }
  if (!temp.ActualSizeAttribute) {
    Data.addPasteupTemplateFrom.ActualSizeAttribute = {
      BleedTop: null,
      BleedBottom: null,
      BleedLeft: null,
      BleedRight: null,
    };
  }
  if (!temp.LengthErrorRange) {
    Data.addPasteupTemplateFrom.LengthErrorRange = {
      MinValue: null,
      MaxValue: null,
    };
  }
  if (!temp.WidthErrorRange) {
    Data.addPasteupTemplateFrom.WidthErrorRange = {
      MinValue: null,
      MaxValue: null,
    };
  }
  // Data.addPasteupTemplateFrom.TemplateID = temp.TemplateID;
  // Data.addPasteupTemplateFrom = temp;
});

</script>
<script lang="ts">
export default {
  name: 'pasteupTemplateSteupPage',
};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.pasteup-template-steup-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  font-size: 12px;
  >header{
    padding: 20px;
    padding-bottom: 0;
  }
  >main{
    flex: 1;
    margin-top: 20px;
    overflow-x: auto;
    padding-left: 40px;
    padding-top: 20px;
    box-sizing: border-box;
    .title{
      font-size: 14px;
      color: #444444;
      font-weight: 600;
      border-left: 3px solid #05C1FF;
      padding-left: 13px;
      line-height: 14px;
    }
    .el-form{
      margin-top: 36px;
      .el-form-item__content{
        font-size: 12px;
        .upload-demo{
          display: flex;
          height: 32px;
          .el-upload{
            margin-right: 20px;
            .el-button{
              width: 110px;
            }
          }
          .el-upload-list--text{
            display: none;
          }
          .el-upload__tip{
            margin-top: 0;
          }
        }
        .hint{
          font-size: 12px;
          line-height: 30px;
          color: #F4A307;
          position: relative;
          padding-left: 23px;
          &::before{
            content: '';
            background-image: url('@/assets/images/warn.png');
            display: inline-block;
            background-size: 13px 13px;
            width: 13px;
            height: 13px;
            margin-right: 10px;
            position: absolute;
            left: 0;
            top: 8px;
          }
        }
      }
      .template-name{
        .el-form-item__content{
          flex-direction: column;
          align-items: flex-start;
          .el-input{
            width: 300px;
          }
        }
      }
      .upload-form{
        .el-form-item__content{
          flex-direction: column;
          align-items: flex-start;
          >div{
            display: flex;
            >.el-link{
              margin-left: 20px;
            }
          }
          .template-info{
            color: #606266;
            ul{
              li{
                display: flex;
                line-height: 2em;
                span{
                  width: 70px;
                  margin: 0 5px;
                }
              }
            }
          }
          .error-range{
            .el-input{
              width: 60px;
              height: 28px;
              input{
                height: 28px;
              }
            }
          }
        }
      }
      .white-edge{
        ul{
          display: flex;
          width: 260px;
          flex-wrap: wrap;
          justify-content: center;
          li{
            width: 130px;
            .el-input{
              width: 60px;
              height: 28px;
              input{
                height: 28px;
              }
            }
          }
          li:first-child{
            width: 131px;
          }
        }
      }
      .template-location-list{
        .table-title, ul, li{
          width: 800px;
          display: flex;
          .coord{
            width: 260px;
          }
          .size{
            width: 270px;
          }
          .row{
            width: 100px;
          }
          .col{
            width: 100px;
          }
          .handle{
            width: 40px;
          }
        }
        .table-title{
          font-size: 14px;
          color: #444444;
          font-weight: 600;
          text-align: center;
          line-height: 38px;
        }
        ul{
          border: 1px solid #DCDFE6;
          border-radius: 3px;
          flex-direction: column;
          li+li{
            border-top: 1px solid #DCDFE6;
          }
          li{
            height: 44px;
            align-items: center;
            padding: 0 20px;
            box-sizing: border-box;
            color: #999;
            font-size: 12px;
            .dark{
              color: #444444;
            }
            i{
              margin: 0 5px;
            }
            .el-input{
              width: 60px;
              height: 28px;
              input{
                height: 28px;
              }
            }
            .coord-item+.coord-item{
              margin-left: 10px;
            }
          }
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
