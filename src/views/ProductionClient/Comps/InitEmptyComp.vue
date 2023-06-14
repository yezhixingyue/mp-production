<template>
  <div class="client-empty-comp-wrap">
    <p class="mp-common-title-wrap black">凌顶揽众生产报工系统</p>
    <div>
      <img src="../assets/images/empty.png" alt="" />
    </div>
    <p class="text">
      <span class="is-gray">尚未绑定设备，请联系系统管理员点击右侧按钮进行设置吧</span>
      <span class="is-blue-span" @click="onClick">设置机器</span>
    </p>
  </div>
</template>

<script setup lang='ts'>
const emit = defineEmits(['setEquipment']);

const onClick = () => {
  emit('setEquipment');
};

</script>

<style scoped lang='scss'>
.client-empty-comp-wrap {
  height: 100%;
  text-align: center;
  box-sizing: border-box;
  font-size: 16px;
  .mp-common-title-wrap {
    display: block;
    margin-left: 80px;
    padding-top: 5vh;
    padding-bottom: 17vh;
    text-align: left;
    font-size: 15px;
    &::before {
      height: 17px;
    }
  }
  .text {
    margin-top: 40px;
    span {
      & + span {
        margin-left: 35px;
      }
    }
  }
}
</style>
