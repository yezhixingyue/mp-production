<template>
  <section class="formula-panel">
    <header>
      <slot name="header">
        <p class="mp-common-title-wrap black">{{ title }}</p>
      </slot>
    </header>
    <main>
      <h4>参数表</h4>
      <div class="is-blue-span mb-10" @click="visible = true">+ 添加</div>

      <!-- 属性列表 -->
      <ul class="p-list">
        <li v-for="it in PropertyList" :key="it.StoredContent">
          <span class="name">[{{ Property.getPropertyName(it) }}]</span>
          <div class="val" :class="{fc:it.FixedType===FixedTypeEnum.FormulaConst}">
            <!-- 空值 | 常量参数 -->
            <span v-if="it.FixedType!==FixedTypeEnum.FormulaConst">空值设为：</span>
            <el-input v-model.trim="it.DefaultValue" maxlength="9"></el-input>
            <span class="unit"> {{it.Unit}}</span>
          </div>
          <div class="btns">
            <RemoveMenu @click="onPropRemoveClick(it)" />

            <span class="is-blue-span" @click="joinProperty(it)">加入 <el-icon><DArrowRight /></el-icon></span>
          </div>
        </li>
      </ul>

      <!-- 公式内容 -->
      <h4>公式</h4>
      <el-input v-model.trim="Content" :rows="10" type="textarea" ref="oTextareaWrap" spellcheck="false" @input="calculateResult = null" />
      <div class="ctrl-box">
        <span :class="it.isMini?'mini':''" v-for="it in ArithmeticOperatorList" :key='it.value' @click="onArithmeticOperatorClick(it)">{{it.label}}</span>
      </div>

      <!-- 试算功能？ -->
      <h4>试算</h4>
      <div class="test-box">
        <div>
          <div v-for="it in PropertyList" :key="it.DisplayContent" :title="it.DisplayContent">
            <span>{{it.DisplayContent}}：</span>
            <el-input v-model.trim="it.CalculateValue" size="small" @input="calculateResult = null" :disabled='!Content.includes(it.DisplayContent)' />
            <span>{{it.Unit}}</span>
          </div>
        </div>
        <p>
          <span class="is-blue-span mr-10" @click="onCalculateClick" :disabled="!Content">测试运算</span>
          <span v-if="calculateResult">测试运算结果：<i class="is-pink">{{calculateResult}}</i></span>
        </p>
      </div>
    </main>
  </section>

  <ConditionPropSelectDialog v-model:visible="visible" :propertyList="localFormulaPropertyList" :selectedIds="PropertyList.map(it => it.StoredContent)"
    @select="onPropSelect" :writableProperty="writableProperty"
    :WrittenPropertyNames="PropertyList.filter(it => it.FixedType===FixedTypeEnum.FormulaConst).map(it => it.DisplayContent)" />
</template>

<script setup lang='ts'>
import api from '@/api';
import { computed, nextTick, onMounted, ref } from 'vue';
import ConditionPropSelectDialog from '@/components/common/ConstraintsComps/ConditionPropSelectDialog/ConditionPropSelectDialog.vue';
import { Property, PropertyListItemType } from '@/components/common/ConstraintsComps/TypeClass/Property';
import RemoveMenu from '@/components/common/menus/RemoveMenu.vue';
import { FixedTypeEnum } from '@/components/common/ConstraintsComps/TypeClass/enum';
import { PropertyListClass } from '@/components/common/ConstraintsComps/TypeClass/PropertyListClass';
import { IFormulaParams } from '../../types/types';
import { useFormulaCalculate } from './useFormulaCalculate';

const props = defineProps<{
  title?: string
  params: IFormulaParams
}>();

const FormulaPropertyList = ref<PropertyListItemType[]>([]);

const PropertyList = defineModel<PropertyListItemType[]>('PropertyList', { required: true });
const Content = defineModel<string>('Content', { required: true });

const writableProperty = computed(() => FormulaPropertyList.value.find(it => it.FixedType === FixedTypeEnum.FormulaConst));
const localFormulaPropertyList = computed(() => FormulaPropertyList.value.filter(it => it.FixedType !== FixedTypeEnum.FormulaConst));

const visible = ref(false);
const onPropSelect = (e: PropertyListItemType) => {
  PropertyList.value.push(e);
};
const onPropRemoveClick = (prop: PropertyListItemType) => {
  PropertyList.value = PropertyList.value.filter(it => it !== prop);
  Content.value = Content.value.replaceAll(prop.DisplayContent, '');
};

const { calculateResult, onCalculateClick } = useFormulaCalculate(PropertyList, Content);

