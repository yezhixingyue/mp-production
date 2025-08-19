<template>
  <div class="mp-manual-order-second-step-right-setup-panel-comp-wrap">
    <!-- 工序列表 -->
    <table class="work-table">
      <thead>
        <tr>
          <template v-if="WorkingProcedures.length > 0">
            <span class="title">加工工序:</span>
            <mp-button link type="primary" @click="workingVisible = true">添加工序</mp-button>
            <span v-if="instanceItem.WorkingList.length === 0" class="empty is-pink">
              <el-icon><WarningFilled /></el-icon>暂无工序, 请添加工序
            </span>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="work in instanceItem.WorkingList" :key="work.ID">
          <td class="w-title" :title="work.Name">{{ work.Name }}</td>
          <td class="w-content" :title="getWorkingContent(work).replaceAll('；', '\r\n')">{{ getWorkingContent(work) }}</td>
          <td class="w-work-times" style="padding-left:15px;padding-right:0" :class="{'v-hide': WorkingTypeEnum.normal !== work.Type }">
            <span>作业次数：</span>
            <el-input v-model.number="work.WorkTimes" maxlength="3"></el-input>
            <span class="ml-5">次</span>
          </td>
          <td class="w-operator">
            <!-- <RemoveMenu class="remove" style="margin-left: 15px;" @click="onWorkRemoveClick(work)" /> -->
          </td>
        </tr>
        <tr v-if="instanceItem.WorkingList.length > 0" class="extra">
          <mp-button link type="primary" v-if="instanceItem.AssistList.some(it=>it.Type===AssistInfoTypeEnum.text)" @click="assistVisible=true">辅助信息</mp-button>
        </tr>
      </tbody>
    </table>

    <!-- 拼版文件列表 -->
    <template v-if="instanceItem.WorkingList.length > 0 && _MakeupFileList.length > 0">
      <div class="header makeup_header">
        <span class="title">拼版文件:</span>
        <el-checkbox :disabled="instanceItem._lineData?.Category === NormalLineCategoryTypeEnum.special" style="margin-right: 60px;"
          :class="{hide: isCombine}"
         :model-value="instanceItem.ForbitUnionMakeup" @change="e => instanceItem.ForbitUnionMakeup = e">禁止印刷版合拼</el-checkbox>

        <el-radio-group :class="{hide: isCombine}" :model-value="instanceItem.NeedFolding" @change="e => { instanceItem.NeedFolding = e; clearBleedSetup() }">
          <el-radio :label="false">无需折手</el-radio>
          <el-radio :label="true">设置折手</el-radio>
        </el-radio-group>

        <mp-button type="primary" class="set-fold" link :class="{v:instanceItem.NeedFolding,hide: isCombine}" @click="emit('foldingClick')"
        >设置折手参数</mp-button>

        <mp-button type="primary" link style="margin: 0 75px 0 105px" :class="{isCombine: isCombine}" @click="onFileMatchClick('makeup')">匹配拼版文件</mp-button>
        <mp-button type="primary" link :class="{hide: isCombine}" :disabled="instanceItem.NeedFolding===''" @click="bleedState.visible = true">设置出血</mp-button>
      </div>
      <table>
        <tbody>
          <tr v-for="it in _MakeupFileList" :key="it.Template?.ID || ''">
            <td class="w-title" :title="it._PlateTemplate?.Name">
              <span class="star">{{ it._PlateTemplate?.Name }}</span>
            </td>
            <td class="w-content file" :title="it.FileName" v-html="getFileNameContentHtml(it.FileName)"></td>
            <td class="w-operator">
              <MpFileSelectButton link :accept="fileAccept.pdf" :title="it.FileName ? '重新上传' : '上传文件'"
               @change="(file) => handleFileChange(file, it, instanceItem.FileList)"/>
              <!-- <mp-button type="primary" link class="ft-12" style="padding: 0;" @click="onBleedSetupClick(it)">设置出血</mp-button> -->
              <span class="is-gray ml-5" :title="getBleedContent(it, false, it._PlateTemplate)" v-html="getBleedContent(it, true, it._PlateTemplate)"></span>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <!-- 辅助文件列表 -->
    <div v-if="instanceItem.WorkingList.length > 0 && _AssistFileList.length > 0" style="margin-top: 20px;display: flex;align-items: center;">
      <span class="title">辅助文件:</span>
      <mp-button type="primary" link style="margin-left: 542px;"  class='ft-13' @click="onFileMatchClick('assist')">匹配辅助文件</mp-button>
    </div>
    <table v-if="instanceItem.WorkingList.length > 0 && _AssistFileList.length > 0">
      <tbody>
        <tr v-for="it in _AssistFileList" :key="it.NoteInfo?.ID">
          <td class="w-title" :title="it.NoteInfo?.Name"><span class="star">{{ it.NoteInfo?.Name }}</span></td>
          <td class="w-content file assist" :title="it.children.map(c => c.FileName).filter(n => n).join('\r\n')">
            <div class="assist-file-list">
              <span v-for="(file, index) in it.children" :key="index"
                v-html="getFileNameContentHtml(file.FileName, { index, len:it.children.length, digit: 4 })"></span>
            </div>
          </td>
          <td class="w-operator">
            <MpFileSelectButton link :accept="fileAccept.assist" multiple :title="it.children.length > 0 ? '重新上传' : '上传文件'"
              @change="(files)=>handleAssistUploadFileChange(files, it, instanceItem)"/>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 专色文件列表 -->
    <div v-if="instanceItem.WorkingList.length > 0 && !isCombine" style="margin-top: 20px;display: flex;align-items: center;">
      <span class="title">专色文件:</span>
      <mp-button link type="primary" class='ft-13' @click="setSpecialColorVisible">添加专色</mp-button>
      <mp-button type="primary" link  class='ft-13' style="margin-left: 484px;" @click="onFileMatchClick('color')"
       v-show="_SpecialColorFileList.length > 0">匹配专色文件</mp-button>
    </div>
    <table v-if="instanceItem.WorkingList.length > 0 && !isCombine">
      <thead>
        <tr>
          <span v-if="_SpecialColorFileList.length === 0" class="empty is-gray">
            <el-icon><InfoFilled /></el-icon>暂无专色文件，如有需要请添加
          </span>
        </tr>
      </thead>
      <tbody>
        <tr v-for="it in _SpecialColorFileList" :key="it._SpecialColorInfo?.ID">
          <td class="w-title" :title="it._SpecialColorInfo?.Name"><span class="star">{{ it._SpecialColorInfo?.Name }}</span></td>
          <td class="w-content file" :title="it.FileName" v-html="getFileNameContentHtml(it.FileName)"></td>
          <td class="w-operator">
            <MpFileSelectButton link :accept="fileAccept.pdf" :title="it.FileName ? '重新上传' : '上传文件'"
             @change="(file) => handleFileChange(file, it, instanceItem.FileList)"/>
            <RemoveMenu class="remove" @click="onColorRemoveClick(it)" />
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 数值列表 -->
    <table v-if="instanceItem.WorkingList.length > 0">
      <thead>
        <tr>
          <span class="title">设置数值:</span>
          <mp-button link type="primary" @click="setNumbericalVisible" class="ft-13">添加数值</mp-button>
          <span v-if="_NumbericalList.length === 0" class="empty is-gray">
            <el-icon><InfoFilled /></el-icon>暂未设置数值，如有需要请添加
          </span>
        </tr>
      </thead>
      <tbody>
        <tr v-for="it in _NumbericalList" :key="it.ID">
          <td class="w-title num" :title="it.Name">{{ it.Name }}</td>
          <td class="w-content num">{{ it.Value }}</td>
          <td class="w-operator">
            <mp-button link type="primary" @click="setNumbericalChange(it)">修改值</mp-button>
            <RemoveMenu class="remove" @click="onNumbericalRemoveClick(it)" />
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 添加工序 -->
    <WorkingSelectDialog
      v-model:visible="workingVisible"
      v-model="instanceItem.WorkingList"
      :workingList="WorkingProcedures"
      :isCombine="isCombine"
      :LineList="instanceItem.LineList"
      @change="handleWorkingSelect"
    />
    <!-- 设置辅助信息弹窗 -->
    <AssistInfoSetupDialog v-model="instanceItem.AssistList" v-model:visible="assistVisible" />
    <!-- 设置专色文件弹窗 -->
    <SpecialColorSelectDialog
      v-model:visible="specialColorState.visible"
      :FileList="instanceItem.FileList"
      :SpecialColorList="specialColorState.colorList"
      @submit="onSpecialColorSubmit"
    />
    <!-- 设置数值 -->
    <AssistNumbericSelectDialog
      v-model:visible="numbericalState.visible"
      :AssistList="instanceItem.AssistList"
      :AssistNumbericalList="numbericalState.AssistNumbericalList"
      @submit="onNumbericSubmit"
    />
    <AssistNumbericChangeDialog v-model:visible="numbericalState.changeVisible" :item="numbericalState.curNumbericalItem" @submit="onNumbericalChangeSubmit" />
    <!-- 出血设置 -->
    <!-- <BleedSetupDialog v-model:visible="bleedState.visible" :NeedFolding="instanceItem.NeedFolding" :fileList="_MakeupFileList"
     @submit="onBleedSetupSubmit" /> -->
    <BleedSetupDialog v-model:visible="bleedState.visible" :NeedFolding="false" :fileList="_MakeupFileList" @submit="onBleedSetupSubmit" />

    <!-- 匹配文件弹窗 -->
    <FileMatchDialog v-model:visible="fileMatchState.visible" :type="fileMatchState.type" :FileList="instanceItem.FileList" @submit="onFileMatchSubmit" />
  </div>
