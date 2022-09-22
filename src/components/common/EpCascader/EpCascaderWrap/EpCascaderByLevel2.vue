<template>
  <EpCascader
    :showLine="props.showLine"
    :list="localList"
    :title="props.title"
    :defaultProps="props.defaultProps"
    :withEmpty="props.withEmpty && !props.onlyLastValid"
    :fiexdWidth="props.fiexdWidth"
    :onlyLastValid="props.onlyLastValid"
    :level="props.level"
    :showTitle="props.showTitle"
    v-model="value"
  />
</template>

<script setup lang='ts'>
import EpCascader from '@/components/common/EpCascader/EpCascader.vue';
import { computed } from 'vue';
import { IListItemType } from './types';

interface IProps {
  list: IListItemType[],
  defaultProps?: { ID: string, Name: string, children: string },
  title?: string
  showLine?: boolean
  withEmpty?: boolean
  fiexdWidth?: number
  onlyLastValid?: boolean // 是否仅最后一级才可点击生效 启用时，将会筛选掉没有最后一级的列表项目
  level?: number
  First: string | number
  Second: string | number
  autoComplete?: boolean // 选中第一级选项时，是否自动给第二级选项赋值（第一个）
  typeList?: string[][]
  showTitle?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  list: () => [],
  defaultProps: () => ({ ID: 'ID', Name: 'Name', children: 'children' }),
  title: '筛选',
  showLine: false,
  withEmpty: true,
  fiexdWidth: 0,
  onlyLastValid: false,
  level: 2,
  First: '',
  Second: '',
  autoComplete: false,
  typeList: () => [['ProductClass', 'First'], ['ProductClass', 'Second']],
  showTitle: true,
});

const emit = defineEmits(['setCondition', 'getList']);

const value = computed({
  get() {
    const list = [
      props.First,
      props.Second,
    ];
    return list.filter(it => it || it === 0);
  },
  set(ids) {
    const [_First, _Second] = ids;
    const First = _First || _First === 0 ? _First : '';
    let Second = _Second || _Second === 0 ? _Second : '';
    if (First !== '' && Second === '' && props.autoComplete) {
      const t = props.list.find(it => it[props.defaultProps.ID] === First);
      if (t && t.children && t.children.length > 0) {
        Second = t.children[0][props.defaultProps.ID];
      }
    }
    emit('setCondition', [props.typeList[0], First]);
    emit('setCondition', [props.typeList[1], Second]);
    emit('getList');
  },
});

const localList = computed(() => {
  if (props.onlyLastValid) {
    return props.list.filter(it => it.children && it.children.length > 0);
  }
  return props.list;
});

</script>

<style scoped lang='scss'>
</style>
