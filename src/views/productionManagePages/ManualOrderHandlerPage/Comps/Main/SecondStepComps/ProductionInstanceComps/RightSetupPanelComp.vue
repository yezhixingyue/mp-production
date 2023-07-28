<template>
  <div class="mp-manual-order-second-step-right-setup-panel-comp-wrap">
    <!-- 工序列表 -->
    <table class="work-table">
      <thead>
        <tr>
          <template v-if="WorkingProcedures.length > 0">
            <span class="title">代加工工序:</span>
            <mp-button link type="primary" @click="workingVisible = true">添加工序</mp-button>
            <span v-if="itemData.WorkingList.length === 0" class="empty is-pink">
              <el-icon><WarningFilled /></el-icon>暂无工序, 请添加工序
            </span>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="work in itemData.WorkingList" :key="work.ID">
          <td class="w-title" :title="work.Name">{{ work.Name }}</td>
          <td class="w-content" :title="getWorkingContent(work).replaceAll('；', '\r\n')">{{ getWorkingContent(work) }}</td>
          <td class="w-work-times" style="padding-left:15px;padding-right:0">
            <span>作业次数：</span>
            <el-input v-model.number="work.WorkTimes" maxlength="3"></el-input>
            <span class="ml-5">次</span>
          </td>
          <td class="w-operator">
            <RemoveMenu class="remove" style="margin-left: 15px;" @click="onWorkRemoveClick(work)" />
          </td>
        </tr>
        <tr v-if="itemData.WorkingList.length > 0" class="extra">
          <mp-button link type="primary" @click="assistVisible = true">辅助信息</mp-button>
        </tr>
      </tbody>
    </table>
    <!-- 拼版文件列表 -->
    <template v-if="itemData.WorkingList.length > 0 && !isCombine && _MakeupFileList.length > 0">
      <div class="header makeup_header">
        <span class="title">拼版文件:</span>
        <el-checkbox :model-value="itemData.ForbitUnionMakeup" @change="e => itemData.ForbitUnionMakeup = e">禁止印刷版合拼</el-checkbox>
        <div class="makeup_size">
          <el-checkbox v-if="itemData.ForbitUnionMakeup"
           :model-value="itemData.NeedSetPlateSize" @change="e => itemData.NeedSetPlateSize = e">手动设置拼版尺寸</el-checkbox>
        </div>
        <el-checkbox :model-value="itemData.NeedFolding" @change="e => itemData.NeedFolding = e">需要折手</el-checkbox>
        <mp-button type="primary" link v-show="itemData.NeedFolding" @click="onFoldingClick">设置折手参数</mp-button>
      </div>
      <table>
        <tbody>
          <tr v-for="it in _MakeupFileList" :key="it.Template?.ID || ''">
            <td class="w-title" :title="it._PlateTemplate?.Name">{{ it._PlateTemplate?.Name }}</td>
            <td class="w-content file" :title="it._File?.name || ''">
              <i v-if="it._File && it._File.name.length > 6">{{ it._File.name.slice(0, -6) }}</i>
              <i v-else>{{ it._File?.name || '' }}</i>
              <em v-if="it._File && it._File.name.length > 6">{{ it._File.name.slice(-6) }}</em>
            </td>
            <td class="w-operator">
              <MpFileSelectButton link :accept="ManualOrderHandlerPageData?._fileAccept.pdf" @change="(file) => handleFileChange(file, it, itemData.FileList)"/>
              <mp-button type="primary" link class="ft-12" style="padding: 0;" @click="onBleedSetupClick(it)">设置出血</mp-button>
              <span class="is-gray ml-5" :title="getBleedContent(it)">{{ getBleedContent(it) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <!-- 辅助文件列表 -->
    <table v-if="itemData.WorkingList.length > 0 && _AssistFileList.length > 0">
      <thead>
        <tr>
          <span class="title">辅助文件:</span>
        </tr>
      </thead>
      <tbody>
        <tr v-for="it in _AssistFileList" :key="it._NoteInfo?.ID">
          <td class="w-title" :title="it._NoteInfo?.Name">{{ it._NoteInfo?.Name }}</td>
          <td class="w-content file" :title="it._File?.name || ''">
            <i v-if="it._File && it._File.name.length > 6">{{ it._File.name.slice(0, -6) }}</i>
            <i v-else>{{ it._File?.name || '' }}</i>
            <em v-if="it._File && it._File.name.length > 6">{{ it._File.name.slice(-6) }}</em>
          </td>
          <td class="w-operator">
            <MpFileSelectButton link :accept="ManualOrderHandlerPageData?._fileAccept.assist"
              @change="(file)=>handleFileChange(file, it, itemData.FileList)"/>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 专色文件列表 -->
    <table v-if="itemData.WorkingList.length > 0 && !isCombine">
      <thead>
        <tr>
          <span class="title">专色文件:</span>
          <mp-button link type="primary" @click="setSpecialColorVisible">添加专色</mp-button>
          <span v-if="_SpecialColorFileList.length === 0" class="empty is-gray">
            <el-icon><InfoFilled /></el-icon>暂无专色文件，如有需要请添加
          </span>
        </tr>
      </thead>
      <tbody>
        <tr v-for="it in _SpecialColorFileList" :key="it._SpecialColorInfo?.ID">
          <td class="w-title" :title="it._SpecialColorInfo?.Name">{{ it._SpecialColorInfo?.Name }}</td>
          <td class="w-content file" :title="it._File?.name || ''">
            <i v-if="it._File && it._File.name.length > 6">{{ it._File.name.slice(0, -6) }}</i>
            <i v-else>{{ it._File?.name || '' }}</i>
            <em v-if="it._File && it._File.name.length > 6">{{ it._File.name.slice(-6) }}</em>
          </td>
          <td class="w-operator">
            <MpFileSelectButton link :accept="ManualOrderHandlerPageData?._fileAccept.pdf" @change="(file) => handleFileChange(file, it, itemData.FileList)"/>
            <RemoveMenu class="remove" @click="onColorRemoveClick(it)" />
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 数值列表 -->
    <table v-if="itemData.WorkingList.length > 0">
      <thead>
        <tr>
          <span class="title">设置数值:</span>
          <mp-button link type="primary" @click="setNumbericalVisible">添加数值</mp-button>
          <span v-if="_NumbericalList.length === 0" class="empty is-gray">
            <el-icon><InfoFilled /></el-icon>暂未设置数值，如有需要请添加
          </span>
        </tr>
      </thead>
      <tbody>
        <tr v-for="it in _NumbericalList" :key="it.ID">
          <td class="w-title num" :title="it._Name">{{ it._Name }}</td>
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
      v-model="itemData.WorkingList"
      :workingList="WorkingProcedures"
      @change="handleWorkingSelect"
    />
    <!-- 设置辅助信息弹窗 -->
    <AssistInfoSetupDialog v-model="itemData.AssistList" v-model:visible="assistVisible" />
    <!-- 设置专色文件弹窗 -->
    <SpecialColorSelectDialog
      v-model:visible="specialColorVisible"
      :FileList="itemData.FileList"
      :SpecialColorList="ManualOrderHandlerPageData?.SpecialColorList || []"
      @submit="onSpecialColorSubmit"
    />
    <!-- 设置数值 -->
    <AssistNumbericSelectDialog
      v-model:visible="numbericalVisible"
      :AssistList="itemData.AssistList"
      :AssistNumbericalList="ManualOrderHandlerPageData?.AssistNumbericalList || []"
      @submit="onNumbericSubmit"
    />
    <AssistNumbericChangeDialog v-model:visible="numbericalChangeVisible" :item="curNumbericalItem" @submit="onNumbericalChangeSubmit" />
    <!-- 出血设置 -->
    <BleedSetupDialog v-model:visible="fileBleedVisible" :fileItem="curFileItem" @submit="onBleedSetupSubmit" />
  </div>
</template>

<script setup lang='ts'>
import { computed, ref, watch } from 'vue';
import { PlaceOrderProductionInstance } from '@/views/productionManagePages/ManualOrderHandlerPage/js/PlaceOrderProductionInstance';
import { ManualOrderHandlerPageData } from '@/views/productionManagePages/ManualOrderHandlerPage/js';
import { ILineDetailWorkingProcedure } from '@/views/productionManagePages/ManualOrderHandlerPage/js/ProductionLineDetailTypes';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IConvertAssistInfo, IConvertOrderFile, IPrintColor } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { handleFileChange, getBleedContent } from '@/views/productionManagePages/ManualOrderHandlerPage/js/utils';
import RemoveMenu from '@/components/common/menus/RemoveMenu.vue';
import MpFileSelectButton from '@/components/common/General/MpFileSelectButton.vue';
import WorkingSelectDialog from './WorkingSelectDialog.vue';
import AssistInfoSetupDialog from './AssistInfoSetupDialog.vue';
import SpecialColorSelectDialog from './SpecialColorSelectDialog.vue';
import AssistNumbericSelectDialog from './AssistNumbericSelectDialog.vue';
import AssistNumbericChangeDialog from './AssistNumbericChangeDialog.vue';
import BleedSetupDialog from './BleedSetupDialog.vue';

interface IPropsModelValue extends Pick<PlaceOrderProductionInstance,
 'AssistList' | 'FileList' | 'WorkingList' | 'handleWorkingSelect' | 'handleNumbericChange'> {
  clearInfoWhenClearPlateTemplate?: PlaceOrderProductionInstance['clearInfoWhenClearPlateTemplate']
  handleSpecialColorChange?: PlaceOrderProductionInstance['handleSpecialColorChange']
  ForbitUnionMakeup?: PlaceOrderProductionInstance['ForbitUnionMakeup']
  NeedSetPlateSize?: PlaceOrderProductionInstance['NeedSetPlateSize']
  ColorList?: PlaceOrderProductionInstance['ColorList']
  NeedFolding?: PlaceOrderProductionInstance['NeedFolding']
}

const props = defineProps<{
  modelValue: IPropsModelValue
  index: number | ''
  WorkingProcedures: ILineDetailWorkingProcedure[]
  isCombine?: boolean
}>();

const emit = defineEmits(['foldingClick']);

const itemData = computed(() => props.modelValue);

/** 拼版文件列表 */
const _MakeupFileList = computed(() => itemData.value.FileList.filter(it => it._PlateTemplate));

/** 辅助文件列表 */
const _AssistFileList = computed(() => itemData.value.FileList.filter(it => it._NoteInfo));

/** 专色文件列表 */
const _SpecialColorFileList = computed(() => itemData.value.FileList.filter(it => it.SpecialColorList));

/** 数值列表 */
const _NumbericalList = computed(() => itemData.value.AssistList.filter(it => it.Type === AssistInfoTypeEnum.numerical));

const onFoldingClick = () => {
  emit('foldingClick');
};

watch(() => _MakeupFileList.value, (newVal, oldVal) => {
  if (newVal.length === 0 && oldVal.length > 0) { // 印刷工序被删除 不再显示拼版文件 清除拼版文件上面相关设置
    console.log('印刷工序被删除 不再显示拼版文件');
    if (itemData.value.clearInfoWhenClearPlateTemplate) itemData.value.clearInfoWhenClearPlateTemplate();
  }
});

/* 选择工序相关
----------------------------------- */
const workingVisible = ref(false);

const handleWorkingSelect = () => {
  itemData.value.handleWorkingSelect(props.index);
};

const getWorkingContent = (work: ILineDetailWorkingProcedure) => work.NoteInfos
  .filter(it => it.Type === AssistInfoTypeEnum.text)
  .map(it => itemData.value.AssistList.find(_it => _it.ID === it.ID))
  .filter(it => it && it.Content)
  .map(it => `${it?._Name}：${it?.Content}`)
  .join('；');

const onWorkRemoveClick = (work: ILineDetailWorkingProcedure) => {
  MpMessage.warn({
    title: '确定删除该工序吗',
    msg: `工序名称: [ ${work.Name} ]`,
    onOk: () => {
      const t = itemData.value.WorkingList.find(it => it.ID === work.ID);
      if (t) {
        t.WorkTimes = '';
      }
      itemData.value.WorkingList = itemData.value.WorkingList.filter(it => it.ID !== work.ID);
      handleWorkingSelect();
    },
  });
};

/* 设置辅助信息相关
----------------------------------- */
const assistVisible = ref(false);

/* 设置专色文件相关
----------------------------------- */
const specialColorVisible = ref(false);

const setSpecialColorVisible = async () => {
  if (ManualOrderHandlerPageData.value) {
    await ManualOrderHandlerPageData.value.getSpecialColorList();
    specialColorVisible.value = true;
  }
};

const onSpecialColorSubmit = (list: IPrintColor[]) => {
  if (itemData.value.handleSpecialColorChange) itemData.value.handleSpecialColorChange(list, props.index);
};

const onColorRemoveClick = (color: IConvertOrderFile) => {
  MpMessage.warn({
    title: '确定删除该专色吗',
    msg: `专色名称: [ ${color._SpecialColorInfo?.Name} ]`,
    onOk: () => {
      const list = itemData.value.FileList.map(it => it._SpecialColorInfo).filter(it => it && it.ID !== color._SpecialColorInfo?.ID) as IPrintColor[];
      onSpecialColorSubmit(list);
    },
  });
};

/* 设置数值相关
----------------------------------- */
const numbericalVisible = ref(false);

const setNumbericalVisible = async () => {
  if (ManualOrderHandlerPageData.value) {
    await ManualOrderHandlerPageData.value.getAssistNumbericalList();
    numbericalVisible.value = true;
  }
};

const onNumbericSubmit = (list: IConvertAssistInfo[]) => {
  itemData.value.handleNumbericChange(list);
};

const onNumbericalRemoveClick = (it: IConvertAssistInfo) => {
  MpMessage.warn({
    title: '确定删除该数值吗',
    msg: `名称: [ ${it._Name} ]`,
    onOk: () => {
      const list = itemData.value.AssistList.filter(_it => _it && _it.Type === AssistInfoTypeEnum.numerical && _it.ID !== it.ID);
      onNumbericSubmit(list);
    },
  });
};

const numbericalChangeVisible = ref(false);

const curNumbericalItem = ref<null | IConvertAssistInfo>(null);

const setNumbericalChange = (it: IConvertAssistInfo) => {
  curNumbericalItem.value = it;
  numbericalChangeVisible.value = true;
};

const onNumbericalChangeSubmit = (data: { ID: string, Value: number }) => {
  if (curNumbericalItem.value) {
    curNumbericalItem.value.Value = data.Value;
  }
};

/* 设置数值相关
----------------------------------- */
const curFileItem = ref<null | IConvertOrderFile>(null);
const fileBleedVisible = ref(false);
const onBleedSetupClick = (item: IConvertOrderFile) => {
  curFileItem.value = item;
  fileBleedVisible.value = true;
};
const onBleedSetupSubmit = (e: Required<Pick<IConvertOrderFile, 'BleedBottom' | 'BleedLeft' | 'BleedRight' | 'BleedTop'>>) => {
  if (!curFileItem.value) return;

  curFileItem.value.BleedBottom = +e.BleedBottom;
  curFileItem.value.BleedLeft = +e.BleedLeft;
  curFileItem.value.BleedRight = +e.BleedRight;
  curFileItem.value.BleedTop = +e.BleedTop;

  fileBleedVisible.value = false;
};

</script>

<style scoped lang='scss'>
.mp-manual-order-second-step-right-setup-panel-comp-wrap {
  width: 925px;
  padding-left: 20px;
  padding-bottom: 20px;
  box-sizing: border-box;
  text-align: left;
  > table {
    margin-top: 18px;
    width: 855px;
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
              > em {
                width: 72px;
              }
              > i {
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
          }
          &.w-work-times {
            width: 150px;
            .el-input {
              width: 55px;
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
              max-width: 100px;
            }
          }
        }
      }
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
      margin-left: 16px;
    }
    :deep(.el-checkbox__label) {
      color: #444;
      font-size: 13px;
    }
  }
}
</style>
