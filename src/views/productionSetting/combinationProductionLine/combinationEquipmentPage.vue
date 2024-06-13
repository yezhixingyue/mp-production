<template>
  <EquipmentListPage
    v-if="processInfo"
    :BreadcrumbList="BreadcrumbList"
    :LineWorkID="processInfo.LineWorkID"
    :ClassEquipmentGroups="processInfo.ClassEquipmentGroups"
    :PlateMakingEquipmentSetupData="PlateMakingEquipmentSetupData"
    :curLineWorkName="curLineWorkName"
    @save="handleEquipmentSubmit"
    @remove="handleRemove"
    @setWeight="setWeight"
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
// import messageBox from '@/assets/js/utils/message';
import { IProductionLineWorkings } from '@/store/modules/productionSetting/types';
import { useProductionSettingStore } from '@/store/modules/productionSetting';
import { storeToRefs } from 'pinia';
import EquipmentListPage from '../putOutAndCapacity/EquipmentListPage.vue';
import { ILineEquipmentSaveParams, IEquipmentGroupSaveResult } from '../putOutAndCapacity/js/types';
import { EquipmentSetupType, IPlateMakingEquipmentSetupData } from '../productionLine/js/types';
import { WorkSourceTypeEnum } from '../putOutAndCapacity/js/enum';

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

const productionSettingStore = useProductionSettingStore();
const { PlateMakingWorkSetupHander } = storeToRefs(productionSettingStore);

const PlateMakingEquipmentSetupData = computed<IPlateMakingEquipmentSetupData | null>(() => {
  if (!processInfo.value) return null;
  if (processInfo.value.PlateMakingWorkID && !processInfo.value.PlateMakingGroupID && processInfo.value.PlateMakingWorkIdentID) {
    const t = PlateMakingWorkSetupHander.value.PlateMakingWorkAllList.find(it => it.ID === processInfo.value?.PlateMakingWorkID);

    if (t && processInfo.value.PlateMakingClassEquipmentGroups) {
      return {
        WorkID: t.ID,
        WorkName: t.Name,
        PlateMakingClassEquipmentGroups: processInfo.value.PlateMakingClassEquipmentGroups,
        PlateMakingWorkIdentID: processInfo.value.PlateMakingWorkIdentID,
      };
    }
  }
  return null;
});

const ToPutOutPage = (item, type: EquipmentSetupType = 'default') => {
  const Name = type === 'default' ? curLineWorkName.value : PlateMakingEquipmentSetupData.value?.WorkName || '';
  const ID = type === 'default' ? processInfo.value?.WorkID || '' : PlateMakingEquipmentSetupData.value?.WorkID || '';
  const Work = { ID, Name };
  router.push({
    name: 'combinationPutOut',
    params: { LineEquipment: JSON.stringify(item), Work: JSON.stringify(Work), lineName: curLineName.value },
  });
};
const TocCpacityPage = (item, type: EquipmentSetupType = 'default') => {
  const Name = type === 'default' ? curLineWorkName.value : PlateMakingEquipmentSetupData.value?.WorkName || '';
  const ID = type === 'default' ? processInfo.value?.WorkID || '' : PlateMakingEquipmentSetupData.value?.WorkID || '';
  const Work = { ID, Name };
  router.push({
    name: 'combinationCapacity',
    params: { LineEquipment: JSON.stringify(item), Work: JSON.stringify(Work), lineName: curLineName.value },
  });
};
const afterRemove = (ID, type: EquipmentSetupType) => {
  const _ClassEquipmentGroups = type === 'default' ? processInfo.value?.ClassEquipmentGroups : processInfo.value?.PlateMakingClassEquipmentGroups;
  if (!_ClassEquipmentGroups) return;
  _ClassEquipmentGroups.forEach((ClassIt) => {
    ClassIt.EquipmentGroups.forEach((GroupIt) => {
      GroupIt.Equipments.forEach((it) => {
        if (it.ID === ID) {
          const _it = it;
          _it.LineEquipmentID = '';
          _it.Weight = null;
        }
      });
    });
  });
};
const handleRemove = (item, type: EquipmentSetupType = 'default') => {
  api.getProductionLinetEquipmentRemove(item.LineEquipmentID).then(res => {
    if (res.data?.Status === 1000) {
      const cb = () => {
        setStorage();
        afterRemove(item.ID, type);
      };

      MpMessage.success({ title: '删除成功', onOk: cb, onCancel: cb });
    }
  });
};
const setEquipment = (list, resultArr: IEquipmentGroupSaveResult[], WorkSourceType: WorkSourceTypeEnum) => {
  const targetClassEquipmentGroups = WorkSourceType === WorkSourceTypeEnum.PlateMaking
    ? processInfo.value?.PlateMakingClassEquipmentGroups : processInfo.value?.ClassEquipmentGroups;
  if (!targetClassEquipmentGroups) return;
  targetClassEquipmentGroups?.forEach((ClassIt, index) => {
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

const setWeight = (list: { ID: string, Weight: number }[], type: EquipmentSetupType) => {
  setStorage();
  const _ClassEquipmentGroups = type === 'default' ? processInfo.value?.ClassEquipmentGroups : processInfo.value?.PlateMakingClassEquipmentGroups;
  if (!_ClassEquipmentGroups) return;
  _ClassEquipmentGroups.forEach((ClassIt) => {
    ClassIt.EquipmentGroups.forEach((GroupIt) => {
      GroupIt.Equipments.forEach((it) => {
        const t = list.find(_it => _it.ID === it.LineEquipmentID);
        if (t) {
          const _it = it;
          _it.Weight = t.Weight;
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
    if (res.data?.Status === 1000) {
      const cb = () => {
        setEquipment([...params.EquipmentIDS], res.data?.Data as IEquipmentGroupSaveResult[], params.WorkSourceType);
        setStorage();
        callback();
      };
        // 保存成功
      MpMessage.dialogSuccess({
        title: '保存成功',
        onOk: cb,
        onCancel: cb,
      });
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
