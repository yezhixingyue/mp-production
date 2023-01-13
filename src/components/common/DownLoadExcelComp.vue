<template>
  <span class="is-blue-span wrap" @click="onClick">{{title}} <el-icon><Download /></el-icon></span>
</template>

<script>
import { ConvertTimeFormat } from '@/assets/js/utils/ConvertTimeFormat';
import messageBox from '@/assets/js/utils/message';

export default {
  props: {
    title: {
      type: String,
      default: '导出Excel表格',
    },
    /**
     * 下载表格配置对象
     */
    configObj: {
      type: Object,
      default: () => ({
        condition: {}, // 当前条件
        count: 0, // 当前数据总数
        fileDefaultName: '客户订单流水', // 导出文件默认名称
        fileDate: { First: '', Second: '' }, // 导出的时间区间
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        downFunc() { }, // 下载函数
      }),
    },
  },
  methods: {
    onClick() {
      if (this.configObj.condition.Page === 1 && this.configObj.count === 0) {
        messageBox.warnSingleError('[ 当前条件没有可导出的列表数据! ]', null, null, '导出失败');
        return;
      }
      // messageBox.warnCancelNullMsg('确定导出表格数据吗?', () => this.handleDownFunc());
      this.handleDownFunc();
    },
    async handleDownFunc() {
      const config = JSON.parse(JSON.stringify(this.configObj.condition)); // 获取经过处理过的请求头配置对象

      delete config.Page;
      delete config.PageSize;

      const res = await this.configObj.downFunc(config);
      console.log(res, config);
      if (!res || res.status !== 200) {
        messageBox.failSingleError('出错啦 ！', `[ 下载失败：${res ? res.statusText : '未知错误'} ]`);
        return;
      }

      const { data } = res;
      const blobData = new Blob([data], { type: 'application/vnd.ms-excel' });

      let fileName = `${this.configObj.fileDefaultName}(全部).xls`;
      if (this.configObj.fileDate) {
        const { First, Second } = this.configObj.fileDate;
        if (First && Second) {
          const f = First.split('T')[0];
          let _second = '';
          if (new Date(Second) > new Date()) {
            const PlaceDate = this.$store.getters['timeSelectModule/TodayDate'];
            _second = PlaceDate.Second;
          } else {
            _second = Second;
          }
          const t2 = _second ? ConvertTimeFormat(new Date(new Date(_second.replace('Z', '')).getTime())) : '';
          if (f) fileName = `${this.configObj.fileDefaultName}(${f}至${t2}).xls`;
        }
      }
      if (this.configObj.showDateByFile === false) {
        const curDate = ConvertTimeFormat(new Date());
        fileName = `${this.configObj.fileDefaultName}(${curDate}日导出).xls`;
      }
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blobData, fileName);
      } else {
        const url = window.URL.createObjectURL(blobData);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;

        link.setAttribute('download', `${fileName}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        link.onload = () => {
          window.URL.revokeObjectURL(url);
        };
      }
    },
  },
};
</script>

<style lang='scss'>
.wrap {
  font-size: 13px;
  i {
    font-size: 15px;
    transform: scaleY(1.1);
    vertical-align: -2px;
    margin-left: 3px;
  }
}
</style>
