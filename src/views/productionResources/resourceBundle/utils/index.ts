import api from '@/api';

interface IMaterialType {
  TypeID: string
  TypeName: string
}

export interface IMaterialTypeGroupItemType {
  CategoryID: number
  CategoryName: string
  MaterialTypes: IMaterialType[]
  innerIds?: string[]
}

export const getMaterialTypeGroup = async (bool?: boolean) => {
  let list:IMaterialTypeGroupItemType[] = [];

  const resp = await api.getMaterialTypeGroup(bool).catch(() => null);
  if (resp?.data?.isSuccess) {
    list = resp.data.Data as IMaterialTypeGroupItemType[];
  }

  return list;
};
