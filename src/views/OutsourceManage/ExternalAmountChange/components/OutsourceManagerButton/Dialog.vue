<template>
  <DialogContainerComp :visible='visible' :width='430' title='外协主管设置' top='12vh' @cancel='visible=false' @open='onOpen'>
    <div class='dialog-content' ref="oWrap">
      <table v-if="outsourceManager.list.length > 0">
        <thead>
          <tr>
            <th>外协主管</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='item in outsourceManager.list' :key='item.StaffID'>
            <td>
              <span style="display: block;width: 15em;overflow: hidden;text-align: center;">{{ item.StaffName }}</span>
            </td>
            <td>
              <div style="width: 8em;text-align: center;">
                <mp-button type='danger' link @click='outsourceManager.removeManager(item.StaffID)'>删除</mp-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <el-empty v-else description="暂无数据" />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <StaffSelector v-model="operator" hideUnlimitedOption boxStyle :staffList="staffList.filter(it => !ids.includes(it.StaffID))" title="外协主管" />
        <mp-button type="primary" style="width: 110px;height: 32px;margin-left: 25px;" @click="onAddClick">添加</mp-button>
      </div>
    </template>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import StaffSelector from '@/components/common/ElementPlusContainners/StaffSelector.vue';
import { IStaff } from '@/views/companyManage/StaffManage/js/types';
import { ElMessage } from 'element-plus';
import { computed, ref } from 'vue';
import { OutsourceManager } from '../../model/OutsourceManager';

const props = defineProps<{
  outsourceManager: OutsourceManager
  staffList: Pick<IStaff, 'StaffID' | 'StaffName'>[]
}>();

const visible = defineModel<boolean>('visible');

const operator = ref('');

const onOpen = () => {
  operator.value = '';
};

const ids = computed(() => props.outsourceManager.list.map((it) => it.StaffID)); // 已有的外协主管ID列表
const oWrap = ref<HTMLDivElement | null>(null);

const onAddClick = async () => {
  if (!operator.value) {
    ElMessage.error('请选择外协主管');
    return;
  }

  const t = props.staffList.find((s) => s.StaffID === operator.value);
  if (!t) return;

  const bool = await props.outsourceManager.addManager(t);
  if (bool) {
    operator.value = '';
    oWrap.value?.scrollTo(0, oWrap.value.scrollHeight);
  }
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
  margin-top: -15px;
  height: 300px;
  overflow: auto;
  overflow: overlay;
  @include scroll;
  background-color: #fff;

  table {
    border-collapse: collapse;
    margin: 0 auto;
    background-color: #fff;
    table-layout: fixed;

    thead {
      tr {
        background-color: #f2f2f2;
        position: sticky;
        top: 0;
        box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
        line-height: 34px;
        border: none;
      }
    }

    tr {
      border: 1px solid var(--el-input-border-color, var(--el-border-color));
      line-height: 36px;
      box-sizing: border-box;
    }

    td {
      font-size: 13px;
    }
  }
}

.dialog-footer {
  text-align: center;
  padding-right: 5px;
}
</style>
