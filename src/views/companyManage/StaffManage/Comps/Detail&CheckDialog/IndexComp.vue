<template>
  <div class="mp-erp-staff-manage-detail-and-check-dialog-comp-wrap">
    <DialogContainerComp
      :width="700"
      top="12vh"
      :title="title"
      v-model:visible="visible"
      :showDel="showRemove"
      :primaryText='submitText'
      :showPrimary='!disabled'
      delBtnText="删除"
      closeBtnText='关闭'
      @submit="onSetJobClick"
      @danger="onRemove"
      @cancel="visible = false"
      @open="onOpen"
      @closed="onClosed"
      @close='onClose'
      class="detail-and-check-dialog-wrap"
    >
      <!-- 内容区 -->
      <DetailDisplayComp :detailData='editData' :showIntranet="showIntranet" />
    </DialogContainerComp>
    <SetJobDialog
      v-model="setJobVisible"
      :list="editData ? editData.PositionList : []"
      :departmentLevelList='departmentLevelList'
      :jobPermissionsList='jobPermissionsList'
      @submitData="submit"
     />
  </div>
</template>

<script>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { Staff } from '../../js/StaffClass';
import { StaffStatusEnumObj } from '../../js/enums';
import DetailDisplayComp from './DetailDisplayComp.vue';
import SetJobDialog from './SetJobDialog.vue';

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    curStaffData: {
      type: Object,
      default: null,
    },
    curIndex: {
      type: Number,
      default: -1,
    },
    departmentLevelList: {
      type: Array,
      default: () => [],
    },
    jobPermissionsList: {
      type: Array,
      default: () => [],
    },
    showIntranet: {
      type: Boolean,
      default: false,
    },
    localPermission: {
      type: Object,
      default: null,
    },
  },
  components: {
    DialogContainerComp,
    DetailDisplayComp,
    SetJobDialog,
  },
  data() {
    return {
      editData: null,
      setJobVisible: false,
    };
  },
  computed: {
    visible: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      },
    },
    title() {
      if (!this.editData) return '';
      let _title = '';
      switch (this.editData.Status) {
        case StaffStatusEnumObj.pending.ID:
          _title = '审核员工';
          break;

        default:
          _title = '员工详情';
          break;
      }
      return _title;
    },
    submitText() {
      if (!this.editData) return '';
      let _title = '';
      switch (this.editData.Status) {
        case StaffStatusEnumObj.pending.ID:
          _title = '通过';
          break;

        default:
          _title = '设置岗位';
          break;
      }
      return _title;
    },
    showRemove() {
      if (!this.localPermission || !this.localPermission.Delete) return false;
      return this.editData && this.editData.Status === StaffStatusEnumObj.pending.ID;
    },
    disabled() { // 离职状态时禁止设置岗位 - 或者无审核权限时
      return this.editData?.Status === StaffStatusEnumObj.leaved.ID || !this.localPermission || !this.localPermission.Check;
    },
  },
  methods: {
    onOpen() {
      this.editData = JSON.parse(JSON.stringify(this.curStaffData));
    },
    onClose() {
      if (this.setJobVisible) this.setJobVisible = false;
    },
    onClosed() {
      this.editData = null;
    },
    onSetJobClick() { // 设置岗位 -- 需要把当前用户信息传入到审核人信息中 --- 如果没有就加上  如果有就不改变
      this.setJobVisible = true;
    },
    onRemove() {
      MpMessage.warn({
        title: '确定删除该员工吗 ?',
        msg: `删除员工：[ ${this.editData.StaffName} ]`,
        onOk: () => {
          this.$emit('remove', { item: this.editData, index: this.curIndex });
        },
      });
    },
    submit(PositionList) { // 审核或修改岗位
      const temp = { ...this.curStaffData, PositionList };
      this.$emit('submit', new Staff(temp));
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-staff-manage-detail-and-check-dialog-comp-wrap {
  .detail-and-check-dialog-wrap {
    .el-dialog__body {
      min-height: 480px;
      display: flex;
      padding: 20px;
      padding-bottom: 5px;
    }
  }
  .staff-set-job-dialog-wrap {
    .el-dialog__body {
      padding-left: 22px;
      min-height: 200px;
      max-height: 300px;
      overflow: auto;
      .content-list {
        > li {
          margin-bottom: 34px;
          > .mp-common-comps-area-select-wrap {
            > li {
              margin-right: 20px;
              &.first-select-box .el-input__inner {
                width: 110px;
              }
              &.text {
                margin-right: 5px;
                position: relative;
                top: -3px;
              }
            }
          }
          > div.bt {
            display: flex;
            align-items: center;
            margin-top: 16px;
            .title {
              margin-left: 2em;
              margin-right: 10px;
              font-weight: 700;
            }
            .mp-select.el-select .el-input {
              width: 114px;
            }
          }
          .el-input__inner {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
