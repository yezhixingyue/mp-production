import { IAssistListItem } from '@/views/productionResources/assistInfo/types';
import { EquipmentClassificationListItem } from '@/views/productionResources/equipmentClassification/types';
import { ISubcontractorFactoryListItemType } from '@/views/productionResources/subcontractor/TypeClass/SubcontractorFactory';
import { EquipmentGroupItemType } from '@/store/modules/resource/EquipmentGroupTypeClass/EquipmentGroupItemClass';
import { IManageEquipmentInfo } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/types';
import { MaterialTypeLimitItemType } from '@/store/modules/resource/EquipmentGroupMaterialTypeLimitClass/MaterialTypeLimitItemClass';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { instance, request } from '@/basic/request';

export const resourceApis = {
  /** 生产资源 - 辅助信息相关
   -------------------------------------------- */
  getResourceNoteSave(data) { // POST /Api/Note/Save  辅助信息编辑
    return request<string>({ method: 'POST', url: '/Api/Note/Save', data });
  },
  /** /Api/Note/DisplayPositionList */
  getNoteDisplayPositionList() {
    return request({ method: 'GET', url: '/Api/Note/DisplayPositionList' });
  },
  getResourceNoteList(condition) { // POST /Api/Note/List  辅助信息查询
    return request<IAssistListItem[]>({ method: 'POST', url: '/Api/Note/List', data: condition });
  },
  getResourceNoteRemove(id) { // POST /Api/Note/Remove  辅助信息删除
    return request({ method: 'DELETE', url: '/Api/Note/Remove', params: { id } });
  },
  getResourceNoteGroup() { // POST /Api/Note/Group  所有辅助信息分类查询
    return request({ method: 'GET', url: '/Api/Note/Group' });
  },
  /** GET /Api/Note/All    辅助信息分类查询 */
  getNoteAll(noteType?: AssistInfoTypeEnum) {
    return request<IAssistListItem[]>({ method: 'GET', url: '/Api/Note/All', params: { noteType } });
  },
  /** 生产资源 - 设备分类相关 EquipmentClassification
   -------------------------------------------- */
  getEquipmentClassificationSave(data) { // POST /Api/EquipmentClass/Save  设备分类编辑
    return request<string>({ method: 'POST', url: '/Api/EquipmentClass/Save', data });
  },
  getEquipmentClassificationList(sign?: string, isHaveEquipment?: boolean) { // POST /Api/EquipmentClass/List  设备分类查询
    const headers = sign ? { sign } : undefined;
    const params = isHaveEquipment ? { isHaveEquipment } : undefined;
    return request<EquipmentClassificationListItem[]>({ method: 'GET', url: '/Api/EquipmentClass/List', headers, params, withoutToken: true });
  },
  getEquipmentClassificationRemove(id) { // POST /Api/EquipmentClass/Remove  设备分类删除
    return request({ method: 'DELETE', url: '/Api/EquipmentClass/Remove', params: { id } });
  },
  /** 生产资源 - 外协工厂相关 subcontractor
   -------------------------------------------- */
  getSubcontractorFactorySave(data) { // POST /Api/Factory/Save   外协工厂编辑保存
    return request<ISubcontractorFactoryListItemType>({ method: 'POST', url: '/Api/Factory/Save', data });
  },
  getSubcontractorFactoryList(conditon) { // POST /Api/Factory/List  外协工厂列表
    return request<ISubcontractorFactoryListItemType[]>({ method: 'POST', url: '/Api/Factory/List', data: conditon });
  },
  getSubcontractorFactoryRemove(id) { // DELETE /Api/Factory/Remove  外协工厂删除
    return request({ method: 'DELETE', url: '/Api/Factory/Remove', params: { id } });
  },
  /** 生产资源 - 物料资源包相关 resourceBundle
   -------------------------------------------- */
  getMaterialGroupSave(data) { // POST /Api/MaterialGroup/Save 资源包编辑
    return request<string>({ method: 'POST', url: '/Api/MaterialGroup/Save', data });
  },
  getMaterialGroupList(condition) { // POST /Api/MaterialGroup/List   资源包列表
    return request({ method: 'POST', url: '/Api/MaterialGroup/List', data: condition });
  },
  getMaterialGroupRemove(id) { // DELETE /Api/MaterialGroup/Remove  资源包删除
    return request({ method: 'DELETE', url: '/Api/MaterialGroup/Remove', params: { id } });
  },
  getMaterialTypeGroup(isHaveMaterial?) { // GET /Api/MaterialType/Group  根据类别分组查询返回物料类型数据
    return request({ method: 'GET', url: `/Api/MaterialType/Group?isHaveMaterial=${isHaveMaterial}` });
  },
  getMaterialTypeGroupAll(feature) { // GET /Api/MaterialGroup/All  所有物料资源
    return request({ method: 'GET', url: `/Api/MaterialGroup/All?feature=${feature}` });
  },
  /** 生产资源 - 设备组相关 EquipmentGroup
  --------------------------------------------- */
  getEquipmentGroupSave(data) { // POST /Api/EquipmentGroup/Save   设备组添加|保存
    return request<string>({ method: 'POST', url: '/Api/EquipmentGroup/Save', data });
  },
  getEquipmentGroupList(conditon, sign?: string) { // POST /Api/EquipmentGroup/List   设备组查询
    const headers = sign ? { sign } : undefined;
    return request<EquipmentGroupItemType[]>({
      method: 'POST', url: '/Api/EquipmentGroup/List', data: conditon, headers, withoutToken: true,
    });
  },
  getEquipmentGroupRemove(id) { // DELETE /Api/EquipmentGroup/Remove   设备组删除
    return request({ method: 'DELETE', url: '/Api/EquipmentGroup/Remove', params: { id } });
  },
  getEquipmentGroupSizeLimit(data) { // POST /Api/EquipmentGroup/SizeLimit   尺寸限制
    return request({ method: 'POST', url: '/Api/EquipmentGroup/SizeLimit', data });
  },
  getEquipmentGroupColorLimit(data) { // POST /Api/EquipmentGroup/ColorLimit   印色数量限制
    return request({ method: 'POST', url: '/Api/EquipmentGroup/ColorLimit', data });
  },
  getEquipmentGroupSetBiteMouth(data) { // POST /Api/EquipmentGroup/SetBiteMouth 叼口设置
    return request({ method: 'POST', url: '/Api/EquipmentGroup/SetBiteMouth', data });
  },

  /** 生产资源 - 加工设备相关 Equipment
  --------------------------------------------- */
  getEquipmentSave(data) { // POST /Api/Equipment/Save   加工设备保存
    return request<string>({ method: 'POST', url: '/Api/Equipment/Save', data });
  },
  getEquipmentList(condition, sign?: string) { // POST /Api/Equipment/List   获取加工设备列表 -- 建立条件类
    const headers = sign ? { sign } : undefined;
    return request<IManageEquipmentInfo[]>({
      method: 'POST', url: '/Api/Equipment/List', data: condition, headers, withoutToken: true,
    });
  },
  getEquipmentSetStatus(data) { // POST /Api/Equipment/SetStatus   设置停用和启用
    return request({ method: 'POST', url: '/Api/Equipment/SetStatus', data });
  },
  getEquipmentRemove(id) { // DELETE /Api/Equipment/Remove   加工设备删除
    return request({ method: 'DELETE', url: '/Api/Equipment/Remove', params: { id } });
  },
  /** 生产资源 - 设备组 - 物料限制相关 EquipmentGroupMaterialType
  --------------------------------------------- */
  getEquipmentGroupMaterialTypeSave(data) { // POST /Api/EquipmentGroupMaterialType/Save   设备组物料类型添加
    return request({ method: 'POST', url: '/Api/EquipmentGroupMaterialType/Save', data });
  },
  getEquipmentGroupMaterialTypeList(groupID: string) { // GET /Api/EquipmentGroupMaterialType/List   设备组物料类型限制列表
    return request<MaterialTypeLimitItemType[]>({ method: 'GET', url: '/Api/EquipmentGroupMaterialType/List', params: { groupID } });
  },
  getEquipmentGroupMaterialTypeRemove(id) { // DELETE /Api/EquipmentGroupMaterialType/Remove   设备组物料类型删除
    return request({ method: 'DELETE', url: '/Api/EquipmentGroupMaterialType/Remove', params: { id } });
  },
  /** POST /Api/EquipmentGroupMaterialType/SizeSetUp   设备组物料类型尺寸设置 */
  getEquipmentGroupMaterialTypeSizeSetUp(data) {
    return request({ method: 'POST', url: '/Api/EquipmentGroupMaterialType/SizeSetUp', data });
  },
  getEquipmentGroupMaterialTypeConditionLimitSave(data) { // POST /Api/EquipmentGroupMaterialTypeLimit/Save    设备组物料类型条件编辑
    return request<number>({ method: 'POST', url: '/Api/EquipmentGroupMaterialTypeLimit/Save', data });
  },
  getEquipmentGroupMaterialTypeLimitRemove(id) { // DELETE /Api/EquipmentGroupMaterialTypeLimit/Remove   设备组物料类型删除
    return request({ method: 'DELETE', url: '/Api/EquipmentGroupMaterialTypeLimit/Remove', params: { id } });
  },
  /** 生产资源 - 设备操作助手
  --------------------------------------------- */
  /** get /Api/Assistant/Type/List 获取助手类型列表 ---- 同时存在于clientApi */
  getAssistantTypeList() {
    return instance.get('/Api/Assistant/Type/List');
  },
  /** post /Api/Assistant/Type/Save 助手类型保存 */
  getAssistantTypeSave(data) {
    return instance.post('/Api/Assistant/Type/Save', data);
  },
  /** delete /Api/Assistant/Type/Remove 助手类型删除 */
  getAssistantTypeRemove(id: number) {
    return instance.delete('/Api/Assistant/Type/Remove', { params: { id } });
  },
  /** delete /Api/Assistant/Remove 人员删除 */
  getAssistantRemove(id: string) {
    return instance.delete('/Api/Assistant/Remove', { params: { id } });
  },
  /** post /Api/Assistant/List 筛选人员列表 ---- 同时存在于clientApi */
  getAssistantList(condition) {
    return instance.post('/Api/Assistant/List', condition);
  },
  /** post /Api/Assistant/Save 人员保存 */
  getAssistantSave(data) {
    return instance.post('/Api/Assistant/Save', data);
  },
  /** post /Api/Assistant/RelationGroup/Save 关联设备组保存 */
  getAssistantRelationGroupSave(data) {
    return instance.post('/Api/Assistant/RelationGroup/Save', data);
  },
  /** delete /Api/Assistant/RelationGroup/Remove 关联设备组删除 typeID（助手类型ID）、groupID（设备组ID） */
  getAssistantRelationGroupRemove(typeID: number, groupID: string) {
    return instance.delete('/Api/Assistant/RelationGroup/Remove', { params: { typeID, groupID } });
  },
  /** post /Api/Assistant/RelationGroup/MemberSetup  关联设备组设置最大最小数量 */
  getAssistantRelationGroupMemberSetup(data) {
    return instance.post('/Api/Assistant/RelationGroup/MemberSetup', data);
  },
};
