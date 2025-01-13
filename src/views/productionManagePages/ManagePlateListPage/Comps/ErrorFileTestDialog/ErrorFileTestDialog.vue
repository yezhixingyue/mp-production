<template>
  <DialogContainerComp :visible='localVisible' :width='600' title='排查错误文件' top='15vh' @open='onOpen' :disabled="!!(ruleForm?.loading || ruleForm?.result)"
    @cancel='localVisible = false' @submit='submit' primaryText="提交">
    <div class='dialog-content'>
      <ul v-if="row && ruleForm">
        <li class="info">
          <span class="title">大版ID：</span>
          <span>{{ row.Code }}</span>
          <span> ( <i class="ft-13 is-gray">包含订单块数量：{{ row.ChunkNumber }}</i> )</span>
        </li>

        <li class="input-box">
          <span class="title">排查范围：</span>
          从第
          <el-input v-model.number="ruleForm.StartNumber" maxlength="3" :disabled="ruleForm.loading || !!ruleForm.result" />
          块到第
          <el-input v-model.number="ruleForm.EndNumber" maxlength="3" :disabled="ruleForm.loading || !!ruleForm.result" />
          块进行排查

          <span class="is-blue-span ml-20 ft-12" v-if="ruleForm.result" @click="ruleForm.result=null">清除</span>
        </li>

        <li class="result">
          <span class="title">排查结果：</span>
          <div class="content">
            <span class="placeholder" v-if="!ruleForm.tip && !ruleForm.result">{{ ruleForm.loading ? '正在加载中...' : '暂无数据' }}</span>
            <span class="tip" v-if="ruleForm.tip">{{ ruleForm.tip }}</span>
            <div v-if="ruleForm.result">
              <el-link :href="ruleForm.result.FilePath" target="_blank" type="primary" style="font-size: 13px;">查看文件</el-link>
              <div class="codes mp-scroll-wrap">
                {{ ruleForm.result.ChunkCodeList.join('、') }}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IManagePlateInfo } from '../../js/type';
import { ErrorFileTestDialogRuleForm } from './ruleForm';

const props = defineProps<{
  visible: boolean
  row: null | IManagePlateInfo
}>();

const emit = defineEmits(['update:visible']);

/**
 * /Api/Plate/CreateFileTest   ID,StartNumber,EndNumber
 */

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const ruleForm = ref<null | ErrorFileTestDialogRuleForm>(null);

const onOpen = () => {
  if (!props.row) return;
  console.log('onOpen', props.row);
  ruleForm.value = new ErrorFileTestDialogRuleForm(props.row);
};

const submit = () => {
  if (!ruleForm.value) return;

  ruleForm.value.submit();
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
  margin-top: -15px;
  min-height: 160px;
  max-height: 360px;
  overflow: auto;
  overflow: overlay;

  @include scroll;

  > ul {
    line-height: 20px;

    > li {
      padding-bottom: 10px;

      &.info {
        font-weight: 700;
        padding-bottom: 10px;
      }

      &.input-box {
        display: flex;
        align-items: center;

        :deep(.el-input) {
          width: 70px;
          margin: 0 5px;

          input {
            text-align: center;
          }
        }
      }

      &.result {
        display: flex;

        > .content {
          .placeholder {
            font-size: 12px;
            color: #aaa;
          }

          .tip {
            font-size: 12px;
            color: #ff3769;
          }

          .codes {
            padding-top: 5px;
            font-size: 12px;
            max-height: 200px;
            overflow: auto;
            @include scroll;
          }
        }
      }
    }

    .title {
      display: inline-block;
      width: 10em;
      text-align: right;
      color: #888E99;
      font-weight: 400;
      margin-right: 4px;
      flex: none;
    }
  }
}
</style>
