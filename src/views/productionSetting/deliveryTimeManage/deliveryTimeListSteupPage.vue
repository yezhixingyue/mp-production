<template>
  <section class="mp-erp-period-manage-delivery-time-manage-setup-page" v-if="Data.DeliveryTimeForm">
    <header>
      <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>

      <p class="mp-common-title-wrap">{{saveType()}}发货班次</p>
    </header>
    <main>
      <ul>
        <li>
          <span class="title">名称：</span>
          <div class="content-item">
            <el-input maxlength="15" show-word-limit v-model="Data.DeliveryTimeForm.ItemName" size="small" style="width:400px"></el-input>
          </div>
        </li>
        <li class="f">
          <span class="title">指定区域：</span>
          <div>
            <mp-button link type="primary" @click="onAreaSelectClick">选择区域</mp-button>
            <!-- 区域展示文字 -->
            <span class="remark" :title="Data.DeliveryTimeForm.AreaDescribe">{{Data.DeliveryTimeForm.AreaDescribe.replaceAll('\r\n', '、')}}</span>
          </div>
        </li>
        <li>
          <span class="title">配送方式：</span>
          <!-- <div class="content-item" v-if="subExpressList.length > 0">
            <p>
              <el-checkbox
                v-model="ExpressCheckAll"
                :indeterminate="isIndeterminate"
                >全选</el-checkbox
              >
            </p>
            <el-checkbox-group v-model="ExpressCheckList">
              <el-checkbox
                v-for="it in subExpressList"
                :key="it.ID"
                :label="it.ID"
                >{{ it.Name }}</el-checkbox
              >
            </el-checkbox-group>
          </div> -->
        </li>
        <li>
          <span class="title">发货班次：</span>
          <div class="content-item">
            <mp-button link type="primary" @click="onShiftAddClick">+添加</mp-button>
            <ul class='list'>
              <li v-for="(it, i) in Data.DeliveryTimeForm.Shift" :key="it.key">
                <el-time-picker
                  :value="getFormatValue(it.S)"
                  @input="e => onShiftTimeItemInput(e, i)"
                  :clearable='false'
                  value-format="HH:mm"
                  format="HH:mm"
                  :picker-options="{ format: 'HH:mm' }"
                  :default-value='defaultBeginTime'
                  placeholder="20:00"
                  size="small"
                >
                </el-time-picker>
                <span class='label'>运输时长：</span>
                <el-input v-model="it.D" maxlength="3" size="small" style="width:100px"></el-input>
                <span class="remark">天</span>
                <el-input v-model="it.H" maxlength="2" size="small" style="width:100px"></el-input>
                <span class="remark">小时</span>
                <mp-button v-show="i > 0" @click="onShiftRemoveClick(i)"></mp-button>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </main>
    <ADAreaDialogSelector
    v-model:visible="visible"
    :defaultCheckedKeys="defaultCheckedKeys"
    :handleChangeFunc="handleChangeFunc"
    ></ADAreaDialogSelector>

    <footer>
      <el-button type='primary' class="is-blue-button" @click="onSubmitClick">保存</el-button>
      <el-button class="cancel-blue-btn" @click="$goback()"><i></i> 返回</el-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import {
  reactive, ref, Ref, computed, getCurrentInstance,
} from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { useRoute } from 'vue-router';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { useRouterStore } from '@/store/modules/routerStore';
import OneLevelSelect from '@/components/common/SelectComps/OneLevelSelect.vue';
import ADAreaDialogSelector from '@/components/common/DialogComps/ADAreaDialogSelector.vue';
import { usePasteupSettingStore } from '@/store/modules/pasteupSetting';
import { useCommonStore } from '@/store/modules/common/index';
import { IDistrictTreeListItemType } from '@/store/modules/common/types';
import { setPageObjType } from './types';

interface SType {
  F: number,
  S: number,
}
interface ShiftType {
  key?: string,
  S: SType,
  D: number,
  H: number,
}
interface AreaListType {
  CountryID: number,
  ProvinceID: number,
  CityID: number,
  CountyID: number,
}
interface ExpressListType {
  ID: number,
  Name: string,
}
interface DeliveryTimeFormType {
  ItemID:string
  ItemName:string
  AreaDescribe:string
  Shift:ShiftType[]
  AreaList:AreaListType[]
  ExpressList:ExpressListType[]
}

