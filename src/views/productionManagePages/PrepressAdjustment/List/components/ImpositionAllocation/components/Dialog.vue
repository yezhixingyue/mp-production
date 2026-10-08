<template>
  <DialogContainerComp :visible='visible' :width='680' title='设置拼版人' top='12vh'  @cancel='visible = false'
    @open='onOpen' @submit='submit'>
    <div class='dialog-content'>
      <h4>物料：{{ row?.MaterialName || '-' }}</h4>

      <div class="main" v-if="row && ruleForm">
        <div class="left">
          <table >
            <tbody>
              <tr v-for="it in ruleForm.MemberList" :key="it.ID">
                <td>{{ it.Name }}</td>
                <td style="width: 80px;">
                  <mp-button type="danger" class="ft-12" link @click="() => ruleForm?.remove(it.ID)">删除</mp-button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="ruleForm.MemberList.length === 0" class="is-gray ft-12 mt-4">该物料尚未设置拼版人</div>
        </div>

        <div class="right">
          <StaffSelector :model-value="ruleForm.currentMember.ID"
           :disabledIDs="ruleForm.MemberList.map(it => it.ID)" hideUnlimitedOption boxStyle @change="(e) => ruleForm?.onCurrentMemberChange(e)" />
          <mp-button type="primary" style="margin-left: 8px;" :disabled="!ruleForm.currentMember.ID" @click="() => ruleForm?.add()">添加一个</mp-button>
        </div>
      </div>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import StaffSelector from '@/components/common/ElementPlusContainners/StaffSelector.vue';
import { IImpAllocationListItem } from '../types/types';
import { ImpAllocationRuleForm } from '../model/ruleForm';

const visible = defineModel<boolean>('visible');

const props = defineProps<{
  row: IImpAllocationListItem | null
}>();

const emit = defineEmits(['submitted']);

const ruleForm = ref<null | ImpAllocationRuleForm>(null);

const onOpen = () => {
  ruleForm.value = new ImpAllocationRuleForm(props.row);
};

const submit = async () => {
  const data = await ruleForm.value?.submit();
  if (!data) return;

  emit('submitted', data);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
  margin-top: -22px;
  height: 350px;

  > .main {
    display: flex;
    height: 300px;
    margin-top: 25px;

    > .left {
      width: 46%;
      height: 100%;
      overflow: auto;
      margin-right: 25px;
      margin-left: 42px;
      table {
        width: 100%;
        border-collapse: collapse;
        letter-spacing: 0;
        td {
          border: 1px solid #ddd;
          text-align: center;
          line-height: 34px;
          font-size: 12px;
        }
      }
    }

    > .right {
      border-left: 1px solid #ddd;
      padding-left: 25px;
    }
  }
}
</style>
