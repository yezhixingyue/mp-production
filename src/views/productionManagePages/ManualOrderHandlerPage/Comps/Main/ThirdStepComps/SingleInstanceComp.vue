<template>
  <div class="single-instance-comp-wrap">
    <ul class="left">
      <li>
        <h2>{{ isCombineLine ? item.SemiFinished?.Name : item._originLineData?.Name }}</h2>
      </li>
      <li v-if="isCombineLine">
        <h4 class="mr-15">{{ item._originLineData?.Name }}</h4>
        <h4 v-if="item.ForbitUnionMakeup">禁止印刷版合拼 <i v-if="item.NeedSetPlateSize" style="font-weight: 400;font-size: 13px;">(手动设置拼版尺寸)</i> </h4>
      </li>
      <li class="summary">
        <span class="title is-pink" v-if="isCombineLine">{{ item.Number }}{{ item.Unit }}</span>
        <span class="title">
          {{ item.Width }}×{{ item.Height }}mm
        </span>
        <span class="title">{{ item.PrintSide === PrintSideEnum.double ? '双面印' : '单面印' }}</span>
        <span class="title">印色：{{ getColorDisplayContent(item.ColorList) }}</span>
      </li>
      <li v-if="!isCombineLine && item.ForbitUnionMakeup">
        <h4>禁止印刷版合拼 <i v-if="item.NeedSetPlateSize" style="font-weight: 400;font-size: 13px;">(手动设置拼版尺寸)</i></h4>
      </li>
      <li>
        <span>{{ item._MaterialName }}</span>
      </li>
      <li>
        <span class="mr-2">
          {{getEnumNameByID(item.MaterialSource, PlaceOrderMaterialSourceEnumList)}}
          <template v-if="item.MaterialSource!==PlaceOrderMaterialSourceEnum.warehouse">(物料尺寸：{{ item.MaterialWidth }}×{{ item.MaterialHeight }}mm)</template>
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
        <span>
          <i v-for="(it, i) in worksDisplayList" :key="i">
            <template v-if="i > 0">、</template>
            {{ it.Name }}
            <em v-show="it.Content" class="is-gray ft-12">({{ it.Content }})</em>
          </i>
        </span>
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
            <span :title="getBleedContent(it)" v-if="getBleedContent(it)"
             style="flex: 1 0 auto;margin-left: 20px;">出血:{{ getBleedContent(it) }}</span>
          </p>
        </div>
      </li>
      <li v-if="props.item.NeedFolding" class="fold-set">
        <div class="f">
          <h4>需要折手 </h4>
          <span v-if="item.NeedSheetIndex">{{ item.NeedSheetIndex ? '添加帖标' : '不添加帖标' }}</span>
          <span v-if="item.FeedEdgePosition !== FeedEdgePositionEnum.None">
            <template v-if="item.FeedEdgePosition === FeedEdgePositionEnum.Front">前叼口空白尺寸：{{ item.FeedEdgeValue }}mm</template>
            <template v-if="item.FeedEdgePosition === FeedEdgePositionEnum.Back">后叼口空白尺寸：{{ item.FeedEdgeValue }}mm</template>
          </span>
          <span v-if="item.MillingValue">铣背深度：{{ item.MillingValue }}mm</span>
        </div>
        <div v-if="item.MoveType !== MoveTypeEnum.None">
          <h4>爬移使用{{ getEnumNameByID(item.MoveType, MoveTypeEnumList) }} </h4>
          <span v-if="item._CheckedMoveIn">内爬移：{{ item.MoveInValue }}mm </span>
          <span v-if="item._CheckedMoveOut">外爬移：{{ item.MoveOutValue }}mm</span>
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
      <li v-if="_NumbericalList.length > 0">
        <span class="title">数值设置:</span>
        <div class="f-list">
          <span v-for="(it, i) in _NumbericalList" :key="it.ID">
            <template v-if="i > 0">、</template>
            {{ it._Name }}
            <i class="ft-12 is-gray">({{ it.Value }})</i>
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang='ts'>
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { computed } from 'vue';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { MoveTypeEnumList, PlaceOrderMaterialSourceEnumList } from '../../../js/EnumList';
import {
  FeedEdgePositionEnum, MoveTypeEnum, PlaceOrderMaterialSourceEnum, PrintColorEnum, PrintSideEnum,
} from '../../../js/enums';
import { PlaceOrderProductionInstance } from '../../../js/PlaceOrderProductionInstance';
import { getWorkProcessContent } from './utils';
import { getBleedContent } from '../../../js/utils';

const props = defineProps<{
  item: Required<PlaceOrderProductionInstance>
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

const worksDisplayList = computed(() => getWorkProcessContent(props.item.WorkingList, props.item.AssistList));

/** 当前生产线类型：单一或组合 */
const isCombineLine = computed(() => props.item._isBelongToCombineLine);

/** 拼版文件列表 */
const _MakeupFileList = computed(() => props.item.FileList.filter(it => it._PlateTemplate));

/** 辅助文件列表 */
const _AssistFileList = computed(() => props.item.FileList.filter(it => it._NoteInfo));

/** 专色文件列表 */
const _SpecialColorFileList = computed(() => props.item.FileList.filter(it => it.SpecialColorList));

/** 数值列表 */
const _NumbericalList = computed(() => props.item.AssistList.filter(it => it.Type === AssistInfoTypeEnum.numerical));

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
                width: 150px;
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

        &.fold-set {
          display: flex;
          flex-direction: column;
          margin-top: -8px;
          > div:not(:last-of-type) {
            padding-bottom: 10px;
          }

          > div {
            display: flex;
            align-items: center;
            > span:not(:last-of-type) {
              margin-left: 2px;
              &::after {
                content: '，';
                display: inline-block;
              }
            }
            > span:first-of-type {
              &::before {
                content: "：";
                display: inline-block;
              }
            }
          }

          h4 {
            font-size: 14px;
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
