<template>
  <ul v-if="PlateList && PlateList.length > 0" class="ft-12">
    <li v-for="plate in PlateList" :key="plate.ID" class="mb-5">
      <h4 style="display: inline;font-weight: 400;">
        {{ plate.Line }} (<i class="is-gray ft-12">版:{{ plate.Code }}</i>)：</h4>
      <!-- 大版整版重做信息 -->
      <span v-if="plate.Reproduce">{{ getReproduceContent(plate.Reproduce) }}</span>

      <!-- 大版块工序重做信息 -->
      <template v-if="!plate.Reproduce && plate.ChunkList">
        <p v-for="chunk in plate.ChunkList" :key="chunk.ID" style="line-height: 22px; text-indent: 1em;">
          <span>{{ chunk.Name }} (<i class="is-gray ft-12">块:{{ chunk.Code }}</i>)：</span>
          <span>{{ chunk.WorkingList.map(w => getWorkingContent(w)).join('、') }}</span>
        </p>
      </template>

      <!-- 子版重做信息 -->
      <RedoPlateListDiaplay :PlateList="plate.ChildList" style="margin-left: 12px;" />
    </li>
  </ul>
</template>

<script setup lang='ts'>
import { IExceptionPlate } from '../../js/type';
import { getReproduceContent, getWorkingContent } from '../js/utils';

defineProps<{
  PlateList: IExceptionPlate[] | null
}>();

</script>

<script lang='ts'>
export default {
  name: 'RedoPlateListDiaplay',
};
</script>

<style scoped lang='scss'>
</style>
