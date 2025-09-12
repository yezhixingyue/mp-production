import { getQRCodeSrc } from '@/components/common/General/Print/utils';
import PrintArea from '@/components/common/General/Print/PrintDialog.vue';
import { Ref, ref, computed } from 'vue';
import { useUserHook } from '@/store/modules/user';
import { IUnionTaskDetail } from '../../../types/type';

export const usePrint = (taskDetail: Ref<null | IUnionTaskDetail>) => {
  const { user } = useUserHook();

  const oPrintDialog = ref<InstanceType<typeof PrintArea>>();

  const qrCodeSrc = ref<string | null>(null);

  const _dateString = ref('');

  const submit = async () => { // 此处需添加权限设置
    if (!taskDetail.value) return;

    qrCodeSrc.value = await getQRCodeSrc(taskDetail.value.WorkCode);
    if (!qrCodeSrc.value) return;

    _dateString.value = new Date().toLocaleString()
      .replace(/\//g, '-')
      .replace(/-(\d{1,2})-(\d{1,2})/, (t, a1, a2) => `-${a1.padStart(2, '0')}-${a2.padStart(2, '0')}`);
    oPrintDialog.value?.print(`组合工单打印：${taskDetail.value.WorkCode}`);
  };

  const printStyle = computed(() => `
  @page {
    padding: 25pt 2vw 30pt;
    margin: 5mm;

    @top-left {
      content: "组合工单打印：${taskDetail.value?.WorkCode}";
      font-size:9pt;
      margin-bottom: -15pt;
      margin-left: 0.6em;
      vertical-align: bottom;
      color: #aaa;
    };
    @bottom-left {
      content: " 打单人：${user.value?.StaffName}       打印时间：${_dateString.value}";
      font-size:11pt;
      white-space: pre;
      margin-top: -28pt;
      margin-left: 1.2em;
      vertical-align: top;
    };
    @bottom-right {
      content: counter(page) " / " counter(pages);
      font-size:11pt;
      margin-top: -28pt;
      margin-right: 1em;
      vertical-align: top;
    }
  }

  .print-area-footer {
    transform:translateY(50%);
    z-index:999;
  }
  `);

  return { oPrintDialog, qrCodeSrc, submit, printStyle, user };
};
