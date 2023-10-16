<template>
  <DialogContainerComp
    :visible='localVisible'
    :width="800"
    title="完成选中任务："
    top="10vh"
    @submit="submit"
    @cancel="localVisible = false"
    primary-text="确定完工"
    class="mp-client-manage-batch-report-batch-confirm-dialog-comp-wrap"
    >
    <ul class="list">
      <li class="item" v-for="it in sectionList" :key="it.NextWorkName + it.EquipmentName">
        <div class="title" v-show="it.NextWorkName || it.EquipmentName">
          <h4>下一道工序：</h4>
          <h4 class="red">{{ it.NextWorkName || '' }}</h4>
          <h2 class="red">{{ it.EquipmentName || '' }}</h2>
        </div>
        <el-table :data="it.list" border stripe class="table-wrap">
          <mp-table-column width="105px" prop="Code" label="任务编号" class-name="code" />
          <mp-table-column min-width="100px" prop="_AssistText" label="辅助信息" class-name="red" />
          <mp-table-column min-width="120px" prop="_Material" label="物料" />
          <mp-table-column min-width="100px" prop="_DetailText" label="信息" />
          <mp-table-column width="85px" prop="_UnFinishNumber" label="数量" />
        </el-table>
      </li>
    </ul>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { getLocalTaskList } from './getLocalTaskList';
import { getNextWorkContent } from '../../CurTaskPanel';

const props = defineProps<{
  visible: boolean
  TaskList: ReturnType<typeof getLocalTaskList>
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

interface ISectionItem {
  NextWorkName: string
  EquipmentName: string
  list: ReturnType<typeof getLocalTaskList>
}

const sectionList = computed(() => {
  const unknowItem: ISectionItem = { NextWorkName: '', EquipmentName: '', list: [] };
  const list: ISectionItem[] = [
    unknowItem,
  ];
  props.TaskList.forEach(task => {
    const temp = getNextWorkContent(task);
    if (!temp) {
      unknowItem.list.push(task);
    }
    const t = list.find(it => it.EquipmentName === temp?.EquipmentName && it.NextWorkName === temp.NextWorkName);
    if (t) {
      t.list.push(task);
    } else if (temp) {
      list.push({ ...temp, list: [task] });
    }
  });

  return list.filter(it => it.list.length > 0);
});

const submit = () => {
  emit('submit');
};

</script>

<style lang='scss'>
@import '@/assets/css/mixins.scss';

.mp-client-manage-batch-report-batch-confirm-dialog-comp-wrap {

  .list {
    margin-top: -12px;
    margin-bottom: -10px;
    padding: 0 20px;

    max-height: 580px;
    min-height: 300px;
    overflow: auto;

    > .item {
      > .title {
        display: flex;
        align-items: flex-end;
        font-family: Microsoft YaHei-Bold, Microsoft YaHei;
        padding-bottom: 6px;
        padding-left: 20px;
        h4 {
          font-size: 15px;
          margin-right: 20px;
        }
        h2 {
          font-size: 18px;
          padding-left: 10px;
        }
        .red {
          color: #D9001B;
        }
      }

      .table-wrap {
        .el-table__header-wrapper {
          display: none;
        }
        .el-table__body-wrapper .el-table__body tbody .el-table__row .el-table__cell {
          text-align: left;
          border-top: 1px solid rgb(235, 238, 245);
          .cell {
            font-size: 13px;
            padding: 0 6px;
          }
          &.red .cell {
            color: #D9001B;
          }
          &.code .cell {
            padding-left: 20px;
          }
        }
      }

      & + .item {
        margin-top: 30px;
      }
    }
  }

  .el-dialog__footer {
    padding-bottom: 26px;
  }
}

</style>
