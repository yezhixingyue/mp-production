<template>
  <DialogContainerComp v-model:visible='localVisible' autoClose :title="dialogTitle" @submit="submit" @open="onOpen" :width="700">
    <ul v-if="ruleForm" class="content-wrap">
      <li>
        <span class="label">分类：</span>
        <el-select v-model="ruleForm.ClassID" @change="onClassChange">
          <el-option v-for="it in EquipmentGroupData.EquipmentClassList" :key="it.ID" :label="it.Name" :value="it.ID"></el-option>
        </el-select>
        <el-tooltip
          content="切换分类将会清除已选外协工厂！"
          placement="top-start"
          effect="customized"
        >
          <span class="tip l"><el-icon><InfoFilled /></el-icon></span>
        </el-tooltip>
      </li>
      <li>
        <span class="label">组名称：</span>
        <el-input v-model.trim="ruleForm.Name" maxlength="20" show-word-limit></el-input>
      </li>
      <li>
        <span class="label">可选外协工厂：</span>
        <div class="factory-box">
          <span v-if="!ruleForm.ClassID && ruleForm.ClassID !== 0" class="tip">请先选择分类</span>
          <el-checkbox-group v-model="ruleForm.FactoryIDS" size="small" v-else-if="localSubcontractorFactoryLis.length > 0">
            <el-checkbox v-for="it in localSubcontractorFactoryLis" :key="it.FactoryID" :label="it.FactoryID" :title="it.Name">{{it.Name}}</el-checkbox>
          </el-checkbox-group>
          <span v-else class="tip">当前分类下尚无可选工厂</span>
        </div>
      </li>
      <li class="tips-box is-orange">
        <span class="label"></span>
        <span><el-icon><WarningFilled /></el-icon> 同组的设备一定要可以互相替换而不影响作业。</span>
      </li>
    </ul>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { EquipmentGroupTypeClass } from '@/store/modules/resource/EquipmentGroupTypeClass';
import { EquipmentGroupItemClass } from '@/store/modules/resource/EquipmentGroupTypeClass/EquipmentGroupItemClass';
import { computed, ref } from 'vue';

const props = defineProps<{
  visible: boolean,
  EquipmentGroupData: Required<EquipmentGroupTypeClass>
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

const dialogTitle = computed(() => (props.EquipmentGroupData.curEditItem ? '编辑设备组' : '添加设备组'));

const ruleForm = ref<null | EquipmentGroupItemClass>(null);

const onOpen = () => { // 初始化 及 筛选掉不生效的工厂ID
  ruleForm.value = new EquipmentGroupItemClass(props.EquipmentGroupData.curEditItem);
  if (props.EquipmentGroupData.curEditItem && props.EquipmentGroupData.SubcontractorFactoryList.length > 0) { // 筛选掉不生效的工厂ID
    const allFactoryIds = props.EquipmentGroupData.SubcontractorFactoryList
      .filter(it => it.ClassIDS.includes(ruleForm.value?.ClassID || -1))
      .map(it => it.FactoryID);
    ruleForm.value.FactoryIDS = ruleForm.value.FactoryIDS.filter(id => allFactoryIds.includes(id));
  }
};

const localSubcontractorFactoryLis = computed(() => {
  const id = ruleForm.value?.ClassID;
  if (typeof id === 'number') {
    return props.EquipmentGroupData.SubcontractorFactoryList.filter(it => it.ClassIDS.includes(id));
  }
  return [];
});

const onClassChange = () => {
  if (ruleForm.value) ruleForm.value.FactoryIDS = [];
};

const submit = () => {
  if (!ruleForm.value) return;
  const res = ruleForm.value.validate();
  if (!res) return;
  emit('submit', ruleForm.value);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/var.scss';
@import '@/assets/css/mixins.scss';

.content-wrap {
  padding: 20px;
  padding-top: 0;
  margin-top: -20px;
  min-height: 280px;
  >li {
    padding: 4px 0 16px;
    display: flex;
    >.label {
      color: $--color-gray;
      font-weight: 700;
      margin-right: 6px;
      width: 120px;
      text-align: right;
      line-height: 32px;
    }
    > .el-select {
      width: 200px;
      :deep(.el-input__wrapper) {
        border-radius: 3px;
      }
    }
    >.el-input {
      width: 400px;
      font-size: 12px;

      :deep(.el-input__wrapper) {
        border-radius: 3px;
      }
    }

    .factory-box {
      margin-top: 5px;
      min-height: 60px;
      >.el-checkbox-group {
        width: 480px;
        max-height: 280px;
        overflow: auto;
        @include scroll;
        .el-checkbox {
          margin-right: 10px;
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
    &.tips-box {
      font-size: 12px;
      letter-spacing: 0.5px;
      margin-top: 15px;
      i {
        vertical-align: -2px;
        font-size: 13px;
        margin-right: 4px;
      }
    }
    span.tip {
      font-size: 12px;
      position: relative;
      letter-spacing: 0.5px;
      top: 1px;
      color: #aaa;
      margin-left: 10px;
      > i {
        vertical-align: -3px;
        font-size: 14px;
        margin-right: 4px;
      }
      &.l {
        line-height: 30px;
        margin-left: 12px;
        cursor: pointer;
        &:hover {
          color: #888;
        }
      }
    }
  }
}
</style>
