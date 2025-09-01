<template>
  <section class="formula-common-page-content-wrap" v-if="rightRuleForm">
    <ConstraintSetupPageComp
    leftWidth="740px"
    :PropertyList="props.PropertyList"
    :condition="props.row" @submit="submit" showPriority>
      <template #header>
        <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
      </template>
      <template #default>
        <div class="right-class">
          <FormulaPanel
            :title="title"
            :params="params"
            v-model:Content="rightRuleForm.Content"
            v-model:PropertyList="rightRuleForm.PropertyList"
           />
        </div>
      </template>
    </ConstraintSetupPageComp>
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import ConstraintSetupPageComp from '@/components/common/ConstraintsComps/ConstraintSetupPageComp.vue';
import { IMpBreadcrumbItem } from '@/assets/Types/common';
import { PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import { TransformConstraintTableItemType } from '@/components/common/ConstraintsComps/ConstraintsTable/utils';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import FormulaPanel from '@/components/Formula/components/FormulaPanel/FormulaPanel.vue';
import { IFormulaItem, IFormulaParams } from '@/components/Formula/types/types';
import { FixedTypeEnum } from '../common/ConstraintsComps/TypeClass/enum';
import { validateFormulaContent } from './components/FormulaPanel/utils';

const props = defineProps<{
  BreadcrumbList: IMpBreadcrumbItem[],
  row: null | TransformConstraintTableItemType<IFormulaItem>,
  PropertyList: PropertyListItemType[]
  title: string
  params: IFormulaParams
}>();

const emit = defineEmits(['save']);

const rightRuleForm = ref<null | Pick<IFormulaItem, 'Content' | 'PropertyList'>>(null);

const submit = (e: IFormulaItem) => {
  if (!rightRuleForm.value) return;

  if (!validateFormulaContent(rightRuleForm.value.Content, '保存失败')) {
    return;
  }

  let t = rightRuleForm.value.PropertyList.find(it => !it.DefaultValue && it.FixedType === FixedTypeEnum.FormulaConst);
  if (t) {
    MpMessage.error({ title: '保存失败', msg: `${t.DisplayContent}值不能为空` });
    return;
  }

  t = rightRuleForm.value.PropertyList.find(it => it.FixedType === FixedTypeEnum.FormulaConst && !/^[-+]?\d+(\.\d+)?$/.test(String(it.DefaultValue)));
  if (t) {
    MpMessage.error('保存失败', `${t.DisplayContent}值设置不正确`);
    return;
  }

  const temp = { ...e, ...props.params, ...rightRuleForm.value };
  emit('save', temp);
};

onMounted(() => {
  rightRuleForm.value = {
    Content: props.row?.Content || '',
    PropertyList: props.row?.PropertyList || [],
  };
});
</script>

<style scoped lang='scss'>
.formula-common-page-content-wrap {
  height: 100%;
  background-color: #fff;

  :deep(.constraint-setup-page-comp-wrap) > header {
    padding-top: 20px;
    .el-breadcrumb{
      margin-bottom: 0px;
    }
  }

  .right-class{
    // width: 200px;
    max-width: 800px;
    margin-left: 85px;
    margin-top: 20px;
    .conent{
      display: flex;
      margin-left: 10px;
      margin-top: 20px;
      >.el-input{
        width: 120px;
      }
      >.el-select{
        margin-left: 10px;
        width: 63px;
      }
    }
  }
}
</style>
