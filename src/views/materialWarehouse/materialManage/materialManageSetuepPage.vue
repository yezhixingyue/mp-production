<template>
  <div class="material-manage-setuep-page">
    <header>
      <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
      <div class="header-top">
        <mp-button type="primary" @click="generativeRuleClick">生成规则</mp-button>
      </div>
    </header>
    <main >
        <!-- :data="Data.BatchAddList" style="width: 100%"> -->
        <el-scrollbar>
          <div class="material-item"
          v-for="(item, index) in Data.BatchAddList" :key="item.ID || item.key">
            <div class="material-title">
              <span>
                名称：{{getMaterialName(item.MaterialRelationAttributes).join(' ')}}
              </span>
              <span>
                编码：<el-input v-model.trim="item.MaterialCode" style="width:120px"></el-input>
              </span>
              <span>
                操作：<mp-button link type="danger" @click="delMaterial(index)">删除物料</mp-button>
              </span>
            </div>
            <el-scrollbar>
              <ul class="size-list">
                <template v-for="(size, i) in item.SizeIDS">
                  <li class="size-item" v-if="size" :key="size">
                    <span>{{getSizeName(size)}}</span>
                    <mp-button link type="danger" @click="delSize(index,i)">删除</mp-button>
                  </li>
                </template>
              </ul>
            </el-scrollbar>
          </div>
        </el-scrollbar>
    </main>
    <footer>
      <mp-button :disabled="!Data.BatchAddList.length"
      type="primary" class="gradient" @click="saveGenerativeRule">保存</mp-button>
      <mp-button class="blue" @click="$goback">返回</mp-button>
    </footer>
    <DialogContainerComp
    :title="'批量生成'"
    :visible='Data.dialogShow'
    :width="660"
    :closeClick="closeClick"
    :closed="closed"
    >
    <template #default>
      <div class="add-Generative-Rule-dialog">
        <el-scrollbar>
        <el-form :model="Data.generativeRule" label-width="180px">
          <el-form-item :label="`${item.AttributeName}：`"
          :class="item.IsRequired?'form-item-required':''"
          v-for="(item) in Data.generativeRule.Attributes" :key="item.AttributeID">

            <el-checkbox-group
              v-model="item.actionsValue"
            >
            <template v-if="item.AttributeType === 1">
              <el-checkbox
              v-for="city in item.AttributeSelects"
              :key="city" :label="city">{{
                city
              }}{{item.AttributeUnit}}
              </el-checkbox>
            </template>
            <template v-else>
              <el-checkbox
              v-for="city in item.AttributeSelects"
              :key="city.SelectID" :label="city.SelectID">{{
                city.SelectItemValue
              }}</el-checkbox>
            </template>
            <template v-if="item.IsCustom">
              <p class="custom">
                <el-checkbox :label="item.selfDefiningValueID">
                    自定义
                </el-checkbox>
                <template v-if="getCustominp(item)">
                  <el-input v-model="item.selfDefiningValue" style="width:100px;margin:0 10px"/>
                  <span class="unit">
                    {{item.AttributeUnit}}
                  </span>
                </template>
              </p>
            </template>

            </el-checkbox-group>
            <template v-if="item.IsCustom">

            </template>
          </el-form-item>

          <el-divider />

          <el-form-item label="可选尺寸：" class="form-item-required select-size"
          v-if="MaterialWarehouseStore.MaterialTypeSizeAllList.length">
          <p>
            <el-checkbox
              v-model="Data.checkAll"
              :indeterminate="Data.isIndeterminate"
              @change="handleCheckAllChange"
            >所有尺寸</el-checkbox>
          </p>
            <el-checkbox-group v-model="Data.generativeRule.SizeIDS"
            @change="handleCheckedCitiesChange">
              <el-checkbox
              v-for="size in MaterialWarehouseStore.MaterialTypeSizeAllList"
              :key="size" :label="size.SizeID">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="`${size.SizeName}${size.SizeLength}x${size.SizeWidth}mm`"
                  placement="top"
                  :disabled="size.SizeName.length<7"
                >
                {{size.SizeName}}{{size.SizeLength}}x{{size.SizeWidth}}mm
                </el-tooltip>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        </el-scrollbar>
      </div>
    </template>
    <template #footer>
      <mp-button type="primary"
      @click="primaryClick(false)">追加生成</mp-button>
      <mp-button type="danger"
      @click="primaryClick(true)">重新生成</mp-button>
      <mp-button @click="closeClick">取消</mp-button>
    </template>
    </DialogContainerComp>
  </div>
