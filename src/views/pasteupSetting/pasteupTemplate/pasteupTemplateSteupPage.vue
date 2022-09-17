<template>
  <div class="pasteup-template-steup-page" >
    <header>
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ path: '/pasteupTemplate' }">拼版模板</el-breadcrumb-item>
        <el-breadcrumb-item>{{Data.addPasteupTemplateFrom.ID?'编辑' :'添加'}}拼版模板：
          {{Data.addPasteupTemplateFrom.ID?`${Data.addPasteupTemplateFrom.Name}` :''}}</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main>
      <p class="title">{{Data.addPasteupTemplateFrom.ID?'编辑' :'添加'}}拼版模板</p>
      <el-form :model="Data.addPasteupTemplateFrom" label-width="100px">
        <el-form-item :label="`分类：`">
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
        </el-form-item>
        <el-form-item :label="`名称：`" class="form-item-required template-name">
          <el-input v-model="Data.addPasteupTemplateFrom.Name" placeholder="请输入"></el-input>
          <div>
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
          </div>
        </el-form-item>
        <!-- 是否为 和印刷版布局保持一致 -->
        <template v-if="!Data.addPasteupTemplateFrom.IsSameSizeWithPrintingPlate">

          <!-- 是否为 印刷版 -->
          <template v-if="Data.addPasteupTemplateFrom.IsPrintingPlate">
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
              <div>

                <el-upload
                  ref="upload"
                  class="upload-demo"
                  action="/Api/Upload/PlateTemplate"
                  accept=".pdf"
                  :on-success='handlleUploaded'
                  :before-upload='beforeUpload'
                >
                  <template #trigger>
                    <el-button type="primary">选择文件</el-button>
                  </template>
                  <!-- <el-button class="ml-3" type="success" @click="submitUpload">
                    upload to server
                  </el-button> -->
                  <template #tip>
                    <div class="el-upload__tip text-red">
                      {{Data.addPasteupTemplateFrom.ModeSizeAttribute.PlateInfo.FilePath? '已上传模板文件':'未上传'}}
                    </div>
                  </template>
                </el-upload>
                <el-link type="primary" :href="Data.addPasteupTemplateFrom.ModeSizeAttribute.PlateInfo.FilePath">
                  {{Data.addPasteupTemplateFrom.ModeSizeAttribute.PlateInfo.FilePath}}</el-link>
                <!-- <el-button link type="primary">下载当前模板文件</el-button> -->
              </div>
              <p class="hint">
                模板制作说明：版芯使用 PANTONE 804C 标记
              </p>
            </el-form-item>
            <el-form-item :label="`拼版方式：`" class="form-item-required">
              <el-checkbox v-model="Data.addPasteupTemplateFrom.ModeSizeAttribute.UseMode" label="按模位" />
            </el-form-item>
            <div v-if="Data.addPasteupTemplateFrom.ModeSizeAttribute.UseMode" class="template-location-list">
              <el-button type="primary" link @click="addModeItem">+ 添加一行</el-button>
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
              <ul v-if="Data.addPasteupTemplateFrom.ModeSizeAttribute.ModeItemList.length">
                <li v-for="(ModeItemList,index) in Data.addPasteupTemplateFrom.ModeSizeAttribute.ModeItemList" :key="ModeItemList.key">
                  <span class="coord">
                    <span class="coord-item">
                      <span class="dark">x：</span>
                      <el-input-number :controls="false" v-model="ModeItemList.XCoordinate"/> mm
                    </span>
                    <span class="coord-item">
                      <span class="dark">y：</span>
                      <el-input-number :controls="false" v-model="ModeItemList.YCoordinate"/> mm
                    </span>
                  </span>
                  <span class="size">
                    <span class="dark">长：</span>
                    <el-input-number :controls="false" v-model="ModeItemList.Length"/>
                    mm <i>X</i> <span class="dark">宽：</span>
                    <el-input-number :controls="false" v-model="ModeItemList.Width"/> mm
                  </span>
                  <span class="row">
                    <el-input-number :controls="false" v-model="ModeItemList.RowNumber"/> 行
                  </span>
                  <span class="col">
                    <el-input-number :controls="false" v-model="ModeItemList.ColumnNumber"/> 列
                  </span>
                  <span class="handle">
                    <el-button type="danger" link @click="delModeItem(index)">删除</el-button>
                  </span>
                </li>
              </ul>
            </div>
          </template>
          <!-- 是否为 按实际拼版尺寸 -->
          <template v-if="Data.addPasteupTemplateFrom.SizeType === 1">
            <el-form-item :label="`白边：`" class="form-item-required white-edge">
              <ul>
                <li>上: <el-input-number :controls="false" v-model="Data.addPasteupTemplateFrom.ActualSizeAttribute.BleedTop" /> mm</li>
                <li>左: <el-input-number :controls="false" v-model="Data.addPasteupTemplateFrom.ActualSizeAttribute.BleedLeft" /> mm</li>
                <li>右: <el-input-number :controls="false" v-model="Data.addPasteupTemplateFrom.ActualSizeAttribute.BleedRight" /> mm</li>
                <li>下: <el-input-number :controls="false" v-model="Data.addPasteupTemplateFrom.ActualSizeAttribute.BleedBottom" /> mm</li>
              </ul>
            </el-form-item>
          </template>
        </template>
      </el-form>
    </main>
    <footer>
      <el-button type="primary" @click="savePasteupTemplate">保存</el-button>
      <el-button @click="$goback">返回</el-button>
    </footer>
  </div>
