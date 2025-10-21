<template>
  <DialogContainerComp :visible='visible' :width='830' :title='title' top='3vh' @cancel='visible=false' @open='onOpen' @submit='submit' @closed="onClosed"
   class="outsource-price-change-dialog">
    <div class='dialog-content'>
      <!-- 外协任务详情表单 -->
      <div class="outside-print-area-wrap">
        <section class="outside-print-area" v-if="row">
          <header>
            <div class="left">
              <p class="line">{{ row._TaskDetail._LineName }}：{{ row._TaskDetail._TargetID.replace(/（[\w\W]+）$/, '') }}</p>
              <p class="info">
                <span style="margin-right: 1.2em;">创建时间：{{ row._TaskDetail._CreateTime }}</span>
                <span class="fn">外协单位：{{ curentFactory?.Name }}</span>
                <span style="margin-right: 1.2em;">({{ curentFactory?.Mobile }})</span>
                <span style="margin-right: 1.2em;">开单人：{{ row._TaskDetail.SendOperator  || '-' }}</span>
                <span>开单时间：{{ row._TaskDetail._StartTime }}</span>
              </p>
            </div>
          </header>

          <OutsourcePrintAreaTable :curRow="row._TaskDetail" />
        </section>
      </div>

      <!-- 财务复核情况 -->
      <h4 class="section-header">财务复核情况</h4>
      <ul class="section-area">
        <li>
          <label for="">复核意见：</label>
          <span class="remark" :title="row?.RecheckRemark">{{ row?.RecheckRemark }}</span>
        </li>
        <li>
          <label for="">复核金额：</label>
          <span>{{ row?.ReferencePrice }}元</span>
        </li>
        <li>
          <label for="">财务复核人：</label>
          <span>{{ row?.CreatorName }}</span>
        </li>
      </ul>

      <!-- 如果是未通过状态 则显示未通过相关情况 -->
      <template v-if="row?.Status===TaskPriceCheckStatusEnum.Refuse">
        <h4 class="section-header">上次改价未通过<span style="font-weight: 400;">（具体情况可找相关人员线下沟通）</span></h4>
        <ul class="section-area">
          <li>
            <label for="">上次改价金额：</label>
            <span>{{ row?.ChangePrice }}元</span>
          </li>
          <li>
            <label for="">改价说明：</label>
            <span class="remark" :title="row?.ChangeRemark">{{ row?.ChangeRemark }}</span>
          </li>
          <li>
            <label for="">未通过环节：</label>
            <span v-if="row?.IsManagerRefuse">主管审核（{{ row?.ManagerName }}）</span>
            <span v-else>财务驳回（{{ row?.RecheckOperatorName }}）</span>
          </li>
        </ul>
      </template>

      <!-- 外协人改价情况 待审核|待确认时显示 -->
      <template v-if="row && [TaskPriceCheckStatusEnum.WaitCheck, TaskPriceCheckStatusEnum.HaveChangePrice].includes(row.Status)">
        <h4 class="section-header">外协人改价情况</h4>
        <ul class="section-area">
          <li>
            <label for="">新外协金额：</label>
            <span class="is-pink">{{ row.ChangePrice }}元</span>
          </li>
          <li>
            <label for="">金额说明：</label>
            <span class="remark" :title="row.ChangeRemark">{{ row.ChangeRemark }}</span>
          </li>
          <li>
            <label for="">外协操作人：</label>
            <span >{{ row.TaskDetail.SendOperator }}</span>
          </li>
          <li v-if="row.Status === TaskPriceCheckStatusEnum.WaitCheck && row.ManagerName">
            <label for="">审核主管：</label>
            <span>{{ row.ManagerName }}</span>
          </li>
        </ul>
      </template>

      <el-form ref="formRef" v-if="ruleForm" :model="ruleForm" label-width="256px" style="margin-right: 40px;margin-top: 25px;">
        <!-- 修改价格 -->
        <template v-if="type === 'changePrice'">
          <el-form-item label="新外协金额：" prop="Price"
            :rules="[
              { required: true, message: '请输入价格' },
              { pattern: /^\d+(\.\d{1})?$/, message: '格式不正确，数字类型，最多1位小数' },
            ]"
          >
            <el-input v-model.trim="ruleForm.Price" @blur="onPriceInputBlur" type="text" style="width: 150px;" maxlength="8" /><span class="is-gray">（元）</span>
          </el-form-item>

          <el-form-item label="金额说明：" prop="Remark" v-if="ruleForm.showManagerOnPriceChange"
            :rules="[
              { required: true, message: '请输入金额说明' },
            ]"
          >
            <el-input v-model.trim="ruleForm.Remark" type="textarea" maxlength="200" :rows="2" show-word-limit />
          </el-form-item>

          <el-form-item label="审核主管：" prop="ManagerID"  v-if="ruleForm.showManagerOnPriceChange"
            :rules="[
              { required: true, message: '请选择审核主管' },
            ]"
          >
            <el-select v-model="ruleForm.ManagerID" style="width: 150px;">
              <el-option v-for="item in localPageData.outsourceManager.list" :key="item.StaffID" :label="item.StaffName" :value="item.StaffID" />
            </el-select>
          </el-form-item>
        </template>

        <!-- 主管审核 -->
        <template v-if="type === 'check'">
          <el-form-item label="审核结果：" prop="IsRefused"
            :rules="[
              { required: true, message: '请确定审核结果' },
            ]"
          >
            <el-radio-group v-model="ruleForm.IsRefused">
              <el-radio :label="RuleFormIsRefusedEnum.False">通过</el-radio>
              <el-radio :label="RuleFormIsRefusedEnum.True">不通过</el-radio>
              <el-radio :label="RuleFormIsRefusedEnum.Other">转给其他主管</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="审核主管：" prop="ManagerID"  v-if="ruleForm.IsRefused === RuleFormIsRefusedEnum.Other"
            :rules="[
              { required: true, message: '请选择审核主管' },
            ]"
          >
            <el-select v-model="ruleForm.ManagerID" style="width: 150px;">
              <el-option v-for="item in localPageData.outsourceManager.list" :key="item.StaffID" :label="item.StaffName" :value="item.StaffID" />
            </el-select>
          </el-form-item>
        </template>

        <!-- 财务确认 -->
        <template v-if="type === 'confirm'">
          <el-form-item label="财务确认：" prop="IsRefused"
            :rules="[
              { required: true, message: '请确定结果' },
            ]"
          >
            <el-radio-group v-model="ruleForm.IsRefused">
              <el-radio :label="RuleFormIsRefusedEnum.False">确认修改</el-radio>
              <el-radio :label="RuleFormIsRefusedEnum.True">驳回</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="调整复核意见：" prop="Remark" v-if="ruleForm.IsRefused === RuleFormIsRefusedEnum.True"
            :rules="[
              { required: true, message: '请输入复核意见' },
            ]"
          >
            <el-input v-model.trim="ruleForm.Remark" type="textarea" maxlength="200" :rows="3" show-word-limit />
          </el-form-item>
        </template>
      </el-form>

      <p class="tips-box" v-if="type==='changePrice'"><el-icon><WarningFilled /></el-icon> 注意：新价格如果高于“核准参考价格”，则需要选择主管审核！</p>
      <p class="tips-box" v-if="type==='check'"><el-icon><WarningFilled /></el-icon> 注意：审核不通过可线下找外协操作人说明情况！</p>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IUser } from '@/store/modules/user/types';
