export interface RouteTreeChildrenType {
  name: string,
  children: RouteTreeChildrenType[]
}
export interface RouteTreeType {
  name: string,
  isModuleRoot: boolean,
  children: RouteTreeChildrenType[]
}
