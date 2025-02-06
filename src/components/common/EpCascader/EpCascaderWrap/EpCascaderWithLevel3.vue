<template>
  <!-- v-bind="$attrs" v-on="$listeners" -->
  <EpCascader
    :showLine="showLine"
    :list="levelTreeList"
    :fiexdWidth="fiexdWidth"
    :onlyLastValid="onlyLastValid"
    :offFirst="offFirst"
    :withEmpty="withEmpty && !onlyLastValid"
    :title="title"
    :level="level"
    :withNullValue="withNullValue"
    :defaultProps="defaultProps"
    v-model="EpCascaderAreaValue"
   />
</template>

<script>
import EpCascader from '@/components/common/EpCascader/EpCascader.vue';

export default {
  props: {
    showLine: {
      type: Boolean,
      default: true,
    },
    withEmpty: {
      type: Boolean,
      default: true,
    },
    fiexdWidth: {
      type: Number,
      default: 240,
    },
    title: {
      type: String,
      default: '销售区域',
    },
    First: {
      default: '',
    },
    Second: {
      default: '',
    },
    Third: {
      default: '',
    },
    typeList: {
      type: Array,
      default: () => [['SellArea', 'First'], ['SellArea', 'Second'], ['SellArea', 'Third']],
    },
    setCondition: {
      type: Function,
      default: () => null,
    },
    getList: {
      type: Function,
      default: () => null,
    },
    level: {
      type: Number,
      default: 3,
    },
    onlyLastValid: {
      type: Boolean,
      default: false,
    },
    offFirst: {
      type: Boolean,
      default: false,
    },
    levelTreeList: {
      type: Array,
      default: () => [],
    },
    defaultProps: {
      type: Object,
      default: () => ({
        ID: 'ID',
        Name: 'Name',
        children: 'children',
      }),
    },
    withNullValue: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    EpCascader,
  },
  computed: {
    EpCascaderAreaValue: {
      get() {
        const list = [
          this.First,
          this.Second,
          this.Third,
        ];
        return list.filter(it => it || it === 0);
      },
      set(ids) {
        const [_First, _Second, _Third] = ids;
        const First = _First || _First === 0 ? _First : '';
        // eslint-disable-next-line no-nested-ternary
        const Second = _Second || _Second === 0 ? _Second : (First === -666 && this.withNullValue ? -666 : '');
        // eslint-disable-next-line no-nested-ternary
        const Third = _Third || _Third === 0 ? _Third : (Second === -666 && this.withNullValue ? -666 : '');
        if (this.First === First && this.Second === Second && this.Third === Third) return;
        if (this.typeList[0]) this.setCondition([this.typeList[0], First]);
        if (this.typeList[1]) this.setCondition([this.typeList[1], Second]);
        if (this.typeList[2]) this.setCondition([this.typeList[2], Third]);
        this.getList();
      },
    },
  },
};
</script>
<style lang='scss'>
</style>
