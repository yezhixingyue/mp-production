<template>
  <el-table
    class="mp-erp-factory-manage-adapters-manage-table-comp-wrap"
    fit
    :data="list"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column width="60px" prop="ID" show-overflow-tooltip label="编号"></el-table-column>
    <el-table-column width="280px" prop="Name" show-overflow-tooltip label="名称"></el-table-column>
    <el-table-column min-width="150px" prop="Url" show-overflow-tooltip label="服务器地址"></el-table-column>
    <el-table-column min-width="150px" prop="PublicKey" show-overflow-tooltip label="公钥"></el-table-column>
    <el-table-column min-width="150px" prop="PrivateKey" show-overflow-tooltip label="私钥"></el-table-column>
    <!-- <el-table-column width="160px" prop="Name" show-overflow-tooltip label="关联工厂数量">
      <template #default="scope:any">{{scope.row.RelationNumber}}个</template>
    </el-table-column> -->
    <el-table-column min-width="140px" label="操作">
      <template #default="scope">
        <mp-button type="info" link @click="onEditClick(scope.row, scope.$index)">
          <i class="iconfont icon-bianji"></i>编辑
        </mp-button>
        <mp-button type="info" link @click="onRemoveClick(scope.row, scope.$index)" :disabled="scope.row.RelationNumber > 0">
          <i class="iconfont icon-delete"></i>删除
        </mp-button>
      </template>
    </el-table-column>
    <template #empty>
      <div>
        <span v-show="!loading">暂无数据</span>
      </div>
    </template>
  </el-table>
</template>

<script>
import { MpMessage } from '@/assets/js/utils/MpMessage';

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onEditClick(item, index) {
      this.$emit('edit', item, index);
    },
    onRemoveClick(item, index) {
      MpMessage.warn({
        title: '确定删除该条转换服务器吗?',
        msg: `名称：[ ${item.Name} ]`,
        onOk: () => {
          this.$emit('remove', item, index);
        },
      });
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/var.scss";
.mp-erp-factory-manage-adapters-manage-table-comp-wrap {
  margin-right: 2px;

  .el-tooltip__popper {
    max-width: 400px;
    line-height: 180%;
    // white-space: pre;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 16px;
  }
}
</style>
