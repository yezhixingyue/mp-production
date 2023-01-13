<template>
  <DialogContainerComp
    title="选择工序"
    :visible='localVisible'
    :width="660"
    :primaryClick="submit"
    :closeClick="() => localVisible = false"
    @open="onOpen"
    primaryText="确定"
    >
    <template #default>
      <div class="content">
        <el-checkbox-group v-model="checkList">
          <template v-for="item in props.WorkingProcedureList" :key="item.ID" >
            <el-checkbox :label="item.ID">{{item.Name}}</el-checkbox>
          </template>
        </el-checkbox-group>
        <el-empty v-if="(props.WorkingProcedureList.length === 0)" style="margin-top:-30px" description="暂无工序可选择" />
      </div>
    </template>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { computed, ref } from 'vue';
import { IWorkingProcedureSearch } from '../PlateMakingGroupView/js/types';

const props = defineProps<{
  visible: boolean
  WorkingProcedureList: IWorkingProcedureSearch[]
  originList: string[]
}>();

const emit = defineEmits(['update:visible', 'save']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const checkList = ref<string[]>([]);

const onOpen = () => {
  let list = [...props.originList];
  if (props.WorkingProcedureList.length > 0 && list.length > 0) {
    const ids = props.WorkingProcedureList.map(it => it.ID);
    list = list.filter(id => ids.includes(id));
  }
  checkList.value = list;
};

const submit = () => {
  emit('save', checkList.value);
};

</script>

<style scoped lang='scss'>
</style>
