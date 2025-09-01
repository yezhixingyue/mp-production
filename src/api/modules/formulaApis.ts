import { instance } from '@/basic/request';
import { IFormulaParams } from '@/components/Formula/types/types';

/**
 * 公式相关接口
 */
export const formulaApis = {
  /** post /Api/Formula/List  获取公式列表 */
  getFormulaList(data: IFormulaParams) {
    return instance.post('/Api/Formula/List', data);
  },
  /** post /Api/Formula/Save  公式保存 */
  getFormulaSave(data) {
    return instance.post('/Api/Formula/Save', data);
  },
  /** delete /Api/Formula/Remove 删除公式 */
  getFormulaRemove(id: string) {
    return instance.delete('/Api/Formula/Remove', { params: { id } });
  },
  /** post /Api/Formula/Calculate 公式计算 */
  getFormulaCalculate(data) {
    return instance.post('/Api/Formula/Calculate', data);
  },
  /** post /Api/Formula/Copy  拷贝公式 */
  getFormulaCopy(data) {
    return instance.post('/Api/Formula/Copy', data);
  },
};
