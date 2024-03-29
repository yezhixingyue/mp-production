<template>
  <div class="single-instance-comp-wrap">
    <ul class="left">
      <li>
        <h2>{{ isCombineLine ? item.SemiFinished.Name : item._originLineData?.Name }}</h2>
      </li>
      <li v-if="isCombineLine">
        <h4 class="mr-15">{{ item._originLineData?.Name }}</h4>
        <h4 v-if="item.ForbitUnionMakeup">禁止印刷版合拼</h4>
      </li>
      <li class="summary">
        <span class="title is-pink" v-if="isCombineLine">{{ item.Number }}{{ item.Unit }}</span>
        <span class="title">
          {{ item.Length }}×{{ item.Width }}mm
        </span>
        <span class="title">{{ item.PrintSide === PrintSideEnum.double ? '双面印' : '单面印' }}</span>
        <span class="title">印色：{{ getColorDisplayContent(item.ColorList) }}</span>
      </li>
      <li v-if="!isCombineLine && item.ForbitUnionMakeup">
        <h4>禁止印刷版合拼</h4>
      </li>
      <li>
        <span>{{ item._MaterialName }}</span>
      </li>
      <li>
        <span class="mr-2">
          {{getEnumNameByID(item.MaterialSource, PlaceOrderMaterialSourceEnumList)}}
          <template v-if="item.MaterialSource!==PlaceOrderMaterialSourceEnum.warehouse">(物料尺寸：{{ item.MaterialLength }}×{{ item.MaterialWidth }}mm)</template>
          {{item.MaterialSource===PlaceOrderMaterialSourceEnum.homePickup ? ':' : ''}}
        </span>
      </li>
      <li v-if="item.MaterialSource===PlaceOrderMaterialSourceEnum.homePickup" class="column">
        <p>{{ item.Address.AddressDetail }}</p>
        <p>
          <span class="mr-5">{{ item.Address.Consignee }}</span>
          <span>{{ item.Address.Mobile }}</span>
        </p>
      </li>
    </ul>
    <ul class="right">
      <li>
        <span class="title">生产工序:</span>
        <span>{{ worksDisplayContent }}</span>
      </li>
      <li v-if="_MakeupFileList.length > 0">
        <span class="title">拼版文件:</span>
        <div class="f-list">
          <p v-for="it in _MakeupFileList" :key="it.Template?.ID">
            <span class="file-type-name" :title="it._PlateTemplate?.Name">{{ it._PlateTemplate?.Name }}</span>
            <span class="file-name" :title='it._File?.name' v-if="it._File">
              <!-- <i>{{ it._File.name.replace(/\.\w+$/, '') }}</i>
              <em >{{ it._File.name.match(/.[^.]+$/)?.[0] || ''}}</em> -->
              <i v-if="it._File.name.length > 6">{{ it._File.name.slice(0, -6) }}</i>
              <i v-else>{{ it._File.name }}</i>
              <em v-if="it._File.name.length > 6">{{ it._File.name.slice(-6) }}</em>
            </span>
          </p>
        </div>
      </li>
      <li v-if="_AssistFileList.length > 0">
        <span class="title">辅助文件:</span>
        <div class="f-list">
          <p v-for="it in _AssistFileList" :key="it._NoteInfo?.ID">
            <span class="file-type-name" :title="it._NoteInfo?.Name">{{ it._NoteInfo?.Name }}</span>
            <span class="file-name" :title='it._File?.name' v-if="it._File">
              <!-- <i>{{ it._File.name.replace(/\.\w+$/, '') }}</i>
              <em >{{ it._File.name.match(/.[^.]+$/)?.[0] || ''}}</em> -->
              <i v-if="it._File.name.length > 6">{{ it._File.name.slice(0, -6) }}</i>
              <i v-else>{{ it._File.name }}</i>
              <em v-if="it._File.name.length > 6">{{ it._File.name.slice(-6) }}</em>
            </span>
          </p>
        </div>
      </li>
      <li v-if="_SpecialColorFileList.length > 0">
        <span class="title">印刷专色:</span>
        <div class="f-list">
          <p v-for="it in _SpecialColorFileList" :key="it._SpecialColorInfo?.ID">
            <span class="file-type-name" :title="it._SpecialColorInfo?.Name">{{ it._SpecialColorInfo?.Name }}</span>
            <span class="file-name" :title='it._File?.name' v-if="it._File">
              <!-- <i>{{ it._File.name.replace(/\.\w+$/, '') }}</i>
              <em >{{ it._File.name.match(/.[^.]+$/)?.[0] || ''}}</em> -->
              <i v-if="it._File.name.length > 6">{{ it._File.name.slice(0, -6) }}</i>
              <i v-else>{{ it._File.name }}</i>
              <em v-if="it._File.name.length > 6">{{ it._File.name.slice(-6) }}</em>
            </span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang='ts'>
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { computed } from 'vue';
import { PlaceOrderMaterialSourceEnumList } from '../../../js/EnumList';
import { PlaceOrderMaterialSourceEnum, PrintColorEnum, PrintSideEnum } from '../../../js/enums';
import { PlaceOrderProductionInstance } from '../../../js/PlaceOrderProductionInstance';

