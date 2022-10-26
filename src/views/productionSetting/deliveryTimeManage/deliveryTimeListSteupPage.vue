<template>
  <section class="delivery-time-list-setup-page" v-if="Data.DeliveryTimeForm">
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
            <span class="remark" :title="Data.DeliveryTimeForm.AreaDescribe">{{Data.DeliveryTimeForm.AreaDescribe}}</span>
          </div>
        </li>
        <li>
          <span class="title">配送方式：</span>
          <div class="content-item" v-if="commonStore.ExpressList.length > 0">
            <p>
              <el-checkbox
                v-model="ExpressCheckAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange(ExpressCheckAll)"
                >全选</el-checkbox
              >
            </p>
            <el-checkbox-group v-model="ExpressList">
              <el-checkbox
                v-for="it in commonStore.ExpressList"
                :key="it.ID"
                :label="it.ID"
                >{{ it.Name }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </li>
        <li>
          <span class="title">发货班次：</span>
          <div class="content-item">
            <mp-button link type="primary" @click="onShiftAddClick">+添加</mp-button>
            <ul class='list'>
              <li v-for="(it, i) in Data.DeliveryTimeForm.Shift" :key="it.key">
                <el-time-picker
                  v-model="it.date"
                  @change="e => onShiftTimeItemInput(e, i)"
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
                <mp-button v-show="i > 0" @click="onShiftRemoveClick(i)" link>删除</mp-button>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </main>
    <ADAreaDialogSelector
    v-model:visible="visible"
    :value="Data.DeliveryTimeForm.AreaList" @change="(list) => Data.DeliveryTimeForm.AreaList = list" v-model:AreaDescribe='Data.DeliveryTimeForm.AreaDescribe'
    ></ADAreaDialogSelector>
    <footer>
      <el-button type='primary' class="is-blue-button" @click="onSubmitClick">保存</el-button>
      <el-button class="cancel-blue-btn" @click="$goback()"><i></i> 返回</el-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import {
  reactive, ref, computed, getCurrentInstance, onMounted,
} from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { useRoute } from 'vue-router';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { useRouterStore } from '@/store/modules/routerStore';
import ADAreaDialogSelector from '@/components/common/DialogComps/ADAreaDialogSelector.vue';
import { useCommonStore } from '@/store/modules/common/index';

interface SType {
  F: string,
  S: string,
}
interface ShiftType {
  key?: string,
  date?: string,
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
const route = useRoute();
const { $goback } = getCurrentInstance()?.appContext.config.globalProperties || { $goback: () => null };
const RouterStore = useRouterStore();
const visible = ref(false);
const ExpressCheckAll = ref(false);
const isIndeterminate = ref(false);
const commonStore = useCommonStore();
const Data:DataType = reactive({
  DeliveryTimeForm: {
    ItemID: '',
    ItemName: '',
    Shift: [
      {
        key: Math.random().toString(16).slice(-10),
        date: '',
        S: {
          F: '',
          S: '',
        },
        D: 0,
        H: 0,
      },
    ],
    AreaDescribe: '',
    AreaList: [],
    ExpressList: [],
  },
});
const defaultBeginTime = computed(() => new Date(new Date(new Date(new Date().setHours(20)).setMinutes(0)).setSeconds(0)));
const setCheck = (list) => {
  Data.DeliveryTimeForm.ExpressList = commonStore.ExpressList.filter(item => list.find(it => it === item.ID)) || [];
  if (commonStore.ExpressList.length === list.length) {
    isIndeterminate.value = false;
    ExpressCheckAll.value = true;
  } else {
    ExpressCheckAll.value = false;
    isIndeterminate.value = !!list.length;
  }
};
const ExpressList = computed({
  get() {
    return Data.DeliveryTimeForm.ExpressList.map(item => commonStore.ExpressList.find(it => it.ID === item.ID)?.ID);
  },
  set(list) {
    setCheck(list);
  },
});
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

function handleCheckAllChange(val: boolean) {
  if (val) {
    const a = commonStore.ExpressList.map(it => it);
    Data.DeliveryTimeForm.ExpressList = a;
  } else {
    Data.DeliveryTimeForm.ExpressList = [];
  }
  isIndeterminate.value = false;
}
function setStorage() { // 设置会话存储
  sessionStorage.setItem('deliveryTimeListSteupPage', 'true');
}
const getFormatValue = (shiftItem) => {
  if (!shiftItem) return '';
  const { F, S } = shiftItem;
  if ((!F && F !== 0) || (!S && S !== 0)) return '';
  const _f = `0${F}`.slice(-2);
  const _s = `0${S}`.slice(-2);
  return `${_f}:${_s}`;
};
const onShiftTimeItemInput = (data, index) => {
  if (!data) return;
  const [F, S] = data.split(':');
  Data.DeliveryTimeForm.Shift[index].S.F = F;
  Data.DeliveryTimeForm.Shift[index].S.S = S;
};
const onAreaSelectClick = () => {
  visible.value = true;
};
const verificationShift = () => {
  let num = 0;
  if (!Data.DeliveryTimeForm.Shift.length) {
    num++;
  }
  Data.DeliveryTimeForm.Shift.forEach(item => {
    if (!item.D || !item.H || !item.S.F || !item.S.S) {
      num++;
    }
  });
  // num 有数据 验证不通过
  return !!num;
};
const onShiftAddClick = () => {
  Data.DeliveryTimeForm.Shift.push({
    key: Math.random().toString(16).slice(-10),
    date: '',
    S: {
      F: '',
      S: '',
    },
    D: 0,
    H: 0,
  });
};
const onSubmitClick = () => {
  Data.DeliveryTimeForm.Shift.forEach((item, index) => {
    onShiftTimeItemInput(item.date, index);
  });
  if (!Data.DeliveryTimeForm.ItemName) {
    messageBox.failSingleError('保存失败', '请填写名称', () => null, () => null);
  } else if (!Data.DeliveryTimeForm.AreaList.length) {
    messageBox.failSingleError('保存失败', '请选择区域', () => null, () => null);
  } else if (!Data.DeliveryTimeForm.ExpressList.length) {
    messageBox.failSingleError('保存失败', '请选择配送方式', () => null, () => null);
  } else if (verificationShift()) {
    messageBox.failSingleError('保存失败', '发货班次信息不完整，请检查', () => null, () => null);
  } else {
    api.getShiftTimeSave(Data.DeliveryTimeForm).then(res => {
      if (res.data.Status === 1000) {
        const cb = () => {
          setStorage();
          RouterStore.goBack();
        };
        // 保存成功
        messageBox.successSingle('保存成功', cb, cb);
      }
    });
  }
};
const onShiftRemoveClick = (index) => {
  Data.DeliveryTimeForm.Shift.splice(index, 1);
};

onMounted(() => {
  const temp = route.params.deliveryTimeID;
  if (temp) {
    api.getShiftTimeDetail(temp).then(res => {
      if (res.data.Status === 1000) {
        const resp = res.data.Data as DeliveryTimeFormType;
        resp.Shift = resp.Shift.map(it => ({
          key: Math.random().toString(16).slice(-10),
          date: getFormatValue(it.S),
          ...it,
        }));
        Data.DeliveryTimeForm = resp;
        setCheck(resp.ExpressList.map(it => it.ID));
      }
    });
  }
  if (!commonStore.ExpressList.length) {
    commonStore.getExpressList();
  }
});
</script>

<script lang="ts">
export default {
  name: 'deliveryTimeListSteupPage',
};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.delivery-time-list-setup-page {
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
              > .label {
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
