<template>
  <section class="mp--pagination" :class='{center:center, countInLeft: countInLeft, left: left}'>
    <el-config-provider :locale="locale">
      <!-- 分页 -->
      <span v-if="!left || !total || total <= pageSize">
        <slot></slot>
      </span>
      <el-pagination
         @current-change="handleCurrentChange"
         :current-page="currentPage"
         hide-on-single-page
         :page-size="pageSize"
         :pager-count='5'
         layout="prev, pager, next, jumper"
         :total="total">
       </el-pagination>
    </el-config-provider>
    <span class="count">
      <NewDownLoadExcelComp v-if="localExportExcelProps" :disabled="total === 0" v-bind="localExportExcelProps" />
      <span>共检索出</span>
      <i class="num"> {{total}} </i>
      <span>条记录</span>
    </span>
  </section>
</template>

<script lang="ts">
import { ElConfigProvider } from 'element-plus';
import { computed } from 'vue';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import NewDownLoadExcelComp from '@/components/common/General/DownLoadExcelComp/DownLoadExcelComp.vue';
import { IExportExcelProps } from './General/DownLoadExcelComp/types';

export default {
  components: {
    ElConfigProvider,
    NewDownLoadExcelComp,
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
    handlePageChange: {
      type: Function,
    },
    center: {
      type: Boolean,
      default: false,
    },
    left: {
      type: Boolean,
      default: false,
    },
    countInLeft: {
      type: Boolean,
      default: false,
    },
    ExportExcelProps: { // IExportExcelProps 类型
      type: Object,
      default: () => null,
    },
  },
  setup(props) {
    function handleCurrentChange(val) {
      if (props.handlePageChange) props.handlePageChange(val);
    }

    const currentPage = computed(() => props.nowPage);

    // const localExportExcelProps = computed<IExportExcelProps | null>(() => (props.ExportExcelProps ? {
    //   ...(props.ExportExcelProps as IExportExcelProps),
    // } : null));

    return {
      currentPage,
      handleCurrentChange,
      locale: zhCn,
      localExportExcelProps: props.ExportExcelProps as IExportExcelProps,
    };
  },
};
</script>

<style lang="scss">
.mp--pagination{
  display: flex;
  justify-content: flex-end;
  font-size: 13px;
  // width: 100%;
  // padding-top: 20px;
  .count{
    display: flex;
    align-items: center;
    margin: 0 40px;
    line-height: 36px;
    color: #444;
    .is-blue-span {
      margin-right: 50px;
      i {
        font-size: 15px;
        transform: scaleY(1.1);
        vertical-align: -2px;
        margin-left: 3px;
      }
    }
    i.num {
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
  &.left {
    justify-content: space-between;
  }
}
</style>
