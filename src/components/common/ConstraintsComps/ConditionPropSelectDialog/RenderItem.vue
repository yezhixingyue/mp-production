<template>
  <section class="render-item">
    <header>
      <p class="mp-common-title-wrap black">{{props.item.Name}}</p>
    </header>
    <main>
      <div v-for="p in props.item.PropertyList" :key="p.Property.ID">
        <span class="is-element" @click="onClick(p)">{{p.Property.Name}}</span>
      </div>
    </main>
  </section>
</template>

<script setup lang='ts'>
import { PropertyListItemType } from '../TypeClass/Property';
import { IGroupedPropertyListItem } from '../TypeClass/types';

const props = defineProps<{
  item: IGroupedPropertyListItem
}>();

const emit = defineEmits(['itemClick']);

const onClick = (p: PropertyListItemType) => {
  emit('itemClick', p);
};

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
