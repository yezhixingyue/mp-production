<template>
  <li :class="{child: !!parentPlate}">
    <PlateDetail :plate="it" :parentPlate="parentPlate" />
    <div v-if="it.Reproduce" class="reproduce">
      <el-checkbox :disabled="!it.Redoable || HandleExceptionRuleForm.getPlateIsDisabledTrue(parentPlate)"
      :model-value='HandleExceptionRuleForm.getPlateIsDisabledTrue(parentPlate) ? true : it.Reproduce._remark'
      @update:model-value="onRemarkChange" label="重新生产" />
      <el-checkbox v-show="isPlateRemake" v-model="it.Reproduce.ReceiveMaterial" label="重新领料" disabled />
      <el-checkbox v-show="isPlateRemake" :disabled="it.Reproduce._PlatemakingDisabled" v-model="it.Reproduce.Platemaking" label="重新制版" />
    </div>
    <ul class="chunks">
      <li v-for="chunk in it.ChunkList" :key="chunk.ID" v-show="chunk.WorkingList.length > 0">
        <h4>{{ chunk.Name }}：</h4>
        <div>
          <el-checkbox
            v-for="working in chunk.WorkingList" :key="working.ID"
            :model-value='HandleExceptionRuleForm.getWorkingIsDisabledTrue(it, working, rootPlateList || PlateList, parentPlate) ? true : working.checked'
            @update:model-value="e => working.checked = e"
            :label="working.Name"
            :disabled="HandleExceptionRuleForm.getWorkingIsDisabledTrue(it, working, rootPlateList || PlateList, parentPlate)"
            @change="(e: boolean) => onWorkingSelect(e, working)"
          />
        </div>
      </li>
    </ul>
    <!-- 子大版列表 -->
    <template v-if="it.ChildList">
      <!-- 大版上的子版 -->
      <PlateRedoSetupItem v-for="child in it.ChildList" :PlateList="it.ChildList"
       :parentPlate="it" :rootPlateList="rootPlateList || PlateList" :key="child.ID" :item="child" @selectWorking="onWorkingSelect" />
    </template>
  </li>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { HandleExceptionRuleForm } from '../../../../js/HandleExceptionRuleForm';
import { IExceptionPlate4Form, IExceptionWorking4RuleForm } from '../../../../js/ruleFormType';
import PlateDetail from '../../RevocationInfoHandleComp/ChunkSelect/PlateDetail.vue';

const props = defineProps<{
  parentPlate?: IExceptionPlate4Form
  item: IExceptionPlate4Form
  PlateList: IExceptionPlate4Form[]
  rootPlateList?: IExceptionPlate4Form[]
}>();

const emit = defineEmits(['selectWorking']);

const it = computed(() => props.item);

const isPlateRemake = computed(() => (it.value.Reproduce?._remark && it.value.Redoable) || HandleExceptionRuleForm.getPlateIsDisabledTrue(props.parentPlate));

const onRemarkChange = (e: boolean) => {
  if (it.value.Reproduce) it.value.Reproduce._remark = e;
};

const onWorkingSelect = (bool: boolean, working: IExceptionWorking4RuleForm) => { // 组合块同步选中或取消
  if (props.parentPlate) {
    emit('selectWorking', bool, working);
    return;
  }

  if (working.UnionChunkID) {
    const _handlePlateList = (PlateList: IExceptionPlate4Form[] | null) => {
      if (!PlateList || PlateList.length === 0) return;
      PlateList.forEach(p => {
        p.ChunkList.forEach(c => {
          c.WorkingList.forEach(w => {
            if (w.UnionChunkID && w.UnionChunkID === working.UnionChunkID) {
              const _w = w;
              _w.checked = bool;
            }
          });
        });
        _handlePlateList(p.ChildList);
      });
    };

    _handlePlateList(props.PlateList);
  }
};

</script>

<script lang="ts">
export default {
  name: 'PlateRedoSetupItem',
};
</script>

<style scoped lang='scss'>
.child {
  padding-left: 50px;
  &:first-of-type {
    padding-top: 5px;
    > .p {
      border-top: 1px solid #e5e5e5;
    }
  }
}

.plate-detail {
  margin-bottom: 0;
}
.reproduce {
  border-left: 1px solid #e5e5e5;
  border-right: 1px solid #e5e5e5;
  padding: 10px 30px;
  padding-bottom: 0;
}

.chunks {
  border: 1px solid #e5e5e5;
  border-top: none;
  padding: 10px 30px;
  padding-top: 0;
  > li {
    display: flex;
    padding-top: 10px;
    & + li {
      margin-top: 6px;
    }
    > h4 {
      height: 22px;
      line-height: 22px;
      margin-right: 8px;
      min-width: 3em;
      flex: none;
    }
    :deep(.el-checkbox ) {
      height: 22px;
      .el-checkbox__label {
        min-width: 4em;
      }
    }
  }
}
</style>
