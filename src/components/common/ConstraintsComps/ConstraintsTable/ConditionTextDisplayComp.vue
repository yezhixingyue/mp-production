<template>
  <el-tooltip v-if="props.conditionObj" effect="light" popper-class='common-property-condition-text-tips-box' placement="bottom-start" :show-arrow='false'>
    <template #content>
      <div>
        <p class="if-box"><span class="is-orange">如果</span> {{props.conditionObj._FilterTypeText}}：</p>
        <template v-if="Array.isArray(props.conditionObj._contentTextList)">
          <p v-for="(it, i) in props.conditionObj._contentTextList" :key="it.name + 'tips' + i">
            <span v-if="i > 0" class="type is-orange mr-2">{{props.conditionObj.FilterType === 1 ? '且' : '或'}}</span>
            <span class="name">{{it.name}}</span>
            <span class="is-orange">{{it.operator}}</span>
            <span class="val">{{it.val}}</span>
            <span v-if="i === props.conditionObj._contentTextList.length - 1" style="margin-left:2px"> 。</span>
            <span v-else style="margin-left:2px">；</span>
          </p>
        </template>
        <p v-else>{{props.conditionObj._contentTextList}}</p>
        <p class="if-box" style="margin-right:5px">
          <span class="is-orange">{{props.content || '则 生效。'}}</span>
        </p>
      </div>
    </template>
    <div class="common-property-condition-text-content-box">
      <p class="if-box"><span class="is-orange">如果</span>
          <span class="is-bold">{{props.conditionObj._FilterTypeText}}</span></p>
      <template v-if="Array.isArray(props.conditionObj._contentTextList)">
        <p v-for="(it, i) in props.conditionObj._contentTextList" :key="it.name + 'content' + i">
          <span v-if="i > 0" class="type">{{props.conditionObj.FilterType === 1 ? '且' : '或'}}</span>
          <span>{{it.name}}</span>
          <span>{{it.operator}}</span>
          <span>{{it.val}}</span>
        </p>
      </template>
      <p v-else>{{props.conditionObj._contentTextList}}</p>
      <p class="if-box" style="margin-left:10px;margin-right:5px">
        <span class="is-orange">{{props.content || '则 生效。'}}</span>
      </p>
    </div>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { IConditionDisplayItemObj } from './utils';

const props = withDefaults(defineProps<{
  conditionObj: IConditionDisplayItemObj | null,
  content?: string
}>(), {
  content: '',
});

</script>
<style lang='scss'>
.common-property-condition-text-tips-box {
  line-height: 24px;
  color: #585858;
  min-width: 180px;
  .name {
    color: #33BBD5;
  }
  .val {
    color: #888;
    font-weight: 700;
  }
  .type {
    // font-weight: 700;
    margin-right: 2px;
  }
  .if-box {
    font-weight: 700;
  }
}

.common-property-condition-text-content-box {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  > p {
    flex: 1 0 auto;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline;
    > span {
      color: #585858;
      &:last-of-type {
        color: #888;
        font-weight: 700;
      }
      &.type {
        color: #f4a307;
        margin: 0 6px;
      }
    }
    &.if-box {
      > span {
        margin-right: 12px;
        font-weight: 400;
        color: #f4a307;
        &.is-bold {
          font-weight: 700;
          color: #444;
        }
      }
    }
  }
}
</style>
