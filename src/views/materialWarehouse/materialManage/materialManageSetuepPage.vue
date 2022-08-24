<template>
  <div class="material-manage-setuep-page">
    <header>
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ path: '/materialManage' }">物料管理</el-breadcrumb-item>
        <el-breadcrumb-item>批量生成： {{materialManageName}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="header-top">
        <el-button type="primary" @click="generativeRuleClick">生成规则</el-button>
      </div>
    </header>
    <main :style="`height:${h}px`">
      <MpCardContainer>
        <!-- :data="Data.BatchAddList" style="width: 100%"> -->
        <el-scrollbar>
          <div class="material-item"
          v-for="(item, index) in Data.BatchAddList" :key="item.ID || item.key">
            <div class="material-title">
              <span>
                名称：{{getMaterialName(item.MaterialRelationAttributes).join('-')}}
              </span>
              <span>
                编码：<el-input v-model="item.MaterialCode" style="width:120px"></el-input>
              </span>
              <span>
                操作：<el-button link type="danger" @click="delMaterial(index)">删除物料</el-button>
              </span>
            </div>
            <el-scrollbar>
              <ul class="size-list">
                <template v-for="(size, i) in item.SizeIDS">
                  <li class="size-item" v-if="size" :key="size">
                    <span>{{getSizeName(size)}}</span>
                    <el-button link type="danger" @click="delSize(index,i)">删除</el-button>
                  </li>
                </template>
                <!-- <li class="size-item">
                  <span>数码不干胶460x320mm</span>
                  <el-button link type="danger">删除</el-button>
                </li>
                <li class="size-item">
                  <span>数码不干胶460x320mm</span>
                  <el-button link type="danger">删除</el-button>
                </li>
                <li class="size-item">
                  <span>数码不干胶460x320mm</span>
                  <el-button link type="danger">删除</el-button>
                </li>
                <li class="size-item">
                  <span>数码不干胶460x320mm</span>
                  <el-button link type="danger">删除</el-button>
                </li>
                <li class="size-item">
                  <span>数码不干胶460x320mm</span>
                  <el-button link type="danger">删除</el-button>
                </li>
                <li class="size-item">
                  <span>数码不干胶460x320mm</span>
                  <el-button link type="danger">删除</el-button>
                </li>
                <li class="size-item">
                  <span>数码不干胶460x320mm</span>
                  <el-button link type="danger">删除</el-button>
                </li>
                <li class="size-item">
                  <span>数码不干胶460x320mm</span>
                  <el-button link type="danger">删除</el-button>
                </li>
                <li class="size-item">
                  <span>数码不干胶460x320mm</span>
                  <el-button link type="danger">删除</el-button>
                </li>
                <li class="size-item">
                  <span>数码不干胶460x320mm</span>
                  <el-button link type="danger">删除</el-button>
                </li>
                <li class="size-item">
                  <span>数码不干胶460x320mm</span>
                  <el-button link type="danger">删除</el-button>
                </li> -->
              </ul>
            </el-scrollbar>
          </div>
        </el-scrollbar>
      </MpCardContainer>
    </main>
    <footer>
      <el-button type="primary" @click="saveGenerativeRule">保存</el-button>
      <el-button @click="$goback">返回</el-button>
    </footer>
    <DialogContainerComp
    :title="'批量生成'"
    :visible='Data.dialogShow'
    :width="660"
    :closed="closed"
    >
    <template #default>
      <div class="add-Generative-Rule-dialog">
        <el-form :model="Data.generativeRule" label-width="180px">
          <el-form-item :label="`${item.AttributeName}：`" :required="item.IsRequired"
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
                    自定义：
                </el-checkbox>
                <el-input v-model="item.selfDefiningValue" style="width:100px"/>
                <span class="unit">
                  {{item.AttributeUnit}}
                </span>
              </p>
            </template>

            </el-checkbox-group>
            <template v-if="item.IsCustom">

            </template>
          </el-form-item>

          <el-divider />

          <el-form-item label="可选尺寸：" required>
            <el-checkbox-group v-model="Data.generativeRule.SizeIDS">
              <el-checkbox
              v-for="size in MaterialWarehouseStore.MaterialTypeSizeAllList"
              :key="size" :label="size.SizeID">{{size.SizeName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #footer>
      <el-button type="primary"
      @click="primaryClick(false)">追加生成</el-button>
      <el-button type="danger"
      @click="primaryClick(true)">重新生成</el-button>
      <el-button @click="closeClick">取消</el-button>
    </template>
    </DialogContainerComp>
  </div>
</template>

<script lang='ts'>
import MpCardContainer from '@/components/common/MpCardContainerComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import {
  ref, reactive, onMounted, watch, computed, getCurrentInstance, onActivated,
} from 'vue';
import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import api from '@/api/request/MaterialStorage';
import { useRoute, useRouter } from 'vue-router';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import messageBox from '@/assets/js/utils/message';
import { getGoBackFun } from '@/router';
import { useCommonStore } from '@/store/modules/common';

interface item {
  AttributeID: number,
  NumericValue: string,
  SelectID: number,
  InputSelectValue:string,
}
interface DataType{
  generativeRule: any,
  [a:string]:any
}
export default {
  name: 'materialManageSetuepPage',
  components: {
    MpCardContainer,
    DialogContainerComp,
  },
  setup() {
    const h = ref(0);
    const CommonStore = useCommonStore();
    const route = useRoute();
    const router = useRouter();

    const MaterialWarehouseStore = useMaterialWarehouseStore();

    const Data:DataType = reactive({
      dialogShow: false,
      TypeID: 0,
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
      const CategoryTemp = MaterialWarehouseStore.CategoryList
        .find(res => res.CategoryID === Data.CategoryID);
      const MaterialTypeTemp = MaterialWarehouseStore.MaterialTypeList
        .find(res => res.TypeID === Data.TypeID);
      return `${CategoryTemp?.CategoryName}-${MaterialTypeTemp?.TypeName}`;
    });
    const getNumberValueList = (valueList) => {
      const reg = /\s|,|，/;
      return valueList.split(reg).filter(it => it);
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
    function closed() {
      Data.generativeRule.SizeIDS = [];
      Data.generativeRule.Attributes = [];
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
      const AttributesList:any = {};
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
              SelectID: 0,
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
                NumericValue: '',
                SelectID: 0,
                InputSelectValue: temp,
              });
            } else {
              actionItem.push({
                AttributeID: AttributesItem.AttributeID,
                NumericValue: '',
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
      console.log(Data.generativeRule.Attributes, 'Data.generativeRule.Attributes');
      const msg:string[] = [];
      // 表单验证
      Data.generativeRule.Attributes.forEach(res => {
        if (res.IsRequired && !res.actionsValue.length) {
          msg.push(res.AttributeName);
        }
      });

      if (msg.length) {
        messageBox.failSingleError('保存失败', `请选择属性 ${msg.join('、')} 的值`, () => null, () => null);
      } else if (!Data.generativeRule.SizeIDS.length) {
        messageBox.failSingleError('保存失败', '请选择可选尺寸', () => null, () => null);
      } else {
        const temp = getCartesianProduct(Data.generativeRule.Attributes);
        if (isAgain) Data.BatchAddList = [];
        temp.forEach(res => {
          Data.BatchAddList.push({
            ID: 0,
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

          returndata.push(SelectTemp?.SelectItemValue as string);
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
    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.material-manage-setuep-page header', 72);
    }
    function saveGenerativeRule() {
      const nullSizeIDS:number[] = [];
      Data.BatchAddList.forEach((res, i) => {
        if (res.SizeIDS.length === 0) {
          nullSizeIDS.push(i as number);
        }
      });
      const nullMaterialCode:number[] = [];
      Data.BatchAddList.forEach((res, i) => {
        if (res.MaterialCode === '') {
          nullMaterialCode.push(i as number);
        }
      });
      if (nullSizeIDS.length) {
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
    watch(() => CommonStore.size, () => {
      setHeight();
    });
    onActivated(() => {
      setHeight();
    });
    onMounted(() => {
      Data.TypeID = Number(route.params.TypeID);
      Data.CategoryID = Number(route.params.CategoryID);
      setHeight();
      MaterialWarehouseStore.getMaterialTypeAttributeAllByTypeID(Data.TypeID);
      MaterialWarehouseStore.getMaterialTypeSizeAllByTypeID(Data.TypeID);
    });
    return {
      h,
      Data,
      BatchAddData,
      materialManageName,
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
  >header{
    >.el-breadcrumb{
      margin-bottom: 20px;
    }
    >.header-top{
      margin-bottom: 20px;
    }
    >.mp-card-container{
      >.top-main{
        display: flex;
        justify-content: space-between;
        .mp-search-input-comp{
          display: flex;
        }
      }
    }
  }
  >main{
    margin-top: 20px;
    >.mp-card-container{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      height: 100%;
      padding: 20px 80px;
      // min-width: 740px;
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
  }
  >footer{
    padding-top: 20px;
    text-align: center;
  }
  .add-Generative-Rule-dialog{
    .el-checkbox-group{
      flex: 1;
    }
    .custom{
      width: 100%;
      font-size: 14px;
      line-height: 30px;
    }
    .unit{
      margin-left: 5px;
    }
  }
}
</style>
