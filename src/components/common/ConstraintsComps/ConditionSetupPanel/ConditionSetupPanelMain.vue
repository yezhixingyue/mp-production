<template>
  <main class="condition-display-list" ref="oBox">
    <ul>
      <li v-for="(it, i) in props.constraint.ItemList" :key="it.ConstraintID || it._key">
        <span class="title" :title="it._errMsg">
          <el-icon v-if="it._errMsg" class="is-pink" ><Warning /></el-icon>
          <!-- <i v-if="it._errMsg" class="icon-tubiaozhizuomoban iconfont"></i> -->
          {{it.Property?.DisplayContent?.replace(/\[|\]/g, '')}}
        </span>
        <div class="box">
          <OperatorComp :item="it" v-model="it.Operator" v-model:valueList="it.ValueList" />
          <!-- 值组件目前仅下面类型才显示： 值类型 -->
          <ValueSelectorComp :item="it" v-model="it.ValueList" />
        </div>
        <!-- <span class="del is-pink-span" @click="remove(i)">删除</span> -->
        <mp-button type="info" class="del menu" link @click="remove(i)">
          <i class="iconfont icon-delete"></i>删除
        </mp-button>
      </li>
      <mp-empty v-if="props.constraint.ItemList.length === 0" description="尚未添加条件" />
    </ul>
  </main>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import OperatorComp from './comps/OperatorComp.vue';
import ValueSelectorComp from './comps/ValueSelectorComp.vue';
import { Constraints } from './Constraints';

const props = defineProps<{
  constraint: Constraints,
}>();

const oBox = ref<InstanceType<typeof Element>>();

const scroll = () => {
  if (oBox.value) oBox.value.scrollTop = 100000;
};

defineExpose({
  scroll,
});

const emit = defineEmits(['remove']);

const remove = (i: number) => {
  emit('remove', i);
};

</script>

<style scoped lang='scss'>
.condition-display-list {
  > ul {
    > li {
      margin-bottom: 22px;
      line-height: 30px;
      display: flex;
      > .title {
        display: inline-block;
        min-width: 210px;
        text-align: right;
        margin-right: 28px;
        height: 30px;
        flex: none;
        transition: color 0.2s ease-in-out;
        font-size: 12px;
        letter-spacing: 0.5px;
        &:not(.is-pink) {
          color: #444;
        }
        > i {
          margin-right: 4px;
          font-size: 20px;
          vertical-align: middle;
          position: relative;
          top: -2px;
          cursor: pointer;
        }
        &.is-pink {
          cursor: pointer;
          &:hover {
            opacity: 0.8;
          }
        }
      }
      > .box {
        width: 280px;
        flex: 1 0 auto;
        display: flex;
        max-width: 380px;
      }
      > .del {
        flex: none;
        font-size: 12px;
        margin-left: 25px;
        display: flex;
        align-items: flex-end;
        line-height: 28px;
        padding: 0;
        i.iconfont {
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
