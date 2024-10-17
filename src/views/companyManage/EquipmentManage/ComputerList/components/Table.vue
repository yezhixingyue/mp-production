<template>
  <el-table :data="list" border stripe class="table-wrap" fit >
    <el-table-column show-overflow-tooltip width="70" prop="index" label="序号" fixed="left" />
    <el-table-column show-overflow-tooltip width="85" label="状态">
      <template #default="scope">
        <span>{{ getStateText(scope.row.state) }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="120" label="部门">
      <template #default="scope">
        <span>{{ getDepartment(scope.row.user) }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="120" label="岗位">
      <template #default="scope">
        <span>{{ getPostName(scope.row.user) }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="100" label="姓名">
      <template #default="scope">
        <span>{{ getStaffName(scope.row.user) }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="140" prop="code" label="主机编号" />
    <el-table-column show-overflow-tooltip width="100" prop="displayNumber" label="显示器数量" />
    <el-table-column show-overflow-tooltip width="140" prop="displayCode" label="显示器编号" />
    <el-table-column show-overflow-tooltip width="125" prop="displayModel" label="显示器型号" />
    <el-table-column show-overflow-tooltip width="120" prop="ip" label="ip" />
    <el-table-column show-overflow-tooltip width="140" prop="mac" label="mac" />
    <el-table-column show-overflow-tooltip width="120" prop="cpu" label="cpu" />
    <el-table-column show-overflow-tooltip width="110" prop="memorySlotsNumber" label="内存插槽数量" />
    <el-table-column show-overflow-tooltip width="100" prop="memory" label="内存" />
    <el-table-column show-overflow-tooltip width="80" prop="diskNumber" label="硬盘数量" />
    <el-table-column show-overflow-tooltip width="120" prop="disk" label="硬盘" />
    <el-table-column show-overflow-tooltip width="120" prop="graphicsCard" label="显卡" />
    <el-table-column show-overflow-tooltip width="120" prop="networkCard" label="网卡" />
    <el-table-column show-overflow-tooltip width="120" prop="os" label="操作类型" />
    <el-table-column show-overflow-tooltip width="120" prop="systermDiskType" label="系统安装盘" />
    <el-table-column show-overflow-tooltip width="120" prop="source" label="电脑来源" />
    <el-table-column show-overflow-tooltip width="125" label="采购日期">
      <template #default="scope">
        <span>{{ getOnlyDateFormat(scope.row.purchaseAt) }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="125" label="保修到期日期">
      <template #default="scope">
        <span>{{ getOnlyDateFormat(scope.row.warrantyExpiredAt) }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="100" label="创建人">
      <template #default="scope">
        <span>{{ scope.row.creator === '00000000-0000-0000-0000-000000000000' ? '数据导入' : getStaffName(scope.row.creator) }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="155" label="创建时间">
      <template #default="scope">
        <span>{{ getDateTimeFormat(scope.row.createdAt) }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="155" label="更新时间">
      <template #default="scope">
        <span>{{ getDateTimeFormat(scope.row.updatedAt === scope.row.createdAt ? '' : scope.row.updatedAt) }}</span>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip width="260px" label="操作" fixed="right">
        <template #default="scope">
          <div class="menus">
            <!-- 设置禁用 -->
            <span class="is-blue-span" @click="emit('edit', scope.row)"
              :class="{disabled:[ComputerUseStateEnum.abandoned, ComputerUseStateEnum.calledout].includes(scope.row.state)}">
              <i>编辑</i>
            </span>
            <span class="is-blue-span ml-15" @click="emit('edit', scope.row, true)"
              :class="{disabled:[ComputerUseStateEnum.abandoned, ComputerUseStateEnum.calledout].includes(scope.row.state)}">
              <i>拷贝</i>
            </span>
            <span class="is-blue-span ml-15" @click="emit('abandon', EquipmentHistoryTypeEnum.abandon, scope.row)"
              :class="{disabled:[ComputerUseStateEnum.abandoned, ComputerUseStateEnum.calledout].includes(scope.row.state)}">
              <i>作废</i>
            </span>
            <span class="is-blue-span ml-15" @click="emit('callin', EquipmentHistoryTypeEnum.callin, scope.row)"
               v-if="scope.row.state === ComputerUseStateEnum.calledout">
              <i>调入</i>
            </span>
            <span class="is-blue-span ml-15" @click="emit('callout', EquipmentHistoryTypeEnum.callout, scope.row)" v-else
              :class="{disabled:[ComputerUseStateEnum.abandoned, ComputerUseStateEnum.calledout].includes(scope.row.state)}">
              <i>调出</i>
            </span>
            <span class="is-blue-span ml-15" @click="emit('history', scope.row)"
             :class="{disabled: !scope.row.updatedAt
               || (scope.row.updatedAt===scope.row.createdAt && scope.row.creator === '00000000-0000-0000-0000-000000000000')}">
              <i>查看历史记录</i>
            </span>
          </div>
        </template>
      </el-table-column>
    <template #empty>
      <span class="ft-12" v-show="!loading">暂无数据</span>
    </template>
  </el-table>
</template>

<script setup lang='ts'>
import { IComputer } from '../types/type';
import { getOnlyDateFormat, getDateTimeFormat } from '../js/tool';
import { useStaffList } from '../hooks/useStaffList';
import { ComputerUseStateEnumList, ComputerUseStateEnum, EquipmentHistoryTypeEnum } from '../types/enum';

defineProps<{
  list: IComputer[]
  loading: boolean
}>();

const emit = defineEmits(['edit', 'history', 'abandon', 'callin', 'callout']);

const { getStaffName, getDepartment, getPostName } = useStaffList();

const getStateText = (state) => ComputerUseStateEnumList.find(it => it.ID === state)?.Name || '';

</script>

<style lang='scss'>
.table-wrap {
  height: 100%;
}
</style>
