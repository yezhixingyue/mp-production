<template>
  <transition name="el-fade-in">
    <div class="hover-item-tooltips " v-show="hoverItemInfo.data.item" ref="oBox">
        <!-- 设备类别和组展示 -->
        <p class="ft-12">
          <span>{{hoverItemInfo.data.item?.ClassName}}</span>
          <i> - </i>
          <span>{{hoverItemInfo.data.item?.Equipment.GroupName}}</span>
        </p>
        <!-- 设备名称 -->
        <h4 class="n">
          <span class="mr-5">{{hoverItemInfo.data.item?.Equipment.Name}}</span>
          <span class="status" v-show="hoverItemInfo.data.item?._EquipmentStatusEnumItem?.Name">
            <i :style="`background-color: ${hoverItemInfo.data.item?._EquipmentStatusEnumItem?.Color}`"></i>
            <em>{{hoverItemInfo.data.item?._EquipmentStatusEnumItem?.Name || ''}}</em>
          </span>
        </h4>
        <!-- 设备状态 -->
        <p>
          <span class="title">任务:</span>
          <span class="c">{{hoverItemInfo.data.item?.TaskList.length}}个</span>
        </p>
        <!-- 操作人 -->
        <p>
          <span class="title">操作人:</span>
          <span class="c">{{hoverItemInfo.data.item?.Operator}}</span>
        </p>
        <!-- 分隔线 -->
        <hr v-show="hoverItemInfo.data.Task || (hoverItemInfo.data.item?.Remark && hoverItemInfo.data.item.Status === EquipmentStatusForBoardEnum.error)" />
        <!-- 错误信息 -->
        <p v-show="hoverItemInfo.data.item?.Remark && hoverItemInfo.data.item.Status === EquipmentStatusForBoardEnum.error" class="is-pink">
          <span class="title bold">错误:</span>
          <span class="is-pink ft-12">{{hoverItemInfo.data.item?.Remark}}</span>
          <span v-show="hoverItemInfo.data.item"> -- {{hoverItemInfo.data.item?.ErrorOperator}}</span>
        </p>
        <!-- 当前指针选定任务 -->
        <p v-show="hoverItemInfo.data.Task">
          <span class="title">任务ID:</span>
          <span class="c">{{hoverItemInfo.data.Task?.Code}}</span>
        </p>
        <p v-show="hoverItemInfo.data.Task?._EquipmentTaskStatusEnumitem">
          <span class="title">任务状态:</span>
          <span class="c"
            :style="`color:${hoverItemInfo.data.Task?._EquipmentTaskStatusEnumitem?.HoverColor}`"
          >{{hoverItemInfo.data.Task?._EquipmentTaskStatusEnumitem?.Name}}</span>
        </p>
        <p v-show="hoverItemInfo.data.Task">
          <span class="title">使用物料:</span>
          <span class="c">{{hoverItemInfo.data.Task?.Material}}</span>
        </p>
        <p v-show="hoverItemInfo.data.Task?.StartTime">
          <span class="title">开始时间:</span>
          <span class="c ft-12">{{format2MiddleLangTypeDateFunc2(hoverItemInfo.data.Task?.StartTime)}}</span>
        </p>
        <p v-show="hoverItemInfo.data.Task?.Duration">
          <span class="title">预计时长:</span>
          <span class="c">{{hoverItemInfo.data.Task?.Duration}}小时</span>
        </p>
    </div>
  </transition>
</template>

<script setup lang='ts'>
import { ref, watchEffect } from 'vue';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { EquipmentStatusForBoardEnum } from '../js/enums';
import { IHoverTarget } from '../js/types';

const props = defineProps<{
  hoverItemInfo: IHoverTarget
}>();

const oBox = ref<InstanceType<typeof HTMLElement>>();

watchEffect(() => {
  if (!oBox.value) return;
  // 1. 获取屏幕宽高和自身宽高
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const BoxWidth = oBox.value.offsetWidth;
  const BoxHeight = oBox.value.offsetHeight;

  // 2. 计算到屏幕右侧和底部距离 30和115为安全区域距离
  const leftDistance = screenWidth - props.hoverItemInfo.position.clientX - BoxWidth - 50;
  const bottomDistance = screenHeight - props.hoverItemInfo.position.clientY - BoxHeight - 85;

  // 3. 获得差值
  const leftDiff = leftDistance > 0 ? 0 : leftDistance;
  const bottomDiff = bottomDistance > 0 ? 0 : -BoxHeight - 40;

  // 4. 最终结果
  const left = props.hoverItemInfo.position.offsetX + leftDiff + 20;
  const top = props.hoverItemInfo.position.offsetY + bottomDiff + 20;

  oBox.value.style.transform = `translate(${left}px, ${top}px)`;
});

</script>

<style scoped lang='scss'>
.hover-item-tooltips {
  position: absolute;
  width: 200px;
  background-color: #fff;
  padding: 15px;
  padding-right: 10px;
  border-radius: 3px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
  border: 1px solid #e4e7ed;
  font-size: 13px;
  color: #585858;
  white-space: normal;
  user-select: none;
  pointer-events: none;
  left: 0;
  top: 0;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s;
  letter-spacing: 0.5px;

  > p, > h4 {
    margin-bottom: 4px;
  }

  > h4.n {
    font-size: 14px;
    .status {
      i {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 5px;
        vertical-align: -1px;
      }
      font-weight: 400;
      color: #585858;
      font-size: 13px;
    }
  }

  .title {
    margin-right: 4px;
    display: inline-block;
    min-width: 60px;
  }

  .c {
    color: #888;
  }
  > hr {
    border: none;
    border-top: 1px solid #d0d0d0;
    margin: 10px 0;
  }
}
</style>
