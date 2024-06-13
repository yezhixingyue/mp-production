<template>
  <DialogContainerComp
    :width="560"
    top="18vh"
    title="设置内部网络IP"
    v-model:visible="visible"
    @submit="onSubmit"
    @cancel="visible = false"
    @open="onOpen"
    class="mp-erp-white-staff-setup-dialog-wrap"
  >
    <!-- 内容区 -->
    <el-input
      type="textarea"
      :rows="8"
      maxlength="1000"
      show-word-limit
      v-model="Content"
      placeholder="请输入IP地址">
    </el-input>
    <p class="tips-box">请输入允许访问的IP地址，多个地址以中英文逗号、分号、反斜杠、空格、回车进行间隔，最多可设置50个IP。</p>
  </DialogContainerComp>
</template>

<script>
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    DialogContainerComp,
  },
  data() {
    return {
      Content: '',
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
  },
  methods: {
    onOpen() {
      this.getIntranetContent();
    },
    async onSubmit() {
      const temp = { Content: this.Content };
      const resp = await api.getIntranetSetup(temp).catch(() => null);
      if (resp?.data?.Status === 1000) {
        const cb = () => {
          this.visible = false;
        };
        MpMessage.dialogSuccess({ title: '设置成功', onOk: cb, onCancel: cb });
      }
    },
    async getIntranetContent() {
      const resp = await api.getIntranetContent().catch(() => null);
      if (resp && resp.data?.Status === 1000) {
        this.Content = resp.data.Data || '';
      } else {
        this.Content = '';
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-white-staff-setup-dialog-wrap {
  .el-dialog__body {
    padding: 30px 25px;
    .tips-box {
      width: 510px;
      height: 60px;
      // letter-spacing: 0.5px;
      margin-top: 10px;
      padding-left: 14px;
      margin-bottom: -10px;
    }
    .el-textarea__inner {
      font-size: 13px;
    }
  }
}
</style>
