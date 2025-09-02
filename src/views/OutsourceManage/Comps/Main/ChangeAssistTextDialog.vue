<template>
 <DialogContainerComp
   :visible='visible'
   :width='850'
   title='加工信息编辑面板'
   top='8vh'
   @open='onOpen'
   @cancel='visible = false'
   @submit='visible = false'
   :showClose="false"
   :disabled="isEdit"
   primaryText="确定"
   class="dialog"
   >
   <section class='dialog-content' :class="{empty: list.length === 0}">
    <header v-if="row">
      <div class="title">
        <h4 class="mp-common-title-wrap">当前加工信息</h4>
        <mp-button link type="primary" v-if="!notEditable && !isEdit && row?.Working.ExternalAttribute.Status === ExternalTaskStatusEnum.WaitFactoryReceive"
          @click="onEditClick"> <i class="iconfont icon-bianji"></i> 编辑</mp-button>
      </div>

      <div class="area">
        <div class="box" v-if="!isEdit">
          <span class="ft-12">{{ current?.Content || '无' }}</span>
        </div>
        <el-input v-else v-model="content.newVal" type="textarea" placeholder="请输入加工信息" spellcheck="false" maxlength="300" show-word-limit />
      </div>

      <div class="btns">
        <!-- 日期人员信息 -->
        <div>
          <span v-if="!isEdit && current" style="color: #989898;margin-left: 10px"
          >{{ format2LangTypeDate(current.CreateTime) }} ( {{ current.Operator }} )</span>
        </div>

        <!-- 保存按钮 -->
        <div v-if="isEdit">
          <mp-button link type="primary" @click="onSaveClick" :disabled="!content.newVal"><i class="iconfont icon-baocun"></i>保存</mp-button>
          <mp-button link type="danger" @click="isEdit = false"><i class="iconfont icon-guanbi bold"></i>取消</mp-button>
        </div>
      </div>
    </header>

    <main>
      <h4 class="mp-common-title-wrap">历史信息</h4>
      <ul class="list">
        <li v-for="(node, i) in list" :key="i" class="item" :class="{active:i===0}">
          <div class="left">
            <div class="f">
              <span>{{ node.Operator }}</span>
            </div>
            <p class="time">{{ format2LangTypeDate(node.CreateTime) }}</p>
          </div>
          <div class="center">
            <i class="point"></i>
          </div>
          <div class="right">
            <span>{{ node.Content }}</span>
          </div>
        </li>
      </ul>
      <!-- <p v-if="list.length === 0" style="font-size: 12px;color: #aaa;">暂无历史记录</p> -->
    </main>
   </section>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import api from '@/api';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { getLocalTaskList } from '@/views/ProductionClient/Comps/EquipmentPageContent/TaskActivateAndList/BatchReport/getLocalTaskList';
import { ref } from 'vue';
import { format2LangTypeDate } from '@/assets/js/filters/dateFilters';
import { ExternalTaskStatusEnum } from '../../js/enum';

type RowType = ReturnType<typeof getLocalTaskList>[number];

interface IModifyProcessInfo {
  ID: string
  Content: string
  TaskWorkingID: string
  Operator: string
  CreateTime: string
}

const props = defineProps<{
  row: RowType | null
  /** 是否不可编辑 */
  notEditable?: boolean
}>();

const visible = defineModel<boolean>('visible');

/** 历史记录列表数据 */
const list = ref<IModifyProcessInfo[]>([]);

/** 加工信息 */
const current = ref<null | IModifyProcessInfo>(null);
const content = ref({
  newVal: '',
});

const isEdit = ref(false);
const onEditClick = () => {
  content.value.newVal = current.value?.Content || '';
  isEdit.value = true;
};

const onOpen = async () => {
  list.value = [];
  isEdit.value = false;
  content.value.newVal = '';
  current.value = null;

  if (!props.row) return;

  const resp = await api.outsourceApis.getExternalTaskModifyProcessInfoList(props.row.Working.TaskWorkingID);
  if (resp.data?.isSuccess) {
    list.value = resp.data.Data;
    if (list.value.length > 0) {
      [current.value] = list.value.splice(0, 1);
    }
  }
};

