<template>
  <DialogContainerComp :visible='visible' :width='580' title='标题' top='18vh'  @cancel='visible = false' primaryText="确定" :showHeader="false"
    @submit="emit('submit')">
    <div class='dialog-content'>
      <h2 class="hello">
        <span>辛苦了， <i>{{ staff?.StaffName }}</i> ！</span>
      </h2>

      <div class="box">
        <el-icon><QuestionFilled /></el-icon>
        <h4>
          <p>是否确认订单 <i>{{ taskDetail?.OrderInfo.OrderID }}</i> 所有生产资源</p>
          <p>均已收集聚拢在一起</p>
        </h4>
      </div>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IStaff } from '@/views/companyManage/StaffManage/js/types';
import { IUnionTaskDetail } from '../../types/type';

defineProps<{
  staff: IStaff | null
  taskDetail: null | IUnionTaskDetail
}>();

const visible = defineModel<boolean>('visible');

const emit = defineEmits(['submit']);

</script>

<style scoped lang='scss'>
.dialog-content {
  margin-top: -15px;
  height: 160px;

  .hello {
    border-bottom: 1px solid #eee;
    font-size: 22px;
    line-height: 28px;
    margin: -20px -12px 0;
    padding: 0 12px 10px;

    i {
      color: #26bcf9
    }
  }

  .box {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 30px;

    .el-icon {
      font-size: 60px;
      color: #f4a307;
      margin-right: 18px;
    }

    h4 {
      font-size: 19px;
      color: #444;

      i {
        color: #F6B437
      }
    }
  }
}
</style>
