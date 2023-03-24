import { IMaterialSources } from '@/store/modules/productionSetting/types';
import { MaterialSourceTypeEnum } from './enums';

/**
 * 获取物料来源展示文字
 *
 * @param {*} material
 * @returns
 */
export const getSourceWork = (material: IMaterialSources, PrcessList) => {
  const IDS = material.SourceWorkIDS || [];
  const returnStr:string[] = [];

  switch (material.SourceType) {
    case MaterialSourceTypeEnum.otherLine:
      returnStr.push('其它生产线');
      break;
    case MaterialSourceTypeEnum.outOfStorage:
      returnStr.push('预出库');
      break;

    case MaterialSourceTypeEnum.picking:
      returnStr.push('领料');
      break;
    case MaterialSourceTypeEnum.plateMaking:
      returnStr.push('自身制版工序');
      break;
    case MaterialSourceTypeEnum.otherPrcess: // 其它工序
      IDS.forEach(ID => {
        if (PrcessList.find(it => it.ID === ID)) {
          returnStr.push(PrcessList.find(it => it.ID === ID)?.Name || '');
        }
      });
      if (material.AllowSourceLine) {
        returnStr.push('其他生产线');
      }
      break;
    case MaterialSourceTypeEnum._plateMaterialDefault:
      returnStr.push('自身制版工序');
      break;
    default:
      break;
  }
  const str = returnStr.length > 0 ? `来自 ${returnStr.join('、')}` : '';
  // if (!str && material.NeedResource === false) return '不需要来源';
  return str;
};
