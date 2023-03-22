<template>
  <div>
    <DialogContainerComp
    title="可选物料资源包"
    :visible='Dialog'
    :width="660"
    :primaryClick="PrimaryClick"
    :closeClick="CloseClick"
    :closed="Closed"
    :appendToBody="true"
    primary-text="确定"
    >
    <template #default>
      <div class="set-apply-equipment-dialog">
        <el-scrollbar max-height="350px">
        <div class="material-type">
          <el-checkbox-group v-model="checkList">
            <el-checkbox
            v-for="(item) in localMaterialListGroupList"
            :key="item.ID" :label="item.ID">
              <span :title="item._FullName">
                <em>{{item._FullName}}</em>
              </span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        </el-scrollbar>
        <p class="tips-box"><el-icon><WarningFilled /></el-icon> 主料和版材均最多包含一个</p>
      </div>
    </template>
    </DialogContainerComp>
  </div>
</template>
<script setup lang="ts">
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import {
  ref, Ref, computed, watch,
} from 'vue';
import type {
  MaterialTypeGroupType,
} from '@/store/modules/productionSetting/types';
import { MakingGroupTypeFeatureEnum } from '@/views/productionResources/resourceBundle/TypeClass/ResourceBundle';
import { MpMessage } from '@/assets/js/utils/MpMessage';

interface Props {
  visible: boolean
  changeVisible?: (bol:boolean) => void
  saveEquipment?: (list:MaterialTypeGroupType[]) => void
  activeMaterialList?: string[]
  MaterialListGroup?: MaterialTypeGroupType[]
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  changeVisible: () => null,
  saveEquipment: () => null,
  activeMaterialList: () => [],
  MaterialListGroup: () => [],
});
const checkList:Ref<string[]> = ref([]);
const Dialog = computed({
  get() {
    return props.visible;
  },
  set(newVal) {
    props.changeVisible(newVal);
  },
});

const _getFullName = (it: MaterialTypeGroupType) => {
  const arr: string[] = [];
  if (it.Feature === MakingGroupTypeFeatureEnum.main) arr.push('主');
  if (it.Feature === MakingGroupTypeFeatureEnum.semifinished) arr.push('半');
  if (it.IsPlateMaterial) arr.push('版材');

  const str = arr.length > 0 ? `${arr.map(s => `(${s})`).join('')}` : '';
  return it.Name + str;
};

const localMaterialListGroupList = computed(() => props.MaterialListGroup.map(it => ({
  ...it,
  _FullName: _getFullName(it),
})));
function CloseClick() {
  props.changeVisible(false);
}
function Closed() {
  // 清空表单
  checkList.value = [];
}
function PrimaryClick() {
  const returnData = props.MaterialListGroup.filter(res => checkList.value.find(it => it === res.ID));

  if (returnData.filter(it => it.Feature === MakingGroupTypeFeatureEnum.main).length > 1) {
    MpMessage.error({
      title: '操作失败',
      msg: '仅能包含一个主料',
    });
    return;
  }

  if (returnData.filter(it => it.IsPlateMaterial).length > 1) {
    MpMessage.error({
      title: '操作失败',
      msg: '最多可选择1个版材',
    });
    return;
  }

  props.saveEquipment(returnData);
}
watch(() => Dialog.value, (newVal) => {
  if (newVal && props.activeMaterialList) {
    checkList.value = props.activeMaterialList as string[];
  }
});
</script>
<style lang="scss" scoped>
  .set-apply-equipment-dialog{
    padding-left: 18px;
    padding-right: 0;
    .material-type{
      &.material-type+.material-type{
        margin-top: 20px;
      }
      p{
        :deep(.el-checkbox__label) {
          font-weight: 600;
          font-size: 13px;
        }
      }
    }
    .el-checkbox-group{
      .el-checkbox{
        margin-right: 8px;
        :deep(.el-checkbox__label) {
          display: inline-block;
          width: 10em;
          overflow: hidden;
          > span {
            display: flex;
            overflow: hidden;
            em {
              flex-shrink: 1;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin-right: 1px;
            }
            i {
              flex: none;
            }
          }
        }
      }
    }
  }
  .tips-box {
    width: 220px;
    margin: 35px auto;
    margin-bottom: -15px;
    i {
      vertical-align: -2px;
      margin: 0 6px;
    }
  }
</style>
