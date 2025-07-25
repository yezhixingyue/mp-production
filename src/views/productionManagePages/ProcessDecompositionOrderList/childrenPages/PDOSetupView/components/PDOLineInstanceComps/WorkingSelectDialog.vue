<template>
  <DialogContainerComp
    :title="`添加工序`"
    :visible='localVisible'
    :width="700"
    @open="onOpen"
    @submit="submit"
    @cancel="localVisible = false"
    primary-text="确定"
    >
    <div class="working-select-content">
      <el-checkbox-group v-model="checkList">
        <el-checkbox :label="it.ID" v-for="it in localWorkingList" :title="it.Name" :key="it.ID"
        >{{it.Name}}</el-checkbox>
      </el-checkbox-group>
      <el-empty :description="`暂无工序`" v-if="(localWorkingList.length === 0)" />
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ILineDetailWorkingProcedure } from '@/views/productionManagePages/ManualOrderHandlerPage/js/ProductionLineDetailTypes';
import { WorkingTypeEnum } from '@/views/productionSetting/process/enums';
import { MakingGroupTypeFeatureEnum } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';
import api from '@/api';

const props = defineProps<{
  visible: boolean
  workingList: ILineDetailWorkingProcedure[]
  modelValue: ILineDetailWorkingProcedure[]
  isCombine?: boolean
  LineList: [{
    ID: string;
    Name: string;
}] | null
}>();

const emit = defineEmits(['update:visible', 'update:modelValue', 'change']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const localWorkingList = ref<ILineDetailWorkingProcedure[]>([]);

const checkList = ref<string[]>([]);

const onOpen = () => {
  checkList.value = props.modelValue.map(it => it.ID);

  localWorkingList.value = props.workingList.map(it => ({
    ...it,
    WorkTimes: props.modelValue.find(_it => _it.ID === it.ID)?.WorkTimes || '',
  }));
};

// const checkedIds = computed(() => props.modelValue.map(it => it.ID));

const submit = async () => {
  if (!props.LineList) return;
  if (checkList.value.length === 0) {
    MpMessage.error({
      title: '操作失败',
      msg: '请选择工序',
    });
    return;
  }

  const list = checkList.value.map(id => localWorkingList.value.find(it => it.ID === id)).filter(it => it) as ILineDetailWorkingProcedure[];
  const _PrintingPlateLength = list.filter(it => it.Type === WorkingTypeEnum.print).length;

  // if (_PrintingPlateLength === 0 && !props.isCombine) {
  //   MpMessage.error({
  //     title: '操作失败',
  //     msg: '没有可用印刷工序, 请检查',
  //   });
  //   return;
  // }

  if (props.isCombine && !list.find(it => it.MaterialSources.find(m => m.Feature === MakingGroupTypeFeatureEnum.semifinished))) {
    MpMessage.error({
      title: '操作失败',
      msg: '没有可用半成品组合工序, 请检查',
    });
    return;
  }

  if (_PrintingPlateLength > 1) {
    MpMessage.error({
      title: '操作失败',
      msg: '存在多个印刷工序, 请检查',
    });
    return;
  }

  /** 检查工序串联可用性 */
  const _checkUseable = async () => {
    if (props.isCombine) return true;

    const temp = {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      LineList: props.LineList!,
      WorkingList: list.map(it => ({ WorkingID: it.ID })),
    };

    const resp = await api.productionManageApis.getCraftResolveWorkingUseable(temp);

    return !!resp.data?.isSuccess;
  };

  if (await _checkUseable()) {
    emit('update:modelValue', list);
    emit('change', list);
    localVisible.value = false;
  }
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.working-select-content {
  max-height: 400px;
  min-height: 160px;
  overflow: auto;
  overflow: overlay;
  padding-left: 25px;
  text-align: left;
  @include scroll;
  .el-checkbox {
    margin-right: 10px;
  }
  :deep(.el-checkbox__label) {
    width: 10em;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    top: 1px;
    text-align: left;
  }
  :deep(.el-empty) {
    padding: 0;
    padding-bottom: 15px;
    margin-top: -30px;
  }
}
</style>
