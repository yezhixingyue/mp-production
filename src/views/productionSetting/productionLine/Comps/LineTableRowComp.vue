<template>
  <li class="table-main" :class="{hs: item._isAfterSplitFirst, split: item._isSplit}">
    <div class="process-item">
      <span class="process" :title="getProcessTips(item)">{{item._WorkName}}</span>
      <span class="equipment ft-f-12" :title="item._EquipmentText ? item._EquipmentText.replaceAll(' | ', '\r\n') : ''">
        {{item._EquipmentText}}
      </span>
      <!-- <span class="work" v-if="type==='normal'" :title="item._PlateMakingWorkContent"> -->
      <span class="work" :title="item._PlateMakingWorkContent">
        {{item._PlateMakingWorkContent}}
      </span>
      <span class="operate" :class="type">
        <!-- <mp-button type="primary" class="ft-12" :class="{h: item._isSplit}" v-if="type==='normal'" link @click="setPlateMakingWork">设置制版工序</mp-button> -->
        <mp-button type="primary" class="ft-12" link :class="{h: item._isSplit}" @click="setPlateMakingWork" :disabled="!canSetPMWork"
          :title="!canSetPMWork ? '物料来源中设置有版材才可设置制版工序' : ''">设置制版工序</mp-button>
        <mp-button type="primary" class="ft-12" link @click="ToEquipment">选择设备/工厂</mp-button>
        <mp-button type="primary" class="ft-12" link :class="{h: item._isSplit}"
        :disabled="!!(
          (!item.MaterialSources || item.MaterialSources.length===0)
          &&
          (item.PlateMakingGroupID||!item.PlateMakingMaterialSources||item.PlateMakingMaterialSources.length===0))"
          @click="ToMaterialSource">物料来源</mp-button>
        <mp-button type="danger" class="ft-12" link @click="delLineWorking">删除</mp-button>
      </span>
    </div>
    <!-- 物料来源 -->
    <div class="material-source" v-if="(item.MaterialSources && !item._isSplit)">
      <!-- {{item.MaterialSources}} -->
      <div :title="item._MaterialSourcesContent">
        <h4 v-if="item.PlateMakingMaterialSources" class="mr-5">[ 工序本身 ]</h4>
        <template v-for="material in item.MaterialSources" :key="material.MaterialTypeID">
          <p>{{getMaterialName(material.MaterialTypeID)}}：
            <span>
              {{getSourceWork(material, [..._summaryWorkList,...PlateMakingWorkSetupHander.PlateMakingWorkAllList])}}
              <i v-if="!getSourceWork(material, [..._summaryWorkList,...PlateMakingWorkSetupHander.PlateMakingWorkAllList])" class="is-gray">来源未设置</i>
              <template v-if="item.PlateMakingMaterialSources"> ；</template>
            </span>
          </p>
        </template>
        <p v-if="item.MaterialSources.length === 0">
          <span class="is-gray">暂无物料</span>
        </p>
      </div>
      <div v-if="item.PlateMakingMaterialSources && item.PlateMakingMaterialSources.length > 0"
          :title="item._PlateMakingMaterialSourcesContent">
        <h4 class="mr-5">[ {{item._PlateMakingWorkContent}} ]</h4>
        <template v-for="material in item.PlateMakingMaterialSources" :key="material.MaterialTypeID">
          <p>{{getMaterialName(material.MaterialTypeID)}}：
            <span>
              {{getSourceWork(material, [..._summaryWorkList,...PlateMakingWorkSetupHander.PlateMakingWorkAllList])}}
              <i v-if="!getSourceWork(material, [..._summaryWorkList,...PlateMakingWorkSetupHander.PlateMakingWorkAllList])" class="is-gray">来源未设置</i>
            </span>
          </p>
        </template>
      </div>
    </div>
  </li>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { getSourceWork } from '../../js/utils';
import { IWorkingProcedureSearch } from '../../PlateMakingGroupView/js/types';
import { ILocalProductionLineWorkings } from '../js/types';
import { getIsOrNotShowAllowUnionImposition } from '../../process/getIsOrNotShowAllowUnionImposition';

const props = defineProps<{
  item: ILocalProductionLineWorkings,
  type: 'combine' | 'normal'
  _summaryWorkList: IWorkingProcedureSearch[]
}>();

const emit = defineEmits(['setPlateMakingWork', 'ToEquipment', 'ToMaterialSource', 'delLineWorking', 'onSplitWorkingRemove']);

const productionSettingStore = useProductionSettingStore();
const { PlateMakingWorkSetupHander, MaterialTypeGroup } = storeToRefs(productionSettingStore);

// 获取物料名
const getMaterialName = (ID) => productionSettingStore.MaterialTypeGroup.find(it => it.ID === ID)?.Name;

const canSetPMWork = computed(() => props.item.MaterialSources.find(it => { // 该工序的物料来源中是否包含有版材
  const t = MaterialTypeGroup.value.find(m => m.ID === it.MaterialTypeID);
  return t && t.IsPlateMaterial;
}));

const setPlateMakingWork = () => {
  if (props.item._isSplit) return;
  emit('setPlateMakingWork', props.item);
};

const ToEquipment = () => {
  emit('ToEquipment', props.item);
};

const ToMaterialSource = () => {
  if (props.item._isSplit) return;
  emit('ToMaterialSource', props.item);
};

const delLineWorking = () => {
  MpMessage.warn({
    title: '确定要删除此工序吗？',
    msg: `[ ${props.item._WorkName} ]`,
    onOk: () => {
      if (props.item._isSplit) {
        emit('onSplitWorkingRemove', props.item);
        return;
      }
      emit('delLineWorking', props.item);
    },
  });
};

const getProcessTips = (item: ILocalProductionLineWorkings) => {
  let _AllowUnionImpositionText = '';

  if (item._WorkItemInfo && getIsOrNotShowAllowUnionImposition(item._WorkItemInfo)) {
    _AllowUnionImpositionText = `\r\n是否允许合拼：${item._WorkItemInfo.AllowUnionImposition ? '允许' : '不允许'}`;
  }

  return `${item._WorkName}\r\n报工方式：${item._ReportModeContent}\r\n工序类型：${item._WorkingTypeContent}${_AllowUnionImpositionText}`;
};

</script>

<style scoped lang='scss'>
.process {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
