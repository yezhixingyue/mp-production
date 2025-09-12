<template>
  <div v-if="taskDetail" class="task-resource-list-comp-wrap">
    <p class="mp-common-title-wrap black" style="margin-top: 15px;font-size: 1.0769em;margin-bottom: 10px;font-weight: 700;">生产资源清单</p>
    <div class="table-box" v-if="taskDetail.List.length > 0">
      <table style="border-collapse: collapse;width: 100%;">
        <thead style="font-size: 1.0769em;height: 2.64em;background-color: #f5f5f5">
          <tr style="border: 1px solid #EBEEF5;">
            <th style="border: 1px solid #EBEEF5;">生产资源信息</th>
            <th style="border: 1px solid #EBEEF5;" v-if="!isPrint">交接状态</th>
            <th style="border: 1px solid #EBEEF5;" v-if="!isPrint">操作</th>
            <th style="border: 1px solid #EBEEF5;" v-if="isPrint">备注</th>
          </tr>
        </thead>

        <tbody style="font-size: 0.923em;text-align: center;line-height: 2em;">
          <tr v-for="it in taskDetail.List" :key="it.ID">
            <td style="border: 1px solid #EBEEF5;">
              <div style="display: grid;padding: 0.8em 0.2em 0.8em 0.8em;
              grid-template-rows: auto;grid-template-columns: 9em 8em auto;text-align: left;align-items: center;">
                <span style="font-size: 1.167em;">{{ it.Name }}</span>

                <div style="margin: 0 1em;">
                  <span style="display: block;">{{ it.Signature }}</span>
                  <span style="display: block;">{{ it.Kind }}</span>
                </div>

                <span style="overflow: hidden;text-overflow: ellipsis;display: -webkit-box;line-clamp: 2;-webkit-box-orient: vertical" :title="it.Content"
                  >{{ it.Content }}</span>
              </div>
            </td>

            <td style="border: 1px solid #EBEEF5;width: 16.6em;" v-if="!isPrint">
              <span v-if="it.Status===UnionTaskResourceStatusEnum.UnReport" style="color: #888;">未报工：{{ it.Equipment.Name }}</span>
              <span v-if="it.Status===UnionTaskResourceStatusEnum.HaveReport" style="color: #F6B437;">已报工：{{ it.Equipment.Name }}</span>
              <span v-if="it.Status===UnionTaskResourceStatusEnum.HaveReceived" style="color: #26BCF9;"><i class="iconfont icon-a-jianqu196"></i> 已送达</span>
            </td>

            <td style="border: 1px solid #EBEEF5;width: 9em;position: relative;" v-if="!isPrint">
              <Menu title="查看缩略图" icon="icon-chakan1-copy iconfont" />
              <el-image src="/favicon.ico" preview-teleported :preview-src-list="[it.FrontUri, it.VersoUri]" fit="cover" />
            </td>

            <td v-if="isPrint" style="border: 1px solid #EBEEF5;width: 24em;text-align: left;padding-left: 0.8em;">
              <span>上道设备：{{ it.Equipment.Name }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 列表长度为0： 部分资源已撤回至拼版前 -->
    <div v-else class="empty">
      <i class="iconfont icon-zhongzhi"></i>
      <div>
        <h2 class="mb-5 ft-20">部分生产资源已撤回到拼版前</h2>
        <p class="ft-16">请等待拼版完成后核对变更情况或重新打印工单</p>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import Menu from '@/components/common/menus/Menu.vue';
import { IUnionTaskDetail } from '../../types/type';
import { UnionTaskResourceStatusEnum } from '../../types/enum';

defineProps<{
  taskDetail: null | IUnionTaskDetail
  isPrint?: boolean
}>();

</script>

<style lang='scss'>
.task-resource-list-comp-wrap .el-image {
  height: 1.5em;
  position: absolute;
  top: 50%;
  left:10px;
  right: 10px;
  opacity: 0;
  transform: translateY(-50%);
}

.task-resource-list-comp-wrap .empty {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 60px;

  .iconfont {
    font-size: 59px;
    color: #c2c2c2;
    margin-right: 15px;
  }
}
</style>
