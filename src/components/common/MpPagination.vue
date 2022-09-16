<template>
  <section class="mp--pagination" :class='{center:center, countInLeft: countInLeft}'>
    <el-config-provider :locale="locale">
      <!-- 分页 -->
      <span>
        <slot></slot>
      </span>
      <el-pagination
         @current-change="handleCurrentChange"
         v-model:current-page="currentPage"
         hide-on-single-page
         :page-size="pageSize"
         :pager-count='5'
         layout="prev, pager, next, jumper"
         :total="total">
       </el-pagination>
    </el-config-provider>
    <span class="count">共检索出 <i> {{total}} </i> 条记录</span>
  </section>
</template>

<script>
import { ElConfigProvider } from 'element-plus';
import { computed } from 'vue';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';

export default {
  components: {
    ElConfigProvider,
  },
  props: {
    nowPage: {
      type: Number,
    },
    pageSize: {
      type: Number,
      default: 20,
    },
    total: {
      type: Number,
    },
    handlePageChange: {},
    center: {
      type: Boolean,
      default: false,
    },
    countInLeft: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    function handleCurrentChange(val) {
      props.handlePageChange(val);
    }
    const currentPage = computed(() => props.nowPage);
    return {
      currentPage,
      handleCurrentChange,
      locale: zhCn,
    };
  },
};
</script>

<style lang="scss">
.mp--pagination{
  display: flex;
  justify-content: flex-end;
  // padding-top: 20px;
  .count{
    display: flex;
    align-items: center;
    margin: 0 40px;
    line-height: 36px;
    color: #444;
    i{
      color: #26bcf9;
      font-weight: 700;
      padding: 0 3px;
    }
  }
  &.center {
    .el-pagination {
      flex: 1;
      justify-content: center;
      position: relative;
      right: -32px;
    }
    > span {
      flex: none;
      min-width: 120px;
    }
  }
  &.countInLeft {
    // justify-content: flex-start;
    .count {
      margin: 0 20px;
    }
    &.center {
      .el-pagination {
        left: -20px;
      }
    }
    flex-direction: row-reverse;
  }
}
</style>
