<template>
  <span class="is-blue-span down-wrap" @click="onClick" :class="{disabled: disabled}">{{title}} <el-icon><Download /></el-icon></span>
</template>

<script setup lang='ts'>
import api from '@/api';
import { downloadExcelApis } from '@/api/modules/downloadExcelApis';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ConvertTimeFormat } from '@/assets/js/utils/ConvertTimeFormat';
import { IExportExcelCondition } from './types';

/**
 * Excel导出组件中可传递和需要传递的props类型
 *
 * @export
 * @interface IExportExcelProps
 */
interface IExportExcelProps {
  /** 按钮标题 */
  title?: string
  /** 是否禁用 - 总页码条目为0时禁用 */
  disabled?: boolean
  /** 导出接口 */
  apiPath: keyof typeof downloadExcelApis
  /** 导出条件 */
  condition?: IExportExcelCondition
  /** 导出的文件名称 */
  fileName: string
  /** 导出时间段 - 如果未设置且withoutDate为false时为全部文字 */
  fileDate?: { First: string, Second: string }
  /** 导出的文件名称上是否包含导出时间段 */
  withExportDate?: boolean
}

const props = withDefaults(defineProps<IExportExcelProps>(), {
  title: '导出Excel表格',
  disabled: false, // 总条目数量count为0时 - 外部知道 - 由外部传入
  withExportDate: false,
});

const onClick = async () => {
  if (props.disabled) return;
  /** 需要知道的信息：
   * 1. 导出Excel的接口地址
   * 2. 导出条件（除起始页码、页码容量外的其它条件）
   * 3. 是否可导出（count > 0， 可使用disabled传入）
   * 4. 导出的文件名称 fileName
   * */
  const _condition: IExportExcelCondition = JSON.parse(JSON.stringify(props.condition || {})); // 获取经过处理过的请求头配置对象

  delete _condition.Page;
  delete _condition.PageSize;

  const resp = await api.downloadExcelApis[props.apiPath](_condition).catch(() => null);

  if (!resp || resp.status !== 200) {
    MpMessage.error({ title: '导出失败', msg: `[ 下载失败：${resp ? resp.statusText : '未知错误'} ]` });
    return;
  }

  const blobData = new Blob([resp.data as unknown as ArrayBuffer], { type: 'application/vnd.ms-excel' });

  let fileName = `${props.fileName}.xls`;

  if (props.fileDate) {
    const { First, Second } = props.fileDate;
    if (First && Second) {
      const f = First.split('T')[0];
      let _second = '';
      if (new Date(Second.replace('Z', '')) > new Date()) {
        _second = ConvertTimeFormat(new Date());
      } else {
        _second = ConvertTimeFormat(new Date(new Date(Second.replace('Z', '')).getTime()));
      }
      const t2 = _second || '';
      if (f) fileName = `${props.fileName}(${f}至${t2}).xls`;
    } else if (!First && !Second) {
      fileName = `${props.fileName}.xls`;
    }
  }

  if (props.withExportDate) {
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