</template>

<script setup lang='ts'>
import { computed, ref, watch } from 'vue';
import { ILineDetailWorkingProcedure } from '@/views/productionManagePages/ManualOrderHandlerPage/js/ProductionLineDetailTypes';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import RemoveMenu from '@/components/common/menus/RemoveMenu.vue';
import MpFileSelectButton from '@/components/common/General/MpFileSelectButton.vue';
import { NormalLineCategoryTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { WorkingTypeEnum } from '@/views/productionSetting/process/enums';
import WorkingSelectDialog from './WorkingSelectDialog.vue';
import AssistInfoSetupDialog from './AssistInfoSetupDialog.vue';
import SpecialColorSelectDialog from './SpecialColorSelectDialog.vue';
import AssistNumbericSelectDialog from './AssistNumbericSelectDialog.vue';
import AssistNumbericChangeDialog from './AssistNumbericChangeDialog.vue';
import BleedSetupDialog from './BleedSetupDialog.vue';
import { PDOLineInstanceType } from '../../model/Instance';
import { getBleedContent, useBleedSetup } from './hooks/useBleedSetup';
import { getFileNameContentHtml, handleFileChange, handleAssistUploadFileChange, getAssistFileList } from './js/tools';
import { useFileMatch } from './hooks/useFileMatch';
import FileMatchDialog from './FileMatchDialog.vue';
import { useFileAccept } from './hooks/useFileAccept';
import { useSpecialColor } from './hooks/useSpecialColor';
import { useAssistNumberical } from './hooks/useAssistNumberical';

const props = defineProps<{
  modelValue: PDOLineInstanceType
  WorkingProcedures: ILineDetailWorkingProcedure[]
  isCombine?: boolean
}>();

const emit = defineEmits(['foldingClick', 'workingChange']);

const instanceItem = computed(() => props.modelValue);

/** 拼版文件列表 */
const _MakeupFileList = computed(() => instanceItem.value.FileList.filter(it => it._PlateTemplate));

/** 辅助文件列表 */
const _AssistFileList = computed(() => getAssistFileList(instanceItem.value));

/** 专色文件列表 */
const _SpecialColorFileList = computed(() => instanceItem.value.FileList.filter(it => it.ColorList && it.ColorList.length > 0));

const { fileMatchState, onFileMatchClick, onFileMatchSubmit } = useFileMatch(instanceItem);

/** 文件允许上传格式 */
const { fileAccept } = useFileAccept();

/** 数值列表 */
const _NumbericalList = computed(() => instanceItem.value.AssistList.filter(it => it.Type === AssistInfoTypeEnum.numerical));

watch(() => _MakeupFileList.value, (newVal, oldVal) => {
  if (newVal.length === 0 && oldVal.length > 0) { // 印刷工序被删除 不再显示拼版文件 清除拼版文件上面相关设置
    console.log('印刷工序被删除 不再显示拼版文件');
    if (instanceItem.value.clearInfoWhenClearPlateTemplate) instanceItem.value.clearInfoWhenClearPlateTemplate();
  }
});

/* 选择工序相关
----------------------------------- */
const workingVisible = ref(false);

const handleWorkingSelect = () => {
  instanceItem.value.handleWorkingSelect();

  emit('workingChange', instanceItem.value.WorkingList);
};

const getWorkingContent = (work: ILineDetailWorkingProcedure) => work.NoteInfos
  .filter(it => it.Type === AssistInfoTypeEnum.text)
  .map(it => instanceItem.value.AssistList.find(_it => _it.ID === it.ID))
  .filter(it => it && it.Content)
  .map(it => `${it?.Name}：${it?.Content}`)
  .join('；');

const { bleedState, onBleedSetupSubmit, clearBleedSetup } = useBleedSetup(_MakeupFileList);

/* 设置辅助信息相关
----------------------------------- */
const assistVisible = ref(false);

/* 设置专色文件相关
----------------------------------- */
const { specialColorState, setSpecialColorVisible, onSpecialColorSubmit, onColorRemoveClick } = useSpecialColor(instanceItem);

/* 设置数值相关
----------------------------------- */
const {
  numbericalState, setNumbericalVisible, onNumbericSubmit, onNumbericalRemoveClick, onNumbericalChangeSubmit, setNumbericalChange,
} = useAssistNumberical(instanceItem);

</script>

<style scoped lang='scss'>
.mp-manual-order-second-step-right-setup-panel-comp-wrap {
  width: 1025px;
  padding-left: 20px;
  padding-bottom: 20px;
  box-sizing: border-box;
  text-align: left;
  > table {
    margin-top: 2px;
    width: 960px;
    border-collapse: collapse;
    > thead > tr {
      line-height: 32px;
      button {
        padding: 0;
        border: none;
        line-height: 30px;
        vertical-align: top;
      }

      :deep(.el-checkbox__label) {
        font-size: 14px;
      }
      .empty {
        display: flex;
        align-items: center;
        position: relative;
        top: 1px;
        i {
          font-size: 14px;
          margin-right: 5px;
          margin-left: 25px;
        }
      }
    }
    > tbody {
      > tr {
        height: 40px;
        border: 1px solid #E5E5E5;
        transition: background-color 0.1s ease-in-out;
        &:nth-of-type(even) {
          background-color: #f5f5f5;
        }
        &:hover {
          background-color: lighten($color: #26bcf9, $amount: 40);
        }
        &.extra {
          border: none;
          background-color:rgba(0, 0, 0, 0);
          height: 20px;
          position: relative;
          > button {
            position: absolute;
            right: 2px;
            top: 6px;
            font-size: 13px;
          }
        }
        > td {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          box-sizing: border-box;
          padding: 0 10px;
          font-size: 13px;
          &.w-title {
            padding-left: 50px;
            width: 196px;
            max-width: 196px;
            // &.num {
            //   max-width: unset;
            //   width: 296px;
            //   max-width: 296px;
            // }
          }
          &.w-content {
            width: 420px;
            max-width: 420px;
            padding-right: 20px;
            &.file {
              :deep(> em) {
                width: 72px;
              }
              :deep(> i) {
                max-width: calc(100% - 72px);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                display: inline-block;
                vertical-align: top;
              }
            }
            // &.num {
            //   width: 320px;
            //   max-width: 320px;
            // }

            &.assist {
              .assist-file-list {
                display: flex;
                overflow: hidden;
                align-items: center;
                > span {
                  flex: 0 1 auto;
                  overflow: hidden;
                  display: flex;
                  margin-right: 3px;

                  :deep(> em) {
                    // width: 6em;
                    flex: none;
                  }
                  :deep(> i) {
                    flex: 0 1 auto;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    display: inline-block;
                    vertical-align: top;
                  }
                }
              }
            }
          }
          &.w-work-times {
            width: 150px;
            .el-input {
              width: 55px;
            }

            &.v-hide {
              * {
                visibility: hidden;
                display: none;
              }
            }
          }
          &.w-operator {
            // width: 239px;
            padding-left: 10px;
            .remove {
              margin-left: 70px;
            }
            :deep(.select-file-button-dom) {
              font-size: 12px;
            }

            > span {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              display: inline-block;
              vertical-align: middle;
              width: 265px;
              max-width: 265px;
              font-size: 12px;
              text-align: center
            }
          }
        }
      }
    }
  }

  .work-table {
    .w-content {
      width: 500px;
    }
  }

  .title {
    font-weight: 700;
    margin-right: 10px;
    font-size: 14px;
    line-height: 30px;
    display: inline-block;
    height: 30px;
    vertical-align: top;
  }

  .header.makeup_header {
    display: flex;
    align-items: center;
    margin-top: 18px;
    & + table {
      margin-top: 2px;
    }

    > label {
      margin-right: 0;
      margin-left: 15px;
    }

    .makeup_size {
      padding-left: 16px;
      width: 160px;
    }

    button {
      font-size: 13px;
      margin-left: 0px;
    }

    .set-fold {
      visibility: hidden;
      &.v {
        visibility: visible;
      }
    }

    .el-radio {
      margin-right: 16px;
    }
    :deep(.el-radio__label) {
      color: #585858;
    }
  }

  .hide {
    visibility: hidden;
  }
  .isCombine {
    margin-left: 542px !important;
  }

  .star::before {
    font-weight: 700;
  }
}
</style>
