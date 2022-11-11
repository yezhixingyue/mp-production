<template>
  <section class="wrap">
    <Header :classList="EquipmentStatusManagePageData.EquipmentClassList" v-model="EquipmentStatusManagePageData.curClassID" />
    <main></main>
    <footer>
      <span>
        当前机器 <i class="is-primary">{{EquipmentStatusManagePageData.listNumber}}</i> 个
      </span>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { EquipmentStatusManageClass } from './js/EquipmentStatusManageClass';
import Header from './Comps/EquipmentStatusHeader.vue';

const EquipmentStatusManagePageData = ref(new EquipmentStatusManageClass());

onMounted(() => {
  EquipmentStatusManagePageData.value.getEquipmentClassList();
});

</script>

<script lang="ts">
export default {
  name: 'EquipmentStatusListPage',
};
</script>

<style scoped lang='scss'>
.wrap {
  background-color: #fff;
  height: 100%;
  color: #444;
  display: flex;
  flex-direction: column;
  > main {
    flex: 1;
  }
  > footer {
    height: 45px;
    line-height: 40px;
    color: #444;
    font-size: 13px;
    text-align: right;
    padding-right: 160px;
  }
  > header, > footer {
    flex: none;
  }
}
</style>
