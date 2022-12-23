<template>
  <label class="menu-box" @click="onClick" :class="{
    disabled: props.disabled,
    isPink: displayType==='icon' && props.isPink,
    isSuccess: displayType==='icon' && props.isSuccess
   }">
    <!-- type模式 -->
    <template v-if="displayType === 'type'">
      <!-- 编辑 -->
      <template v-if="props.type === 'edit'">
        <img v-if="!props.disabled" src="@/assets/images/menu/edit.png" alt="">
        <img v-else src="@/assets/images/menu/edit-disabled.png" alt="">
      </template>
      <!-- 删除 -->
      <template v-if="props.type === 'del'">
        <img v-if="!props.disabled" src="@/assets/images/menu/del.png" alt="">
        <img v-else src="@/assets/images/menu/del-disabled.png" alt="">
      </template>
      <!-- 详情 -->
      <template v-if="props.type === 'detail'">
        <img v-if="!props.disabled" src="@/assets/images/menu/detail.png" alt="">
        <img v-else src="@/assets/images/menu/detail-disabled.png" alt="">
      </template>
      <!-- 添加 -->
      <template v-if="props.type === 'add'">
        <img :class="props.disabled ? 'img-gray' : ''" src="@/assets/images/menu/add.png" alt="">
      </template>
    </template>
    <!-- icon模式 -->
    <i v-if="displayType==='icon'" :class="props.icon"></i>
    <!-- defineOption模式 -->
    <template v-if="displayType === 'defineOption'">
      <img v-if="!props.disabled" :src="rightImgUrl" alt="">
      <img v-else :src="disabledImgUrl" alt="">
    </template>
    <span>{{props.title}}</span>
  </label>
</template>

<script setup lang='ts'>
import { computed } from 'vue';

/**
 * 通用按钮组件（通用基础按钮）
 * 优先级：
 * 1. 传递icon时，使用icon模式
 * 2. 没有传递icon 传递defineOption时 使用defineOption自定义模式
 * 3. 如果没有传递上面2种，传递的有type时，则使用type模式（edit | del,  后续补充其它类型）
 * 4. 如果全部没有传递，则使用type - edit模式
 */
const props = withDefaults(defineProps<{
  title: string,
  disabled?: boolean
  // 上面为共用属性  下面为3种类型
  type?: 'edit' | 'del' | 'detail' | 'add'
  icon?: string
  isPink?: boolean // 仅icon模式生效
  isSuccess?: boolean // 仅icon模式生效
  defineOption?: null | { // 需要传递未禁用时图片路径 和 禁用时图片路径
    rightImgUrl: string
    disabledImgUrl: string
  },
}>(), {
  title: '编辑',
  disabled: false,
  type: 'edit',
  defineOption: null,
});

const emit = defineEmits(['click']);

const displayType = computed(() => { // 当前按钮展示类型
  let t:'icon'|'defineOption'|'type' = 'type';
  if (props.icon) t = 'icon';
  else if (props.defineOption) t = 'defineOption';
  return t;
});

const rightImgUrl = computed(() => {
  let url = '';
  if (props.defineOption && displayType.value === 'defineOption') {
    url = props.defineOption.rightImgUrl;
  }
  return url;
});
const disabledImgUrl = computed(() => {
  let url = '';
  if (props.defineOption && displayType.value === 'defineOption') {
    url = props.defineOption.disabledImgUrl;
  }
  return url;
});

const onClick = () => {
  if (props.disabled) return;
  emit('click');
};

</script>

<style scoped lang='scss'>
.menu-box {
  margin: 0 9px;
  cursor: pointer;
  user-select: none;
  transition: 0.1s ease-in-out;
  > img {
    margin-right: 6px;
    vertical-align: -2px;
  }
  > span {
    font-size: 12px;
    color: #989898;
  }
  &:hover > span {
    color: #585858;
  }
  &:active > span {
    color: #444;
  }

  > i {
    color: #26bcf9;
    margin-right: 6px;
    font-size: 15px;
  }
  &:hover > i {
    color: darken($color: #26bcf9, $amount: 8)
  }
  &:active > i {
    color: darken($color: #26bcf9, $amount: 20)
  }

  &.isPink {
    > i {
      color: #ff3769;
    }
    &:hover > i {
      color: darken($color: #ff3769, $amount: 8)
    }
    &:active > i {
      color: darken($color: #ff3769, $amount: 20)
    }

  }
  &.isSuccess {
    > i {
      color: #80c269;
    }
    &:hover > i {
      color: darken($color: #80c269, $amount: 8)
    }
    &:active > i {
      color: darken($color: #80c269, $amount: 20)
    }
  }

  &.disabled {
    cursor: not-allowed;
    > span {
      color: #cbcbcb !important;
    }
    > i {
      color: #cbcbcb !important;
    }
  }
  .img-gray {
    filter: grayscale(1);
    opacity: 0.8;
  }
}
</style>
