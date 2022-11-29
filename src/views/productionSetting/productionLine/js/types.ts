import { IClassEquipmentGroups, IMaterialSources } from '@/store/modules/productionSetting/types';

export interface ISetPlateMakingWorkParams {
  LineWorkID: string
  PlateMakingWorkID: string
  /** 可为空 */
  PlateMakingGroupID: string
}

export interface ISetPlateMakingWorkSaveResult {
  PlateMakingClassEquipmentGroups: null | IClassEquipmentGroups[],
  PlateMakingMaterialSources: null | IMaterialSources[],
  PlateMakingWorkIdentID: null | string
}

export interface IPlateMakingEquipmentSetupData {
  WorkID: string
  WorkName: string;
  PlateMakingClassEquipmentGroups: IClassEquipmentGroups[];
  PlateMakingWorkIdentID: string;
}

export type EquipmentSetupType = 'default' | 'additional';

export interface IPlateMakingMaterialSourceSetupData {
  WorkName: string;
  PlateMakingMaterialSources: IMaterialSources[];
  PlateMakingWorkIdentID: string;
  PlateMakingWorkID: string;
}
