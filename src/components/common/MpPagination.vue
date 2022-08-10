<template>
  <section class="mp--pagination">
    <span class="count">共 <i> 1000 </i> 条记录</span>
    <!-- <el-pagination
     background layout="prev, pager, next" :total="1000" default-current-page /> -->
    <!-- <el-pagination
      v-model:currentPage="currentPage3"
      v-model:page-size="pageSize3"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="prev, pager, next, jumper"
      :total="1000"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->
    <el-config-provider :locale="locale">
      分页
        <!-- <el-pagination
            @current-change="handleCurrentChange"
            v-model:current-page="currentPage"
            hide-on-single-page
            :page-size="pageSize"
            :pager-count='5'
            layout="prev, pager, next, jumper"
            :total="1000">
          </el-pagination> -->
    </el-config-provider>
  </section>
</template>

<script>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';

export default {
  components: {
    ElConfigProvider,
  },
  setup() {
    return {
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