</template>

<script lang='ts'>
import {
  reactive, onMounted,
} from 'vue';

import { useRoute } from 'vue-router';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { useRouterStore } from '@/store/modules/routerStore';
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';
import { usePasteupSettingStore } from '@/store/modules/pasteupSetting';
import { ImpositionTemmplate } from './types';

interface DataType {
  addPasteupTemplateFrom: ImpositionTemmplate
}
export default {
  name: 'pasteupTemplateSteupPage',
  components: {
    OneLevelSelect,
  },
  setup() {
    const route = useRoute();
    const RouterStore = useRouterStore();
    const PasteupSettingStore = usePasteupSettingStore();
    const Data: DataType = reactive({
      addPasteupTemplateFrom: {
        ClassID: '',
        // 印刷版
        IsPrintingPlate: false,
        // 和印刷版保持一致
        IsSameSizeWithPrintingPlate: false,
        // 翻版方式
        ReproductionType: 0,
        // 尺寸
        SizeType: 0,
        ModeSizeAttribute: {
          PlateInfo: {
            FilePath: '',
            Length: 0,
            Width: 0,
            AreaList: [
              {
                XCoordinate: 0,
                YCoordinate: 0,
                Length: 0,
                Width: 0,
              },
            ],
          },
          // 是否按模位
          UseMode: false,
          ModeItemList: [
            {
              XCoordinate: 0,
              YCoordinate: 0,
              Length: 0,
              Width: 0,
              RowNumber: 0,
              ColumnNumber: 0,
              key: '1',
            },
          ],
        },
        ActualSizeAttribute: {
          BleedTop: 0,
          BleedBottom: 0,
          BleedLeft: 0,
          BleedRight: 0,
        },
        CreateTime: '',
        ID: '',
        Name: '',
      },
    });

    function addModeItem() {
      Data.addPasteupTemplateFrom.ModeSizeAttribute.ModeItemList.push({
        XCoordinate: 0,
        YCoordinate: 0,
        Length: 0,
        Width: 0,
        RowNumber: 0,
        ColumnNumber: 0,
        key: Math.random().toString(16).slice(-10),
      });
    }
    function delModeItem(i) {
      Data.addPasteupTemplateFrom.ModeSizeAttribute.ModeItemList.splice(i, 1);
    }
    function verification() {
      if (!Data.addPasteupTemplateFrom.ClassID) {
        messageBox.failSingleError('保存失败', '请选择分类', () => null, () => null);
        return false;
      }
      if (!Data.addPasteupTemplateFrom.Name) {
        messageBox.failSingleError('保存失败', '请输入名称', () => null, () => null);
        return false;
      }

      // 不和印刷版保持一致
      if (!Data.addPasteupTemplateFrom.IsSameSizeWithPrintingPlate) {
        // 按实际拼版尺寸 上
        if (Data.addPasteupTemplateFrom.SizeType === 1) {
          if (!Data.addPasteupTemplateFrom.ActualSizeAttribute.BleedTop) {
            messageBox.failSingleError('保存失败', '请输入上白边', () => null, () => null);
          } else if (!Data.addPasteupTemplateFrom.ActualSizeAttribute.BleedLeft) {
            messageBox.failSingleError('保存失败', '请输入左白边', () => null, () => null);
          } else if (!Data.addPasteupTemplateFrom.ActualSizeAttribute.BleedRight) {
            messageBox.failSingleError('保存失败', '请输入右白边', () => null, () => null);
          } else if (!Data.addPasteupTemplateFrom.ActualSizeAttribute.BleedBottom) {
            messageBox.failSingleError('保存失败', '请输入下白边', () => null, () => null);
          } else {
            return true;
          }
          return false;
        }
        // 按模板尺寸 没有上传模板
        if (Data.addPasteupTemplateFrom.SizeType === 0 && !Data.addPasteupTemplateFrom.ModeSizeAttribute.PlateInfo.FilePath) {
          messageBox.failSingleError('保存失败', '请上传模板文件', () => null, () => null);
          return false;
        }
        // 按模板尺寸 并且按模位
        if (Data.addPasteupTemplateFrom.SizeType === 0 && Data.addPasteupTemplateFrom.ModeSizeAttribute.UseMode) {
          // 验证模位合法性
          for (let index = 0; index < Data.addPasteupTemplateFrom.ModeSizeAttribute.ModeItemList.length; index++) {
            const ModeItem = Data.addPasteupTemplateFrom.ModeSizeAttribute.ModeItemList[index];
            if (
              ModeItem.XCoordinate === null
            || ModeItem.YCoordinate === null
            || !ModeItem.Length
            || !ModeItem.Width
            || !ModeItem.RowNumber
            || !ModeItem.ColumnNumber
            ) {
              messageBox.failSingleError('保存失败', `请输入第${index + 1}行的数据`, () => null, () => null);
              console.log('messageBoxmessageBoxmessageBox');
              return false;
            }

            const { AreaList } = Data.addPasteupTemplateFrom.ModeSizeAttribute.PlateInfo;
            // 当前模位起点所在可拼版区域
            const Area = AreaList.find(res => {
              // 分别找到横轴和竖轴的起点是否都在此可拼版区域
              const xinclude = ModeItem.XCoordinate >= res.XCoordinate && ModeItem.XCoordinate <= Number(res.XCoordinate) + Number(res.Length);
              const yinclude = ModeItem.YCoordinate >= res.YCoordinate && ModeItem.YCoordinate <= Number(res.YCoordinate) + Number(res.Width);
              return xinclude && yinclude;
            });
            // 没找到说明起点不在可拼版区域
            if (!Area) {
              messageBox.failSingleError('保存失败', `第${index + 1}行数据起始坐标不在可拼版区域`, () => null, () => null);
              return false;
            }
            // 横轴结束点是否在可拼版区域
            const xEndInclude = (Number(ModeItem.XCoordinate) + ModeItem.Length) * ModeItem.ColumnNumber <= Number(Area.XCoordinate) + Number(Area.Length);
            const yEndInclude = (Number(ModeItem.YCoordinate) + ModeItem.Width) * ModeItem.RowNumber <= Number(Area.YCoordinate) + Number(Area.Width);
            if (!xEndInclude) {
              messageBox.failSingleError('保存失败', `第${index + 1}行数据长度超出可拼版区域`, () => null, () => null);
              return false;
            }
            if (!yEndInclude) {
              messageBox.failSingleError('保存失败', `第${index + 1}行数据宽度超出可拼版区域`, () => null, () => null);
              return false;
            }
          }
        }
      }
      return true;
    }
    function setStorage() { // 设置会话存储
      sessionStorage.setItem('pasteupTemplateSteupPage', 'true');
    }
    function savePasteupTemplate() {
      if (verification()) {
        api.getImpositionTemmplateSave(Data.addPasteupTemplateFrom).then(res => {
          if (res.data.Status === 1000) {
            const cb = () => {
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
        Data.addPasteupTemplateFrom.ModeSizeAttribute.PlateInfo.FilePath = e.Data.FilePath;
        Data.addPasteupTemplateFrom.ModeSizeAttribute.PlateInfo.AreaList = e.Data.AreaList;
        Data.addPasteupTemplateFrom.ModeSizeAttribute.PlateInfo.Length = e.Data.Length;
        Data.addPasteupTemplateFrom.ModeSizeAttribute.PlateInfo.Width = e.Data.Width;
      } else {
        messageBox.failSingleError('上传失败', e.Message, () => null, () => null);
      }
    }
    function beforeUpload(file) {
      const isLt15M = file.size / 1024 / 1024 < 15;
      if (!isLt15M) {
        // 文件过大上传失败
        messageBox.failSingleError('上传失败', '上传文件过大，请上传小于20M的文件', () => null, () => null);
      }
      return isLt15M;
    }

    onMounted(() => {
      const temp = JSON.parse(route.params.Template as string) as ImpositionTemmplate;
      if (!temp.ModeSizeAttribute) {
        temp.ModeSizeAttribute = {
          PlateInfo: {
            FilePath: '',
            Length: 0,
            Width: 0,
            AreaList: [
              {
                XCoordinate: 0,
                YCoordinate: 0,
                Length: 0,
                Width: 0,
              },
            ],
          },
          // 是否按模位
          UseMode: false,
          ModeItemList: [
            {
              XCoordinate: 0,
              YCoordinate: 0,
              Length: 0,
              Width: 0,
              RowNumber: 0,
              ColumnNumber: 0,
              key: '1',
            },
          ],
        };
      }
      if (!temp.ActualSizeAttribute) {
        temp.ActualSizeAttribute = {
          BleedTop: 0,
          BleedBottom: 0,
          BleedLeft: 0,
          BleedRight: 0,
        };
      }
      if (temp.ClassID) {
        Data.addPasteupTemplateFrom = temp;
      }
      // 获取所有分类
      if (!PasteupSettingStore.ImpositionTemmplateClassList.length) {
        PasteupSettingStore.getImpositionTemmplateClassList();
      }
    });
    return {
      Data,
      PasteupSettingStore,
      addModeItem,
      delModeItem,
      savePasteupTemplate,
      handlleUploaded,
      beforeUpload,
    };
  },

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
    >.el-form{
      margin-top: 36px;
      .el-form-item__content{
        font-size: 12px;
        .upload-demo{
          display: flex;
          height: 32px;
          .el-upload{
            margin-right: 20px;
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
            >.el-button{
              margin-left: 20px;
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
            .el-input-number{
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
            .el-input-number{
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
      width: 100px;
    }
    .el-button + .el-button{
      margin-left: 30px;
    }
  }
}
</style>
