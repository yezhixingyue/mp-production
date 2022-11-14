<template>
  <div class="equipment-page" >
    <header>
      <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
      <div class="header-top">
        <mp-button type="primary" @click="addEquipment">+ 添加设备/工厂</mp-button>
      </div>
    </header>
    <main>
      <el-table fit stripe border
      :data="EquipmentList" style="width: 755px">
        <el-table-column
        show-overflow-tooltip prop="ClassName" label="设备分类" min-width="154" />
        <el-table-column
        show-overflow-tooltip prop="GroupName" label="设备组" min-width="144">
        </el-table-column>
        <el-table-column
        show-overflow-tooltip prop="Name" label="设备" min-width="158" />
        <el-table-column prop="name" label="操作" min-width="240">
          <template #default="scope">
            <template v-if="!scope.row.IsSpecialColor">
              <mp-button type="primary" class="ft-12" link @click="ToPutOutPage(scope.row)">申放</mp-button>
              <mp-button type="primary" class="ft-12" link @click="TocCpacityPage(scope.row)">设备产能</mp-button>
              <mp-button type="danger" class="ft-12" link
                @click="delEquipment(scope.row)">删除</mp-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <DialogContainerComp
    :title="`添加设备工厂`"
    :visible='addEquipmentShow'
    :width="660"
    :primaryClick="addColorPrimaryClick"
    :closeClick="addColorCloseClick"
    :closed="addColorCloseedClick"
    >
    <template #default>
      <div class="add-equipment-dialog">
        <el-scrollbar max-height="450px">
          <!-- <el-checkbox-group
            v-model="EquipmentSaveData.EquipmentIDS"
          > -->
          <ul class="one-list">
            <template  v-for="ClassIt in processInfo?.ClassEquipmentGroups" :key="ClassIt.ClassID">
              <li v-if="ClassIt.EquipmentGroups && ClassIt.EquipmentGroups.length">
                <p class="one">{{ClassIt.ClassName}}:</p>
                <ul class="tow-list">
                  <template v-for="GroupIt in ClassIt.EquipmentGroups" :key="GroupIt.GroupID">
                    <li v-if="GroupIt.Equipments && GroupIt.Equipments.length">
                      <p class="tow">{{GroupIt.GroupName}}:</p>
                      <div class="checkbox">
                        <el-checkbox @change="bool => addEquipmentChange(it.ID)"
                          :checked="EquipmentSaveData.EquipmentIDS.some(id => it.ID === id)"
                          v-for="it in GroupIt.Equipments" :key="it.ID" :label="it.ID">{{it.Name}}</el-checkbox>
                      </div>
                    </li>
                  </template>
                </ul>
              </li>
            </template>
          </ul>
          <!-- </el-checkbox-group> -->
        </el-scrollbar>
      </div>
    </template>
    </DialogContainerComp>
    <footer>
      <mp-button class="blue" @click="$goback">返回</mp-button>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import {
  onMounted, computed, getCurrentInstance, ref, Ref, watch,
} from 'vue';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { useRoute, useRouter } from 'vue-router';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import api from '@/api';
import messageBox from '@/assets/js/utils/message';
import { IProductionLineWorkings } from '@/store/modules/productionSetting/types';

interface EquipmentListType {
  ClassID:number
  ClassName:string
  GroupID:string
  GroupName:string
  ID:string
  Name:string
  LineEquipmentID?:string
}

const route = useRoute();
const router = useRouter();

const { $goback } = getCurrentInstance()?.appContext.config.globalProperties || { $goback: () => null };

const processInfo:Ref<IProductionLineWorkings|null> = ref(null);

const addEquipmentShow = ref(false);