const props = defineProps<{
  item: PlaceOrderProductionInstance
}>();

const getColorDisplayContent = (ColorList: PrintColorEnum[]) => {
  const list: string[] = [];
  Object.entries(PrintColorEnum).forEach(([key, val]) => {
    if (typeof val !== 'string' && ColorList.includes(val)) {
      list.push(key);
    }
  });
  return list.join('');
};

const worksDisplayContent = computed(() => {
  const list = props.item.WorkingList.map(it => {
    const { Name } = it;
    const content = it.NoteInfos
      .filter(it => it.Type === AssistInfoTypeEnum.text)
      .map(it => props.item.AssistList.find(_it => _it.ID === it.ID))
      .filter(it => it && it.Content)
      .map(it => it?.Content)
      .join(',');
    if (content) return `${Name}（${content}）`;
    return Name;
  });
  return list.join('、');
});

/** 当前生产线类型：单一或组合 */
const isCombineLine = computed(() => props.item._isBelongToCombineLine);

/** 拼版文件列表 */
const _MakeupFileList = computed(() => props.item.FileList.filter(it => it._PlateTemplate));

/** 辅助文件列表 */
const _AssistFileList = computed(() => props.item.FileList.filter(it => it._NoteInfo));

/** 专色文件列表 */
const _SpecialColorFileList = computed(() => props.item.FileList.filter(it => it.SpecialColorList));

</script>

<style scoped lang='scss'>
.single-instance-comp-wrap {
  width: 100%;
  display: flex;
  border-top: 1px solid #d4d4d4;
  font-size: 13px;
  > ul {
    box-sizing: border-box;
    padding-right: 12px;
    padding-top: 20px;
    padding-bottom: 10px;
    li {
      line-height: 18px;
      padding-bottom: 12px;
      display: flex;
      flex-wrap: wrap;
      &.column {
        flex-direction: column;
      }
      &.summary {
        span {
          margin-right: 15px;
          &:last-of-type {
            margin-right: 0;
          }
        }
      }
      .title {
        font-weight: 700;
        margin-right: 10px;
        flex: none;
        font-size: 14px;
      }
      h2 {
        font-size: 18px;
        width: 100%;
        padding-bottom: 4px;
        text-indent: 96px;
      }
      h4 {
        font-size: 15px;
      }
    }
    &.left {
      flex: 1;
      padding-left: 112px;
    }
    &.right {
      flex: none;
      width: 769px;
      padding-left: 100px;
      border-left: 1px solid #d4d4d4;
      li {
        flex-wrap: nowrap;
        overflow: hidden;
        .f-list {
          flex: 1;
          overflow: hidden;
          p {
            display: flex;
            width: 100%;
            padding-bottom: 10px;
            > span {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              &.file-type-name {
                flex: none;
                width: 165px;
                padding-right: 15px;
              }
              &.file-name {
                display: flex;
                > i {
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
              }
            }
          }
        }
      }
    }
  }
  &:last-of-type {
    border-bottom: 1px solid #d4d4d4;
  }
}
</style>
