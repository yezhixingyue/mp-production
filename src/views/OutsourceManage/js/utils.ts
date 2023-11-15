import { getLocalTaskList } from '@/views/ProductionClient/Comps/EquipmentPageContent/TaskActivateAndList/BatchReport/getLocalTaskList';
import { ExternalTaskStatusEnum } from './enum';

/**
 * 检查单个外协任务信息是否填写完整
 *
 * @param {ReturnType<typeof getLocalTaskList>[number]} row
 * @returns {(true | string)}
 */
export const checkExTaskIsComplete = (row: ReturnType<typeof getLocalTaskList>[number]): true | string => {
  const { FactoryID, Amount, WishFinishTime } = row._ExternalSubmitParams;

  if (!FactoryID) return '请选择外协工厂';
  // const _row = row; // 此两行代码临时使用 后面需要删除 并 取消注释上行代码
  // _row._ExternalSubmitParams.FactoryID = '4bd5293b-1e4d-4b47-a58c-afba010ae72a';

  if (!Amount && Amount !== 0) return '请输入外协金额';

  if (!/^\d+(\.\d)?$/.test(`${Amount}`)) return '外协金额不正确，请输入数字类型，最多1位小数';

  if (!WishFinishTime) return '请设置预计完成日期';

  return true;
};

/**
 * 获取外协任务是否可以下载文件
 * 1. 已外协  2. 有文件可下载（AssistList中有文件类型或PlateInfo中FilePath有值）
 *
 * @param {ReturnType<typeof getLocalTaskList>[number]} row
 */
export const getCanNotDownload = (row: ReturnType<typeof getLocalTaskList>[number]) => {
  if (row.Working.ExternalAttribute.Status === ExternalTaskStatusEnum.FactoryReceived && row.Working.ExternalAttribute.HaveFile) {
    return true;
  }

  return false;
};