const EquipmentSaveData = ref({
  LineWorkID: '',
  EquipmentIDS: [],
});
const BreadcrumbList = computed(() => [
  { to: { path: '/productionLine' }, name: '生产线' },
  {
    name: '设备工厂',
  },
]);
const EquipmentList = computed(() => {
  const returnData:EquipmentListType[] = [];
  processInfo.value?.ClassEquipmentGroups?.forEach(ClassIt => {
    ClassIt.EquipmentGroups.forEach(GroupIt => {
      GroupIt.Equipments.forEach(it => {
        if (it.LineEquipmentID) {
          returnData.push({
            ClassID: ClassIt.ClassID as number,
            ClassName: ClassIt.ClassName as string,
            GroupID: GroupIt.GroupID as string,
            GroupName: GroupIt.GroupName as string,
            ID: it.ID as string,
            Name: it.Name as string,
            LineEquipmentID: it.LineEquipmentID,
          });
        }
      });
    });
  });

  return returnData;
});
const ToPutOutPage = (item) => {
  router.push({
    name: 'putOut',
    params: { LineEquipmentID: item.LineEquipmentID, ReportMode: 0 },
  });
};
const TocCpacityPage = (item) => {
  router.push({
    name: 'capacity',
    params: { LineEquipmentID: item.LineEquipmentID, ReportMode: 0 },
  });
};
const removeEquipment = (ID) => {
  processInfo.value?.ClassEquipmentGroups?.forEach((ClassIt, ClassIti) => {
    ClassIt.EquipmentGroups.forEach((GroupIt, GroupIti) => {
      GroupIt.Equipments.forEach((it, iti) => {
        if (it.ID === ID) {
          const _it = it;
          _it.LineEquipmentID = '';
        }
      });
    });
  });
};
const delEquipment = (item) => {
  messageBox.warnCancelBox('确定要删除此生产设备吗？', `${item.Name}`, () => {
    api.getProductionLinetEquipmentRemove(item.LineEquipmentID).then(res => {
      if (res.data.Status === 1000) {
        setStorage();
        removeEquipment(item.ID);
      }
    });
  }, () => undefined);
};
// const isChecked = computed(() => returnData);
watch(() => EquipmentList.value, (newVal) => {
  EquipmentSaveData.value.EquipmentIDS = newVal.map(it => it.ID) as never[];
});
const setEquipment = (list) => {
  processInfo.value?.ClassEquipmentGroups?.forEach((ClassIt, index) => {
    ClassIt.EquipmentGroups.forEach((GroupIt, i) => {
      GroupIt.Equipments.forEach((it, num) => {
        const temp = list.find(id => id === it.ID);
        if (temp) {
          if (processInfo.value) {
            processInfo.value.ClassEquipmentGroups[index].EquipmentGroups[i].Equipments[num].LineEquipmentID = it.ID;
          }
        }
      });
    });
  });
};
function setStorage() { // 设置会话存储
  sessionStorage.setItem('productionLinePage', 'true');
}
function addEquipment() { // 添加设备工厂点击
  addEquipmentShow.value = true;
}

const addEquipmentChange = (value) => {
  const clickItem = EquipmentSaveData.value.EquipmentIDS.find(it => it === value);
  if (clickItem) {
    EquipmentSaveData.value.EquipmentIDS = EquipmentSaveData.value.EquipmentIDS.filter(it => it !== value);
  } else {
    EquipmentSaveData.value.EquipmentIDS.push(value as never);
  }
};
const addColorCloseedClick = () => {
  EquipmentSaveData.value.LineWorkID = '';
  EquipmentSaveData.value.EquipmentIDS = [];
};
const addColorCloseClick = () => {
  addEquipmentShow.value = false;
};
const addColorPrimaryClick = () => {
  EquipmentSaveData.value.LineWorkID = processInfo.value?.LineWorkID || '';
  api.getProductionLinetEquipmentSave(EquipmentSaveData.value).then(res => {
    if (res.data.Status === 1000) {
      const cb = () => {
        setEquipment([...EquipmentSaveData.value.EquipmentIDS]);
        setStorage();
        addColorCloseClick();
      };
        // 保存成功
      messageBox.successSingle('保存成功', cb, cb);
    }
  });
//
};
onMounted(() => {
// sessionStorage.removeItem('foldWayTemplateSteupPage');
  const temp = JSON.parse(route.params.processInfo as string) as IProductionLineWorkings;
  if (temp) {
    processInfo.value = { ...temp };
  }
});

</script>
<script lang="ts">
export default {
  name: 'equipmentPage',
};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.equipment-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  font-size: 12px;
  >header{
    padding: 20px;
    padding-bottom: 0;
    .header-top{
      margin-top: 20px;
    }
  }
  >main{
    flex: 1;
    margin-top: 20px;
    overflow-x: auto;
    padding-left: 20px;
    // padding-top: 20px;
    box-sizing: border-box;
    .el-table{
      height: 100%;
    }
  }
  >footer{
    min-height: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 50px;
    .el-button{
      width: 120px;
    }
    .el-button + .el-button{
      margin-left: 30px;
    }
  }
  .add-equipment-dialog{
    .one-list{
      min-height: 350px;
      p{
        font-size: 14px;
        font-weight: 700;
        padding: 10px 0;
      }
      .one{
        padding-left: 1em;
      }
      .tow{
        padding-left: 2em;
      }
      .checkbox{
        padding-left: 3em;
      }
    }
  }
}
</style>
