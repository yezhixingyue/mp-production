<template>
  <section class="page-wrap">
    <header>
      <MpBreadcrumb :list="breadcrumbList" />
    </header>
    <main>
      <p class="mp-common-title-wrap black">编辑运行时间:</p>
      <ul>
        <li>
          <span class="title">开机方式:</span>
          <el-radio-group v-model="ruleForm.IsAutomatic">
            <el-radio :label="true" class="mr-49">自动开关机</el-radio>
            <el-radio :label="false">手动开关机</el-radio>
          </el-radio-group>
        </li>
        <li v-show="ruleForm.IsAutomatic">
          <span class="title">以下时间段为:</span>
          <div>
            <el-radio-group v-model="ruleForm.LimitOff">
              <el-radio :label="true" class="mr-85">关机</el-radio>
              <el-radio :label="false">开机</el-radio>
            </el-radio-group>
            <MultiDateSelectComp v-model:monthLimit="ruleForm._MonthTypeLimit" v-model:type="ruleForm.PeriodType" v-model:weekLimit="ruleForm._WeekTypeLimit"/>
          </div>
        </li>
        <li class="t-box" v-show="ruleForm.IsAutomatic">
          <span class="title">开机时间:</span>
          <div class="period-list">
            <mp-button link type="primary" @click="onTimeAddClick">+ 添加时间段</mp-button>
            <ul>
              <li v-for="(it, i) in ruleForm.PeriodList" :key="it._key">
                <el-time-picker
                  v-model="it._First"
                  :clearable='false'
                  value-format="HH:mm"
                  format="HH:mm"
                  :picker-options="{ format: 'HH:mm' }"
                  :default-value='defaultBeginTime'
                  placeholder="20:00"
                  :teleported="false"
                >
                </el-time-picker>
                <i>到</i>
                <el-time-picker
                  v-model="it._Second"
                  :clearable='false'
                  value-format="HH:mm"
                  format="HH:mm"
                  :picker-options="{ format: 'HH:mm' }"
                  :default-value='defaultBeginTime'
                  placeholder="20:00"
                  :teleported="false"
                >
                </el-time-picker>
                <RemoveMenu @click="onPeriodRemoveClick(i)" v-show="ruleForm.PeriodList.length > 1" />
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </main>
    <footer>
      <mp-button type="primary" class="gradient" @click="submit">保存</mp-button>
      <mp-button class="blue" @click="getGoBackFun">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import MultiDateSelectComp from '@/components/common/SelectComps/MultiDateSelectComp.vue';
import RemoveMenu from '@/components/common/menus/RemoveMenu.vue';
import { getGoBackFun } from '@/router';
import { ManageEquipmentListPageData } from '../js/store';
import { EquipmentRunTimeClass } from './js/EquipmentRunTimeClass';

const FullName = computed(() => {
  if (!ManageEquipmentListPageData.value.curEditItem) return '';
  const { _ClassName, _GroupName, Name } = ManageEquipmentListPageData.value.curEditItem;
  return [_ClassName, _GroupName, Name].filter(it => it).join('-');
});

const breadcrumbList = [
  { to: { path: '/ManageEquipmentList' }, name: '设备管理' },
  { name: `运行时间：${FullName.value}` },
];

const ruleForm = ref(new EquipmentRunTimeClass(ManageEquipmentListPageData.value.curEditItem || undefined));

const defaultBeginTime = computed(() => new Date(new Date(new Date(new Date().setHours(20)).setMinutes(0)).setSeconds(0)));

const onTimeAddClick = () => { // 添加时间段
  ruleForm.value.generatePeriodItem();
};

const onPeriodRemoveClick = (i: number) => { // 删除时间段
  ruleForm.value.PeriodList.splice(i, 1);
};

const submit = () => {
  ruleForm.value.submit();
};

</script>

<script lang="ts">
export default {
  name: 'ManageEquipmentRunTimePage',
};
</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.page-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  > header {
    padding: 20px;
  }
  > main {
    flex: 1;
    padding-left: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    > p {
      flex: none;
      padding-bottom: 5px;
    }
    > ul {
      margin-top: 8px;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      > li {
        flex: none;
        display: flex;
        margin-bottom: 10px;
        .title {
          width: 105px;
          text-align: right;
          line-height: 32px;
          font-weight: 700;
          font-size: 12px;
          margin-right: 20px;
        }

        .period-list {
          line-height: 30px;
          display: flex;
          overflow: hidden;
          flex-direction: column;
          align-items: flex-start;
          > button {
            flex: none;
            height: 30px;
          }
          > ul {
            margin-top: 12px;
            flex: 1;
            // max-height: 328px;
            overflow: auto;
            @include scroll;
            > li {
              margin-bottom: 8px;
              font-size: 12px;
              height: 32px;
              display: flex;
              align-items: center;
              :deep(.el-input) {
                width: 140px;
              }
              i {
                margin: 0 20px;
              }
              :deep(.mp-remove-menu) {
                margin-left: 35px;
              }
            }
          }
        }
        &.t-box {
          flex: 1;
          overflow: hidden;
        }
      }
    }
  }
  > footer {
    height: 35px;
    padding: 70px 0;
    padding-left: 300px;
    button {
      height: 35px;
      width: 120px;
      border-radius: 3px;
      & + .el-button {
        margin-left: 30px;
      }
    }
  }
  > header, > footer {
    flex: none;
  }
  > header, > main, > footer {
    background-color: #fff;
  }
}
</style>
