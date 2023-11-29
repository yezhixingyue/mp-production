<template>
  <section class="page-wrap">
    <Header
     :condition="ManageLaterCraftPlateListPageData.condition"
     :list="ManageLaterCraftPlateListPageData.list"
     :lineList="ManageLaterCraftPlateListPageData.ProductionLineList"
     :WorkingAndMakingGroupList="ManageLaterCraftPlateListPageData.WorkingAndMakingGroupList"
     :getList="getList"
     :setCondition="setCondition"
     @clear="clearCondition" />
    <Main
     :Type="ManageLaterCraftPlateListPageData.condition.Type"
     :list="ManageLaterCraftPlateListPageData.list"
     :loading="ManageLaterCraftPlateListPageData.loading" />
    <Footer :condition="ManageLaterCraftPlateListPageData.condition" :getList="getList" :total="ManageLaterCraftPlateListPageData.listNumber" />
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import Header from './Comps/Header.vue';
import Main from './Comps/Main.vue';
import Footer from './Comps/Footer.vue';
import { ManagePlateListClass } from './js/ManagePlateListClass';
import { PlateTypeEnum } from './js/enum';

/** 后工版列表页面数据 */
const ManageLaterCraftPlateListPageData = ref(new ManagePlateListClass(PlateTypeEnum.LaterCraft));

const setCondition = (e) => { ManageLaterCraftPlateListPageData.value.setCondition(e); };

const clearCondition = () => { ManageLaterCraftPlateListPageData.value.clearCondition(); };

const getList = (e?: number) => { ManageLaterCraftPlateListPageData.value.getList(e); };

onMounted(() => { ManageLaterCraftPlateListPageData.value.getInitData(); });
</script>

<script lang="ts">
export default {
  name: 'ManageLaterCraftPlateListPage',
};
</script>

<style scoped lang='scss'>
.page-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  > main {
    flex: 1;
    margin-top: 8px;
  }
  > footer {
    height: 40px;
    padding-top: 7px;
  }
  > header, > footer {
    flex: none;
  }
  > header, > main, > footer {
    background-color: #fff;
  }
}
</style>