</template>

<script lang='ts'>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import {
  reactive, onMounted, computed,
} from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import api from '@/api';
import { useRoute } from 'vue-router';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import messageBox from '@/assets/js/utils/message';
import { getGoBackFun } from '@/router';

interface item {
  AttributeID: string,
  NumericValue: number|null,
  SelectID: string,
  InputSelectValue:string,
}
interface AttributesListType {
  [id:string]: item[]
}
interface AttributesType {
  IsCustomValue: string,
  actionsValue: [],
  AttributeID: string,
  AttributeName: string,
  AttributeSelects: string[],
  IsCustom: boolean,
  selfDefiningValueID: string,
  AttributeUnit: string,
  // 小数
  IsAllowDecimal: boolean,
  AttributeType: number,
  IsRequired: boolean,
  selfDefiningValue?:string
}
interface generativeRuleType {
  SizeIDS: string[],
  Attributes: AttributesType[],
}
interface BatchAddListType {
  ID: string,
  key: string,
  MaterialRelationAttributes: item[],
  MaterialCode: string,
  SizeIDS: string[],
  BrandID: number,
}

interface DataType{
  checkAll:boolean,
  isIndeterminate:boolean,
  generativeRule: generativeRuleType,
  CategoryID:number|''
  TypeID:string
  dialogShow:boolean
  BatchAddList:BatchAddListType[]
}
export default {
  name: 'materialManageSetuepPage',
  components: {
    DialogContainerComp,
    MpBreadcrumb,
  },
  setup() {
    const route = useRoute();

    const MaterialWarehouseStore = useMaterialWarehouseStore();

    const Data:DataType = reactive({
      checkAll: false,
      isIndeterminate: false,
      dialogShow: false,
      TypeID: '',
      CategoryID: '',
      BatchAddList: [
        // {
        //   ID: 0,
        //   MaterialRelationAttributes: [
        //     {
        //       AttributeID: 0,
        //       NumericValue: 'string',
        //       SelectID: 0,
        //       InputSelectValue: 'string',
        //     },
        //   ],
        //   MaterialCode: 'string',
        //   SizeIDS: [
        //     0,
        //   ],
        //   BrandID: 0,
        // },
      ],
      generativeRule: {
        SizeIDS: [],
        Attributes: [
          // {
          //   selfDefiningValueID: '',
          //   selfDefiningValue: '',
          //   actionsValue: [],
          // },
        ],
      },
    });
    const BatchAddData = computed(() => ({
      AttributeAllList: MaterialWarehouseStore.MaterialTypeAttributeAllList,
      TypeSizeAllList: MaterialWarehouseStore.MaterialTypeSizeAllList,
    }));
    const materialManageName = computed(() => {
      const CategoryTemp = MaterialWarehouseStore.MaterialTypeGroup
        .find(res => res.CategoryID === Data.CategoryID);
      const MaterialTypeTemp = CategoryTemp?.MaterialTypes
        .find(res => res.TypeID === Data.TypeID);
      return `${CategoryTemp?.CategoryName}-${MaterialTypeTemp?.TypeName}`;
    });
    const BreadcrumbList = computed(() => [
      { to: { path: '/materialManage' }, name: '物料管理' },
      { name: `设置货位编号：${materialManageName.value}` },
    ]);
    const getNumberValueList = (valueList) => {
      const reg = /\s|,|，/;
      return valueList.split(reg).filter(it => it);
    };

    const handleCheckedCitiesChange = (value:number[]) => {
      const checkedCount = value.length;
      Data.checkAll = checkedCount === MaterialWarehouseStore.MaterialTypeSizeAllList.length;
      Data.isIndeterminate = checkedCount > 0
       && checkedCount < MaterialWarehouseStore.MaterialTypeSizeAllList.length;
    };
    const handleCheckAllChange = (val: boolean) => {
      if (val) {
        const temp = MaterialWarehouseStore
          .MaterialTypeSizeAllList.map(it => it.SizeID as string);
        Data.generativeRule.SizeIDS = temp;
      } else {
        Data.generativeRule.SizeIDS = [];
      }
      Data.isIndeterminate = false;
    };
    function generativeRuleClick() {
      Data.dialogShow = true;
      Data.generativeRule.Attributes = BatchAddData.value.AttributeAllList.map(res => {
        if (res.AttributeType === 1) {
          return {
            // 自定义值
            IsCustomValue: '',
            actionsValue: [],
            AttributeID: res.AttributeID,
            AttributeName: res.AttributeName,
            AttributeSelects: getNumberValueList(res.RegularQuantity),
            IsCustom: res.IsCustom,
            selfDefiningValueID: Math.random().toString(16).slice(-10),
            AttributeUnit: res.AttributeUnit,
            // 小数
            IsAllowDecimal: res.IsAllowDecimal,
            AttributeType: res.AttributeType,
            IsRequired: res.IsRequired,
          };
        }
        return {
          // 自定义值
          IsCustomValue: '',
          actionsValue: [],
          AttributeID: res.AttributeID,
          AttributeName: res.AttributeName,
          AttributeSelects: res.AttributeSelects,
          IsCustom: res.IsCustom,
          selfDefiningValueID: Math.random().toString(16).slice(-10),
          AttributeUnit: '',
          // 小数
          IsAllowDecimal: res.IsAllowDecimal,
          AttributeType: res.AttributeType,
          IsRequired: res.IsRequired,
        };
      });
    }
    function getCustominp(it) {
      if (it.actionsValue.find(t => t === it.selfDefiningValueID)) {
        return true;
      }
      return false;
    }
    function closed() {
      Data.generativeRule.SizeIDS = [];
      Data.generativeRule.Attributes = [];
      Data.checkAll = false;
      Data.isIndeterminate = false;
    }
    function closeClick() {
      Data.dialogShow = false;
      // Data.generativeRule.SizeIDS = [];
      // Data.generativeRule.Attributes = [];
    }

    // const year = ['2019', '2020'];
    // const color = ['白色', '灰色', '蓝色'];
    // const size = ['S', 'M', 'L'];
    // const list = [year, color, size];
    // 求笛卡尔积
    function calcDescartes(array) {
      if (array.length < 2) return array[0] || [];
      return array.reduce((total, currentValue) => {
        const res:Array<item[]> = [];
        total.forEach((t:item[]|item) => {
          currentValue.forEach((cv:item[] | item) => {
            if (t instanceof Array) {
              const temp = [...t, cv];
              res.push(temp as item[]);
            } else {
              res.push([t, cv as item]);
            }
          });
        });
        return res;
      });
    }

    // 获取
    function getCartesianProduct(Attributes) {
      const AttributesList:AttributesListType = {};
      Attributes.forEach(AttributesItem => {
        const actionItem:item[] = [];

        // 数字值
        if (AttributesItem.AttributeType === 1) {
          // 把选择项添加到列表中
          AttributesItem.actionsValue.forEach(actionsItem => {
            // 如果自定义的值选中了
            let temp = actionsItem;
            if (actionsItem === AttributesItem.selfDefiningValueID) {
              temp = AttributesItem.selfDefiningValue;
            }
            actionItem.push({
              AttributeID: AttributesItem.AttributeID,
              NumericValue: temp,
              SelectID: '',
              InputSelectValue: '',
            });
          });
        }
        // 选择项
        if (AttributesItem.AttributeType === 2) {
          // 把选择项添加到列表中
          AttributesItem.actionsValue.forEach(actionsItem => {
            // 如果自定义的值选中了
            let temp = actionsItem;
            if (actionsItem === AttributesItem.selfDefiningValueID) {
              temp = AttributesItem.selfDefiningValue;
              actionItem.push({
                AttributeID: AttributesItem.AttributeID,
                NumericValue: null,
                SelectID: '',
                InputSelectValue: temp,
              });
            } else {
              actionItem.push({
                AttributeID: AttributesItem.AttributeID,
                NumericValue: null,
                SelectID: temp,
                InputSelectValue: '',
              });
            }
          });
        }
        if (actionItem.length) {
          AttributesList[AttributesItem.AttributeID] = actionItem;
        }
      });
      const temp = Object.keys(AttributesList).map(res => AttributesList[res]);
      return calcDescartes(temp);
      // {
      //     "AttributeID": 0,
      //     "NumericValue": "string",
      //     "SelectID": 0,
      //     "InputSelectValue": "string"
      // }
    }

    function primaryClick(isAgain) {
      const msg:string[] = [];
      const CustomMsg:string[] = [];
      // 表单验证
      Data.generativeRule.Attributes.forEach(res => {
        if (res.IsRequired && !res.actionsValue.length) {
          msg.push(res.AttributeName);
        }
      });
      Data.generativeRule.Attributes.forEach(res => {
        if (res.IsCustom) {
          const _IsActionCustom = res.actionsValue.find(it => it === res.selfDefiningValueID);

          if (_IsActionCustom && !res.selfDefiningValue) {
            CustomMsg.push(res.AttributeName);
          }
        }
      });

      if (msg.length) {
        messageBox.failSingleError('保存失败', `请选择属性 ${msg.join('、')} 的值`, () => null, () => null);
      } else if (CustomMsg.length) {
        messageBox.failSingleError('保存失败', `请输入属性 ${CustomMsg.join('、')} 的自定义值`, () => null, () => null);
      } else if (MaterialWarehouseStore
        .MaterialTypeSizeAllList.length && !Data
        .generativeRule.SizeIDS.length) {
        messageBox.failSingleError('保存失败', '请选择可选尺寸', () => null, () => null);
      } else {
        const temp = getCartesianProduct(Data.generativeRule.Attributes);
        if (isAgain) Data.BatchAddList = [];
        temp.forEach(res => {
          Data.BatchAddList.push({
            ID: '',
            key: Math.random().toString(16).slice(-10),
            MaterialRelationAttributes: res instanceof Array ? res : [res],
            MaterialCode: '',
            SizeIDS: [...Data.generativeRule.SizeIDS],
            BrandID: 0,
          });
        });
        closeClick();
      }
    }
    function delMaterial(index) {
      Data.BatchAddList.splice(index, 1);
    }
    function delSize(index, i) {
      Data.BatchAddList[index].SizeIDS.splice(i, 1);
    }
    function getMaterialName(Attributes) {
      if (!Attributes) return [];
      const returndata:string[] = [];
      Attributes.forEach((AttributesItem) => {
        const temp = MaterialWarehouseStore.MaterialTypeAttributeAllList
          .find(res => res.AttributeID === AttributesItem.AttributeID);
        if (temp && temp.AttributeType === 1) {
          returndata.push(`${AttributesItem.NumericValue}${temp.AttributeUnit}`);
        }
        if (temp && temp.AttributeType === 2) {
          const SelectTemp = temp.AttributeSelects
            .find(res => res.SelectID === AttributesItem.SelectID);
          if (SelectTemp) {
            returndata.push(SelectTemp?.SelectItemValue as string);
          } else {
            returndata.push(AttributesItem.InputSelectValue as string);
          }
        }
      });

      return returndata;
    }
    function getSizeName(sizeId) {
      if (!sizeId) return '';
      const temp = MaterialWarehouseStore
        .MaterialTypeSizeAllList.find(res => res.SizeID === sizeId);
      return `${temp?.SizeName}${temp?.SizeLength}x${temp?.SizeWidth}mm`;
    }

    function saveGenerativeRule() {
      const nullSizeIDS:number[] = [];
      Data.BatchAddList.forEach((res, i) => {
        if (res.SizeIDS.length === 0) {
          nullSizeIDS.push(i + 1 as number);
        }
      });
      const nullMaterialCode:number[] = [];
      Data.BatchAddList.forEach((res, i) => {
        if (res.MaterialCode === '') {
          nullMaterialCode.push(i + 1 as number);
        }
      });
      if (MaterialWarehouseStore
        .MaterialTypeSizeAllList.length && nullSizeIDS.length) {
        messageBox.failSingleError('保存失败', `第 ${nullSizeIDS.join('、')} 个物料没有尺寸`, () => null, () => null);
      } else if (nullMaterialCode.length) {
        messageBox.failSingleError('保存失败', `请输入第 ${nullMaterialCode.join('、')} 个物料的编码`, () => null, () => null);
      } else {
        api.getMaterialSave({
          TypeID: Data.TypeID,
          Materials: Data.BatchAddList,
        }).then(res => {
          if (res.data.Status === 1000) {
            if (res.data.Status === 1000) {
              // 添加成功
              const cb = () => {
                getGoBackFun();
                sessionStorage.setItem('saveGenerative', 'true');
              };
              // 成功
              messageBox.successSingle('保存成功', cb, cb);
            }
          }
        });
      }
    }
    onMounted(() => {
      Data.TypeID = route.params.TypeID as string;
      Data.CategoryID = Number(route.params.CategoryID);
      MaterialWarehouseStore.getMaterialTypeAttributeAllByTypeID(Data.TypeID);
      MaterialWarehouseStore.getMaterialTypeSizeAllByTypeID(Data.TypeID);
    });
    return {
      BreadcrumbList,
      Data,
      BatchAddData,
      getCustominp,
      materialManageName,
      handleCheckedCitiesChange,
      handleCheckAllChange,
      generativeRuleClick,
      delMaterial,
      delSize,
      getMaterialName,
      getSizeName,
      primaryClick,
      closeClick,
      closed,
      MaterialWarehouseStore,
      saveGenerativeRule,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.material-manage-setuep-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  >header{
    padding: 20px;
    background-color: #fff;
    >.el-breadcrumb{
      margin-bottom: 20px;
    }
  }
  >main{
    flex: 1;
    // margin-top: 10px;
    background-color: #fff;
      >.el-scrollbar{
        flex: 1;
        padding: 0 40px;
        .el-scrollbar__view{
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
        .material-item{
          margin-bottom: 60px;
          width: 700px;
          height: 204px;
          border: 1px solid #CAD4DE;
          border-radius: 4px;
          min-width: 700px;
          .material-title{
            height: 50px;
            background-color: #F2F6FC;
            border-bottom: 1px solid #CAD4DE;
            display: flex;
            align-items: center;
            justify-content: space-around;
            font-size: 14px;
          }
          .el-scrollbar{
            flex: 1;
            max-height: 150px;
            // height: 100%;
          }
          .size-list{
            line-height: 38px;
            display: flex;
            flex-wrap: wrap;
            font-size: 12px;
            width: 100%;
            .size-item{
              width: 33%;
              display: flex;
              justify-content: space-around;
              color: #566176;
              span{
                flex: 1;
                text-align: center;
              }
              .el-button{
                font-size: 12px;
                padding: 0 20px;
              }
            }
          }
        }
      }
  }
  >footer{
    min-height: 50px;
    background-color: #fff;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-button{
      width: 120px;
    }
    .el-button + .el-button{
      margin-left: 30px;
    }
  }
  .add-Generative-Rule-dialog{
    max-height: 500px;
    .el-form{
      max-height: 500px;
      .select-size{
        .el-checkbox-group{
          width: 100%;
          .el-checkbox{
            max-width: 400px;
            .el-checkbox__label{
              display: inline-block;
              width: calc(100% - 14px - 10px);
              .el-only-child__content{
                max-width: 400px;
                display: inline-block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }
    }
    .custom{
      width: 100%;
      font-size: 14px;
      line-height: 30px;
      min-height: 34px;
    }
    .unit{
      margin-left: 5px;
    }
  }
}
</style>