const onSaveClick = async () => {
  if (content.value.newVal === current.value?.Content || !props.row) {
    isEdit.value = false;
    return;
  }

  const temp = {
    PreID: current.value?.ID,
    Content: content.value.newVal,
    TaskWorkingID: props.row.Working.TaskWorkingID || '',
  };

  const resp = await api.outsourceApis.getExternalTaskModifyProcessInfo(temp);

  if (resp.data?.isSuccess) { // 修改成功
    // 1. 向历史条目添加一条数据
    if (current.value) list.value.unshift(current.value);

    // 2. 修改当前数据并关闭编辑模式
    current.value = resp.data.Data;

    // 3. 修改列表数据
    const _row = props.row;
    _row.Working.ExternalAttribute.ProcessContent = temp.Content;
    _row._AssistText = temp.Content;

    // 4. 关闭编辑模式
    isEdit.value = false;
  }
};
</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
  margin-top: -25px;
  margin-bottom: -20px;
  padding: 0 10px 0 20px;
  height: 595px;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  overflow: hidden;

  &.empty {
    > header {
      border: none;
    }

    > main {
      visibility: hidden;
    }
  }

  > header {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    // min-height: 200px;
    border-bottom: 2px solid #eee;

    .title {
      flex: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      height: 18px;
      // padding-right: 18px;
    }

    .area {

      .box {
        height: 136px;
        box-sizing: border-box;
        overflow: auto;
        @include scroll;
        padding: 10px 12px;
        color: #585858;
        // padding-right: 20px;
        line-height: 18px;
        padding-right: 16px;
        background-color: #f9f9f9;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        letter-spacing: 0.5px;

      }

      :deep(.el-textarea) {
        textarea {
          font-size: 12px;
          padding: 11px 13px;
          padding-right: 16px;
          min-height: 136px !important;
          max-height: 180px;
          border-radius: 3px;
          letter-spacing: 0.5px;
        }
      }
    }

    .btns {
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 30px;
      height: 30px;
      margin-top: 3px;
      padding-bottom: 5px;
    }

    .iconfont {
      font-size: 14px;
    }

    :deep(button) {
      font-size: 14px;
    }
  }

  > main {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
    border-bottom: 2px solid #eee;

    > h4 {
      flex: none;
      margin-bottom: 20px;
    }

    > ul.list {
      flex: 1;
      overflow: auto;
      padding-right: 10px;
      @include scroll;

      &::-webkit-scrollbar {
        background: #EBEFF8;
      }

      > .item {
        display: flex;
        line-height: 16px;
        color: #989898;

        .left {
          width: 172px;
          text-align: right;
          flex: none;
          min-height: 30px;
          font-size: 14px;
          .f {
            color: #444;
          }

          .time {
            letter-spacing: 0.5px;
            margin-top: 5px;
          }
        }

        .center {
          flex: none;
          position: relative;
          margin: 0 15px;
          &::after {
            content: '';
            position: absolute;
            width: 2px;
            background-color: #eee;
            height: 100%;
            top: 14px;
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
            top: 6px;
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
          flex: 1;
          margin-bottom: 10px;
          min-height: 100px;

          > span {
            background-color: #f9f9f9;
            color: #888;
            padding: 8px 10px;
            border-radius: 4px;
            border: 1px solid #DCDFE6;
            display: block;
            font-size: 13px;
            letter-spacing: 0.5px;
          }
        }

        &.active {
          .center {
            .point {
              background-color: rgba($color: #0087FF, $alpha: 0.2);
              &::before {
                height: 8px;
                width: 8px;
                background-color: #0087FF;
              }
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

  button {
    --el-font-size-base: 12px;
  }

  h4 {
    color: #444;
  }
}

</style>
