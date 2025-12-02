<template>
  <DialogContainerComp :visible='visible' :width='660' title='关联设备分组' top='12vh'  @cancel='visible = false'
    @open='onOpen' @submit='submit'>
    <div class='dialog-content'>
      <ul>
        <li>
          <label class="star">设备分类：</label>
          <el-select v-model="ruleForm.classID" placeholder="请选择设备分类" style="width: 260px" @change="ruleForm.groupIds = [...disabledGroupIds]">
            <el-option v-for="item in EquipmentGroupLevelList" :key="item.ClassID" :label="item.ClassName" :value="item.ClassID" />
          </el-select>
        </li>

        <li>
          <label class="star">设备组：</label>
          <el-checkbox-group v-model="ruleForm.groupIds">
            <el-checkbox v-for="group in groupList" :key="group.GroupID"
             :label="group.GroupID" :value="group.GroupID"
             :disabled="disabledGroupIds.includes(group.GroupID)"
             :title="group.GroupName"
            >{{ group.GroupName }}</el-checkbox>
          </el-checkbox-group>
        </li>
      </ul>
    </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { ElMessage } from 'element-plus';
import { IAssistantRelationGroup, IEquipmentGroupLevelItem } from '../../../types/types';
import { TypeGroupRelationModel } from '../model/TypeGroupRelationModel';

const props = defineProps<{
  relationModel: TypeGroupRelationModel
  EquipmentGroupLevelList: IEquipmentGroupLevelItem[]
}>();

const visible = defineModel<boolean>('visible');

const ruleForm = ref<{ classID: '' | number; groupIds: string[] }>({
  classID: '',
  groupIds: [],
});

const disabledGroupIds = computed(() => props.relationModel.target.GroupList.map(it => it.ID)); // 已被关联过的设备组ID
const groupList = computed(() => props.EquipmentGroupLevelList.find(it => it.ClassID === ruleForm.value.classID)?.EquipmentGroups || []);

const onOpen = () => {
  ruleForm.value = {
    classID: props.EquipmentGroupLevelList[0] ? props.EquipmentGroupLevelList[0].ClassID : '',
    groupIds: [...disabledGroupIds.value],
  };
};

const submit = async () => {
  const targetClass = props.EquipmentGroupLevelList.find(it => it.ClassID === ruleForm.value.classID);

  if (!targetClass) {
    MpMessage.error('保存失败', '请选择设备分类');
    return;
  }

  if (ruleForm.value.groupIds.length === 0) {
    MpMessage.error('保存失败', '请选择需要关联的设备组');
    return;
  }

  const GroupList: IAssistantRelationGroup[] = targetClass.EquipmentGroups
    .filter(g => ruleForm.value.groupIds.includes(g.GroupID) && !disabledGroupIds.value.includes(g.GroupID))
    .map(it => ({
      TypeID: props.relationModel.target.ID,
      ID: it.GroupID,
      Name: it.GroupName,
      ClassID: targetClass.ClassID,
      ClassName: targetClass.ClassName,
      MinNumber: 0,
      MaxNumber: 1,
    }));

  if (GroupList.length === 0) {
    MpMessage.error('保存失败', '请选择需要关联的设备组');
    return;
  }

  const bool = await props.relationModel.relation(GroupList);
  if (bool) {
    ElMessage.success('保存成功');
    visible.value = false;
  }
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
  margin-top: -15px;
  min-height: 260px;
  max-height: 360px;
  overflow: auto;
  @include scroll;

  > ul {
    > li {
      display: flex;
      margin-bottom: 10px;
      margin-left: 60px;

      .star {
        flex: none;
        width: 6em;
        text-align: right;
        line-height: 32px;
        margin-right: 6px;
      }

      :deep(.el-checkbox) {
        margin-right: 10px;
        .el-checkbox__label {
          width: 10em;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
