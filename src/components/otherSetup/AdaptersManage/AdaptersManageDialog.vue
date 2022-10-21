<template>
  <DialogContainerComp
    :width="700"
    :title="title"
    v-model:visible="localVisible"
    class="mp-erp-factory-manage-adapters-manage-dialog-comp-wrap"
    @open="onOpen"
    @submit="submitForm"
    @cancel="cancel"
    @closed="closed"
    top="20vh"
  >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="adapter-ruleForm" v-if="ruleForm">
      <el-form-item label="服务器名称：" prop="Name">
        <el-input v-model.trim="ruleForm.Name" autocomplete="off" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="服务器地址：" prop="Url">
        <el-input v-model.trim="ruleForm.Url" autocomplete="off" maxlength="255"></el-input>
      </el-form-item>
      <el-form-item label="公钥：" prop="PublicKey">
        <el-input v-model.trim="ruleForm.PublicKey" maxlength="60"></el-input>
      </el-form-item>
      <el-form-item label="密钥：" prop="PrivateKey">
        <el-input v-model.trim="ruleForm.PrivateKey" maxlength="60"></el-input>
      </el-form-item>
    </el-form>
    <p class="tips-box is-orange ft-12"> <el-icon class="ft-14"><WarningFilled /></el-icon> 说明：公钥和密钥需要在服务器管理后台生成，请联系该服务器后台管理员</p>
  </DialogContainerComp>
</template>

<script>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import AdapterClass from './AdapterClass';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: null,
    },
    list: { // 列表数据，用于重复组名称判断
      type: Array,
      default: () => [],
    },
  },
  components: {
    DialogContainerComp,
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
    title() {
      return this.item ? '编辑转换服务器' : '添加转换服务器';
    },
  },
  data() {
    const validateRepeat = (key, title, rule, value, callback) => {
      const t = this.list.find(it => it.ID !== this.ruleForm.ID && it[key] === value);
      if (t) {
        callback(new Error(`${title}重复，请检查`));
      } else {
        callback();
      }
    };

    // const validateKeyUrlRepeat = (rule, value, callback) => {
    //   const t = this.list.find(it => it.ID !== this.ruleForm.ID && it.Url === this.ruleForm.Url && it.PrivateKey === this.ruleForm.PrivateKey);
    //   if (t) {
    //     callback(new Error('服务器地址和密钥同时重复，请检查'));
    //   } else {
    //     callback();
    //   }
    // };

    return {
      ruleForm: null,
      rules: {
        Name: [
          { required: true, message: '请输入服务器名称', trigger: 'change' },
          { validator: (...args) => validateRepeat('Name', '服务器名称', ...args), trigger: 'change' },
        ],
        Url: [
          { required: true, message: '请输入服务器地址', trigger: 'change' },
          { pattern: /^(http(s)?:\/\/)/, message: '请以http://或https://开头，输入正确的服务器地址', trigger: 'change' },
          // { validator: (...args) => validateRepeat('Url', '服务器地址', ...args), trigger: 'change' },
        ],
        PublicKey: [
          { required: true, message: '请输入公钥', trigger: 'change' },
          // { validator: (...args) => validateRepeat('PublicKey', '公钥', ...args), trigger: 'change' },
        ],
        PrivateKey: [
          { required: true, message: '请输入密钥', trigger: 'change' },
          // { validator: (...args) => validateRepeat('PrivateKey', '密钥', ...args), trigger: 'change' },
        ],
      },
    };
  },
  methods: {
    onOpen() {
      this.ruleForm = new AdapterClass(this.item);
    },
    submitForm() {
      if (!this.$refs.ruleForm) return;
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const result = await this.ruleForm.save();
          if (result) {
            const title = this.item ? '编辑成功' : '添加成功';
            const cb = () => {
              // 修改列表数据
              this.$emit('saved', { ...this.ruleForm });
            };
            MpMessage.success({
              title, onOk: cb, onCancel: cb,
            });
          }
        }
      });
    },
    cancel() {
      this.localVisible = false;
    },
    closed() {
      this.ruleForm = null;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-factory-manage-adapters-manage-dialog-comp-wrap {
  .el-dialog__body {
    padding-top: 40px;
    padding-bottom: 55px;
    height: 200px;
    .el-input {
      width: 480px;
    }
    label {
      color: #888E99;
      margin-right: 2px;
    }
    .el-form-item__error {
      height: 14px;
      padding-top: 2px;
    }
    .tips-box {
      margin-left: 140px;
      width: 480px;
      margin-top: 12px;
      i {
        vertical-align: -2px;
        margin-right: 5px;
      }
    }
  }
  .el-dialog__footer {
    padding-bottom: 45px;
  }
}
</style>
