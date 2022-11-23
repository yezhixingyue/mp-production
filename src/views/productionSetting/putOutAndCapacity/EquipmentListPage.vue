<template>
  <section class="equipment-page">
    <header>
      <MpBreadcrumb :list="props.BreadcrumbList"></MpBreadcrumb>
      <div class="header-top">
        <mp-button type="primary" @click="visible = true">+ 添加设备/工厂</mp-button>
      </div>
    </header>
    <main>
      <el-table fit stripe border :data="EquipmentList" style="width: 755px">
        <mp-table-column prop="ClassName" label="设备分类" min-width="154" />
        <mp-table-column prop="GroupName" label="设备组" min-width="144">
        </mp-table-column>
        <mp-table-column prop="Name" label="设备" min-width="158" />
        <mp-table-column prop="name" label="操作" min-width="240">
          <template #default="scope">
            <mp-button type="primary" class="ft-12" link @click="ToPutOutPage(scope.row)">申放</mp-button>
            <mp-button type="primary" class="ft-12" link @click="TocCpacityPage(scope.row)">设备产能</mp-button>
            <mp-button type="danger" class="ft-12" link @click="onRemoveClick(scope.row)">删除</mp-button>
          </template>
        </mp-table-column>
      </el-table>
    </main>
    <EquipmentAddDialog v-model:visible="visible" :ClassEquipmentGroups="props.ClassEquipmentGroups" :cur-edit-item="curEditItem" @submit="submit" />
    <footer>
      <mp-button class="blue" @click="getGoBackFun">返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { getGoBackFun } from '@/router';
import { IMpBreadcrumbItem } from '@/assets/Types/common';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IClassEquipmentGroups } from '@/store/modules/productionSetting/types';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import EquipmentAddDialog from './Comps/EquipmentAddDialog.vue';
import { EquipmentListType, ILineEquipmentSaveParams } from './js/types';

const props = defineProps<{
  BreadcrumbList: IMpBreadcrumbItem[]
  LineWorkID?: string
  ClassEquipmentGroups: IClassEquipmentGroups[]
  Equipments?: { ID: string, LineEquipmentID: string }[]
}>();

const emit = defineEmits(['ToPutOut', 'TocCpacity', 'remove', 'save']);

const EquipmentIDS = computed(() => (props.Equipments ? props.Equipments.map(it => it.ID) : []));

const EquipmentList = computed(() => {
  const list:EquipmentListType[] = [];
  props.ClassEquipmentGroups?.forEach(lv1 => {
    lv1.EquipmentGroups.forEach(lv2 => {
      lv2.Equipments.forEach(it => {
        if (it.LineEquipmentID || EquipmentIDS.value.includes(it.ID)) {
          let LineEquipmentID = it.LineEquipmentID || '';
          if (props.Equipments) {
            const t = props.Equipments.find(e => e.ID === it.ID);
            LineEquipmentID = t?.LineEquipmentID || '';
          }
          list.push({
            ID: it.ID,
            Name: it.Name,
            LineEquipmentID,
            ClassID: lv1.ClassID,
            ClassName: lv1.ClassName,
            GroupID: lv2.GroupID,
            GroupName: lv2.GroupName,
          });
        }
      });
    });
  });
  return list;
});

const visible = ref(false);
const curEditItem = computed(() => ({
  LineWorkID: props.LineWorkID || '',
  EquipmentIDS: EquipmentList.value.map(it => it.ID),
}));

const callback = () => { // 保存成功后的回调函数
  visible.value = false;
  // 数据改动
};

const submit = (data: ILineEquipmentSaveParams) => { // 添加设备 本地保存？
  emit('save', data, callback);
};

const ToPutOutPage = (it: EquipmentListType) => { // 申放
  emit('ToPutOut', it);
};

const TocCpacityPage = (it: EquipmentListType) => { // 设备产能
  emit('TocCpacity', it);
};

const onRemoveClick = (it: EquipmentListType) => { // 本地保存？
  MpMessage.warn({
    title: '确定删除该设备吗 ?',
    msg: `设备名称：[ ${it.Name} ]`,
    onOk: () => {
      emit('remove', it);
    },
  });
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
  > main{
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
  > footer{
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
}
</style>
