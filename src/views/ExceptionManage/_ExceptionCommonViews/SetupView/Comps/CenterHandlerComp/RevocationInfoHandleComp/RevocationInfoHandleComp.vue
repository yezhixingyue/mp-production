<template>
  <!-- 撤销 -->
  <div class="revocation">
    <!-- 撤销类型 -->
    <el-radio-group v-model="ruleForm.RevocationInfo.Type">
      <el-radio v-for="it in localRevocationTypeEnumList" :key="it.ID" :label="it.ID">{{ it.Name }}</el-radio>
    </el-radio-group>
    <!-- 撤销此大版、撤销当前块、撤销此订单（块报工时） 不需要下面显示 -->

    <!-- 1. 订单报工时 此订单 -->
    <OrderChunkListSelector
      v-if="ruleForm.RevocationInfo.Type === RevocationTypeEnum.CurrentOrder && ruleForm._ReportMode === ReportModeEnum.order"
      :ChunkList="ruleForm._RevocationOrderChunkList"
      v-model:checkAll="ruleForm.RevocationInfo.IsAllSelected"
    />

    <!-- 2. 指定大版显示内容 -->
    <FixedPlateListSeletor v-if="ruleForm.RevocationInfo.Type === RevocationTypeEnum.FixedPlate" :PlateList="ruleForm._RevocationPlateList"  />

    <!-- 3. 其它块显示内容 --  大版报工和块报工显示相同  订单报工显示另外一种 -- 由大版数量决定? -->
    <ul class="chunk-select-list" v-if="ruleForm.RevocationInfo.Type === RevocationTypeEnum.OtherChunk">
      <li v-for="it in ruleForm._PlateChunkSelectList" :key="it.PlateDetail.ID">
        <PlateDetail :plate="it.PlateDetail" v-if="ruleForm._ReportMode !== ReportModeEnum.board" />
        <SearchBox @search="e => it.getChunkList(e)" />
        <CheckListTable :ChunkList="it.ChunkList" />
      </li>
    </ul>
  </div>
</template>

<script setup lang='ts'>
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import { computed } from 'vue';
import { RevocationTypeEnum } from '../../../js/enum';
import { RevocationTypeEnumList } from '../../../js/EnumList';
import { HandleExceptionRuleForm } from '../../../js/HandleExceptionRuleForm';
import PlateDetail from './ChunkSelect/PlateDetail.vue';
import SearchBox from './ChunkSelect/SearchBox.vue';
import CheckListTable from './ChunkSelect/CheckListTable.vue';
import FixedPlateListSeletor from './FixedPlateListSeletor.vue';
import OrderChunkListSelector from './OrderChunkListSelector.vue';

const props = defineProps<{
  handleExceptionRuleForm: HandleExceptionRuleForm
}>();

const ruleForm = computed(() => props.handleExceptionRuleForm);

/** 撤回类型，根据报工方式展示不同的类型 */
const localRevocationTypeEnumList = computed(() => RevocationTypeEnumList
  .filter(it => it._Display.includes(ruleForm.value._ReportMode as ReportModeEnum)
   && (!it._needChildList || ruleForm.value.TaskExceptionDetail?.PlateList?.find(p => p.ChildList?.length))));

</script>

<style scoped lang='scss'>
.revocation {
  .chunk-select-list {
    margin-top: 10px;
  }
}
</style>
