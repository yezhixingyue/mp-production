<template>
  <div class="mp-prod-condition-prop-select-dialogwrap">
    <div v-for="(lv1, index1) in optionList" :key="lv1.Name + '' + index1" class="lv1-item">
      <span class="mp-common-title-wrap" :title="lv1.Name">{{ lv1.Name }}</span>
      <ul>
        <li v-for="(lv2, index2) in lv1.List" :key="lv2.Name + '' + index2">
          <el-checkbox :indeterminate="getIndeterminate(lv2)" :modelValue='getLv2Value(lv2)'
            @change="bool => handleLv2Change(bool, lv2)" :title="lv2.Name">{{ lv2.Name }}</el-checkbox>
          <el-checkbox-group v-model="localCheckList">
            <el-checkbox :title="lv3.Name" :label="lv3.Data.First" v-for="(lv3, index3) in lv2.List"
              :key="lv3.Name + '' + index3">{{ lv3.Name }}</el-checkbox>
          </el-checkbox-group>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { IMaterialOptionItem } from './types';

const props = defineProps<{
  optionList: IMaterialOptionItem[],
  modelValue:(string | number)[]
}>();

const emit = defineEmits(['update:modelValue']);

const localCheckList = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

const getLv2Value = (lv2: IMaterialOptionItem['List'][number]) => {
  const t = lv2.List.find(it => !localCheckList.value.includes(it.Data.First));
  if (t) return false;
  return true;
};

const handleLv2Change = (bool: boolean, lv2: IMaterialOptionItem['List'][number]) => {
  const ids = lv2.List.map(it => it.Data.First);
  const _list = localCheckList.value.filter(it => !ids.includes(it));
  if (bool) _list.push(...ids);
  localCheckList.value = _list;
};

const getIndeterminate = (lv2: IMaterialOptionItem['List'][number]) => {
  const ids = lv2.List.map(it => it.Data.First);
  const list = ids.filter(it => localCheckList.value.includes(it));
  return list.length > 0 && list.length < ids.length;
};
</script>

<style scoped lang='scss'>
.mp-prod-condition-prop-select-dialogwrap {
  overflow: auto;
  max-height: 500px;
  div.lv1-item {
    display: flex;
    margin-bottom: 20px;

    >span {
      width: 120px;
      margin-right: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 700;
      color: #444;
      flex: none;
      font-size: 15px;
      padding-top: 5px;

      &::before {
        height: 16px;
      }
    }

    >ul {
      >li {
        display: flex;
        margin-bottom: 10px;

        >label {
          width: 130px;
          margin-right: 10px;
          font-weight: 700;
          color: #444;
          flex: none;
          height: 28px;

          :deep(.el-checkbox__label) {
            width: 110px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: -5px;
            font-size: 13px;
          }
        }

        >div.el-checkbox-group {
          white-space: normal;

          :deep(.el-checkbox) {
            margin-right: 10px;
            height: 28px;

            .el-checkbox__label {
              font-size: 12px;
              color: #585858;
              width: 122px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              vertical-align: middle;
            }
          }
        }
      }
    }
  }
}

</style>
