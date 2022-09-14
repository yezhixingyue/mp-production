<template>
  <div class="pasteup-template-steup-page" >
    <header>
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ path: '/pasteupTemplate' }">拼版模板</el-breadcrumb-item>
        <el-breadcrumb-item>{{'添加=或=编辑'}}拼版模板： {{'某拼版模板'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </header>
    <main :style="`height:${h}px`">
      <p class="title">编辑拼版模板</p>
      <el-form :model="Data.addPasteupTemplateFrom" label-width="100px">
        <el-form-item :label="`分类：`">

        </el-form-item>
        <el-form-item :label="`名称：`" class="form-item-required template-name">
          <el-input v-model="Data.addPasteupTemplateFrom.name" placeholder="请输入"></el-input>
          <div>
            <p>
              <el-checkbox v-model="Data.addPasteupTemplateFrom.printingEdition" label="印刷版"/>
              <el-checkbox v-model="Data.addPasteupTemplateFrom.printingEditionAccordance" label="和印刷版保持一致" style="--el-checkbox-font-size: 12px"/>
            </p>
            <p>
              每个生产线仅允许有一个印刷版，请不要把非印刷版设置为印刷版。
            </p>
          </div>
        </el-form-item>
        <!-- 是否为 和印刷版布局保持一致 -->
        <template v-if="!Data.addPasteupTemplateFrom.printingEditionAccordance">

          <!-- 是否为 印刷版 -->
          <template v-if="Data.addPasteupTemplateFrom.printingEdition">
            <el-form-item :label="`翻版方式：`" class="form-item-required">
              <el-radio-group v-model="Data.addPasteupTemplateFrom.aReplicaWay">
                <el-radio :label="1">正反版</el-radio>
                <el-radio :label="2">自翻版</el-radio>
                <el-radio :label="3">滚翻版</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
          <el-form-item :label="`尺寸：`" class="form-item-required">
            <el-radio-group v-model="Data.addPasteupTemplateFrom.size">
              <el-radio :label="1">按模板尺寸</el-radio>
              <el-radio :label="2">按实际拼版尺寸</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 是否为 按模板尺寸 -->
          <template v-if="Data.addPasteupTemplateFrom.size === 1">
            <el-form-item :label="`模板文件：`" class="form-item-required">

            </el-form-item>
            <el-form-item :label="`拼版方式：`" class="form-item-required">
              <el-checkbox v-model="Data.addPasteupTemplateFrom.isTemplateLocation" label="按模位" />
            </el-form-item>
            <div v-if="Data.addPasteupTemplateFrom.isTemplateLocation" class="template-location-list">
              <el-button type="primary" link>+ 添加一行</el-button>
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
              <ul>
                <li>
                  <span class="coord">
                    <span class="coord-item">
                      <span class="dark">x：</span><el-input></el-input> mm
                    </span>
                    <span class="coord-item">
                      <span class="dark">y：</span><el-input></el-input> mm
                    </span>
                  </span>
                  <span class="size">
                    <span class="dark">长：</span><el-input></el-input> mm <i>X</i> <span class="dark">宽：</span><el-input></el-input> mm
                  </span>
                  <span class="row">
                    <el-input></el-input> 行
                  </span>
                  <span class="col">
                    <el-input></el-input> 列
                  </span>
                  <span class="handle">
                    <el-button type="danger" link>删除</el-button>
                  </span>
                </li>
                <li></li>
              </ul>
            </div>
          </template>
          <!-- 是否为 按实际拼版尺寸 -->
          <template v-if="Data.addPasteupTemplateFrom.size === 2">
            <el-form-item :label="`白边：`" class="form-item-required white-edge">
              <ul>
                <li>上: <el-input size="small"></el-input> mm</li>
                <li>左: <el-input size="small"></el-input> mm</li>
                <li>右: <el-input size="small"></el-input> mm</li>
                <li>下: <el-input size="small"></el-input> mm</li>
              </ul>
            </el-form-item>
          </template>
        </template>
      </el-form>
    </main>
    <footer>
      <el-button
      type="primary">保存</el-button>
      <el-button @click="$goback">返回</el-button>
    </footer>
  </div>
</template>

<script lang='ts'>
import {
  ref, reactive, onMounted, watch, onActivated,
} from 'vue';

import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import api from '@/api/request/MaterialStorage';
import messageBox from '@/assets/js/utils/message';
import { useCommonStore } from '@/store/modules/common';

export default {
  name: 'pasteupTemplateSteupPage',
  components: {
  },
  setup() {
    const h = ref(0);
    const CommonStore = useCommonStore();
    const Data = reactive({
      addPasteupTemplateFrom: {
        classify: '',
        name: '',
        // 印刷版
        printingEdition: false,
        // 和印刷版保持一致
        printingEditionAccordance: false,
        // 翻版方式
        aReplicaWay: 0,
        // 尺寸
        size: 1,
        // 模板文件
        templateFile: '',
        // 是否按模位
        isTemplateLocation: false,
        templateLocations: [],
      },
    });

    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.pasteup-template-steup-page > header', 122);
    }
    watch(() => CommonStore.size, () => {
      setHeight();
    });
    onActivated(() => {
      setHeight();
    });
    onMounted(() => {
      setHeight();
    });
    return {
      h,
      Data,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.pasteup-template-steup-page{
  font-size: 12px;
  >header{
    padding: 20px;
    padding-bottom: 0;
  }
  >main{
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
            }
          }
          li:first-child{
            width: 131px;
          }
        }
      }
      .template-location-list{
        .table-title, ul, li{
          width: 780px;
          display: flex;
          .coord{
            width: 260px;
          }
          .size{
            width: 250px;
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
              width: 50px;
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
  }
}
</style>
