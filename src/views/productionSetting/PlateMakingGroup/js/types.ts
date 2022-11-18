import { IMaterialSources } from '@/store/modules/productionSetting/types';

/**
 * 保存制版组参数
 *
 * @export
 * @interface ISavePlateMakingGroupParams
 */
export interface ISavePlateMakingGroupParams {
  ID: string
  Name: string
  TemplateID: string
}

/**
 * 制版组列表项目类型接口
 *
 * @export
 * @interface IPlateMakingGroup
 */
export interface IPlateMakingGroup {
  ID: string
  Name: string
  TemplateID: string
  // 欠缺其它数据？
}

export interface IPlateMakingGroupMaterialSourceSaveData {
  GroupID: string
  Materials: IMaterialSources[]
}
