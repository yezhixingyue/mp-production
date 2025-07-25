<template>
  <DialogContainerComp :visible='localVisible' :width='600' :title="`设置出血：${NeedFolding?'':'无需'}折手拼版文件出血设置`" top='17vh' @open='onOpen' primary-text="确定"
    @cancel='localVisible = false' @submit='submit'>
    <div class="main">
      <div class="binding-edge" v-if="NeedFolding">
        <div style="padding-left: 8px;">
          <span style="vertical-align: 2px;">装订边位置：</span>
          <el-radio-group v-model="ruleForm.BindingEdge">
            <el-radio v-for="it in BindingEdgeEnumList.filter(it => it.ID !== BindingEdgeEnum.None)" :key="it.ID" :label="it.ID">{{ it.Name }}</el-radio>
          </el-radio-group>
        </div>

        <p class="tips-box is-orange ft-12"> <el-icon class="ft-14"><WarningFilled /></el-icon> 注意：设置前需确保文件方向为翻阅视角，再指定翻看方式。</p>
      </div>
      <ul class='bleed-content'>
        <li class="item" :class="{active: displayLabels.top === '装订边'}">
          <span>{{ displayLabels.top }}：</span>
          <el-input v-model.trim="ruleForm.BleedTop" maxlength="4"></el-input>
          <em>mm</em>
        </li>
        <li class="item" :class="{active: displayLabels.left === '装订边'}">
          <span>{{ displayLabels.left }}：</span>
          <el-input v-model.trim="ruleForm.BleedLeft" maxlength="4"></el-input>
          <em>mm</em>
        </li>
        <li class="item" :class="{active: displayLabels.right === '装订边'}">
          <span>{{ displayLabels.right }}：</span>
          <el-input v-model.trim="ruleForm.BleedRight" maxlength="4"></el-input>
          <em>mm</em>
        </li>
        <li class="item" :class="{active: displayLabels.bottom === '装订边'}">
          <span>{{ displayLabels.bottom }}：</span>
          <el-input v-model.trim="ruleForm.BleedBottom" maxlength="4"></el-input>
          <em>mm</em>
        </li>
      </ul>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { BindingEdgeEnum, BindingEdgeEnumList } from '@/views/productionManagePages/ProcessDecompositionOrderList/types/enum';
import { IOrderFileInfo } from '../../../../types/types';
import { getBleedLabels } from './hooks/useBleedSetup';

const props = defineProps<{
  visible: boolean
  fileList: IOrderFileInfo[]
  NeedFolding: boolean | ''
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

const ruleForm = ref<Required<Pick<IOrderFileInfo, 'BleedBottom' | 'BleedLeft' | 'BleedRight' | 'BleedTop'>> & { BindingEdge: BindingEdgeEnum | '' }>({
  BleedTop: '',
  BleedRight: '',
  BleedBottom: '',
  BleedLeft: '',
  BindingEdge: BindingEdgeEnum.None,
});

const displayLabels = computed(() => getBleedLabels(ruleForm.value.BindingEdge, props.NeedFolding));

const onOpen = () => {
  ruleForm.value = {
    BleedTop: '',
    BleedRight: '',
    BleedBottom: '',
    BleedLeft: '',
    BindingEdge: BindingEdgeEnum.None,
  };

  const t = props.fileList.find(it => it._PlateTemplate?.IsPrintingPlate || it._PlateTemplate?.IsSameSizeWithPrintingPlate);
  if (t) restoreInitDataByOrigin(ruleForm.value, t);

  // 装订边校正：
  if (!props.NeedFolding) {
    ruleForm.value.BindingEdge = BindingEdgeEnum.None;
  } else if (ruleForm.value.BindingEdge === BindingEdgeEnum.None) {
    ruleForm.value.BindingEdge = '';
  }
};

const submit = () => {
  // 校验
  const values = Object.values(ruleForm.value);
  // 1. 装订边校验
  if (props.NeedFolding && (ruleForm.value.BindingEdge === BindingEdgeEnum.None || ruleForm.value.BindingEdge === '')) {
    MpMessage.error('设置失败', '请选择装订边');
    return;
  }

  // 2. 不能有空项
  if (values.findIndex(it => it === '') > -1) {
    MpMessage.error('设置失败', '有出血项未设置值');
    return;
  }
  // 3. 必须都是数字格式
  if (values.findIndex(it => !/^\d+(.\d)?$/.test(`${it}`)) > -1) {
    MpMessage.error('设置失败', '有值输入不正确，必须为大于等于0的数字类型，最多1位小数');
    return;
  }

  // 提交
  emit('submit', ruleForm.value);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.binding-edge {
  margin: 0 auto;
  margin-top: -20px;
  padding-bottom: 30px;
  width: 370px;

  .tips-box {
    margin-top: 4px;
  }
}

.bleed-content {
  width: 400px;
  margin: 0 auto;
  padding-bottom: 30px;

  display: grid;
  grid-template-rows: 40px 40px 40px;
  grid-template-columns: 133px 133px 133px;
  grid-template-areas:
    " .    top    .   "
    "left   .   right "
    " .   bottom  .   ";

  .item {
    display: flex;
    align-items: center;
    justify-content: center;

    white-space: nowrap;
    color: #888;

    > span {
      font-size: 13px;

    }

    > em {
      font-size: 12px;
      margin-left: 5px;
    }

    &.active {
      > span, > em {
        color: #ff3769;
        font-weight: 700;
      }
    }

    &:nth-of-type(1) {
      grid-area: top;
    }

    &:nth-of-type(2) {
      grid-area: left;
    }

    &:nth-of-type(3) {
      grid-area: right;
    }

    &:nth-of-type(4) {
      grid-area: bottom;
    }
  }
}</style>
