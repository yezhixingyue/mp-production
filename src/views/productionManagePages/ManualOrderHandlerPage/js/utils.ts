import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IImpositionTemplate } from './ProductionLineDetailTypes';
import { IConvertOrderFile } from './types';

export const checkMobile = (str: string, target = '') => {
  const mobileRegxp = /^1[3456789]\d{9}$/;

  if (!str) {
    return `请输入${target}手机号码`;
  }

  if (str.length !== 11) {
    return `${target}手机号码长度应为11位`;
  }

  if (!mobileRegxp.test(str)) {
    return `${target}手机号码格式不正确`;
  }

  return true;
};

/** 检查是否为正整数 */
export const checkIsPositiveInteger = (num: number | string, title: string) => {
  if (!num && num !== 0) {
    MpMessage.error({ title: '操作失败', msg: `请输入${title}` });
    return false;
  }

  if (!/^\d+$/.test(`${num}`) || num === 0) {
    MpMessage.error({ title: '操作失败', msg: `${title}输入不正确，必须为正整数，请检查` });
    return false;
  }

  return true;
};

export const handleFileChange = (file: File, item: IConvertOrderFile, FileList: IConvertOrderFile[]) => {
  // const t = FileList.find(it => it._File?.name === file.name
  //   && it._File.lastModified === file.lastModified
  //   && it._File.size === file.size
  //   && ((!it._NoteInfo && !item._NoteInfo) || (it._NoteInfo && item._NoteInfo && it._NoteInfo !== item._NoteInfo))
  //   && ((!it._PlateTemplate && !item._PlateTemplate) || (it._PlateTemplate && item._PlateTemplate && it._PlateTemplate !== item._PlateTemplate))
  //   && ((!it._SpecialColorInfo && !item._SpecialColorInfo)
  //    || (it._SpecialColorInfo && item._SpecialColorInfo && it._SpecialColorInfo !== item._SpecialColorInfo)));

  const t = FileList.find(it => it._PlateTemplate
    && item._PlateTemplate
    && it._File?.name === file.name
    && it._File.lastModified === file.lastModified
    && it._File.size === file.size);

  const _item = item;

  if (t) {
    const cb = () => {
      _item._File = null;
      _item.UniqueName = '';
    };
    MpMessage.error({
      title: '文件选择失败', msg: '拼版文件不能重复', onOk: cb, onCancel: cb,
    });
    return;
  }
  _item._File = file;
  _item.UniqueName = '';
};

export const getBleedContent = (item: IConvertOrderFile) => {
  const { BleedTop, BleedBottom, BleedLeft, BleedRight } = item;

  if ([BleedTop, BleedBottom, BleedLeft, BleedRight].filter(it => typeof it === 'number').length === 4) {
    return `上:${BleedTop}mm,下:${BleedBottom}mm,左:${BleedLeft}mm,右:${BleedRight}mm`;
  }

  return '';
};

let _DigitalImpositionTemplateCache: null | IImpositionTemplate = null;
export const getDigitalImpositionTemplate = async () => {
  if (_DigitalImpositionTemplateCache) return _DigitalImpositionTemplateCache;

  const resp = await api.ManualOrderHandlerApis.getDigitalImpositionTemplate().catch(() => null);

  if (resp?.data?.isSuccess) {
    _DigitalImpositionTemplateCache = resp.data.Data as IImpositionTemplate;

    return _DigitalImpositionTemplateCache;
  }

  return null;
};
