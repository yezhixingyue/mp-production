<template>
  <section class="assist-position-view-wrap">
    <header>
      <MpBreadcrumb :list="breadcrumbList" />
    </header>

    <main>
      <ul>
        <li v-for="it in NoteDisplayPositionList" :key="it.ID" class="position-item">
          <h2 class="mp-common-title-wrap black mb-10" style="font-size: 15px;">{{ it.Name }}：</h2>
          <mp-button type="primary" class="btn" @click="onClick(it)">选择辅助信息</mp-button>

          <div class="content">
            <div v-for="(typeItem, i) in getContentList(it.Notes)" :key="i" class="c-item">
              <h4 style="flex: none;width: 5em;">{{ getEnumNameByID(typeItem[0], AssistInfoTypeEnums) }}：</h4>
              <span>{{ typeItem[1].map(it => it.Name).join('、') }}</span>
            </div>
          </div>
        </li>
      </ul>

      <SelectAssistInfoDialog v-model:visible="visible" :setupTarget="setupTarget" @submit="submit" />
    </main>

    <footer>
      <mp-button class="blue" @click="getGoBackFun">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import api from '@/api';
import { getGoBackFun } from '@/router';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ref } from 'vue';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { AssistInfoTypeEnums } from '@/views/productionResources/assistInfo/types/enum';
import { onBeforeRouteLeave } from 'vue-router';
import { useNoteDisplayPositionList } from './hooks/useNoteDisplayPositionList';
import { INoteDisplayPosition } from '../types';
import SelectAssistInfoDialog from './components/SelectAssistInfoDialog.vue';
import { isLeaveFromAssistPosSetupView } from '../store';

const breadcrumbList = [
  { to: { path: '/assistInfo' }, name: '辅助信息' },
  {
    name: '设置辅助信息显示位置',
  },
];

const { NoteDisplayPositionList } = useNoteDisplayPositionList();

const visible = ref(false);
const setupTarget = ref<null | INoteDisplayPosition>(null); // 设置目标对象
const onClick = (row: INoteDisplayPosition) => {
  setupTarget.value = row;
  visible.value = true;
};

const getContentList = (Notes: INoteDisplayPosition['Notes']) => {
  const m = new Map<number, INoteDisplayPosition['Notes']>();
  Notes.forEach(n => {
    const t = m.get(n.Type);
    if (t) {
      t.push(n);
    } else {
      m.set(n.Type, [n]);
    }
  });

  const list = Array.from(m);
  return list;
};

const submit = async (Notes: INoteDisplayPosition['Notes']) => {
  if (!setupTarget.value) return;
  const temp = {
    ID: setupTarget.value.ID,
    Notes,
  };
  const resp = await api.getNoteSetPosition(temp);
  if (resp.data?.isSuccess) {
    const cb = () => {
      setupTarget.value!.Notes = Notes;
      visible.value = false;
    };
    MpMessage.dialogSuccess({ title: '保存成功', onOk: cb, onCancel: cb });
  }
};

isLeaveFromAssistPosSetupView.value = false;
onBeforeRouteLeave((to, from) => {
  isLeaveFromAssistPosSetupView.value = to.name === 'assistInfo';
  return true;
});

</script>

<script lang='ts'>
export default {
  name: 'AssistPositionSetupView',
};
</script>

<style scoped lang='scss'>
.assist-position-view-wrap {
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;

  > header {
    flex: none;
    padding: 20px;
  }

  > main {
    flex: 1;
    overflow: hidden;
    padding: 0 20px;
    max-width: 860px;

    > ul {
      max-height: 100%;
      overflow: auto;
    }

    .position-item {
      .btn {
        height: 28px;
        width: 110px;
        padding: 0;
        display: block;
        font-size: 12px;
      }

      .content {
        margin-top: 10px;
        margin-bottom: 20px;
        min-height: 72px;

        .c-item {
          display: flex;
          line-height: 20px;
          margin-bottom: 5px;

          > h4 {
            text-align: right;
          }

          > span {
            font-size: 12px;
          }
        }
      }
    }
  }

  > footer {
    flex: none;
    text-align: center;
    padding: 20px 20px 40px 20px;
    max-width: 860px;

    button {
      width: 120px;
      height: 36px;
    }
  }
}
</style>
