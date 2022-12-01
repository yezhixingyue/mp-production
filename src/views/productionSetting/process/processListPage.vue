<template>
  <div class="process-list-page">
    <header>
      <div class="header-top">
        <mp-button type="primary" @click="ToProcess(null)">添加工序</mp-button>
        <span class="hint">说明：拼版为特殊工序，不用添加</span>
      </div>
    </header>
    <main>
      <el-table fit stripe :data="Data.processList"
       style="width: 100%">
        <el-table-column
        show-overflow-tooltip prop="Name" label="工序名称" min-width="160" />
        <el-table-column show-overflow-tooltip prop="ReportMode" label="报工方式" min-width="130">
          <template #default="scope">
            <span v-if="scope.row.ReportMode === 0">块报工</span>
            <span v-if="scope.row.ReportMode === 1">大版报工</span>
            <span v-if="scope.row.ReportMode === 2">订单报工</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ShowColor" label="工序类型" min-width="130">
          <template #default="scope">
            <span v-if="scope.row.Type === 0">普通工序</span>
            <span v-if="scope.row.Type === 1">印刷工序</span>
            <span v-if="scope.row.Type === 2">制版工序</span>
            <span v-if="scope.row.Type === 3">组合工序</span>
            <span v-if="scope.row.Type === 4">拆分工序</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ShowColor" label="设备/工厂组" min-width="310">
          <template #default="scope">
            {{getEquipmentGroupsNames(scope.row.EquipmentGroups)}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ShowColor" label="文件" min-width="200">
          <template #default="scope">
            {{getInfoName(scope.row.Relations, 0)}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ShowColor" label="文字信息" min-width="200">
          <template #default="scope">
            {{getInfoName(scope.row.Relations,1)}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ShowColor" label="物料资源包" min-width="200">
          <template #default="scope">
            {{getMaterialName(scope.row.Relations)}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ShowColor" label="大版类型" min-width="200">
          <template #default="scope">
            <template v-if="scope.row.TemplateType === 0"> </template>
            <template v-if="scope.row.TemplateType === 1">
              印刷版
            </template>
            <template v-if="scope.row.TemplateType === 2">
              {{getTemplateName(scope.row.Relations)}}
            </template>

          </template>

        </el-table-column>
        <el-table-column prop="name" label="操作" min-width="186">
          <template #default="scope">
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
import { useRouter } from 'vue-router';
import {
  onMounted, ref, reactive, onActivated, computed,
} from 'vue';
import api from '@/api';
import { ImpositionTemmplateListGroupType, ProcessListType } from '@/store/modules/productionSetting/types';
import messageBox from '@/assets/js/utils/message';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import type { RelationsType } from '@/store/modules/productionSetting/types';
import { usePasteupSettingStore } from '@/store/modules/pasteupSetting';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { WorkingProcedureRelationEnum } from './enums';

const PasteupSettingStore = usePasteupSettingStore();
const productionSettingStore = useProductionSettingStore();

interface DataType{
  processList: ProcessListType[],
}
const router = useRouter();
const Data:DataType = reactive({
  processList: [],
});
const getProcessListData = ref({
  Page: 1,
  PageSize: 20,
  DataTotal: 0,
});
const ToProcess = (item) => {
  router.push({
    name: 'processSetup',
    params: { process: JSON.stringify(item) },
  });
};
// 获取工序列表
const getProcessList = () => {
  api.getWorkingProcedureList(getProcessListData.value).then(res => {
    if (res.data.Status === 1000) {
      Data.processList = res.data.Data as ProcessListType[];
      getProcessListData.value.DataTotal = res.data.DataNumber as number;
    }
  });
};

function PaginationChange(newVal) {
  if (getProcessListData.value.Page === newVal) return;
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
const getInfoName = (Relations:RelationsType[], Type) => {
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
const getMaterialName = (Relations:RelationsType[]) => {
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
const ImpositionTemmplateListGroup = computed(() => {
  const returnData:ImpositionTemmplateListGroupType[] = [];
  productionSettingStore.ImpositionTemmplateList.forEach(item => {
    const temp = returnData.find(it => it.ClassID === item.ClassID);
    // 找到此条数据对应的分类及该分类下的所有模板
    if (!temp) {
      const TemmplateClass = PasteupSettingStore.ImpositionTemmplateClassList.find(it => it.ID === item.ClassID);
      const TemmplateList = productionSettingStore.ImpositionTemmplateList.filter(it => it.ClassID === item.ClassID);
      returnData.push({ Name: TemmplateClass?.Name || '', children: TemmplateList, ClassID: TemmplateClass?.ID || 0 });
    }
  });
  return returnData;
});
// 格式化大阪模板
const getTemplateName = (Relations:RelationsType[]) => {
  const temp = Relations.filter(item => item.Type === WorkingProcedureRelationEnum.otherBoard);
  const ids = temp.map(it => it.RelationID);
  const list = ImpositionTemmplateListGroup.value.map(it => ({
    Name: it.Name,
    content: it.children.filter(c => ids.includes(c.ID)).map(c => c.Name).join('、'),
  })).filter(it => it.content).map(it => `${it.Name}：${it.content}`);
  return list.join('；');
};
const delProcess = (item) => {
  messageBox.warnCancelBox('确定要删除此工序吗？', `${item.Name}`, () => {
    api.getWorkingProcedureRemove(item.ID).then(res => {
      if (res.data.Status === 1000) {
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
  if (!PasteupSettingStore.ImpositionTemmplateClassList.length) {
    PasteupSettingStore.getImpositionTemmplateClassList();
  }
  productionSettingStore.getEquipmentGroup();
  productionSettingStore.getResourceNoteGroup();
  productionSettingStore.getMaterialTypeGroupAll();
  productionSettingStore.getImpositionTemmplateList({
    Page: 1,
    PageSize: 999,
    OnlyShowName: true,
  });
});
onMounted(() => {
  sessionStorage.removeItem('processSetupPage');
  getProcessList();
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
    background-color: #fff;
    >.header-top{
      display: flex;
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
  }
}
</style>
