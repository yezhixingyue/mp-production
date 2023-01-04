<!--  -->
<template>
  <div>
    <h4>生产报工页面</h4>

    <div>
      <span>本机设备编码：</span>
      <span>{{ code }}</span>
    </div>

    <mp-button @click="loadFile" class="mr-25">{{ code ? '导出' : '生成' }}配置</mp-button>

    <MpFileSelectButton accept=".txt" ref="oInput" @change="selectFile" title="导入配置" />
  </div>
</template>

<script lang='ts' setup>
import { createLocalMachineCode, getLocalMachineCode } from '@/assets/js/getLocalMachineCode';
import { onMounted, ref } from 'vue';
import MpFileSelectButton from '@/components/common/General/MpFileSelectButton.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';

const code = ref('');

const setCodeValue = (val: string) => {
  code.value = val;
  if (val) {
    console.log('此处可初始化数据');
  }
};

const loadFile = async () => {
  const fileName = '生产报工配置文件.txt';
  const content = code.value || await createLocalMachineCode();

  const file = new File(
    [content],
    fileName,
    {
      type: 'text/plain',
    },
  );

  const link = document.createElement('a');

  link.download = fileName;

  link.href = URL.createObjectURL(file);

  link.click();

  if (!code.value) {
    setCodeValue(content);
  }
};

const selectFile = (file: File) => {
  const reader = new FileReader(); // 创建一个 FileReader 实例对象
  // 读取文件成功后触发 load 事件
  reader.onload = (e: ProgressEvent<FileReader>) => {
    if (!e.target) return;
    console.log(e.target.result);
    if (typeof e.target.result === 'string' && e.target.result.length === 16) {
      setCodeValue(e.target.result);
    } else {
      MpMessage.error({ title: '操作失败', msg: '配置文件不可用' });
    }
  };
  // 读取文件
  reader.readAsText(file);
};

onMounted(async () => {
  setCodeValue(await getLocalMachineCode());
});
</script>
<style lang='scss' scoped>
</style>
