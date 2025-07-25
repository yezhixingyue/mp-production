<template>
  <DialogContainerComp
    :title="`匹配${title}`"
    :visible='visible'
    :width="700"
    @open="onOpen"
    @submit="submit"
    @cancel="visible = false"
    primary-text="确定"
    >
    <div class="main" :class="`${props.type}`">
      <table>
        <thead>
          <tr>
            <th>{{ title }}</th>
            <th>审稿文件</th>
            <th v-if="type!=='assist'">尺寸</th>
            <th v-if="type!=='assist'">页数</th>
            <th>选择文件</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(it) in leftDataList" :key="it.row.ID">
            <td :title="it.row.Name">{{ it.row.Name }}</td>
            <td :title="it.ReviewFiles.map(_it => [_it.PartName, _it.FileName].filter(_it => _it).join('-')).join('\r\n')">
              <span>{{ it.ReviewFiles.map(_it => [_it.PartName, _it.FileName].filter(_it => _it).join('-')).join('；') }}</span>
            </td>
            <td v-if="type!=='assist'">{{ it.size }}</td>
            <td v-if="type!=='assist'">{{ it.pager }}</td>
            <td class="w-operator">
              <mp-button type="primary" class="ft-12" link @click="onclick(it)">选择</mp-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </DialogContainerComp>

  <FileMapSelectDialog v-if="currentLeftRow"
   v-model:visible="selectVisible"
   v-model:map-ids="currentLeftRow.mapIds"
   :list="rightFileList" :type="type" :disabledIds="selectDisabledList" />
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IOrderFileInfo, IPDOrderItem } from '@/views/productionManagePages/ProcessDecompositionOrderList/types/types';
import { ILineWorkingNoteInfo } from '@/views/productionManagePages/ManualOrderHandlerPage/js/ProductionLineDetailTypes';
import { FileMatchType } from './hooks/useFileMatch';
import { PDOSetupViewStore } from '../../store/PDOSetupViewStore';
import FileMapSelectDialog from './FileMapSelectDialog.vue';

const props = defineProps<{
  type: FileMatchType
  FileList: IOrderFileInfo[]
}>();

const emit = defineEmits(['submit']);

const visible = defineModel('visible', { type: Boolean });

const title = computed(() => {
  switch (props.type) {
    case 'makeup':
      return '拼版文件';
    case 'assist':
      return '辅助文件';
    default:
      return '专色文件';
  }
});

const leftList = ref<{ ID: string; Name: string; mapIds: string[]; _NoteInfo?: ILineWorkingNoteInfo }[]>([]);
const rightFileList = ref<IPDOrderItem['FileList']>([]);

const leftDataList = computed(() => leftList.value.map(it => {
  const ReviewFiles = rightFileList.value.filter(file => it.mapIds.includes(file.FilePath));
  const targetItem = props.type === 'assist' ? undefined : ReviewFiles[0];

  const _size = [targetItem?.Width, targetItem?.Height].filter(num => typeof num === 'number').map(num => Number((num as number).toFixed(1))).join('x');

  return {
    row: it,
    ReviewFiles,
    size: _size ? `${_size}mm` : '',
    pager: targetItem?.PageNumber || '',
  };
}));

const onOpen = () => {
  leftList.value = [];
  rightFileList.value = [];

  if (!PDOSetupViewStore.value) {
    return;
  }

  props.FileList.forEach(it => {
    switch (props.type) {
      case 'makeup':
        if (it._PlateTemplate) {
          leftList.value.push({
            ID: it._PlateTemplate.ID,
            Name: it._PlateTemplate.Name,
            mapIds: !it._File && it.FileName && it.DownloadPath ? [it.DownloadPath] : [],
          });
        }
        break;

      case 'assist':
        if (it._NoteInfo) {
          let t = leftList.value.find(_it => _it.ID === it._NoteInfo?.ID);
          if (!t) {
            t = {
              ID: it._NoteInfo.ID,
              Name: it._NoteInfo.Name,
              mapIds: [],
              _NoteInfo: it._NoteInfo,
            };
            leftList.value.push(t);
          }
          if (!it._File && it.FileName && it.DownloadPath) {
            t.mapIds.push(it.DownloadPath);
          }
        }
        break;

      case 'color':
        if (it._SpecialColorInfo) {
          leftList.value.push({
            ID: it._SpecialColorInfo.ID,
            Name: it._SpecialColorInfo.Name,
            mapIds: !it._File && it.FileName && it.DownloadPath ? [it.DownloadPath] : [],
          });
        }
        break;

      default:
        break;
    }
  });

  rightFileList.value = PDOSetupViewStore.value.rowItem.FileList.filter(it => {
    if (props.type === 'assist') return true;

    return it.FilePath.endsWith('.pdf');
  });
};

const currentLeftRow = ref<typeof leftList.value[number] | null>(null);
const selectVisible = ref(false);
const selectDisabledList = computed(() => {
  if (props.type === 'assist') return [];

  return leftList.value.filter(it => it.ID !== currentLeftRow.value?.ID).map(it => it.mapIds).flat();
});
const onclick = (leftRow: typeof leftDataList.value[number]) => {
  currentLeftRow.value = leftRow.row;
  selectVisible.value = true;
};

const submit = () => {
  visible.value = false;

  emit('submit', leftDataList.value);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.main {
  min-height: 300px;

  table {
    width: 100%;
    border-collapse: collapse;
    tr {
      border: 1px solid #E5E5E5;
      text-align: center;
      line-height: 16px;

      th {
        background-color: #F5F5F5;
        font-weight: 700;
        padding: 8px 0;
      }

      td {
        font-size: 12px;
        padding: 10px 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:nth-of-type(1) {
          width: 120px;
          max-width: 120px;
        }

        &:nth-of-type(2) {
          width: 300px;
          max-width: 300px;
        }

        &:nth-of-type(3) {
          width: 100px;
          max-width: 100px;
        }

        &:nth-of-type(4) {
          width: 35px;
          max-width: 35px;
        }

        &:last-of-type {
          width: 80px;
          max-width: 80px;
        }
      }
    }

    tbody {
      tr {
        &:nth-of-type(even) {
          background-color: #f5f5f5;
        }
      }
    }
  }

  &.assist {
    table tr {
      td:last-of-type {
        width: 60px;
        max-width: 60px;
      }
    }
  }
}
</style>
