<template>
  <DialogContainerComp
    :visible='localVisible'
    :width="450"
    :showHeader="false"
    :showPrimary="false"
    top="20vh"
    @cancel="localVisible = false"
    closeBtnText="关闭"
    class="mp-outside-material-manage-item-address-display-dialog-comp-wrap"
    >
    <ul class="box" v-if="address">
      <li>
        <span class="title">取料地址：</span>
        <span class="content">{{ address.AddressDetail }}</span>
      </li>
      <li>
        <span class="title">联系人：</span>
        <span class="content">{{ address.Consignee }}</span>
      </li>
      <li>
        <span class="title">手机号码：</span>
        <span class="content">{{ address.Mobile }}</span>
      </li>
    </ul>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { ICustomerAddress } from '../../ManualOrderHandlerPage/js/types';

const props = defineProps<{
  visible: boolean
  address: null | ICustomerAddress
}>();

const emit = defineEmits(['update:visible']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

</script>

<style lang='scss'>
@import '@/assets/css/mixins.scss';

.mp-outside-material-manage-item-address-display-dialog-comp-wrap {

  .box {
    padding: 0 25px;
    > li {
      display: flex;
      padding-bottom: 8px;
      line-height: 18px;
      .title {
        width: 6em;
        text-align: right;
        margin-right: 5px;
        flex: none;
        color: #888E99;
      }
      .content {
        color: #444;
        font-size: 14px;
      }
    }
  }

  .el-dialog__footer {
    padding-bottom: 26px;
  }
}

</style>