import { ElMessage, type FormInstance } from 'element-plus';
import { PageMoudleManageClassType } from '../model/PageMoudleManageClass';
import { MenuEventType, TaskPriceCheckInfoRowType } from '../types/type';
import OutsourcePrintAreaTable from '../../Comps/Main/OutsourcePrintAreaTable.vue';
import { RuleFormIsRefusedEnum, TaskPriceCheckStatusEnum } from '../types/enum';
import { RuleForm } from '../model/ruleForm';

const props = defineProps<{
  localPageData: PageMoudleManageClassType
  user: IUser | null
  row: TaskPriceCheckInfoRowType | null
  type: MenuEventType | ''
}>();

const visible = defineModel<boolean>('visible');

/** 弹窗标题 */
const title = computed(() => {
  let _title = '外协金额';

  switch (props.type) {
    case 'changePrice':
      _title += '修改';
      break;
    case 'check':
      _title += '审核';
      break;
    case 'confirm':
      _title += '确认';
      break;
    default:
      break;
  }

  return _title;
});

const curentFactory = computed(() => props.localPageData.FactoryList.find(it => it.ID === props.row?.TaskDetail.Equipment.ID));

const ruleForm = ref<null | RuleForm>(null);
const onOpen = () => {
  ruleForm.value = props.row && props.type ? new RuleForm(props.row, props.type) : null;
};
const onClosed = () => {
  ruleForm.value = null;
};

