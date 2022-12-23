<template>
  <DialogContainerComp
    :width="700"
    title="选择物料"
    v-model:visible="localVisible"
    @open="onOpen"
    @submit="submit"
    @cancel="cancel"
    @closed="closed"
    class="dialog"
    top="12vh"
    primary-text="确定"
  >
    <div class="m-select-content">
      <div class="header">
        <EpCascader
          v-if="FactoryMaterialClassList.length > 0"
          title="物料类型"
          :list="localEpCascaderList"
          :defaultProps="{ID: 'ID',Name: 'Name',children: 'List'}"
          :level="2"
          :withEmpty="false"
          onlyLastValid
          v-model="EpCascaderValue"
        />
        <span v-else class="is-pink ft-12"><el-icon class="ft-14 mr-4"><WarningFilled /></el-icon> 暂无分类数据</span>
      </div>
      <div class="c">
        <el-empty v-if="FactoryMaterialClassList.length === 0 || (radioList.length === 0 && !loading && condition.TypeID)" description="暂无数据" />
        <el-radio-group v-model="radio">
          <el-radio v-for="it in radioList" :key="it.ID" :label="it.ID" :title="it.Name">{{it.Name}}</el-radio>
        </el-radio-group>
      </div>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { computed, reactive, ref } from 'vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import EpCascader from '@/components/common/EpCascader/EpCascader.vue';
import { IMaterialTypeGroupItemType } from '@/views/productionResources/resourceBundle/utils';

const props = defineProps<{
  visible: boolean
  modelValue: string
  MaterialList: { ID: string, Name: string, TypeID: string }[]
  FactoryMaterialClassList: IMaterialTypeGroupItemType[]
  loading: boolean
}>();

const emit = defineEmits(['update:visible', 'update:modelValue', 'change', 'getClassList']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const condition = reactive<{ ClassID: '' | number, TypeID: string }>({
  ClassID: '',
  TypeID: '',
});

const radio = ref('');

const radioList = computed(() => {
  if (!condition.TypeID) return [];
  return props.MaterialList.filter(it => it.TypeID === condition.TypeID);
});

const localEpCascaderList = computed(() => {
  const list = props.FactoryMaterialClassList.map(lv1 => {
    const temp = {
      ID: lv1.CategoryID,
      Name: lv1.CategoryName,
      List: lv1.MaterialTypes.map(lv2 => ({ ID: lv2.TypeID, Name: lv2.TypeName })),
    };
    return temp;
  });

  return list;
});

const EpCascaderValue = computed({
  get(): ['' | number, string] {
    return [condition.ClassID, condition.TypeID];
  },
  set([ClassID, TypeID]: ['' | number, string]) {
    if (condition.ClassID === ClassID && condition.TypeID === TypeID) return;
    condition.ClassID = ClassID || '';
    condition.TypeID = TypeID || '';
    // 此处获取数据 -- 向原有列表中追加
    if (condition.TypeID) emit('change', condition.TypeID);
    radio.value = '';
  },
});

const onOpen = () => {
  radio.value = props.modelValue || '';

  condition.ClassID = '';
  condition.TypeID = '';

  if (props.FactoryMaterialClassList.length > 0) {
    if (radio.value) {
      const _t = props.MaterialList.find(it => it.ID === radio.value);
      if (_t) {
        const target = props.FactoryMaterialClassList.find(lv1 => {
          const ids = lv1.MaterialTypes.map(lv2 => lv2.TypeID);
          return ids.includes(_t.TypeID);
        });
        if (target) {
          condition.ClassID = target.CategoryID;
          condition.TypeID = _t.TypeID;
        }
      }
    }
  } else {
    emit('getClassList');
  }
};

const cancel = () => {
  localVisible.value = false;
};

const closed = () => {
  radio.value = '';
  condition.ClassID = '';
  condition.TypeID = '';
};

const submit = () => {
  const id = radio.value;
  if (!id) {
    MpMessage.error({ title: '保存失败', msg: '请选择物料' });
    return;
  }
  emit('update:modelValue', id);
  localVisible.value = false;
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.m-select-content {
  margin-top: -18px;
  padding-left: 10px;
  > .header {
    padding-left: 21px;
    padding-bottom: 15px;
    i.ft-14 {
      vertical-align: -2px;
    }
  }
  .c {
    height: 400px;
    overflow: auto;
    overflow: overlay;
    @include scroll;
    :deep(.el-radio) {
      margin-right: 10px;
      margin-bottom: 8px;
      height: 20px !important;
      .el-radio__label {
        display: inline-block;
        vertical-align: -5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 15em;
        font-size: 12px;
        vertical-align: -5px;
      }
    }
  }
}
</style>