interface DataType {
  DeliveryTimeForm:DeliveryTimeFormType
}
const { $goback } = getCurrentInstance()?.appContext.config.globalProperties || { $goback: () => null };
const RouterStore = useRouterStore();
const PasteupSettingStore = usePasteupSettingStore();
const visible = ref(false);
const defaultCheckedKeys:Ref<number[]> = ref([]);
const commonStore = useCommonStore();
const Data:DataType = reactive({
  DeliveryTimeForm: {
    ItemID: '',
    ItemName: '',
    Shift: [],
    AreaDescribe: '',
    AreaList: [],
    ExpressList: [],
  },
});
const defaultBeginTime = computed(() => new Date(new Date(new Date(new Date().setHours(20)).setMinutes(0)).setSeconds(0)));
const saveType = () => {
  if (Data.DeliveryTimeForm && Data.DeliveryTimeForm.ItemID) return '编辑';
  return '添加';
};
const BreadcrumbList = computed(() => [
  { to: { path: '/deliveryTimeList' }, name: '发货班次' },
  {
    name: `${Data.DeliveryTimeForm.ItemID ? '编辑' : '添加'}发货班次`,
  },
]);
const allStateItem = computed(() => {
  const _arr:IDistrictTreeListItemType[] = [];
  commonStore.DistrictTreeList.forEach(l1 => {
    l1.children?.forEach(l2 => {
      l2.children?.forEach(l3 => {
        _arr.push(l3);
      });
    });
  });
  return _arr;
});
const getFormatValue = (a) => {
  // if (DeliveryTimeItemClass.submitChecker(this.DeliveryTimeForm)) {
  //   this.$store.dispatch('periodManage/getDeliveryTimeItemSave', [this.DeliveryTimeForm, this.onGoBackClick]);
  // }
};
const onShiftTimeItemInput = (a, b) => {
  // if (DeliveryTimeItemClass.submitChecker(this.DeliveryTimeForm)) {
  //   this.$store.dispatch('periodManage/getDeliveryTimeItemSave', [this.DeliveryTimeForm, this.onGoBackClick]);
  // }
};
const onAreaSelectClick = () => {
  visible.value = true;
  // if (DeliveryTimeItemClass.submitChecker(this.DeliveryTimeForm)) {
  //   this.$store.dispatch('periodManage/getDeliveryTimeItemSave', [this.DeliveryTimeForm, this.onGoBackClick]);
  // }
};
const onShiftAddClick = () => {
  // if (DeliveryTimeItemClass.submitChecker(this.DeliveryTimeForm)) {
  //   this.$store.dispatch('periodManage/getDeliveryTimeItemSave', [this.DeliveryTimeForm, this.onGoBackClick]);
  // }
};
const onSubmitClick = () => {
  // if (DeliveryTimeItemClass.submitChecker(this.DeliveryTimeForm)) {
  //   this.$store.dispatch('periodManage/getDeliveryTimeItemSave', [this.DeliveryTimeForm, this.onGoBackClick]);
  // }
};
const onShiftRemoveClick = (i) => {
  // if (DeliveryTimeItemClass.submitChecker(this.DeliveryTimeForm)) {
  //   this.$store.dispatch('periodManage/getDeliveryTimeItemSave', [this.DeliveryTimeForm, this.onGoBackClick]);
  // }
};
const handleChangeFunc = (checkedNodes, checkedKeys, isAll) => {
  if (checkedNodes.length === 0) {
    defaultCheckedKeys.value = [];
    return;
  }
  if (isAll) {
    defaultCheckedKeys.value = allStateItem.value.map(it => it.ID);
    return;
  }
  defaultCheckedKeys.value = [558];
};
</script>

<script lang="ts">
export default {
  name: 'deliveryTimeListSteupPage',
};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.mp-erp-period-manage-delivery-time-manage-setup-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  > header {
    flex: none;
    padding: 20px;
    background-color: #fff;
    align-items: center;
    .mp-common-title-wrap{
      margin-top: 50px;
      margin-left: 20px;
      color: red;
    }
  }
  > main {
    flex: 1;
    background-color: #fff;
    > ul {
      width: 850px;
      > li {
        display: flex;
        line-height: 30px;
        margin-bottom: 24px;
        color: #444;
        > span.title {
          font-size: 14px;
          font-weight: 700;
          width: 10em;
          text-align: right;
          flex: none;
          margin-right: 5px;
        }
        > div {
          font-size: 14px;
          .el-input {
            width: 140px;
            height: 30px;
            line-height: 30px;
            input {
              height: 30px;
              line-height: 30px;
              border-radius: 5px;
              border-color: #e5e5e5;
              position: relative;
              top: -2px;
            }
            .el-input__icon {
              line-height: 30px;
            }
          }
          .el-checkbox {
            line-height: 24px;
            .el-checkbox__label {
              font-size: 12px;
              color: #444;
            }
          }
          .el-checkbox-group {
            line-height: 20px;
            padding-bottom: 20px;
          }
          > .r {
            font-size: 14px;
            margin-left: 9px;
          }
          ul.list {
            padding-top: 5px;
            > li {
              margin-bottom: 15px;
              > label {
                color: #585858;
                margin-left: 25px;
                margin-right: 5px;
              }
              > .remark {
                color: #989898;
                font-size: 12px;
                margin-left: 8px;
                margin-right: 16px;
              }
              > .ctrl-menus-container {
                margin-left: 8px;
              }
            }
          }
        }
        &.f {
          margin-bottom: 18px;
          .remark {
            max-width: 560px;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-left: 20px;
            font-size: 12px;
            display: inline-block;
            white-space: nowrap;
            vertical-align: top;
            color: #989898;
          }
        }
      }
    }
  }
  > footer {
    flex: none;
    background-color: #fff;
    height: 100px;
    padding-left: 306px;
    button {
      width: 120px;
      height: 35px;
      padding: 0;
      border-radius: 3px;
      i {
        transform: scaleY(1.4);
        display: inline-block;
      }
      & + .el-button {
        margin-left: 30px;
      }
    }
  }
}
</style>
