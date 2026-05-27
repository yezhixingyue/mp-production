<template>
  <DialogContainerComp :visible='visible' :width='600' title='追加印刷数量' top='12vh'  @cancel='visible = false'
    @open='onOpen' @submit='submit' :disabled="!ruleForm.result || ruleForm.result.isError">
    <div class='dialog-content'>
      <ul>
        <li>
          <label class="star">订单号：</label>
          <div class="right">
            <el-input v-model.trim="ruleForm.OrderID" @keyup.enter="onSearchClick" maxlength="30" style="width: 220px;"></el-input>
            <mp-button type="primary" @click="onSearchClick">搜索</mp-button>
          </div>
        </li>

        <li>
          <label class="star">款序：</label>
          <div class="right">
            <!-- 无数据且未搜索的情况 -->
            <span class="placeholder" v-if="!ruleForm.result && !ruleForm.loading">请输入订单号后，点搜索！</span>

            <!-- 搜索不到数据 -->
            <div class="err-msg" v-else-if="ruleForm.result?.isError">
              <span>未找到可追加印数的款，可能原因如下：</span>
              <span>1. 该订单没有款块当前处于尾版拼版阶段</span>
              <span>2. 追加印刷数量每个款块只能进行一次</span>
              <span>3. 该订单“禁止合拼”</span>
              <span>4. 你无权操作该订单（所在生产线）</span>
            </div>

            <!-- 搜索到数据 -->
            <ul v-else-if="ruleForm.result">
              <li v-for="chunk in ruleForm.result.chunkList" :key="chunk.ID">
                <el-radio :label="chunk.ID" v-model="ruleForm.chunkId">
                  <span class="chunk-name" :title="getChunkName(chunk)">{{ getChunkName(chunk) }}</span>
                </el-radio>
              </li>
            </ul>
          </div>
        </li>

        <li v-if="currentChunk" class="number">
          <label class="star">追加数量：</label>
          <div class="right">
            <el-input v-model.number="ruleForm.Number" maxlength="9" style="width: 80px;"></el-input>
            <span>总印数{{currentChunk.TotalNumber}}，最大追加数{{ruleForm.maxAddNumber}}（不得超过20%）</span>
          </div>
        </li>

        <li v-if="currentChunk">
          <label class="star">原因：</label>

          <ul class="right mr-20">
            <li v-for="(reason, index) in reasons" :key="reason">
              <el-radio :label="index" v-model="ruleForm.reason.radio">{{ reason }}</el-radio>
            </li>
            <li>
              <el-radio :label="255" v-model="ruleForm.reason.radio">其他</el-radio>

              <el-input v-if="ruleForm.reason.radio===255" v-model="ruleForm.reason.remark" maxlength="60" show-word-limit type="textarea"
               :autosize="{minRows: 3, maxRows: 3}" :rows="3" />
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import api from '@/api';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IPlateChunk } from '@/views/productionManagePages/PrepressAdjustment/types';
import { ElMessage } from 'element-plus';
import { computed, ref } from 'vue';
import { AddNumberRuleForm } from '../model/AddNumberRuleForm';

const visible = defineModel<boolean>('visible');

const emit = defineEmits(['submit']);

const ruleForm = ref(new AddNumberRuleForm());

const currentChunk = computed(() => ruleForm.value.currentChunk);

const reasons = [
  '与其他订单凑数合拼',
  '此单工期紧张凑版合拼',
  '无法被拼版位数整除',
  '提升印量，确保成品数量',
];

const onOpen = () => {
  ruleForm.value = new AddNumberRuleForm();
};

const getChunkName = (chunk: IPlateChunk) => {
  const n1 = [chunk.SemiFinished, chunk.SemiFinished ? chunk.PageRemark : '', chunk.KindRemark].join(' ');
  const n2 = `（剩余 ${chunk.RemainNumber}）`;

  return n1 + n2;
};

const onSearchClick = async () => {
  if (!ruleForm.value.OrderID) {
    ElMessage.warning('请先输入订单号');
    return;
  }

  if (ruleForm.value.OrderID === ruleForm.value.result?.OrderID) return;

  if (ruleForm.value.result) ruleForm.value.result.isError = false;

  ruleForm.value.loading = true;
  const resp = await api.productionManageApis.getOrderChunkList(ruleForm.value.OrderID, true);
  ruleForm.value.loading = false;

  const _result = resp.data?.isSuccess
    ? { chunkList: resp.data.Data, isError: resp.data.Data.length === 0, OrderID: ruleForm.value.OrderID }
    : { chunkList: [], isError: true, OrderID: ruleForm.value.OrderID };
  ruleForm.value = new AddNumberRuleForm(ruleForm.value.OrderID, _result);
};

const submit = () => {
  const params = ruleForm.value.getParams(reasons);
  if (!params) return;

  emit('submit', params);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
  margin-top: -15px;
  min-height: 428px;
  max-height: 520px;
  overflow: auto;

  > ul {
    > li {
      display: flex;
      line-height: 30px;
      margin-bottom: 15px;

      > label {
        flex: none;
        width: 8em;
        text-align: right;
        font-weight: 700;
        margin-right: 5px;
        color: #444;
      }

      > .right {
        flex: 1;
        overflow: hidden;
        padding-left: 5px;

        :deep(.el-input) {
          .el-input__wrapper {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            height: 28px;
          }
        }

        button {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          margin-left: -1px;
          height: 30px;
        }

        .err-msg {
          display: flex;
          flex-direction: column;
          letter-spacing: 0.5px;
          font-size: 13px;

          > span:not(:first-of-type) {
            font-size: 13px;
          }
        }

        .placeholder {
          font-size: 13px;
          letter-spacing: 0.5px;
        }

        :deep(textarea) {
          max-height: 73px;
        }

        .chunk-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: block;
          max-width: 415px;
        }
      }

      &.number {
        .right {
          > span {
            font-size: 12px;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>
