import { restoreInitDataByOrigin } from 'yezhixingyue-js-utils-4-mpzj';

/**
 * 外协工厂类
 *
 * @export
 * @class SubcontractorFactory
 */
export class SubcontractorFactory {
  FactoryID = ''

  Name = ''

  ProvinceID: '' | number = ''

  CityID: '' | number = ''

  DetailAddress = ''

  LinkMan = ''

  Mobile = ''

  ClassIDS: number[] = []

  constructor(data) {
    if (data) {
      restoreInitDataByOrigin(this, data);
    }
  }
}

export type ISubcontractorFactoryListItemType = Required<SubcontractorFactory>;
