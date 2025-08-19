import { WorkingMaterialStatusEnum } from './enum';

export interface IPartialDeliveryMaterial {
  Name: string
  Status: WorkingMaterialStatusEnum
  Percentage: number
}
