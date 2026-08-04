<template>
  <div class="assist-item">
    <p class="mp-common-title-wrap black">{{title}}：<mp-button type="primary" link @click="emit('select')">选择辅助信息</mp-button><span>（选填）</span></p>
    <ul class="info">
      <li v-for="(it, i) in data" :key="i">
        <span class="title">{{ getEnumNameByID(it[0], AssistInfoTypeEnums) }}：</span>
        <span>{{ it[1].map(it => it.Name).join('、') }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { INoteDisplayPosition, IResourceNoteGroup } from '@/views/productionResources/assistInfo/types';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { AssistInfoTypeEnums } from '@/views/productionResources/assistInfo/types/enum';
import { WorkingProcedureRelationEnum } from '../enums';

const props = defineProps<{
  Relations: { Type: WorkingProcedureRelationEnum; RelationID: string }[]
  ResourceNoteGroup: IResourceNoteGroup[]
  title: string
  Type: WorkingProcedureRelationEnum
}>();

const emit = defineEmits(['select']);

const data = computed(() => {
  const assistRelations = props.Relations.filter(item => item.Type === props.Type); // 辅助信息资源列表

  const selectedNoteIds = assistRelations.map(it => it.RelationID);
  const notes = props.ResourceNoteGroup.map(it => it.Notes.map(n => ({ ...n, Type: it.Type }))).flat().filter(it => selectedNoteIds.includes(it.ID));

  const m = new Map<number, INoteDisplayPosition['Notes']>();
  notes.forEach(n => {
    const t = m.get(n.Type);
    if (t) {
      t.push(n);
    } else {
      m.set(n.Type, [n]);
    }
  });

  return Array.from(m);
});
</script>

<style scoped lang='scss'>
.assist-item {
  > p {
    display: flex;
    align-items: center;
    text-indent: 3px;
    margin-bottom: 8px;
    margin-top: 18px;
    span {
      font-weight: 400;
      font-size: 12px;
      color: #888;
    }
    button {
      padding-top: 0;
      padding-bottom: 0;
    }
  }

  > ul {
    margin: 0px 0 25px 16px;
    > li {
      display: flex;
      line-height: 14px;
      margin: 5px 0;
      span {
        flex: 1;
        &.title {
          flex: none;
        }
      }
    }
  }
}
</style>
