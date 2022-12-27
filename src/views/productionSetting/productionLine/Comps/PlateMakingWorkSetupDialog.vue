<template>
  <DialogContainerComp :title="title" :visible='localVisible' :width="660" top="10vh" @submit="submit" @open="onOpen" @cancel="localVisible = false">
    <ul class="content">
      <li>
        <h4>设置制版工序：</h4>
        <el-radio-group v-model="ruleForm.PlateMakingWorkID" @change="ruleForm.PlateMakingGroupID = ''">
          <el-radio v-for="it in localPlateMakingWorkAllList" :key="it.ID" :label="it.ID" :title="it.Name">{{it.Name}}</el-radio>
        </el-radio-group>
      </li>
      <li v-show="showGroup">
        <h4>选择制版组：</h4>
        <el-radio-group v-model="ruleForm.PlateMakingGroupID">
          <el-radio v-for="it in _PlateMakingGroupList" :key="it.ID" :label="it.ID" :title="it.Name">{{it.Name}}</el-radio>
        </el-radio-group>
        <span v-show="_PlateMakingGroupList.length === 0" class="is-gray ft-12 ml-22">暂无制版组，请先添加</span>
      </li>
    </ul>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { computed, reactive } from 'vue';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import { storeToRefs } from 'pinia';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ISetPlateMakingWorkParams } from '../js/types';
import { ReportModeEnum } from '../../process/enums';

const props = defineProps<{
  visible: boolean,
  curWorkName: string
}>();

const emit = defineEmits(['update:visible', 'submited']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const productionSettingStore = useProductionSettingStore();
const { PlateMakingWorkSetupHander } = storeToRefs(productionSettingStore);

const title = computed(() => `设置制版工序：${props.curWorkName}`);

const localPlateMakingWorkAllList = computed(() => {
  if (PlateMakingWorkSetupHander.value.curWorkItem) {
    const curReportMode = PlateMakingWorkSetupHander.value.curWorkItem._WorkItemInfo.ReportMode; // 报工方式
    if (curReportMode === ReportModeEnum.board) { // 大版报工
      return PlateMakingWorkSetupHander.value.PlateMakingWorkAllList.filter(it => it.ReportMode === ReportModeEnum.board);
    }
  }

  return PlateMakingWorkSetupHander.value.PlateMakingWorkAllList;
});

const ruleForm: ISetPlateMakingWorkParams = reactive({
  LineWorkID: '',
  PlateMakingWorkID: '',
  PlateMakingGroupID: '',
});

const showGroup = computed(() => PlateMakingWorkSetupHander.value.getPlateMakingWorkCannotSetGroup(ruleForm.PlateMakingWorkID));

const _PlateMakingGroupList = computed(() => PlateMakingWorkSetupHander.value.PlateMakingGroupAllList.filter(it => it.WorkID === ruleForm.PlateMakingWorkID));

const onOpen = () => {
  ruleForm.LineWorkID = PlateMakingWorkSetupHander.value.curWorkItem?.LineWorkID || '';
  ruleForm.PlateMakingWorkID = PlateMakingWorkSetupHander.value.curWorkItem?.PlateMakingWorkID || '';
  ruleForm.PlateMakingGroupID = PlateMakingWorkSetupHander.value.curWorkItem?.PlateMakingGroupID || '';
};

const submit = () => {
  if (!ruleForm.PlateMakingGroupID && showGroup.value) {
    MpMessage.error({
      title: '保存失败',
      msg: '请选择制版组',
    });
    return;
  }
  const cb = () => {
    localVisible.value = false;
    emit('submited');
  };
  PlateMakingWorkSetupHander.value.handlePlateMakingWorkSubmit(ruleForm, cb);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.content {
  margin-top: -15px;
  padding-left: 12px;
  height: 432px;
  box-sizing: border-box;
  :deep(.el-radio) {
    margin-right: 10px;
    height: 28px;
    .el-radio__label {
      width: 10em;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  > li {
    padding-bottom: 20px;
    max-height: 185px;
    overflow: auto;
    overflow: overlay;
    @include scroll;
    h4 {
      padding-bottom: 6px;
      position: sticky;
      top: 0;
      background-color: #fff;
      z-index: 1;
    }
    .is-gray {
      line-height: 28px;
      color: #989898;
    }
  }
}
</style>
