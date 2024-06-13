<template>
  <DialogContainerComp
    :visible='localVisible'
    :width="628"
    title="时间线"
    :showPrimary="false"
    :loading="loading"
    top="10vh"
    @open="onOpen"
    @cancel="localVisible = false"
    closeBtnText="关闭"
    >
    <div class="time-line-content" v-loading="loading">
      <!-- 顶部文字说明 -->
      <p class="header" v-if="row">
        <span>{{ row.ServerName }}</span>
        <span class="ml-15 mr-50">{{ row.OrderCode }}</span>
        <span>{{ [row.FirstLevel, row.SecondLevel, row.ProductName].filter(it => it).join('-') }}</span>
      </p>

      <el-empty v-if="!loading && (!lineData || lineData.length === 0)" description="暂无时间线" />

      <!-- 时间线展示列表 -->
      <ul v-else class="list">
        <li v-for="(node, i) in lineData" :key="i" class="item" :class="{active: node.ShowFocus, complete: !node.ShowFocus && node._IsBegin}">
          <div class="left">
            <div class="f">
              <span v-if="node.Operator">{{ node.Operator }}</span>
              <i v-if="node.Operator">/</i>
              <h4>{{ node.Description }}</h4>
            </div>
            <p class="time">{{ node._IsBegin ? format2MiddleLangTypeDateFunc2(node.OperateTime) : '' }}</p>
          </div>
          <div class="center">
            <i class="point"></i>
          </div>
          <div class="right">
            <el-progress :percentage="100" :show-text="false" :stroke-width="4" />
          </div>
        </li>
      </ul>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import api from '@/api';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { IManageOrderListItem, IOrderTimelineItem } from '../js/type';

const props = defineProps<{
  visible: boolean
  row: null | IManageOrderListItem
}>();

const emit = defineEmits(['update:visible']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const lineData = ref<null | IOrderTimelineItem[]>(null);
const loading = ref(false);

const getTimeLine = async () => { // 获取时间线数据
  lineData.value = null;

  if (props.row) {
    loading.value = true;
    const resp = await api.productionManageApis.getOrderGetTimeLine(props.row.ID).catch(() => null);
    loading.value = false;

    if (resp?.data?.isSuccess) {
      const list: IOrderTimelineItem[] = resp.data.Data || [];
      list.sort((a, b) => b.Index - a.Index);
      const index = list.findIndex(it => it.ShowFocus);
      list.forEach((it, i) => {
        const _it = it;
        _it._IsBegin = i >= index;
      });
      lineData.value = list;
    }
  }
};

const onOpen = () => {
  getTimeLine();
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.time-line-content {
  --el-text-color-regular: #444;
  margin-top: -25px;
  min-height: 400px;
  max-height: calc(90vh - 250px);
  overflow: auto;
  display: flex;
  flex-direction: column;

  > .header {
    padding-left: 23px;
    padding-bottom: 15px;
    flex: none;
  }

  :deep(.el-empty__description p) {
    font-size: 13px;
  }

  > ul.list {
    flex: 1;
    overflow: auto;
    @include scroll;
    > .item {
      display: flex;
      line-height: 16px;
      color: #989898;
      font-size: 12px;

      .left {
        width: 250px;
        text-align: right;
        flex: none;
        min-height: 60px;
        .f {
          display: flex;
          justify-content: flex-end;
          h4 {
            font-size: 14px;
            overflow: hidden;
            flex-grow: 0;
            flex-shrink: 1;
            // min-width: 160px;
          }
          i {
            margin: 0 4px 0 6px;
            font-size: 14px;
            flex: none;
          }
          > span {
            flex: none;
            position: relative;
            top: 1px;
          }
        }

        .time {
          letter-spacing: 0.5px;
          margin-top: 2px;
        }
      }

      .center {
        flex: none;
        position: relative;
        margin: 0 15px;
        &::after {
          content: '';
          position: absolute;
          width: 1px;
          background-color: #eee;
          height: 100%;
          top: 8px;
          left: calc(50% - 0.5px);
        }
        .point {
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          z-index: 9;
          position: relative;
          &::before {
            content: '';
            height: 11px;
            width: 11px;
            background-color: #eee;
            border-radius: 50%;
          }
        }
      }

      .right {
        width: 180px;
        padding-top: 5px;
        :deep(.el-progress-bar__inner) {
          background-color: #eee;
        }
      }

      &.complete {
        .right {
          :deep(.el-progress-bar__inner) {
            background: linear-gradient(to right, rgba(#35dff9, 0.6), rgba(#63f9d5, 0.6));
          }
        }
      }

      &.active {
        color: #444;
        .center {
          .point {
            background-color: rgba($color: #26bcf9, $alpha: 0.2);
            &::before {
              height: 8px;
              width: 8px;
              background-color: #26bcf9;
            }
          }
        }
        .right {
          :deep(.el-progress-bar__inner) {
            background: linear-gradient(to right, #26bcf9, #35dff9);
          }
        }
      }

      &:last-of-type {
        .center::after {
          display: none;
        }
      }
    }
  }
}
</style>
