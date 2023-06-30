<template>
  <section class="delivery-time-list-setup-page" v-if="ruleForm.loaded">
    <header>
      <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>

      <p class="mp-common-title-wrap">{{ruleForm.ItemID ? '编辑' : '添加'}}发货班次</p>
    </header>
    <main>
      <ul>
        <li>
          <span class="title">名称：</span>
          <div class="content-item">
            <el-input maxlength="15" show-word-limit v-model.trim="ruleForm.ItemName" size="small" style="width:400px"></el-input>
          </div>
        </li>
        <li class="f">
          <span class="title">指定区域：</span>
          <div>
            <mp-button link type="primary" @click="visible = true">选择区域</mp-button>
            <!-- 区域展示文字 -->
            <span class="remark" :title="ruleForm.AreaDescribe">{{ruleForm.AreaDescribe}}</span>
          </div>
        </li>
        <li>
          <span class="title">配送方式：</span>
          <div class="content-item" v-if="commonStore.ExpressList.length > 0">
            <p>
              <el-checkbox
                v-model="ExpressCheckAll"
                :indeterminate="isIndeterminate"
                >全选</el-checkbox
              >
            </p>
            <el-checkbox-group v-model="localExpressList">
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
            <mp-button link type="primary" @click="onShiftAddClick(-1)">+添加发货班次</mp-button>
            <ShiftTimeTable :ShiftTimeList="ruleForm.Shift" @edit="onShiftAddClick" @remove="onRemoveClick" />
            <!-- <el-time-picker
              :clearable='false'
              value-format="HH:mm"
              format="HH:mm"
              :picker-options="{ format: 'HH:mm' }"
              placeholder="请选择时间"
            >
            </el-time-picker> -->
          </div>
        </li>
      </ul>
    </main>
    <ADAreaDialogSelector
      v-model:visible="visible"
      v-model:AreaDescribe='ruleForm.AreaDescribe'
      v-model="ruleForm.AreaList"
    />
    <ShiftTimeSetupDialog v-model:visible="shiftTimeVisible" :curEditShiftTime="curEditShiftTime" @submit="onShiftTimeSubmit" />
    <footer>
      <mp-button type='primary' class="is-blue-button" @click="onSubmitClick">保存</mp-button>
      <mp-button class="cancel-blue-btn" @click="getGoBackFun"><i></i> 返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { ref, computed, onMounted } from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { useRoute } from 'vue-router';
import { getGoBackFun } from '@/router';
import ADAreaDialogSelector from '@/components/common/DialogComps/ADAreaDialogSelector.vue';
import { useCommonStore } from '@/store/modules/common/index';
import ShiftTimeSetupDialog from './Comps/ShiftTimeSetupDialog/ShiftTimeSetupDialog.vue';
import { ShiftTimeClass } from './ShiftTimeClass';
import { IShiftRowItem } from './types';
import ShiftTimeTable from './Comps/ShiftTimeTable.vue';

const route = useRoute();

const ruleForm = ref(new ShiftTimeClass());

const BreadcrumbList = computed(() => [
  { to: { path: '/deliveryTimeList' }, name: '发货班次' },
  {
    name: `${ruleForm.value.ItemID ? '编辑' : '添加'}发货班次`,
  },
]);

const commonStore = useCommonStore();

/* 设置地址区域相关
------------------------ */
const visible = ref(false);

/* 设置配送方式相关
------------------------ */
// const ExpressCheckAll = ref(false);
// const isIndeterminate = ref(false);
// function handleCheckAllChange(val: boolean) {
//   ruleForm.value.ExpressList = val ? commonStore.ExpressList.map(it => it) : [];
//   console.log(val, ruleForm.value.ExpressList);
// }
const isIndeterminate = computed(() => localExpressList.value.length > 0 && localExpressList.value.length < commonStore.ExpressList.length);
const ExpressCheckAll = computed({
  get() {
    return localExpressList.value.length > 0 && localExpressList.value.length === commonStore.ExpressList.length;
  },
  set(val) {
    ruleForm.value.ExpressList = val ? [...commonStore.ExpressList] : [];
  },
});
const localExpressList = computed({
  get() {
    return ruleForm.value.ExpressList.map(item => commonStore.ExpressList.find(it => it.ID === item.ID)).filter(it => it).map(it => it?.ID);
  },
  set(list) {
    ruleForm.value.ExpressList = commonStore.ExpressList.filter(item => list.find(it => it === item.ID)) || [];
  },
});

/* 日期选择弹窗相关
------------------------ */
const shiftTimeVisible = ref(false);
const curEditShiftTime = ref<null | IShiftRowItem>(null);
const onShiftAddClick = (index: number) => {
  curEditShiftTime.value = index === -1 ? null : ruleForm.value.Shift[index];
  shiftTimeVisible.value = true;
};
const onShiftTimeSubmit = (result: IShiftRowItem) => {
  if (!curEditShiftTime.value) { // 新增
    ruleForm.value.Shift.push(result);
  } else { // 编辑
    curEditShiftTime.value.ShiftTime = result.ShiftTime;
    curEditShiftTime.value.ShiftType = result.ShiftType;
    curEditShiftTime.value.TypeLimit = result.TypeLimit;
  }
  shiftTimeVisible.value = false;
};
const onRemoveClick = (index: number) => {
  ruleForm.value.Shift.splice(index, 1);
};

function setStorage() { // 设置会话存储
  sessionStorage.setItem('deliveryTimeListSteupPage', 'true');
}

const onSubmitClick = () => {
  const cb = () => {
    setStorage();
    getGoBackFun();
  };
  ruleForm.value.submit(cb);
};

onMounted(() => {
  const item = route.params.curEditItem ? JSON.parse(route.params.curEditItem as string) : null;
  ruleForm.value.getOriginData(item);
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
      margin-top: 25px;
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
              border-radius: 5px;
              border-color: #e5e5e5;
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
