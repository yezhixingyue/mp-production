<template>
  <section class="assist-page-containner">
    <Header v-model="condition.Type" @change="getList" @add="onItemSetupClick" />
    <Main :list="DataList" @edit="onItemSetupClick" @remove="onRemoveClick" />
    <Footer :condition="condition" :total="DataNumber" :getList="getList" />
    <Dialog v-model:visible="visible" :item="curEditItem" :list="DataList" @submit="handleItemSubmit"  />
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import Header from '@/components/productionResources/assistInfo/AssistInfoManageHeader.vue';
import Main from '@/components/productionResources/assistInfo/AssistInfoManageMain.vue';
import Footer from '@/components/productionResources/assistInfo/AssistInfoManageFooter.vue';
import Dialog from '@/components/productionResources/assistInfo/AssistInfoManageSetupDialog.vue';
import CommonClassType from '@/store/modules/formattingTime/CommonClassType';
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { AssistListConditionClass as Condition } from './TypeClass/assistListConditionClass';
import type { AssistInfoItem } from './TypeClass/assistInfoItem';
import type { IAssistListItem } from './types';

const condition = ref(new Condition());
const DataList = ref<IAssistListItem[]>([]);
const DataNumber = ref(0);

const getList = async (Page = 1) => { // 获取列表数据
  condition.value.Page = Page;
  DataList.value = [];
  const temp = CommonClassType.filter(condition.value);
  const resp = await api.getResourceNoteList(temp).catch(() => null);
  if (resp?.data?.isSuccess) {
    DataList.value = resp.data.Data;
    DataNumber.value = resp.data.DataNumber;
  }
};

onMounted(() => {
  getList();
});

/** 下面为新增|编辑相关
 ------------------------------------------- */
const visible = ref(false);
const curEditItem = ref<null | IAssistListItem>(null);

const onItemSetupClick = (item: null | IAssistListItem) => { // 新增|编辑 点击事件
  visible.value = true;
  curEditItem.value = item;
};

const handleItemSubmit = (data: AssistInfoItem) => {
  const isEdit = !!curEditItem.value;
  const cb = (temp: IAssistListItem) => {
    visible.value = false;
    // 在列表中处理新增或编辑
    if (!isEdit) {
      DataList.value.unshift(temp);
      DataNumber.value += 1;
    } else {
      const i = DataList.value.findIndex(it => it.NoteID === temp.NoteID);
      if (i > -1) DataList.value.splice(i, 1, temp);
    }
  };
  data.submit(cb);
};

/** 删除
 ------------------------------------------- */
const onRemoveClick = (item: IAssistListItem) => {
  MpMessage.warn({
    title: '确定删除该条辅助信息吗 ?',
    msg: `名称：[ ${item.Name} ]`,
    onOk: () => {
      handleRemove(item.NoteID);
    },
  });
};

const handleRemove = async (NoteID: string) => {
  const resp = await api.getResourceNoteRemove(NoteID).catch(() => null);
  if (resp?.data?.isSuccess) {
    const cb = () => {
      const i = DataList.value.findIndex(it => it.NoteID === NoteID);
      if (i > -1) {
        DataList.value.splice(i, 1);
        DataNumber.value -= 1;
      }
    };

    MpMessage.success({ title: '删除成功', onOk: cb, onCancel: cb });
  }
};

</script>

<script lang='ts'>
export default {
  name: 'assistInfoManagePage',
};
</script>

<style lang='scss' scoped>
.assist-page-containner {
  // margin: 0 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
  > header {
    flex: none;
    display: flex;
    align-items: center;
    height: 75px;
    background-color: #fff;
    padding-left: 20px;
    > :deep(.el-button) {
      width: 130px;
      height: 30px;
      border-radius: 3px;
      margin-right: 40px;
    }
  }
  > main {
    flex: 1;
    margin-top: 10px;
    background-color: #fff;
    overflow: hidden;
    > :deep(.el-table) {
      height: 100%;
      width: 900px;
    }
  }
  > footer {
    flex: none;
    height: 50px;
    background-color: #fff;
    box-sizing: border-box;
    padding-top: 5px;
    :deep(.el-pagination) {
      margin-left: 150px;
    }
  }
}
</style>
