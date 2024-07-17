<template>
  <span class="is-blue-span down-wrap" @click="onClick"
   :class="{disabled: localDisabled}">{{options.title || '导出Excel表格'}} <el-icon><Download /></el-icon></span>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ConvertTimeFormat } from '@/assets/js/utils/ConvertTimeFormat';
import { IExportExcelCondition, IExportExcelProps } from './types';

const props = defineProps<{
  options: IExportExcelProps
  disabled: boolean
}>();

const localDisabled = computed(() => (typeof props.options.disabled === 'boolean' ? props.options.disabled : props.disabled));

const onClick = async () => {
  if (localDisabled.value) return;
  /** 需要知道的信息：
   * 1. 导出Excel的接口地址
   * 2. 导出条件（除起始页码、页码容量外的其它条件）
   * 3. 是否可导出（count > 0， 可使用disabled传入）
   * 4. 导出的文件名称 fileName
   *
   * */
  const _condition: IExportExcelCondition = JSON.parse(JSON.stringify(props.options.getCondition ? props.options.getCondition() : {})); // 获取经过处理过的请求头配置对象

  delete _condition.Page;
  delete _condition.PageSize;

  const resp = await api.downloadExcelApis[props.options.apiPath](_condition).catch(() => null);

  if (!resp || resp.status !== 200) {
    MpMessage.error({ title: '导出失败', msg: `[ 下载失败：${resp ? resp.statusText : '未知错误'} ]` });
    return;
  }

  const blobData = new Blob([resp.data as unknown as ArrayBuffer], { type: 'application/vnd.ms-excel' });

  const _fileName = typeof props.options.fileName === 'function' ? props.options.fileName() : props.options.fileName;

  let fileName = `${_fileName}.xls`;

  if (props.options.getFileNameDate) {
    const { First, Second } = props.options.getFileNameDate();
    if (First && Second) {
      const f = First.split('T')[0];
      let _second = '';
      if (new Date(Second.replace('Z', '')) > new Date()) {
        _second = ConvertTimeFormat(new Date());
      } else {
        _second = ConvertTimeFormat(new Date(new Date(Second.replace('Z', '')).getTime()));
      }
      const t2 = _second || '';
      if (f) fileName = `${_fileName}(${f}至${t2}).xls`;
    } else if (!First && !Second) {
      fileName = `${_fileName}.xls`;
    }
  }

  if (props.options.withExportDate) {
    const curDate = ConvertTimeFormat(new Date());
    fileName = `${fileName.replace('.xls', '')}(${curDate}日导出).xls`;
  }

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
};
</script>

<style scoped lang='scss'>
.down-wrap {
  font-size: 13px;
  i {
    font-size: 15px;
    transform: scaleY(1.1);
    vertical-align: -2px;
    margin-left: 3px;
  }
}
</style>
