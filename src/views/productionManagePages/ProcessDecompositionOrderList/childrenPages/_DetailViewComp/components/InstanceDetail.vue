<template>
  <div class="instance-detail" :class="{isCombine}">
    <!-- 标题等 -->
    <h4 class="title">
      <div v-if="!isInstance(item) && item.SemiFinished">半成品：{{ item.SemiFinished.Name }}</div>
      <div>生产线：{{ item.LineList?.[0]?.Name }}
        <template v-if="isCombine">( 组合生产线 )</template>
      </div>
      <div class="m" v-if="!isInstance(item) && !isCombine">主料：{{ item.Attribute.Material.Name }}</div>
    </h4>

    <!-- 工序 -->
    <h5>生产工序：</h5>
    <table>
      <tbody>
        <tr v-for="work in item.WorkingList" :key="work.WorkingID">
          <td>
            <span class="cell" style="width: 13em;">{{ work.WorkingName }}</span>
          </td>
          <td>
            <span class="cell" style="width: 44.8em;text-align: left;padding-left: 1em;color: #888;"
            :title="work.AssistList?.filter(it => !!it.Content).map(it => `${it.Name}：${it.Content}`).join('/r/n')"
            >{{ work.AssistList?.filter(it => !!it.Content).map(it => `${it.Name}：${it.Content}`).join('；') }}</span>
          </td>
          <td>
            <span class="cell" style="width: 10em;">作业次数：{{ work.WorkTimes }}次</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 拼版文件 -->
    <div v-if="MakeupFileList.length">
      <div class="m-t" style="margin-top: 12px;">
        <h5>拼版文件：</h5>
        <div v-if="!isCombine && !isInstance(item)">
          <span>印刷版禁止合拼：[ {{ item.ForbitUnionMakeup ? '是' : '否' }} ]</span>
          <span>需要折手：[ {{ item.NeedFolding ? '是' : '否' }} ]</span>
          <template v-if="item.NeedFolding">
            <span v-if="item.NeedSheetIndex">贴标：[ {{ item.NeedSheetIndex ? '是' : '否' }} ]</span>
            <span v-if="item.MoveType === MoveTypeEnum.Zoom">爬移：[ {{ item.MoveType === MoveTypeEnum.Zoom ? item.MoveInValue : '否' }} ]</span>
            <span v-if="item.GripperEdgePosition === FeedEdgePositionEnum.Front"
              >掀口：[ {{ item.GripperEdgePosition === FeedEdgePositionEnum.Front ? item.GripperEdgeValue : '否' }} ]</span>
            <span v-if="item.HaveMilling">铣背：[ {{ item.HaveMilling ? item.MillingValue : '否' }} ]</span>
          </template>
        </div>
      </div>
      <table>
        <tbody>
          <tr v-for="(it, i) in MakeupFileList" :key="i">
            <td>
              <span class="cell" style="width: 13em;">{{ it.Template?.Name || '' }}</span>
            </td>
            <td>
              <span class="cell filename" style="width: 22em;text-align: left;padding-left: 1em;color: #888;"
               :title="it.FileName" v-html="getFileNameContentHtml(it.FileName)" />
            </td>
            <td>
              <span class="cell" style="width: 7em;">
                <template v-if="it.Width > 0 || it.Height > 0">{{ +it.Width.toFixed(1) }}×{{ +it.Height.toFixed(1) }}mm</template>
              </span>
            </td>
            <td>
              <span class="cell" style="width: 4em;">
                <template v-if="it.FileName">{{ it.PageNumber }}页</template>
              </span>
            </td>
            <td>
              <span class="cell" style="width: 21em;" :title="getBleedContent(it, false, it.Template)" v-html="getBleedContent(it, true, it.Template)"></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 辅助文件 -->
    <h5 v-if="AssistFileList.length" style="margin-top: 12px;">辅助文件：</h5>
    <table v-if="AssistFileList.length">
      <tbody>
        <tr v-for="(it, i) in AssistFileList" :key="i">
          <td>
            <span class="cell" style="width: 13em;">{{ it.NoteInfo?.Name || '' }}</span>
          </td>
          <td>
            <span class="cell " style="width: 55.1em;text-align: left;padding-left: 1em;"
             :title="it.children.map(c => c.FileName).filter(n => n).join('\r\n')">
              <span v-for="(file, index) in it.children" :key="index" class="ellipsis filename"
                v-html="getFileNameContentHtml(file.FileName, { index, len:it.children.length, digit: 4 })"></span>
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 专色文件 -->
    <h5 v-if="ColorFileList.length" style="margin-top: 12px;">专色文件：</h5>
    <table v-if="ColorFileList.length">
      <tbody>
        <tr v-for="(it, i) in ColorFileList" :key="i">
          <td>
            <span class="cell" style="width: 13em;">{{ it.ColorName }}</span>
          </td>
          <td>
            <span class="cell filename" style="width: 55.1em;text-align: left;padding-left: 1em;"
             :title="it.FileName" v-html="getFileNameContentHtml(it.FileName)"></span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 数值 -->
    <h5 v-if="AssistNumbericList.length" style="margin-top: 12px;">数值列表：</h5>
    <table v-if="AssistNumbericList.length">
      <tbody>
        <tr v-for="(it, i) in AssistNumbericList" :key="i">
          <td>
            <span class="cell" style="width: 13em;">{{ it.Name }}</span>
          </td>
          <td>
            <span class="cell filename" style="width: 55.1em;text-align: left;padding-left: 1em;">{{ it.Value }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { MoveTypeEnum, FeedEdgePositionEnum } from '@/views/productionManagePages/ManualOrderHandlerPage/js/enums';
import { IBaseProperty } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { TCraftResolveDetail, TDetailInstance } from '../../../types/types';
import { getBleedContent } from '../../PDOSetupView/components/PDOLineInstanceComps/hooks/useBleedSetup';
import { getDetailAssistFileList, getFileNameContentHtml } from '../../PDOSetupView/components/PDOLineInstanceComps/js/tools';

const props = defineProps<{
  item: TDetailInstance | TCraftResolveDetail
  ColorList?: IBaseProperty<string>[]
  isCombine?: boolean
}>();

// eslint-disable-next-line max-len
const isInstance = (data: TDetailInstance | TCraftResolveDetail): data is TCraftResolveDetail => !!((data as TCraftResolveDetail).InstanceList || (data as TCraftResolveDetail).CraftResolve);

/** 拼版文件列表 */
const MakeupFileList = computed(() => props.item.FileList.filter(it => it.Template));

/** 辅助文件列表 */
const AssistFileList = computed(() => getDetailAssistFileList(props.item));

/** 专色文件列表 */
const ColorFileList = computed(() => props.item.FileList.filter(it => it.ColorList && it.ColorList.length > 0).map(it => {
  const colorId = it.ColorList?.[0];
  const colorList = props.ColorList || [];
  const t = colorList.find(it => it.ID === colorId);
  return {
    ...it,
    ColorName: t?.Name || '未知专色',
  };
}));

/** 数值列表 */
const AssistNumbericList = computed(() => props.item.AssistList?.filter(it => it.Type === AssistInfoTypeEnum.numerical) || []);
</script>

<style scoped lang='scss'>
.instance-detail {
  font-family: "Arial Negreta", "Arial Normal", "Arial", sans-serif;
  width: 960px;
  white-space: nowrap;
  font-size: 13px;
  margin-bottom: 15px;
  line-height: 26px;
  overflow: hidden;
  background-color: #fff;
  padding: 20px 20px;
  border-radius: 5px;
  // box-shadow: 0 0 10px rgba($color: #000000, $alpha: 0.06);

  h5 {
    font-size: inherit;
  }

  .title {
    display: flex;
    align-items: center;
    font-size: 16px;
    border-bottom: 1px solid #444;
    line-height: 20px;
    margin-bottom: 15px;
    padding: 0 25px;
    position: relative;
    top: -5px;

    .m {
      font-weight: 400;
    }

    div {
      margin-right: 28px;
      flex: 0 1 auto;
    }
  }

  > div.item {
    display: flex;
    margin-bottom: 10px;
  }

  .filename {
    flex: 0 1 auto;
    overflow: hidden;
    display: flex !important;
    margin-right: 3px;
    color: #888;

    :deep(> em) {
      flex: none;
      left: 0 !important;
    }
    :deep(> i) {
      flex: 0 1 auto;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: inline-block;
      vertical-align: top;
    }
  }

  .make-file-list {
    > li {
      > span {
        flex: none;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 1em;
      }
    }
  }

  .assist-file-list {
    flex: 0 1 auto;
    overflow: hidden;
    display: flex !important;
    align-items: center;
  }

  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  li {
    display: flex;
    .name {
      width: 11em;
      margin-right: 1em;
      flex: none;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .grow {
    flex: 1;
    overflow: hidden;
  }

  h5 {
    width: 5em;
    margin-left: 42px;
    margin-right: 10px;
    flex: none;
  }

  ul {
    flex: 1;
    overflow: hidden;
    margin-right: 1em;
  }

  .m-t {
    display: flex;
    align-items: baseline;

    > div {
      // color: #666;
      > span {
        margin-right: 25px;
        // font-weight: 700;
      }
    }

    & + ul {
      margin-left: calc(65px + 5em);
      margin-bottom: 10px;
    }
  }

  table {
    border-collapse: collapse;
    text-align: center;
    margin-left: 40px;
    // width: calc(100% - 65px);
    overflow: hidden;
    td {
      border: 1px solid #cbcbcb;
      padding: 8px 2px;
      line-height: 18px;

      .cell {
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;;
      }
    }

    tr {
      transition: background-color 0.1s ease-in-out;
      &:nth-of-type(even) {
        background-color: #f5f5f5;
      }
      &:hover {
        background-color: lighten($color: #26bcf9, $amount: 40);
      }
    }
  }

  // &.isCombine {
  //   h4.title {
  //     font-size: 20px;
  //     line-height: 24px;
  //   }
  // }
}
</style>
