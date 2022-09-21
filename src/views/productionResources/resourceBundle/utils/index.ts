import api from '@/api';

interface IMaterialType {
  TypeID: string
  TypeName: string
}

export interface IMaterialTypeGroupItemType {
  CategoryID: number
  CategoryName: string
  MaterialTypes: IMaterialType[]
}

export const getMaterialTypeGroup = async () => {
  let list:IMaterialTypeGroupItemType[] = [];

  const resp = await api.getMaterialTypeGroup().catch(() => null);
  if (resp?.data.isSuccess) {
    list = resp.data.Data as IMaterialTypeGroupItemType[];
  }

  return list;
};
