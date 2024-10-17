<template>
  <DialogContainerComp
    class="dialog" :width="700" top="15vh" title="查看设备修改历史"
    v-model:visible="localVisible" :showSubmit="false"
    @open="open" @cancel="cancel">
    <div class="dialog-content">
      <el-table v-if="result" :data="result.rows" stripe border style="width: 100%;" height="340">
        <el-table-column width="100" label="操作人" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ getStaffName(scope.row.creator) }}</span>
          </template>
        </el-table-column>
        <el-table-column width="80" label="操作类型" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ getTypeEnumName(scope.row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="操作备注" show-overflow-tooltip width="325"></el-table-column>
        <el-table-column prop="createdAt" label="时间" show-overflow-tooltip ></el-table-column>
      </el-table>

      <el-pagination v-if="result" small layout="prev, pager, next" @current-change="getHistory" class="mt-5"
       :total="result.count" :page-size="condition.limit" :current-page="condition.offset" hide-on-single-page />
    </div>
  </DialogContainerComp>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { mpEquipmentApi } from '@/api/equipment';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { useStaffList } from '../hooks/useStaffList';
import { EquipmentHistoryTypeEnum, EquipmentHistoryTypeEnumList } from '../types/enum';
import { IComputer, IComputerEditHistory } from '../types/type';

const props = defineProps<{
  visible: boolean
  item: IComputer | null
}>();

const emit = defineEmits(['update:visible']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const condition = ref({ equipmentId: '', offset: 1, limit: 10 });
const result = ref<null | { rows: IComputerEditHistory[], count: number }>(null);
const getHistory = async (offset = 1) => {
  if (result.value) {
    result.value.rows = [];
  }
  condition.value.offset = offset;

  const resp = await mpEquipmentApi.getComputerHistoryList(condition.value).catch(() => null);

  if (resp?.data?.isSuccess) {
    result.value = resp.data.Data;
  }
};

const { getStaffName } = useStaffList();
const getTypeEnumName = (type: EquipmentHistoryTypeEnum) => EquipmentHistoryTypeEnumList.find(it => it.ID === type)?.Name;

const open = async () => {
  result.value = null;
  condition.value.equipmentId = props.item?.id || '';

  getHistory();
};

const cancel = () => {
  localVisible.value = false;
};
</script>
<style lang='scss' scoped>
.dialog-content {
  display: flex;
  margin: 0 auto;
  flex-direction: column;
  height: 350px;
  margin-bottom: -20px;

  :deep(.el-table) {
    th.el-table__cell {
      padding: 4px 0;
      font-size: 14px;
    }
    td.el-table__cell {
      padding: 5px 0;
    }
  }
}
</style>
