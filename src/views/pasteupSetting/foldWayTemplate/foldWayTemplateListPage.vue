<template>
  <div class="foldWay-template-page">
    <header>
      <div class="classs">
        <RadioGroupComp
          :level1Options='FoldWayTemplateClassList'
          :level2Options='[]'
          :defaultProps="{
            value:'ID',
            label:'Name',
          }"
          :value='RadioGroupCompValue'
          @change="RadioGroupCompChange"
          ></RadioGroupComp>
        <mp-button type="primary" link @click="ManagementClass">管理分类</mp-button>
      </div>
      <div class="header-top">
        <mp-button type="primary" @click="TofoldWayTemplate">+ 添加折手模板</mp-button>
      </div>
    </header>
    <main>
      <el-table border fit stripe
      :data="Data.FoldWayTemplateList" style="width: 100%">
        <el-table-column
        show-overflow-tooltip prop="Name" label="分类" min-width="180">
          <template #default="scope">
            {{getClassName(scope.row.ClassID)}}
          </template>
        </el-table-column>
        <el-table-column
        show-overflow-tooltip prop="Name" label="名称" min-width="200">
        </el-table-column>
        <el-table-column
        show-overflow-tooltip prop="ShowColor" label="行列数" min-width="160">
          <template #default="scope">
            {{scope.row.RowNumber}}行 {{scope.row.ColumnNumber}}列
          </template>
        </el-table-column>
        <!-- show-overflow-tooltip prop="Linkman" label="适用设备" min-width="505"> -->
        <el-table-column
        show-overflow-tooltip prop="Linkman" label="适用设备" min-width="895">
          <template #default="scope">
            <span class="useable-equipment" v-for="(item) in getUseableEquipmentText(scope.row.UseableEquipmentGroupList)" :key="item.ClassID">
              <!-- {{index===0?'':';'}} -->
              <span class="group">{{item.ClassName}}：</span><span>{{item.EquipmentGroups.map(it => it.Name).join('、')}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="操作" min-width="277">
          <template #default="scope">
            <mp-button type="primary" link @click="setApplyEquipment(scope.row)">
              <!-- <i class="iconfont icon-bianji"></i> -->
              适用设备</mp-button>
            <mp-button type="primary" link @click="TofoldWayTemplate(scope.row)">
              <!-- <i class="iconfont icon-bianji"></i> -->
              编辑</mp-button>
            <mp-button type="danger" link
              @click="delFoldWayTemplate(scope.row)">
              <!-- <i class="iconfont icon-delete"></i> -->
              删除</mp-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <SetApplyEquipmentDialog
    title="适用设备"
    :visible='Data.ApplyEquipmentShow'
    :changeVisible='(visble) => Data.ApplyEquipmentShow = visble'
    :haveSetApplyEquipmentList="Data.haveSetApplyEquipmentList"
    :applyEquipmentList="Data.applyEquipmentList"
    :saveEquipment="saveEquipment"
    :foldWayName="Data.ApplyEquipment?.Name"
    >
    </SetApplyEquipmentDialog>
    <footer>
      <div class="bottom-count-box">
        <MpPagination :total="Data.DataTotal"/>
      </div>
    </footer>
  </div>
</template>

<script lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import {
  reactive, onMounted, computed, onActivated,
} from 'vue';

import SetApplyEquipmentDialog from '@/components/pasteupSetting/setApplyEquipmentDialog.vue';
import { EquipmentGroups, UseClassEquipmentGroupType } from '@/components/pasteupSetting/types';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { useRouter } from 'vue-router';
import { usePasteupSettingStore } from '@/store/modules/pasteupSetting';
import RadioGroupComp from '@/components/common/RadioGroupComp.vue';
import { FoldWayTemplateType } from './type';

interface _EquipmentGroups{
  GroupID: string,
  GroupName: string
}

export interface _UseClassEquipmentGroupType {
  ClassID: 0,
  ClassName: string,
  EquipmentGroups: _EquipmentGroups[]
}
interface getFoldWayTemplateDataType {
  ClassID:number|string,
  Page:number,
  PageSize:number,
}
interface DataType {
  ApplyEquipment:FoldWayTemplateType|null,
  applyEquipmentList:UseClassEquipmentGroupType[],
  haveSetApplyEquipmentList:EquipmentGroups[],
  ApplyEquipmentShow:boolean,
  getFoldWayTemplateData:getFoldWayTemplateDataType,
  FoldWayTemplateList:FoldWayTemplateType[]
  DataTotal:number
}
export default {
  name: 'foldWayTemplateListPage',
  components: {
    MpPagination,
    RadioGroupComp,
    SetApplyEquipmentDialog,
  },
  setup() {
    const router = useRouter();
    const PasteupSettingStore = usePasteupSettingStore();
    const Data:DataType = reactive({
      ApplyEquipment: null,
      applyEquipmentList: [],
      haveSetApplyEquipmentList: [],
      ApplyEquipmentShow: false,
      FoldWayTemplateList: [],
      getFoldWayTemplateData: {
        ClassID: '',
        Page: 1,
        PageSize: 20,
      },
      DataTotal: 0,
    });

    const FoldWayTemplateClassList = computed(() => [{
      ID: '',
      Name: '所有分类',
    }, ...PasteupSettingStore.FoldWayTemplateClassList]);
    const RadioGroupCompValue = computed(() => ({
      level1Val: Data.getFoldWayTemplateData.ClassID,
      level2Val: '',
    }));

    // 获取折手模板列表
    function getFoldWayTemplateList() {
      api.getFoldWayTemplateList(Data.getFoldWayTemplateData).then(res => {
        if (res.data.Status === 1000) {
          Data.FoldWayTemplateList = res.data.Data as FoldWayTemplateType[];
          Data.DataTotal = res.data.DataNumber;
          //
        }
      });
    }
    function RadioGroupCompChange(levelData) {
      const { level1Val } = levelData;
      if (level1Val !== undefined) {
        Data.getFoldWayTemplateData.ClassID = level1Val;
        getFoldWayTemplateList();
      }
    }

    function delFoldWayTemplate(item) {
      messageBox.warnCancelBox('确定要删除此折手模板吗？', `${item.Name}`, () => {
        api.getFoldWayTemplateRemove(item.ID).then(res => {
          if (res.data.Status === 1000) {
          // 删除成功
            getFoldWayTemplateList();
          }
        });
      }, () => undefined);
    }
    function ApplyEquipmentCloseClick() {
      Data.ApplyEquipmentShow = false;
    }
    // 设置适用设备
    function setApplyEquipment(item) {
      Data.ApplyEquipmentShow = true;
      Data.ApplyEquipment = item;
      Data.haveSetApplyEquipmentList = item.UseableEquipmentGroupList as EquipmentGroups[];
    }
    // 添加/编辑折手模板
    function TofoldWayTemplate(item = null) {
      router.push({
        name: 'foldWayTemplateSteup',
        params: { Template: JSON.stringify(item) },
      });
    }
    // 管理分类
    function ManagementClass() {
      router.push({
        name: 'foldWayTemplateClass',
        // params: { TypeID: IDs.TypeID, CategoryID: IDs.CategoryID },
      });
    }
    function getClassName(ClassID) {
      const ClassItem = PasteupSettingStore.FoldWayTemplateClassList.find(it => it.ID === ClassID);
      return ClassItem?.Name;
    }
    // 适用设备保存
    function saveEquipment(Equipments) {
      console.log(Equipments, 'Equipments');
      api.getFoldWayTemplateUseableEquipment({
        ID: Data.ApplyEquipment?.ID,
        UseableEquipmentGroupList: Equipments,
      }).then(res => {
        if (res.data.Status === 1000) {
          const cb = () => {
            Data.ApplyEquipmentShow = false;
            getFoldWayTemplateList();
          };
          messageBox.successSingle('入库成功', cb, cb);
        }
      });
    }
    // 获取保存的适用设备文字
    function getUseableEquipmentText(Equipments) {
      const tempGroup:UseClassEquipmentGroupType[] = [];
      Data.applyEquipmentList.forEach(item => {
        const EquipmentGroup = item.EquipmentGroups.filter(it => {
          const Equipment = Equipments.find(Equipment => Equipment.ID === it.ID);
          return Equipment;
        });
        if (EquipmentGroup.length) {
          const _item = { ...item };
          _item.EquipmentGroups = EquipmentGroup;
          tempGroup.push(_item);
        }
      });
      return tempGroup;
    }

    onActivated(() => {
      const foldWayTemplateSteupPage = sessionStorage.getItem('foldWayTemplateSteupPage') === 'true';
      if (foldWayTemplateSteupPage) {
        getFoldWayTemplateList();
        sessionStorage.removeItem('foldWayTemplateSteupPage');
      }
    });
    onMounted(() => {
      sessionStorage.removeItem('foldWayTemplateSteupPage');
      getFoldWayTemplateList();
      // 获取所有分类
      PasteupSettingStore.getFoldWayTemplateClassList();
      // 获取所有适用设备
      api.getEquipmentGroup().then(res => {
        if (res.data.Status === 1000) {
          const temp = res.data.Data as _UseClassEquipmentGroupType[];
          Data.applyEquipmentList = [];
          temp.forEach(item => {
            const EquipmentGroups = item.EquipmentGroups.map(it => ({
              ID: it.GroupID,
              Name: it.GroupName,
            }));
            Data.applyEquipmentList.push({
              ClassID: item.ClassID,
              ClassName: item.ClassName,
              EquipmentGroups,
            });
          });
          console.log(Data.applyEquipmentList, temp);
        }
      });
    });
    return {
      Data,
      RadioGroupCompValue,
      PasteupSettingStore,
      FoldWayTemplateClassList,
      saveEquipment,
      getUseableEquipmentText,
      getClassName,
      RadioGroupCompChange,
      ManagementClass,
      TofoldWayTemplate,
      setApplyEquipment,
      delFoldWayTemplate,
      ApplyEquipmentCloseClick,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.foldWay-template-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  >header{
    padding: 20px;
    background-color: #fff;
    .classs{
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;
      .el-button{
        height: 30px;
        margin-left: 20px;
      }
    }
    >.header-top{
      display: flex;
      justify-content: space-between;
    }
  }
  >main{
    margin-top: 10px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: #fff;
    .el-table{
      flex: 1;
      .el-button{
        font-size: 12px;
      }
      .el-button+.el-button{
        margin-left: 30px;
      }
      .useable-equipment{
        &.useable-equipment+.useable-equipment{
          margin-left: 20px;
        }
        .group{
          font-weight: 600;
        }
      }
    }
  }
  >footer{
    background-color: #fff;
    min-height: 50px;
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .add-printing-color-dialog{
    .el-form{
      width: 370px;
      margin: 0 auto;
    }
  }
}
</style>
