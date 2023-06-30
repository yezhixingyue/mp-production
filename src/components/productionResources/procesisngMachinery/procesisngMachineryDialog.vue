<template>
  <DialogContainerComp v-model:visible='localVisible' autoClose :title="dialogTitle" @submit="submit" @open="onOpen" :width="700">
    <ul v-if="ruleForm" class="content-wrap">
      <li>
        <span class="label star">设备组：</span>
        <span class="tip is-pink ml-10" v-if="props.localEquipmentListClassData.EquipmentClassAndGroupLevelList.length === 0">暂无数据</span>
        <EpCascaderByLevel2
           v-else
           onlyLastValid
          :withEmpty="false"
          :showTitle="false"
          :First="ruleForm.ClassID"
          :Second="ruleForm.GroupID"
          :type-list="[['ClassID', ''], ['GroupID', '']]"
          :list="props.localEquipmentListClassData.EquipmentClassAndGroupLevelList"
          @setCondition="setConditon"
        />
      </li>
      <li>
        <span class="label star">设备名称：</span>
        <el-input v-model.trim="ruleForm.Name" maxlength="20" show-word-limit></el-input>
      </li>
      <li>
        <span class="label star">设备状态显示顺序：</span>
        <el-input class="num" v-model.number="ruleForm.Index" maxlength="9"></el-input>
        <span class="tip is-orange"><el-icon><WarningFilled /></el-icon>数字越小显示越靠前</span>
      </li>
    </ul>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import EpCascaderByLevel2 from '@/components/common/EpCascader/EpCascaderWrap/EpCascaderByLevel2.vue';
import CommonClassType from '@/store/modules/formattingTime/CommonClassType';
import { Equipment } from '@/views/productionResources/procesisngMachinery/TypeClass/Equipment';
import { EquipmentListClass } from '@/views/productionResources/procesisngMachinery/TypeClass/EquipmentListClass';
import { computed, ref } from 'vue';

const props = defineProps<{
  visible: boolean,
  localEquipmentListClassData: Required<EquipmentListClass>
}>();

const emit = defineEmits(['update:visible', 'submit']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const dialogTitle = computed(() => (props.localEquipmentListClassData.curEditItem ? '编辑加工设备' : '添加加工设备'));

const ruleForm = ref<null | Equipment>(null);

const onOpen = () => { // 初始化
  ruleForm.value = new Equipment(props.localEquipmentListClassData.curEditItem);
};

const setConditon = (e) => {
  if (ruleForm.value) CommonClassType.setCondition(e, ruleForm.value);
};

const submit = () => {
  if (!ruleForm.value) return;
  const res = ruleForm.value.getSubmitData();
  if (!res) return;
  emit('submit', res);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/var.scss';
@import '@/assets/css/mixins.scss';

.content-wrap {
  padding: 20px;
  padding-top: 0;
  margin-top: -10px;
  min-height: 120px;
  padding-left: 50px;
  >li {
    padding: 4px 0 16px;
    display: flex;
    >.label {
      color: $--color-gray;
      font-weight: 700;
      margin-right: 6px;
      width: 140px;
      text-align: right;
      line-height: 32px;
    }
    >.el-input {
      width: 300px;
      font-size: 12px;

      :deep(.el-input__wrapper) {
        border-radius: 3px;
      }
      &.num {
        width: 115px;
      }
    }

    span.tip {
      font-size: 12px;
      letter-spacing: 0.5px;
      margin-left: 25px;
      line-height: 32px;
      > i {
        vertical-align: -3px;
        font-size: 14px;
        margin-right: 8px;
      }
      &.ml-10 {
        margin-left: 10px;
      }
    }
  }
}
</style>
