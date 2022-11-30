<template>
  <DialogContainerComp :title="`添加设备工厂：${title}`" :visible='localVisible' :width="660" :primaryClick="submit"
    :closeClick="() => localVisible = false" :open="onOpen">
    <template #default>
      <div class="add-equipment-dialog">
        <el-scrollbar max-height="450px">
          <div v-if="localClassEquipmentGroups.length === 0" class="is-pink">
            <el-icon><WarningFilled /></el-icon>
            <span class="ft-12 ml-8">暂无设备可设置</span>
          </div>
          <ul class="one-list" v-else>
            <template v-for="ClassIt in localClassEquipmentGroups" :key="ClassIt.ClassID">
              <li v-if="ClassIt.EquipmentGroups && ClassIt.EquipmentGroups.length">
                <p class="one">{{ ClassIt.ClassName }}:</p>
                <ul class="tow-list">
                  <template v-for="GroupIt in ClassIt.EquipmentGroups" :key="GroupIt.GroupID">
                    <li v-if="GroupIt.Equipments && GroupIt.Equipments.length">
                      <p class="tow">{{ GroupIt.GroupName }}:</p>
                      <div class="checkbox">
                        <el-checkbox @change="() => onChange(it.ID)"
                          :modelValue="ruleForm.EquipmentIDS.includes(it.ID)" v-for="it in GroupIt.Equipments"
                          :key="it.ID" :label="it.ID">{{ it.Name }}</el-checkbox>
                      </div>
                    </li>
                  </template>
                </ul>
              </li>
            </template>
          </ul>
        </el-scrollbar>
      </div>
    </template>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { IClassEquipmentGroups } from '@/store/modules/productionSetting/types';
import { computed, reactive } from 'vue';
import { filterClassEquipmentGroups } from '../../PlateMakingGroupView/js/utils';
import { WorkSourceTypeEnum } from '../js/enum';
import { ILineEquipmentSaveParams } from '../js/types';

const props = defineProps<{
  visible: boolean
  curEditItem: null | ILineEquipmentSaveParams
  ClassEquipmentGroups: IClassEquipmentGroups[]
  title: string
}>();

const emit = defineEmits(['update:visible', 'submit']);

const ruleForm = reactive<ILineEquipmentSaveParams>({
  LineWorkID: '',
  EquipmentIDS: [],
  WorkSourceType: WorkSourceTypeEnum.Normal,
});

const localClassEquipmentGroups = computed(() => filterClassEquipmentGroups(props.ClassEquipmentGroups));

const onOpen = () => {
  ruleForm.LineWorkID = props.curEditItem?.LineWorkID || '';
  const list = props.curEditItem ? [...props.curEditItem.EquipmentIDS] : [];
  const ids: string[] = [];
  localClassEquipmentGroups.value.forEach(lv1 => {
    lv1.EquipmentGroups.forEach(lv2 => {
      lv2.Equipments.forEach(lv3 => {
        ids.push(lv3.ID);
      });
    });
  });
  ruleForm.EquipmentIDS = list.filter(id => ids.includes(id)); // 筛选掉已不在列表中的项目
};

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const onChange = (value: string) => {
  const t = ruleForm.EquipmentIDS.find(it => it === value);
  if (t) {
    ruleForm.EquipmentIDS = ruleForm.EquipmentIDS.filter(it => it !== value);
  } else {
    ruleForm.EquipmentIDS.push(value);
  }
};

const submit = () => {
  if (ruleForm.EquipmentIDS.length === 0) {
    MpMessage.error({
      title: '保存失败', msg: '请选择设备/工厂',
    });
    return;
  }
  emit('submit', ruleForm);
};

</script>

<style scoped lang='scss'>
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
.is-pink {
  i {
    vertical-align: -2px;
  }
}
</style>
