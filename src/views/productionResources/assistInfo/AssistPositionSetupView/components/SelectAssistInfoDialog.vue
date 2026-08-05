<template>
  <DialogContainerComp :visible='visible' :width='660' title='选择辅助信息' top='12vh' :disabled="ResourceNoteGroupList.length===0"  @cancel='visible = false'
    @open='onOpen' @submit='submit'>
    <ul class='dialog-content'>
      <li v-for="(AssistType, i) in localAssistTypeList" :key="AssistType.Type" class="type-item">
          <el-checkbox :modelValue="getCheckAllModelValue(i)" :indeterminate="getIsIndeterminate(i)" @change="(e) => onCheckAllChange(e, i)">
            <span class="title">{{AssistType._Name}}</span>
          </el-checkbox>

          <div class="list">
            <el-checkbox v-for="it in AssistType.Notes" :key="it.ID" :label="it.ID" :title="it.Name" v-model="it.checked" style="margin-right: 10px;">
              {{it.Name}}
            </el-checkbox>
          </div>
        </li>
    </ul>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import api from '@/api';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { ref } from 'vue';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { AssistInfoTypeEnum, AssistInfoTypeEnums } from '@/views/productionResources/assistInfo/types/enum';
import { INoteDisplayPosition, IResourceNoteGroup } from '../../types';

const visible = defineModel<boolean>('visible');

const props = defineProps<{
  setupTarget: null | INoteDisplayPosition
}>();

const emit = defineEmits<{
  submit: [e: { ID: string; Name: string; Type: AssistInfoTypeEnum }[]]
}>();

const ResourceNoteGroupList = ref<IResourceNoteGroup[]>([]);
const getResourceNoteGroup = async () => {
  if (ResourceNoteGroupList.value.length > 0) return;
  const resp = await api.getResourceNoteGroup();
  if (resp.data?.isSuccess) {
    ResourceNoteGroupList.value = resp.data.Data;
  }
};

const getInitListValue = () => {
  if (props.setupTarget && ResourceNoteGroupList.value.length > 0) {
    const ids = props.setupTarget.Notes.map(it => it.ID);
    return ResourceNoteGroupList.value
      .filter(it => props.setupTarget!.Types.includes(it.Type) && it.Notes.length > 0)
      .map(it => ({
        ...it,
        _Name: getEnumNameByID(it.Type, AssistInfoTypeEnums),
        Notes: it.Notes.map(n => ({ ...n, checked: ids.includes(n.ID), Type: it.Type })),
      }));
  }

  return [];
};

const localAssistTypeList = ref<ReturnType<typeof getInitListValue>>([]);
const getCheckAllModelValue = (index: number) => {
  if (new Set(localAssistTypeList.value[index].Notes.map(it => it.checked)).size === 1) {
    return localAssistTypeList.value[index].Notes[0].checked;
  }

  return false;
};
const getIsIndeterminate = (index: number) => new Set(localAssistTypeList.value[index].Notes.map(it => it.checked)).size === 2;
const onCheckAllChange = (bool: boolean, index: number) => {
  localAssistTypeList.value[index].Notes.forEach(it => {
    const _it = it;
    _it.checked = bool;
  });
};

const onOpen = async () => {
  await getResourceNoteGroup();
  localAssistTypeList.value = getInitListValue();
};

const submit = () => {
  if (ResourceNoteGroupList.value.length === 0) return;

  const list = localAssistTypeList.value.flatMap(it => it.Notes).filter(it => it.checked);

  emit('submit', list);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
  margin-top: -20px;
  min-height: 160px;
  max-height: 360px;
  padding-left: 10px;
  overflow: auto;
  overflow: overlay;
  @include scroll;

  .type-item {
    margin-bottom: 15px;

    .title {
      font-weight: 600;
      font-size: 13px;
    }

    .list {
      display: flex;
      flex-wrap: wrap;
      :deep(.el-checkbox__label) {
        display: inline-block;
        width: 10em;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
