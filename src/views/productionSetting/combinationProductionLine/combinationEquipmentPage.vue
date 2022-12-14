<template>
  <EquipmentListPage
    v-if="processInfo"
    :BreadcrumbList="BreadcrumbList"
    :LineWorkID="processInfo.LineWorkID"
    :ClassEquipmentGroups="processInfo.ClassEquipmentGroups"
    :curLineWorkName="curLineWorkName"
    @save="handleEquipmentSubmit"
    @remove="handleRemove"
    @toPutOut="ToPutOutPage"
    @tocCpacity="TocCpacityPage" />
</template>

<script lang="ts" setup>
import {
  onMounted, computed, ref, Ref,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import messageBox from '@/assets/js/utils/message';
import { IProductionLineWorkings } from '@/store/modules/productionSetting/types';
import EquipmentListPage from '../putOutAndCapacity/EquipmentListPage.vue';
import { ILineEquipmentSaveParams, IEquipmentGroupSaveResult } from '../putOutAndCapacity/js/types';

const route = useRoute();
const router = useRouter();

const processInfo:Ref<IProductionLineWorkings|null> = ref(null);

const curLineWorkName = ref('');
const curLineName = ref('');

const BreadcrumbList = computed(() => [
  { to: { path: '/combinationProductionLine' }, name: curLineName.value },
  {
    name: `选择设备/工厂：${curLineWorkName.value}`,
  },
]);

const ToPutOutPage = (item) => {
  const Name = curLineWorkName.value;
  const ID = processInfo.value?.WorkID || '';
  const Work = { ID, Name };
  router.push({
    name: 'combinationPutOut',
    params: { LineEquipment: JSON.stringify(item), Work: JSON.stringify(Work), lineName: curLineName.value },
  });
};
const TocCpacityPage = (item) => {
  const Name = curLineWorkName.value;
  const ID = processInfo.value?.WorkID || '';
  const Work = { ID, Name };
  router.push({
    name: 'combinationCapacity',
    params: { LineEquipment: JSON.stringify(item), Work: JSON.stringify(Work), lineName: curLineName.value },
  });
};
const afterRemove = (ID) => {
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
const handleRemove = (item) => {
  api.getProductionLinetEquipmentRemove(item.LineEquipmentID).then(res => {
    if (res.data.Status === 1000) {
      const cb = () => {
        setStorage();
        afterRemove(item.ID);
      };

      MpMessage.success({ title: '删除成功', onOk: cb, onCancel: cb });
    }
  });
};
const setEquipment = (list, resultArr: IEquipmentGroupSaveResult[]) => {
  if (!processInfo.value?.ClassEquipmentGroups) return;
  processInfo.value?.ClassEquipmentGroups?.forEach((ClassIt, index) => {
    ClassIt.EquipmentGroups.forEach((GroupIt, i) => {
      GroupIt.Equipments.forEach((it, num) => {
        const _it = it;
        _it.LineEquipmentID = '';
        const temp = list.find(id => id === it.ID);
        if (temp) {
          const t = resultArr.find(r => r.EquipmentID === it.ID);
          if (t) {
            _it.LineEquipmentID = t.LineEquipmentID;
          }
        }
      });
    });
  });
};
function setStorage() { // 设置会话存储
  sessionStorage.setItem('combinationProductionLinePage', 'true');
}
const handleEquipmentSubmit = (params: ILineEquipmentSaveParams, callback: () => void) => {
  api.getProductionLinetEquipmentSave(params).then(res => {
    if (res.data.Status === 1000) {
      const cb = () => {
        setEquipment([...params.EquipmentIDS], res.data.Data as IEquipmentGroupSaveResult[]);
        setStorage();
        callback();
      };
        // 保存成功
      messageBox.successSingle('保存成功', cb, cb);
    }
  });
//
};

onMounted(() => {
  const temp = JSON.parse(route.params.processInfo as string) as IProductionLineWorkings;
  if (temp) {
    processInfo.value = { ...temp };
    curLineWorkName.value = route.params.WorkName as string;
    curLineName.value = route.params.lineName as string;
  }
});

</script>
<script lang="ts">
export default {
  name: 'combinationEquipmentPage',
};
</script>
<style lang='scss'>
</style>
