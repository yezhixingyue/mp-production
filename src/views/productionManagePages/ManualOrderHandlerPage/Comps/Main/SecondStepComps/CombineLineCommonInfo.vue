<template>
  <div v-if="combineData && combineData._curCombineLine" class="combine-line-common-info-wrap">
    <p class="mt-10">
      <span class="title ft-14">成品尺寸:</span>
      <el-input v-model.trim="combineData.Attribute.Size" maxlength="40" style="width: 290px;"></el-input>
    </p>
    <table class="work-table">
      <thead>
        <tr>
          <span class="title">代加工工序:</span>
          <mp-button link type="primary" @click="workingVisible = true">添加工序</mp-button>
          <span v-if="combineData.WorkingList.length === 0" class="empty is-pink">
            <el-icon><WarningFilled /></el-icon>暂无工序, 请添加工序
          </span>
        </tr>
      </thead>
      <tbody>
        <tr v-for="work in combineData.WorkingList" :key="work.ID">
          <td class="w-title" :title="work.Name">{{ work.Name }}</td>
          <td class="w-content" :title="getWorkingContent(work).replaceAll('；', '\r\n')">{{ getWorkingContent(work) }}</td>
          <td class="w-operator">
            <RemoveMenu class="remove" @click="onWorkRemoveClick(work)" />
          </td>
        </tr>
        <tr v-if="combineData.WorkingList.length > 0" class="extra">
          <mp-button link type="primary" @click="assistVisible = true">辅助信息</mp-button>
        </tr>
      </tbody>
    </table>
    <!-- 辅助文件列表 -->
    <table v-if="ManualOrderHandlerPageData && combineData.WorkingList.length > 0 && _AssistFileList.length > 0">
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
            <MpFileSelectButton link :accept="''" @change="(file) => it._File = file" />
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 设置辅助信息弹窗 -->
    <AssistInfoSetupDialog v-model="combineData.AssistList" v-model:visible="assistVisible" />
    <!-- 添加工序 -->
    <WorkingSelectDialog
      v-model:visible="workingVisible"
      v-model="combineData.WorkingList"
      :workingList="combineData._curCombineLine?.Detail.WorkingProcedures || []"
      @change="handleWorkingSelect"
    />
    <!-- 设置辅助信息弹窗 -->
    <!-- <AssistInfoSetupDialog v-model="itemData.AssistList" v-model:visible="assistVisible" /> -->
  </div>
</template>

<script setup lang='ts'>
import { ref, computed } from 'vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import RemoveMenu from '@/components/common/menus/RemoveMenu.vue';
import MpFileSelectButton from '@/components/common/General/MpFileSelectButton.vue';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { ManualOrderHandlerPageData } from '../../../js';
import WorkingSelectDialog from './ProductionInstanceComps/WorkingSelectDialog.vue';
import AssistInfoSetupDialog from './ProductionInstanceComps/AssistInfoSetupDialog.vue';
import { ILineDetailWorkingProcedure } from '../../../js/ProductionLineDetailTypes';

const combineData = computed(() => ManualOrderHandlerPageData.value?.CreateOrderInfo);

const workingVisible = ref(false);

const handleWorkingSelect = () => {
  combineData.value?.handleCombineWorkingSelect();
};

/** 辅助文件列表 */
const _AssistFileList = computed(() => combineData.value?.FileList.filter(it => it._NoteInfo) || []);

const assistVisible = ref(false);

const onWorkRemoveClick = (work: ILineDetailWorkingProcedure) => {
  MpMessage.warn({
    title: '确定删除该工序吗',
    msg: `工序名称: [ ${work.Name} ]`,
    onOk: () => {
      if (!combineData.value) return;
      combineData.value.WorkingList = combineData.value.WorkingList.filter(it => it.ID !== work.ID);
      handleWorkingSelect();
    },
  });
};

const getWorkingContent = (work: ILineDetailWorkingProcedure) => work.NoteInfos
  .filter(it => it.Type === AssistInfoTypeEnum.text)
  .map(it => combineData.value?.AssistList.find(_it => _it.ID === it.ID))
  .filter(it => it && it.Content)
  .map(it => `${it?._Name}：${it?.Content}`)
  .join('；');

</script>

<style scoped lang='scss'>
.combine-line-common-info-wrap {
  width: 855px;
  margin: 0 auto;
  margin-bottom: 20px;
  .title {
    font-weight: 700;
    flex: none;
    margin-right: 10px;
    font-size: 14px;
  }
  > table {
    margin-top: 18px;
    width: 855px;
    border-collapse: collapse;
    > thead > tr {
      display: flex;
      align-items: center;
      padding-bottom: 4px;

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
          }
          &.w-content {
            width: 420px;
            max-width: 420px;
            padding-right: 20px;
            text-align: left;
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
          }
        }
      }
    }
    &.work-table > tbody > tr > td {
      &.w-content {
        width: 475px;
        max-width: 475px;
      }
    }
  }
}
</style>