const onPriceInputBlur = () => {
  if (!ruleForm.value) return;

  ruleForm.value.showManagerOnPriceChange = (props.row && ruleForm.value.Price !== '' && Number(ruleForm.value.Price) > props.row.ReferencePrice) || false;
};

const formRef = ref<FormInstance>();
const submit = () => {
  if (!ruleForm.value || !formRef.value) return;

  formRef.value.validate(async (valid) => {
    if (valid && ruleForm.value) {
      // 根据不同类型调用不同接口方法 并在成功后进行相应的处理（行数据修改、关闭弹窗等）
      const temp = ruleForm.value.getParams();

      if (props.type === 'changePrice') {
        const bool = await props.localPageData.listManager.changePrice(temp, props.localPageData.StaffList);
        if (bool) {
          ElMessage.success('修改价格成功');
          visible.value = false;
        }
      }
      if (props.type === 'check') {
        const bool = await props.localPageData.listManager.managerCheck(temp, props.localPageData.StaffList);
        if (bool) {
          ElMessage.success('已审核');
          visible.value = false;
        }
      }
      if (props.type === 'confirm') {
        const bool = await props.localPageData.listManager.confirm(temp, props.user?.StaffName || '');
        if (bool) {
          ElMessage.success('已确认');
          visible.value = false;
        }
      }
    } else {
      // 是否滚动至底部？
    }
  });
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
  margin-top: -30px;
  margin-bottom: -22px;
  height: 725px;
  overflow: auto;
  overflow: overlay;
  @include scroll;
  color: #333;

  .outside-print-area-wrap {
    width: 100%;
    height: auto;

    .outside-print-area {
      width: 100%;
      height: auto;
      font-size: 14px;
      padding: 0;
      transform: scale(1);

      .info {
        display: flex;
        align-items: center;
        overflow: hidden;
        width: 100%;
        font-size: 13px;

        > span {
          flex: none;

          &.fn {
            flex: 0 1 auto;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }

  .section-header {
    margin-top: 15px;
  }

  ul.section-area {
    margin-top: 2px;
    font-size: 13px;
    background-color: rgba(242, 242, 242, 1);
    border-radius: 5px;
    padding: 10px;
    padding-bottom: 4px;

    > li {
      display: flex;
      line-height: 18px;
      margin-bottom: 6px;
      > label {
        flex: none;
        width: 18em;
        text-align: right;
      }

      > span {
        color: #7f7f7f;

        &.remark {
          @include multiline-ellipsis(2);
        }
      }
    }
  }

  .tips-box {
    width: 420px;
    margin: 20px auto 0;
  }
}

</style>

<style>
.outsource-price-change-dialog {
  margin-bottom: 20px;

  .el-dialog__footer {
    padding-bottom: 25px;
  }
}
</style>
