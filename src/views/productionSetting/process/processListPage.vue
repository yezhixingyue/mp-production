<template>
  <div class="process-list-page">
    <header>
      <div class="header-top" v-if='localPermission?.Setup'>
        <mp-button type="primary" @click="ToProcess(null)" v-if='localPermission?.Setup'>添加工序</mp-button>
        <span class="hint">说明：拼版为特殊工序，不用添加</span>
      </div>
      <ul class="filter-box">
        <li class="item">
          <span class="title">报工方式：</span>
          <el-select v-model="getProcessListData.ReportMode" class="mp-select" @change="() => PaginationChange()">
            <el-option key="" label="不限" value="" />
            <el-option v-for="item in ReportModeEnumList" :key="item.ID" :label="item.Name" :value="item.ID" />
          </el-select>
        </li>
        <li class="item">
          <span class="title">工序类型：</span>
          <el-select v-model="getProcessListData.Type" class="mp-select" @change="() => PaginationChange()">
            <el-option key="" label="不限" value="" />
            <el-option v-for="item in WorkingTypeEnumList" :key="item.ID" :label="item.Name" :value="item.ID" />
          </el-select>
        </li>
        <li>
          <EpCascaderByLevel2
            title="设备组"
            showLine
            onlyLastValid
            :fiexdWidth="200"
            :First="getProcessListData.ClassID"
            :Second="getProcessListData.GroupID"
            :type-list="[['ClassID', ''], ['GroupID', '']]"
            :defaultProps="{ ID: 'ID', Name: 'Name', children: 'EquipmentGroups' }"
            :list="productionSettingStore.EquipmentListGroup"
            @getList="() => PaginationChange()"
            @setCondition="(e) => CommonClassType.setCondition(e, getProcessListData)"
          />
        </li>
        <li class="item">
          <span class="title">物料资源包：</span>
          <el-select v-model="getProcessListData.RelationID" class="mp-select" @change="() => PaginationChange()">
            <el-option key="" label="不限" value="" />
            <el-option v-for="item in productionSettingStore.MaterialTypeGroup" :key="item.ID" :label="item.Name" :value="item.ID" />
          </el-select>
        </li>
      </ul>
      <SearchInputComp
        :word='getProcessListData.KeyWords'
        title="关键词搜索"
        placeholder="请输入搜索关键词"
        resetWords="清空所有筛选条件"
        :changePropsFunc="(keywords: string) => getProcessListData.KeyWords = keywords"
        :requestFunc='PaginationChange'
        :searchWatchKey="Data.processList"
        @reset='clearCondition'
      />
    </header>
    <main>
      <el-table fit stripe :data="Data.processList" border
       style="width: 100%">
        <el-table-column show-overflow-tooltip prop="Name" label="工序名称" min-width="160" />
        <el-table-column show-overflow-tooltip prop="ReportMode" label="报工方式" width="95">
          <template #default="scope: any">
            <span>{{ getEnumNameByID(scope.row.ReportMode, ReportModeEnumList) }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ShowColor" label="工序类型" width="95">
          <template #default="scope: any">
            <span>{{ getEnumNameByID(scope.row.Type, WorkingTypeEnumList) }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ShowColor" label="允许合拼" width="85">
          <template #default="scope: any">
            <span>{{ scope.row.AllowUnionImposition ? '允许' : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ShowColor" label="设备/工厂组" min-width="220">
          <template #default="scope: any">
            {{getEquipmentGroupsNames(scope.row.EquipmentGroups)}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ReportMode" label="允许批量报工" width="110">
          <template #default="scope: any">
            {{ scope.row.AllowBatchReport ? '允许' : '不允许' }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ShowColor" label="文件" min-width="160">
          <template #default="scope: any">
            {{getInfoName(scope.row.Relations, 0)}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ShowColor" label="文字信息" min-width="160">
          <template #default="scope: any">
            {{getInfoName(scope.row.Relations,1)}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ShowColor" label="物料资源包" min-width="160">
          <template #default="scope: any">
            {{getMaterialName(scope.row.Relations)}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ShowColor" label="大版模板" width="160">
          <template #default="scope: any">
            {{getTemplateName(scope.row.TemplateID)}}
          </template>

        </el-table-column>
        <el-table-column prop="name" label="操作" width="200" v-if='localPermission?.Setup'>
          <template #default="scope: any">
            <template v-if="!scope.row.IsSpecialColor">
              <mp-button type="info" link @click="ToProcess(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</mp-button>
              <mp-button type="info" link
                @click="delProcess(scope.row)">
                <i class="iconfont icon-delete"></i>删除</mp-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer>
      <div class="bottom-count-box">
        <MpPagination
          center
          :nowPage="getProcessListData.Page"
          :pageSize="getProcessListData.PageSize"
          :total="getProcessListData.DataTotal"
          :handlePageChange="PaginationChange"
        />
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import MpPagination from '@/components/common/MpPagination.vue';
import SearchInputComp from '@/components/common/SelectComps/SearchInputComp.vue';
import { useRouter } from 'vue-router';
import {
  onMounted, ref, reactive, onActivated, computed,
} from 'vue';
import api from '@/api';
import { IWorkingProcedureInfo } from '@/assets/Types/ProductionLineSet/types';
import messageBox from '@/assets/js/utils/message';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import CommonClassType from '@/store/modules/formattingTime/CommonClassType';
import EpCascaderByLevel2 from '@/components/common/EpCascader/EpCascaderWrap/EpCascaderByLevel2.vue';
import type { IRelationsType } from '@/store/modules/productionSetting/types';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { useUserStore } from '@/store/modules/user';
import { ReportModeEnumList, WorkingTypeEnumList } from './enums';

const productionSettingStore = useProductionSettingStore();

const userStore = useUserStore();
const localPermission = computed(() => userStore.user?.PermissionList.PermissionManageWorking.Obj);

interface DataType{
  processList: IWorkingProcedureInfo[],
}
const router = useRouter();
const Data:DataType = reactive({
  processList: [],
});
const getProcessListData = ref({
  Page: 1,
  PageSize: 20,
  DataTotal: 0,
  ReportMode: '', // 报工方式
  Type: '', // 工序类型
  ClassID: '',
  GroupID: '',
  RelationID: '',
  KeyWords: '',
});
const clearCondition = () => {
  getProcessListData.value.Page = 1;
  getProcessListData.value.ReportMode = '';
  getProcessListData.value.Type = '';
  getProcessListData.value.ClassID = '';
  getProcessListData.value.GroupID = '';
  getProcessListData.value.RelationID = '';
  getProcessListData.value.KeyWords = '';
};
const ToProcess = (item) => {
  router.push({
    name: 'processSetup',
    params: { process: JSON.stringify(item) },
  });
};
// 获取工序列表
const getProcessList = () => {
  Data.processList = [];
  api.getWorkingProcedureList(getProcessListData.value).then(res => {
    if (res.data?.Status === 1000) {
      Data.processList = res.data.Data as IWorkingProcedureInfo[];
      getProcessListData.value.DataTotal = res.data.DataNumber as number;
    }
  });
};

function PaginationChange(newVal = 1) {
  // if (getProcessListData.value.Page === newVal) return;
  getProcessListData.value.Page = newVal as number;
  getProcessList();
}
// 获取设备工厂
// 格式化设备工厂
const getEquipmentGroupsNames = (EquipmentGroups) => {
  let allEquipment = productionSettingStore.EquipmentListGroup.map(item => {
    const actionEquipment = item.EquipmentGroups.filter(it => EquipmentGroups.find(el => it.ID === el.GroupID));
    if (actionEquipment.length) {
      return {
        ClassID: item.ClassID,
        ClassName: item.ClassName,
        EquipmentGroups: actionEquipment,
      };
    }
    return null;
  });
  allEquipment = allEquipment.filter(it => it);
  return allEquipment.map(item => `${item?.ClassName}：${item?.EquipmentGroups.map(it => it.Name).join('、')}`).join('；');
};
// 格式化辅助信息
const getInfoName = (Relations:IRelationsType[], Type) => {
  const returnStr:string[] = [];
  Relations.forEach(item => {
    if (item.Type === 0) {
      productionSettingStore.ResourceNoteGroup.forEach(it => {
        if (it.Type === Type) {
          const temp = it.Notes.find(res => res.ID === item.RelationID);
          if (temp) {
            returnStr.push(temp.Name);
          }
        }
      });
    }
  });

  return returnStr.join('、');
};
// 格式化物料资源
const getMaterialName = (Relations:IRelationsType[]) => {
  const returnStr:string[] = [];
  Relations.forEach(item => {
    if (item.Type === 1) {
      const temp = productionSettingStore.MaterialTypeGroup.find(res => res.ID === item.RelationID);
      if (temp) {
        returnStr.push(temp.Name);
      }
    }
  });

  return returnStr.join('、');
};
// 格式化大阪模板
const getTemplateName = (TemplateID: string) => {
  const t = productionSettingStore.ImpositionTemmplateList.find(it => it.ID === TemplateID);

  return t?.Name || '';
};
const delProcess = (item) => {
  messageBox.warnCancelBox('确定要删除此工序吗？', `${item.Name}`, () => {
    api.getWorkingProcedureRemove(item.ID).then(res => {
      if (res.data?.Status === 1000) {
        // 删除成功
        const cb = () => {
          getProcessList();
        };
        MpMessage.success({
          title: '删除成功',
          onOk: cb,
          onCancel: cb,
        });
      }
    });
  }, () => undefined);
  // api.getWorkingProcedureRemove(e.ID);
};
onActivated(() => {
  const processSetupPage = sessionStorage.getItem('processSetupPage') === 'true';
  if (processSetupPage) {
    getProcessList();
    sessionStorage.removeItem('processSetupPage');
  }
});
onMounted(() => {
  sessionStorage.removeItem('processSetupPage');
  getProcessList();
  productionSettingStore.getEquipmentGroup();
  productionSettingStore.getResourceNoteGroup();
  productionSettingStore.getMaterialTypeGroupAll();
  productionSettingStore.getImpositionTemmplateList({
    Page: 1,
    PageSize: 999,
    OnlyShowName: true,
    // IsPrintPlate: false,
    // IsSameWithPrintPlate: false,
  });
});
</script>
<script lang="ts">
export default {
  name: 'processListPage',
};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.process-list-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  >header{
    padding: 20px;
    padding-top: 10px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;
    flex-wrap: wrap;
    >.header-top{
      display: flex;
      margin-right: 20px;
      margin-top: 10px;
      >span{
        line-height: 30px;
        margin-left: 20px;
        color: red;
      }
      .hint{
        font-size: 12px;
        line-height: 30px;
        color: #F4A307;
        position: relative;
        padding-left: 23px;
        &::before{
          content: '';
          background-image: url('@/assets/images/warn.png');
          display: inline-block;
          background-size: 13px 13px;
          width: 13px;
          height: 13px;
          margin-right: 10px;
          position: absolute;
          left: 0;
          top: 8px;
        }
      }
    }

    > .filter-box {
      display: flex;
      flex: 1;
      align-items: center;
      > li {
        margin-right: 10px;
        margin-top: 10px;
        > span.title {
          font-weight: 700;
        }
      }
    }

    > section {
      margin-top: 10px;
      // flex: 1;
      margin-left: 0;
    }
  }
  >main{
    flex: 1;
    margin-top: 10px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border: 1px solid #E5E5E5;
    .el-table{
      flex: 1;
      // &.el-table--border:after, .el-table__inner-wrapper::before{
      //   width: 0;
      // }
    }
  }
  >footer{
    min-height: 50px;
    background-color: #fff;
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .bottom-count-box {
      width: 100%;
    }
  }
}
</style>
