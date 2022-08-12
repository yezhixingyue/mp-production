<template>
  <section class="mp--pagination">
    <span class="count">共 <i> {{total}} </i> 条记录</span>
    <el-config-provider :locale="locale">
      <!-- 分页 -->
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
  padding-top: 20px;
  .count{
    display: flex;
    align-items: center;
    margin-right: 40px;
    i{
      color: #428DFA;
      padding: 0 3px;
    }
  }
}
</style>
