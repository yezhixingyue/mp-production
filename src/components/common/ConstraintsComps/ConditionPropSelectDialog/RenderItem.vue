<template>
  <section class="render-item">
    <header>
      <p class="mp-common-title-wrap black">{{props.item.Name}}</p>
    </header>
    <main>
      <div v-for="p in props.item.PropertyList" :key="p.StoredContent">
        <span class="is-element" @click="onClick(p)">{{getName(p)}}</span>
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

console.log(props.item);

const emit = defineEmits(['itemClick']);

const onClick = (p: PropertyListItemType) => {
  emit('itemClick', p);
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
    }
  }
}
</style>
