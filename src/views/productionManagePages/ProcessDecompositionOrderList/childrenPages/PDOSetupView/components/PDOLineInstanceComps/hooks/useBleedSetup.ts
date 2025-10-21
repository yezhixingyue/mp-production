import { ComputedRef, ref } from 'vue';
import { IOrderFileInfo } from '@/views/productionManagePages/ProcessDecompositionOrderList/types/types';
import { SignaturePositionEnum } from '@/views/productionManagePages/ProcessDecompositionOrderList/types/enum';
import { IImpositionTemplate } from '@/views/productionManagePages/ManualOrderHandlerPage/js/ProductionLineDetailTypes';

export const useBleedSetup = (MakeupFileList: ComputedRef<IOrderFileInfo[]>) => {
  const bleedState = ref({
    visible: false,
  });

  /** 设置出血值 */
  const onBleedSetupSubmit = async (data: Pick<IOrderFileInfo, 'BleedBottom' | 'BleedLeft' | 'BleedRight' | 'BleedTop' | 'BindingEdge'>) => {
    MakeupFileList.value.filter(file => file._PlateTemplate?.IsPrintingPlate || file._PlateTemplate?.IsSameSizeWithPrintingPlate).forEach(file => {
      const _file = file;
      _file.BleedTop = Number(data.BleedTop);
      _file.BleedBottom = Number(data.BleedBottom);
      _file.BleedLeft = Number(data.BleedLeft);
      _file.BleedRight = Number(data.BleedRight);
      _file.BindingEdge = data.BindingEdge;
    });

    bleedState.value.visible = false;
  };

  /** 清除所有出血设置 */
  const clearBleedSetup = () => {
    MakeupFileList.value.filter(file => file._PlateTemplate?.IsPrintingPlate || file._PlateTemplate?.IsSameSizeWithPrintingPlate).forEach(file => {
      const _file = file;
      _file.BleedTop = '';
      _file.BleedBottom = '';
      _file.BleedLeft = '';
      _file.BleedRight = '';
      _file.BindingEdge = SignaturePositionEnum.None;
    });
  };

  return { bleedState, onBleedSetupSubmit, clearBleedSetup };
};

export const getBleedLabels = (BindingEdge: SignaturePositionEnum | '', NeedFolding?: boolean | '') => {
  const _BindingEdge = BindingEdge;

  const _text = _BindingEdge !== SignaturePositionEnum.None || NeedFolding ? '书口' : '';

  const left = _BindingEdge === SignaturePositionEnum.Left ? '装订边' : `左${_text}`;
  const top = _BindingEdge === SignaturePositionEnum.Top ? '装订边' : `上${_text}`;
  const right = _BindingEdge === SignaturePositionEnum.Right ? '装订边' : `右${_text}`;
  const bottom = _BindingEdge === SignaturePositionEnum.Bottom ? '装订边' : `下${_text}`;

  return { left, top, right, bottom };
};

export const getBleedContent = (
  item: Pick<IOrderFileInfo, 'BindingEdge' | 'BleedBottom' | 'BleedLeft' | 'BleedRight' | 'BleedTop'>,
  useHtml: boolean,
  _PlateTemplate?: IImpositionTemplate,
) => {
  if (!_PlateTemplate?.IsPrintingPlate && !_PlateTemplate?.IsSameSizeWithPrintingPlate) return '';
  const { BleedTop, BleedBottom, BleedLeft, BleedRight } = item;

  const { left, top, right, bottom } = getBleedLabels(item.BindingEdge);

  if ([BleedTop, BleedBottom, BleedLeft, BleedRight].filter(it => typeof it === 'number').length === 4) {
    if (useHtml) {
      return `<span>
        <i style="color:${top === '装订边' ? '#ff3769' : ''}">${top} :${BleedTop};</i>
        <i style="color:${bottom === '装订边' ? '#ff3769' : ''}">${bottom} :${BleedBottom};</i>
        <i style="color:${left === '装订边' ? '#ff3769' : ''}">${left} :${BleedLeft};</i>
        <i style="color:${right === '装订边' ? '#ff3769' : ''}">${right} :${BleedRight}</i>
      </span>`;
    }

    return `${top}: ${BleedTop};${bottom}: ${BleedBottom};${left}: ${BleedLeft};${right}: ${BleedRight}`;
  }

  return '';
};
