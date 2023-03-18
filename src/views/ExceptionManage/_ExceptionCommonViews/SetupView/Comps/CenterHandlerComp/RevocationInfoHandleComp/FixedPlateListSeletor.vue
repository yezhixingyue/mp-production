<template>
  <table class="plate-check-list-table" :class="{hasParent: !!parentPlate}">
    <tbody>
      <template  v-for="plate in PlateList" :key="plate.ID">
        <tr>
          <td class="check">
            <!-- <el-checkbox
             :disabled="!plate.Revocationable || isParentChecked ||
              (plate.ChildList && plate.ChildList.length > 0 && plate.ChildList.filter(c => !c.checked).length === 0)"
             :model-value='isParentChecked || (plate.ChildList && plate.ChildList.length > 0 && plate.ChildList.filter(c => !c.checked).length === 0)
              ? true : plate.checked'
             @update:model-value="e => plate.checked = e"
             @change="onChange"
             /> -->
             <el-checkbox
             :disabled="!plate.Revocationable || isParentChecked"
             :model-value='isParentChecked ? true : plate.checked'
             @update:model-value="e => plate.checked = e"
             @change="onChange"
             />
          </td>
          <td style="width: 70px;text-align: left">
            <span>{{ plate.Code}}</span>
          </td>
          <td>
            <span :title="`${plate.Template}${plate.TemplateSize}`">{{ plate.Template }}{{ plate.TemplateSize }}</span>
          </td>
          <td>
            <span :title="plate.Material">{{ plate.Material }}</span>
          </td>
          <td style="width: 80px;">
            <span>{{ plate.Number }}{{ plate.Unit }}</span>
          </td>
        </tr>
        <tr v-if="plate.ChildList && plate.ChildList.length > 0">
          <td colspan="5">
            <FixedPlateListSeletor :PlateList="plate.ChildList" :isParentChecked="isParentChecked || plate.checked" :parentPlate="plate" @setTrue="setTrue" />
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script setup lang='ts'>
import { HandleExceptionRuleForm } from '../../../js/HandleExceptionRuleForm';
import { IRevocationPlateItem } from '../../../js/type';

const props = defineProps<{
  PlateList: HandleExceptionRuleForm['_RevocationPlateList']
  isParentChecked?: boolean
  parentPlate?: IRevocationPlateItem
}>();

const emit = defineEmits(['setTrue']);

const onChange = (e: boolean) => {
  if (!props.parentPlate) return;
  if (e) {
    // 查看当前列表中的所有项是否已选中，如果全部选中则通知上级组件进行勾选操作
    const t = props.PlateList.find(p => !p.checked);

    if (!t) { // 已全部选中
      emit('setTrue', props.parentPlate.ID);
    }
  }
};

const setTrue = (id: string) => {
  const t = props.PlateList.find(it => it.ID === id);
  if (t) {
    // t.checked = true;
  }
};

</script>

<script lang='ts'>
export default {
  name: 'FixedPlateListSeletor',
};
</script>

<style scoped lang='scss'>
.plate-check-list-table {
  width: 100%;
  border-collapse: collapse;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
  margin-top: 10px;
  table-layout: fixed;
  tr {
    td {
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      font-size: 12px;
      height: 32px;
      &.check {
        text-align: center;
        width: 40px;
      }
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      text-align: center;

      span {
        // display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  &.hasParent {
    margin-left: 20px;
    width: calc(100% - 20px);
    margin-top: 6px;
    margin-bottom: 15px;
    position: relative;
    right: -1px;
  }
}
</style>
