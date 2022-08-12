<template>
  <div class="material-manage-setuep-page">
    <header>
      <el-breadcrumb >
        <el-breadcrumb-item :to="{ path: '/materialManage' }">物料管理</el-breadcrumb-item>
        <el-breadcrumb-item>批量生成</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="header-top">
        <el-button type="primary" @click="Data.dialogShow = true">生成规则</el-button>
      </div>
    </header>
    <main :style="`height:${h}px`">
      <MpCardContainer>
        <el-table border fit
        :data="Data.dimensisnsList" style="width: 100%">
          <el-table-column prop="name" label="操作" min-width="287">
            <template #default="scope">
              <el-button type="primary" link @click="editDimensions(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</el-button>
              <el-button type="danger" link
                @click="delDimensions(scope.row.SizeID)">
                <i class="iconfont icon-delete"></i>删除</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="SizeName" label="尺寸名称" min-width="315" />
          <el-table-column prop="SizeCode" label="尺寸编码" min-width="315" />
          <el-table-column prop="SizeLength" label="长度" min-width="287" />
          <el-table-column prop="SizeWidth" label="宽度" min-width="287" />

        </el-table>
        <div class="bottom-count-box">
          <MpPagination />
        </div>
      </MpCardContainer>
    </main>
    <footer>
      <el-button type="primary" @click="$goback">返回</el-button>
    </footer>
    <DialogContainerComp
    :title="Data.dialogTitle"
    :visible='Data.dialogShow'
    :width="660"
    :primaryClick="primaryClick"
    :closeClick="closeClick"
    >
    <template #default>
      <div class="add-dimensions-dialog">
        <el-form :model="Data.generativeRule" label-width="180px">
          <el-form-item :label="`${item.AttributeName}：`"
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
              <p>
                <el-checkbox :label="item.selfDefiningValueID">
                    自定义：
                </el-checkbox>
                <el-input v-model="item.selfDefiningValue" style="width:100px"/>
                <span>
                  {{item.AttributeUnit}}
                </span>
              </p>
            </template>

            </el-checkbox-group>
            <template v-if="item.IsCustom">

            </template>
          </el-form-item>

          <el-divider />
<!--
          <el-form-item label="可选尺寸：">
            <el-input v-model="Data.addDimensionsForm.SizeCode" style="width:100px"/>
          </el-form-item> -->
        </el-form>
      </div>
    </template>
    </DialogContainerComp>
  </div>
</template>

<script lang='ts'>
import MpCardContainer from '@/components/common/MpCardContainerComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import {
  ref, reactive, onMounted, computed, watch,
} from 'vue';
import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import api from '@/api/request/MaterialStorage';
import { useRoute } from 'vue-router';
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';

interface DataType{
  generativeRule: any,
  [a:string]:any
}
export default {
  name: 'setTheStorageUnitPage',
  components: {
    MpCardContainer,
    MpPagination,
    DialogContainerComp,
  },
  setup() {
    const h = ref(0);
    const route = useRoute();
    const MaterialWarehouseStore = useMaterialWarehouseStore();

    const Data:DataType = reactive({
      dialogTitle: '添加属性',
      dialogShow: false,
      TypeID: 0,
      BatchAddList: [
        {
          ID: 0,
          MaterialRelationAttributes: [
            {
              AttributeID: 0,
              NumericValue: 'string',
              SelectID: 0,
              InputSelectValue: 'string',
            },
          ],
          MaterialCode: 'string',
          SizeIDS: [
            0,
          ],
          BrandID: 0,
        },
      ],
      generativeRule: {
        SizeIDS: [],
        Attributes: [
          {
            selfDefiningValueID: '',
            selfDefiningValue: '',
            actionsValue: [],
          },
        ],
      },
    });
    const BatchAddData = computed(() => ({
      AttributeAllList: MaterialWarehouseStore.MaterialTypeAttributeAllList,
      TypeSizeAllList: MaterialWarehouseStore.MaterialTypeSizeAllList,
    }));
    const getNumberValueList = (valueList) => {
      const reg = /\s|,|，/;
      return valueList.split(reg).filter(it => it);
    };
    watch(() => BatchAddData.value, (newVal, oldVal) => {
      console.log(newVal, oldVal, 'BatchAddData.value,');
      Data.generativeRule.Attributes = newVal.AttributeAllList.map(res => {
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
        };
      });
    });

    function closeClick() {
      Data.dialogShow = false;
    }

    function delDimensions(ID) {
      api.getMaterialTypeSizeRemove(ID).then(res => {
        if (res.data.Status === 1000) {
          // 删除成功
        }
      });
    }
    function setTableList(RuleData) {
      // RuleData.Attributes.forEach
      console.log(RuleData);
    }
    function primaryClick() {
      setTableList(Data.generativeRule);
      console.log('res');
    }
    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.material-manage-setuep-page header', 72);
      window.onresize = () => {
        h.value = getHeight('.material-manage-setuep-page header', 72);
      };
    }
    onMounted(() => {
      Data.TypeID = Number(route.params.TypeID);
      setHeight();
      console.log('onMounted', route.params);

      MaterialWarehouseStore.getMaterialTypeAttributeAllByTypeID(Data.TypeID);
      MaterialWarehouseStore.getMaterialTypeSizeAllByTypeID(Data.TypeID);
    });
    return {
      h,
      Data,
      BatchAddData,
      primaryClick,
      closeClick,
      MaterialWarehouseStore,
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
    overflow-x: auto;
    >.mp-card-container{
      display: flex;
      flex-direction: column;
      height: 100%;
      .el-table{
        flex: 1;
        max-height: calc(100% - 21px);
      }
    }
  }
  >footer{
    padding-top: 20px;
    text-align: center;
  }
}
</style>
