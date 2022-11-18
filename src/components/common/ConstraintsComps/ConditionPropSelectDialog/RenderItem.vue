<template>
  <section class="render-item">
    <header>
      <p class="mp-common-title-wrap black">{{props.item.Name}}</p>
    </header>
    <main>
      <div v-for="p in props.item.PropertyList" :key="p.StoredContent">
        <span :class="getClass(p)" @click="onClick(p)">{{getName(p)}}</span>
        <span v-if="p._FixedTypeList && p._FixedTypeList.length > 0" class="fix-list"> (
          <span v-for="fixedProp in p._FixedTypeList" :key="fixedProp.StoredContent"
           :class="getClass(fixedProp)" @click="onClick(fixedProp)">{{getName(fixedProp)}}</span>
         )</span>
      </div>
    </main>
  </section>
</template>

<script setup lang='ts'>
import { Property, PropertyListItemType } from '../TypeClass/Property';
import { IGroupedPropertyListItem } from '../TypeClass/types';

const props = defineProps<{
  item: IGroupedPropertyListItem
}>();

const emit = defineEmits(['itemClick']);

const onClick = (p: PropertyListItemType) => {
  if (!p.StoredContent) return;
  emit('itemClick', p);
};

const getClass = (it: PropertyListItemType) => {
  if (!it.StoredContent) return 'ft-13';
  if (typeof it.FixedType === 'number') return 'is-pink-span ft-12';
  return 'is-element';
};

const getName = (it: PropertyListItemType) => Property.getPropertyName(it);

</script>

<style scoped lang='scss'>
.render-item {
  margin-bottom: 25px;
  > header {
    margin-bottom: 10px;
  }
  > main {
    > div {
      display: inline-block;
      margin-right: 25px;
      margin-bottom: 5px;
      .is-element {
        font-size: 13px;
        color: #428DFA;
        cursor: pointer;
        user-select: none;
        &:hover {
          color: #428cfadc;
        }
        &:active {
          color: #0959cf;
        }
        &.disabled {
          color: #cbcbcb;
        }
      }
      .fix-list {
        > span + span {
          margin-left: 12px;
        }
      }
    }
  }
}
</style>
