import request from '../request';

const api = {
  // 物料类型 ------------------------ MaterialType
  getMaterialTypeList(data) { // POST /Api/Staff/Login  物料类型查询
    return request({ method: 'POST', url: '/Api/MaterialType/List', data });
  },
  getMaterialTypeSave(data) { // POST /Api/MaterialType/Save  物料类型编辑
    return request({ method: 'POST', url: '/Api/MaterialType/Save', data });
  },
  getMaterialTypeAll(categoryID) { // POST /Api/MaterialType/All  所有物料类型
    return request({ method: 'POST', url: `/Api/MaterialType/All?categoryID=${categoryID}` });
  },
  getMaterialTypeRemove(typeID) { // DELETE /Api/MaterialType/Remove  物料分类删除
    return request({ method: 'DELETE', url: `/Api/MaterialType/Remove?typeID=${typeID}` });
  },
  // 物料类型属性---------------------- MaterialTypeAttribute
  getMaterialTypeAttributeList(data) { // POST /Api/MaterialTypeAttribute/List  物料类型属性查询
    return request({ method: 'POST', url: '/Api/MaterialTypeAttribute/List', data });
  },
  getMaterialTypeAttributeRemove(AttributesID) {
    // DELETE /Api/MaterialTypeAttribute/Remove  物料类型属性删除
    return request({ method: 'DELETE', url: `/Api/MaterialTypeAttribute/Remove?attributeID=${AttributesID}` });
  },
  getMaterialTypeAttributeSave(data) { // POST /Api/MaterialTypeAttribute/Save  物料类型属性编辑
    return request({ method: 'POST', url: '/Api/MaterialTypeAttribute/Save', data });
  },
  getMaterialTypeAttributeSetBrand(data) {
    // POST /Api/MaterialTypeAttribute/SetBrand  物料类型属性 - 设置品牌
    return request({ method: 'POST', url: '/Api/MaterialTypeAttribute/SetBrand', data });
  },
  getMaterialTypeAttributeSetSelectType(data) {
    // POST /Api/MaterialTypeAttribute/SelectType  物料类型属性 选择项查询
    return request({ method: 'GET', url: '/Api/MaterialTypeAttribute/SelectType', data });
  },
  getMaterialTypeAttributeAll(data) { // POST /Api/MaterialTypeAttribute/All  物料类型属性 -
    return request({ method: 'POST', url: `/Api/MaterialTypeAttribute/All?typeID=${data.TypeID}` });
  },
  // 物料分类 ------------------------ MaterialCategory
  getMaterialCategorySave(data) { // POST /Api/MaterialCategory/Save  物料分类编辑
    return request({ method: 'POST', url: '/Api/MaterialCategory/Save', data });
  },
  getMaterialCategoryList(data) { // POST /Api/MaterialCategory/List  物料分类查询
    return request({ method: 'POST', url: '/Api/MaterialCategory/List', data });
  },
  getMaterialCategoryAll(data) { // POST /Api/MaterialCategory/All  物料所有分类查询
    return request({ method: 'POST', url: '/Api/MaterialCategory/All', data });
  },
  getMaterialCategoryRemove(CategoryID) { // DELETE /Api/MaterialCategory/Remove  物料分类删除
    console.log('/Api/MaterialCategory/Remove');

    return request({ method: 'DELETE', url: `/Api/MaterialCategory/Remove?categoryID=${CategoryID}` });
  },
  // 物料 -------------------- Material
  getMaterialSave(data) { // POST /Api/Material/Save  物料编辑
    return request({ method: 'POST', url: '/Api/Material/Save', data });
  },
  getMaterialList(data) { // POST /Api/Material/List  物料查询
    return request({ method: 'POST', url: '/Api/Material/List', data });
  },
  getMaterialRemove(id) { // DELETE /Api/Material/Remove  物料删除
    return request({ method: 'DELETE', url: `/Api/Material/Remove?id=${id}` });
  },
  // 物料类型尺寸 ------------ MaterialTypeSize
  getMaterialTypeSizeRemove(ID) { // DELETE /Api/MaterialTypeSize/Remove  物料类型尺寸删除
    return request({ method: 'DELETE', url: `/Api/MaterialTypeSize/Remove?sizeID=${ID}` });
  },
  getMaterialTypeSizeList(data) { // POST /Api/MaterialTypeSize/List  物料类型尺寸查询
    return request({ method: 'POST', url: '/Api/MaterialTypeSize/List', data });
  },
  getMaterialTypeSizeAll(typeID) { // POST /Api/MaterialTypeSize/All  物料类型尺寸 -
    return request({ method: 'POST', url: `/Api/MaterialTypeSize/All?typeID=${typeID}` });
  },
  getMaterialTypeSizeSave(data) { // POST /Api/MaterialTypeSize/Save  物料类型尺寸编辑
    return request({ method: 'POST', url: '/Api/MaterialTypeSize/Save', data });
  },
  // 物料类型单位 ------------ MaterialTypeUnit
  getMaterialTypeSetStockUnit(data) {
    // POST /Api/MaterialType/SetStockUnit 设置库存单位 接口文档在 MaterialType 目录下
    return request({ method: 'POST', url: '/Api/MaterialType/SetStockUnit', data });
  },
  getMaterialTypeUnitRemove(ID) { // DELETE /Api/MaterialTypeUnit/Remove  物料类型单位删除
    return request({ method: 'DELETE', url: `/Api/MaterialTypeUnit/Remove?unitID=${ID}` });
  },
  getMaterialTypeUnitList(data) { // POST /Api/MaterialTypeUnit/List  物料类型单位查询
    return request({ method: 'POST', url: '/Api/MaterialTypeUnit/List', data });
  },
  getMaterialTypeUnitSave(data) { // POST /Api/MaterialTypeUnit/Save  物料类型单位编辑
    return request({ method: 'POST', url: '/Api/MaterialTypeUnit/Save', data });
  },
  // 供应商管理 ---------------------------- MaterialSupplier
  getMaterialSupplierSave(data) { // POST /Api/MaterialSupplier/Save  物料供应商编辑
    return request({ method: 'POST', url: '/Api/MaterialSupplier/Save', data });
  },
  getMaterialSupplierList(data) { // POST /Api/MaterialSupplier/List  物料供应商列表
    return request({ method: 'POST', url: '/Api/MaterialSupplier/List', data });
  },
  getMaterialSupplierSelect() { // POST /Api/MaterialSupplier/Select  物料供应商选择项
    return request({ method: 'POST', url: '/Api/MaterialSupplier/Select' });
  },
  getMaterialSupplierRemove(ID) { // POST /Api/MaterialSupplier/Remove  物料供应商列表
    return request({ method: 'DELETE', url: `/Api/MaterialSupplier/Remove?id=${ID}` });
  },
  // 仓库管理 ------------------------------ Storehouse
  getStorehouseList(data) { // POST /Api/Storehouse/List  仓库查询
    return request({ method: 'POST', url: '/Api/Storehouse/List', data });
  },
  getStorehouseSave(data) { // POST /Api/Storehouse/Save  仓库查询
    return request({ method: 'POST', url: '/Api/Storehouse/Save', data });
  },
  getStorehouseRemove(ID) { // POST /Api/Storehouse/Remove  仓库删除
    return request({ method: 'DELETE', url: `/Api/Storehouse/Remove?storehouseID=${ID}` });
  },
  // 货位维度 ------------------------------- GoodsPositionDimension
  getGoodsPositionDimensionList(data) { // POST /Api/GoodsPositionDimension/List  货位维度
    return request({ method: 'POST', url: '/Api/GoodsPositionDimension/List', data });
  },
  getGoodsPositionDimensionSave(data) { // POST /Api/GoodsPositionDimension/Save  货位维度
    return request({ method: 'POST', url: '/Api/GoodsPositionDimension/Save', data });
  },
  getGoodsPositionDimensionRemove(dimensionID) { // POST /Api/GoodsPositionDimension/Remove  货位维度删除
    return request({ method: 'DELETE', url: `/Api/GoodsPositionDimension/Remove?dimensionID=${dimensionID}` });
  },
  getGoodsPositionDimensionLockStatus(storehouseID) {
    // GET /Api/GoodsPositionDimension/LockStatus  货位维度删除
    return request({ method: 'GET', url: `/Api/GoodsPositionDimension/LockStatus?storehouseID=${storehouseID}` });
  },
  getGoodsPositionDimensionLockCode(storehouseID) {
    // GET /Api/GoodsPositionDimension/LockStatus  锁定货位编号
    return request({ method: 'GET', url: `/Api/GoodsPositionDimension/LockCode?storehouseID=${storehouseID}` });
  },
  getGoodsPositionDimensionUnlockCode(storehouseID) {
    // GET /Api/GoodsPositionDimension/UnlockCode  锁定货位编号
    return request({ method: 'GET', url: `/Api/GoodsPositionDimension/UnlockCode?storehouseID=${storehouseID}` });
  },
  // 出入库记录  --------------------
  getStockLogList(data) {
    // POST /Api/StockLog/List  锁定货位编号
    return request({ method: 'POST', url: '/Api/StockLog/List', data });
  },
};
export default api;
