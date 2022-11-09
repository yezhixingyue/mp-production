export interface IDepartment {
  ID: number
  Name: string
  Level: number
  ParentID: number
}

export interface IDepartmentLevelItem extends IDepartment {
  children?: IDepartmentLevelItem[]
}