const oTextareaWrap = ref();
const insertVariable = async (value: string, num = 0) => {
  const otextarea: HTMLTextAreaElement | undefined = oTextareaWrap.value?.textarea;

  if (!otextarea) return;

  if (otextarea.selectionStart || otextarea.selectionStart === 0) {
    const startPos = otextarea.selectionStart;

    const endPos = otextarea.selectionEnd;

    Content.value = otextarea.value.substring(0, startPos) + value + otextarea.value.substring(endPos, otextarea.value.length);

    await nextTick();

    otextarea.focus();

    otextarea.setSelectionRange(endPos + value.length + num, endPos + value.length + num);

    calculateResult.value = null;
  } else {
    Content.value = value;
  }
};

const ArithmeticOperatorList = [
  { label: '+', isMini: true, value: '+', num: 0 }, // num为-1时指插入内容后光标退后一位
  { label: '-', isMini: true, value: '-', num: 0 },
  { label: '×', isMini: true, value: '*', num: 0 },
  { label: '÷', isMini: true, value: '/', num: 0 },
  { label: '(', isMini: false, value: '(', num: 0 },
  { label: ')', isMini: false, value: ')', num: 0 },
  { label: '取余', isMini: false, value: '%', num: 0 },
  { label: '向上取整', isMini: false, value: 'Ceiling()', num: -1 },
  { label: '向下取整', isMini: false, value: 'Floor()', num: -1 },
  { label: '最大值', isMini: false, value: 'Max()', num: -1 },
  { label: '最小值', isMini: false, value: 'Min()', num: -1 },
  { label: '平方根', isMini: false, value: 'Sqrt()', num: -1 },
];

const onArithmeticOperatorClick = (it: typeof ArithmeticOperatorList[number]) => {
  if (!it) return;
  insertVariable(it.value, it.num || 0);
};

const joinProperty = (Property: PropertyListItemType) => {
  if (!Property || !Property.DisplayContent) return;

  insertVariable(Property.DisplayContent);
};

onMounted(() => {
  const _getFormulePropertyList = async () => {
    const resp = await api.propertyApis.getPropertyList(props.params);

    if (resp.data?.isSuccess) {
      FormulaPropertyList.value = resp.data.Data || [];

      PropertyList.value = PropertyList.value
        .map(p => PropertyListClass.getPerfectPropertyByImperfectProperty(p, FormulaPropertyList.value))
        .filter(it => it) as PropertyListItemType[];

      PropertyList.value.forEach(p => {
        const _p = p;
        _p.CalculateValue = '';
      });
    }
  };

  _getFormulePropertyList();
});
</script>

<style scoped lang='scss'>
.formula-panel {
  width: 800px;
  .p-list {
    padding-bottom: 5px;
    &:has(li) {
      padding-bottom: 15px;
    }

    > li {
      display: flex;
      align-items: center;
      color: #585858;
      padding: 10px 0;
      padding-right: 16%;

      > span, > div {
        flex: none;

        &.name {
          min-width: 7em;
        }

        &.val {
          flex: 1;
          padding: 0 10px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          font-size: 13px;

          &.fc {
            justify-content: flex-start;
          }

          > span {
            color: #888e99;
          }

          .unit {
            min-width: 4em;
          }

          .el-input {
            width: 120px;
            margin: 0 10px;
            --el-input-border-radius: 2px;
          }
        }

        &.btns {
          display: flex;
          align-items: center;

          > label {
            margin-top: 2px;
          }

          .is-blue-span {
            display: flex;
            align-items: center;
            margin-left: 30px;

            i {
              margin-top: 1px;
              margin-left: 5px;
            }
          }
        }
      }
    }
  }

  .ctrl-box {
    display: flex;
    margin: 20px 0;
    justify-content: space-between;
    > span {
      width: 64px;
      height: 35px;
      border: 1px solid #B2E4F9;
      border-radius: 5px;
      text-align: center;
      line-height: 33px;
      box-sizing: border-box;
      font-size: 13px;
      color: #26BCF9;
      user-select: none;
      cursor: pointer;
      transition: 0.1s ease-in-out;
      &.mini {
        font-size: 20px;
      }
      &:hover {
        background-color: #b2e4f954;
      }
      &:active {
        background-color: #26bdf971;
        border-color: #26BCF9;
        color: #08b0f3;
      }
    }
  }

  .test-box {
    padding-bottom: 20px;
    > div {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 15px;
      > div {
        width: 360px;
        margin-right: 14px;
        display: flex;
        align-items: center;
        overflow: hidden;
        margin-bottom: 15px;
        > span {
          white-space: nowrap;
          flex: none;
          font-size: 12px;
          color: #888E99;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 16px;
          &:first-of-type {
            font-size: 13px;
            width: 186px;
            text-align: right;
          }
        }
        > .el-input {
          width: 100px;
          margin: 0 4px;
        }
      }
    }
  }

  > main  {
    > h4 {
      margin-top: 25px;
      margin-bottom: 15px;
    }
  }
}
</style>
