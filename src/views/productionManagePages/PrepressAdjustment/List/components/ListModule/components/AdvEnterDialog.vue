<template>
  <DialogContainerComp :visible='visible' :width='565' title='提前转入尾版登记' top='12vh'  @cancel='visible = false'
    @open='onOpen' @submit='submit'>
    <div class='dialog-content'>
      <ul v-if="item">
        <li>
          <label>订单号：</label>
          <span class="right">{{ item.OrderCode }}</span>
        </li>

        <li>
          <label>款序：</label>
          <span class="right">{{ item.KindRemark }}</span>
        </li>

        <li>
          <label class="star">原因：</label>

          <ul class="right">
            <li v-for="(reason, index) in reasons" :key="reason">
              <el-radio :label="index" v-model="radio">{{ reason }}</el-radio>
            </li>
            <li>
              <el-radio :label="255" v-model="radio">其它</el-radio>

              <el-input v-if="radio===255" v-model="defineReason" maxlength="60" show-word-limit type="textarea"
               :autosize="{minRows: 3, maxRows: 3}" :rows="3" />
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IAdjustInfo } from '@/views/productionManagePages/PrepressAdjustment/types';
import { ref } from 'vue';

const visible = defineModel<boolean>('visible');

defineProps<{
  item: IAdjustInfo | null
}>();

const emit = defineEmits(['submit']);

const reasons = [
  '订单量不足，短期难以合拼',
  '等待时间过长',
  '交期/紧急订单',
  '模板不适用',
];

const radio = ref<number | ''>('');
const defineReason = ref('');

const onOpen = () => {
  radio.value = '';
  defineReason.value = '';
};

const submit = () => {
  let reason = '';
  if (radio.value === 255) {
    reason = defineReason.value;
  } else if (typeof radio.value === 'number') {
    reason = reasons[radio.value];
  }

  if (!reason) {
    MpMessage.error('保存失败', '请先设置提前转入原因');
    return;
  }

  emit('submit', reason);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
  margin-top: -15px;
  height: 320px;

  > ul {
    > li {
      display: flex;
      line-height: 32px;
      margin-bottom: 5px;

      > label {
        flex: none;
        width: 8em;
        text-align: right;
        font-weight: 700;
        margin-right: 10px;
        color: #444;
      }

      > .right {
        flex: 1;
        overflow: hidden;
        padding-right: 30px;

        :deep(textarea) {
          max-height: 73px;
        }
      }
    }
  }
}
</style>
