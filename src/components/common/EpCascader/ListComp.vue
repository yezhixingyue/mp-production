<template>
  <el-scrollbar ref="oWrap">
    <ul>
      <li
         v-for="(it, i) in list"
         :key="i"
         @mouseenter="onmouseenter(it)"
         @click="onClick(it)"
         @keydown="onClick(it)"
         @focus="() => {}"
         :class="{
          active: (curLvActiveID===it[defaultProps.ID]) || (activeIds.length===0&&it[defaultProps.ID]===''&&withEmpty),
          selected: (curLvSelectID===it[defaultProps.ID]&&(activePathString===selectPathString||rowIndex===0))
          || (selectedIds.length===0&&it[defaultProps.ID]===''&&withEmpty),
        }">
         <el-icon class="el-icon-check"
         v-show="((curLvSelectID===it[defaultProps.ID] && selectedIds[selectedIds.length - 1] === it[defaultProps.ID])
          && isLast && activePathString === selectPathString)
           || (selectedIds.length === 0 && it[defaultProps.ID] === ''&&withEmpty)"><Check /></el-icon>
        <span class="label">{{it[defaultProps.Name]}}</span>
        <el-icon class="el-icon-arrow-right" v-show="it.children && it.children.length > 0 && !isLast"><ArrowRight /></el-icon>
      </li>
    </ul>
  </el-scrollbar>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    activeIds: {
      type: Array,
      default: () => [],
    },
    selectedIds: {
      type: Array,
      default: () => [],
    },
    rowIndex: {},
    withEmpty: {
      type: Boolean,
      default: false,
    },
    defaultProps: {
      type: Object,
      default: null,
      required: true,
    },
    isLast: {
      type: Boolean,
      default: false,
    },
    withNullValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['hoverItem', 'itemClick'],
  computed: {
    curLvActiveID() {
      return this.activeIds[this.rowIndex] || '';
    },
    curLvSelectID() {
      return this.selectedIds[this.rowIndex] || '';
    },
    selectPathString() {
      const list = this.selectedIds.slice(0, this.rowIndex);
      return JSON.stringify(list);
    },
    activePathString() {
      const list = this.activeIds.slice(0, this.rowIndex);
      return JSON.stringify(list);
    },
  },
  methods: {
    onmouseenter(it) {
      this.$emit('hoverItem', it);
    },
    onClick(it) {
      this.$emit('itemClick', it);
    },
  },
  mounted() {
    // 创建的时候 根据selected的状态 设置滚动条的高度 -- 让其显示在视野的范围内
    if (!this.$refs.oWrap) return;
    const scrollWrap = this.$refs.oWrap.$el.querySelector('.el-scrollbar__wrap');
    const selected = this.$refs.oWrap.$el.querySelector('ul > li.selected');
    if (!scrollWrap || !selected) return;
    const wrapOffsetHeight = this.$refs.oWrap.$el.offsetHeight;
    const selectedOffsetTop = selected.offsetTop;
    const selectedoffsetHeight = selected.offsetHeight;
    const dis = selectedOffsetTop + selectedoffsetHeight - wrapOffsetHeight;
    if (dis <= 0) return;
    scrollWrap.scrollTop = dis;
  },
};
</script>
<style lang='scss'>
</style>
