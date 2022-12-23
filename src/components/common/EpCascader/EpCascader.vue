<template>
  <div class="mp-common-comps-ep-cascader-comp-wrap" :class="{'show-line':showLine}">
    <span class="title" v-if="showTitle">{{title}}：</span>
    <el-popover
      placement="bottom-start"
      popper-class="mp-common-comps-ep-cascader-comp-popper-wrap"
      ref="oPop"
      transition="el-zoom-in-top"
      :visible="visible">
      <template #reference>
        <el-button :style="`width:${fiexdWidth ? fiexdWidth + 'px' : ''}`" ref="oBtn"
          size="small" class="btn" @click="onClick" :class="{active:visible,none:label.length===0&&!withEmpty}"
          >{{label.join(' / ')||(withEmpty?'不限':'请选择')}}<el-icon v-if="!showLine"><ArrowDown /></el-icon></el-button>
      </template>
      <div class="display-content" v-clickoutside="close">
        <ListComp
          v-for="(it, i) in cascaderList"
          :key="it.key"
          :list="it.list"
          :activeIds="activeIds"
          :selectedIds="modelValue"
          :rowIndex="i"
          :curLvActiveID="activeIds[i]"
          :curLvSelectID="modelValue[i]"
          :withEmpty="withEmpty"
          :withNullValue="withNullValue"
          :onlyLastValid="onlyLastValid"
          :defaultProps="defaultProps"
          :isLast="level ? i >= (level - 1) : false"
          @hoverItem="e => onItemHover(i, e)"
          @itemClick="onItemClick(i)"
        />
        <div class="empty" v-if="cascaderList.length === 0">
          <span>暂无数据</span>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { ClickOutside as Clickoutside } from 'element-plus';
import ListComp from './ListComp.vue';
import { debounce } from './assets/utils';

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
    withEmpty: {
      type: Boolean,
      default: true,
    },
    showLine: { // 显示样式
      type: Boolean,
      default: false,
    },
    defaultProps: {
      type: Object,
      default: () => ({
        ID: 'ID',
        Name: 'ClassName',
        children: 'children',
      }),
    },
    fiexdWidth: { // 是否固定宽度 如果传的有值则使用固定宽度
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: '产品',
    },
    onlyLastValid: { // 仅最后一个生效（可点击）
      type: Boolean,
      default: false,
    },
    level: { // 下拉展示等级数量  若要启用 则传入数值类型
      default: '',
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    withNullValue: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ListComp,
  },
  directives: {
    Clickoutside,
  },
  data() {
    return {
      visible: false,
      activeIds: [],
      cascaderList: [],
      popWrap: null,
      initialLeft: 0,
    };
  },
  computed: {
    localList() {
      return this.withEmpty ? [{ [this.defaultProps.ID]: '', [this.defaultProps.Name]: '不限' }, ...this.list] : this.list;
    },
    label() {
      let curList = this.localList;
      return this.modelValue.reduce((arr, id) => {
        const t = curList.find(it => it[this.defaultProps.ID] === id);
        if (t) {
          arr.push(t[this.defaultProps.Name]);
        }
        curList = t ? t[this.defaultProps.children] || [] : [];
        return arr;
      }, []);
    },
  },
  emits: ['update:modelValue', 'change'],
  methods: {
    close() {
      this.visible = false;
    },
    open() {
      this.visible = true;
      this.activeIds = [];
      this.setInitState();
    },
    onClick() {
      if (this.visible) {
        this.close();
      } else {
        this.open();
      }
    },
    getInitialLeft() {
      if (!this.$refs.oBtn || !this.$refs.oBtn.$el) return;
      const result = this.$refs.oBtn.$el.getBoundingClientRect();
      if (result) {
        this.initialLeft = result.left;
      }
    },
    async handleLeftChange() { // 处理左右位置的变化
      if (!this.popWrap) {
        this.popWrap = this.$refs.oPop.popperRef.contentRef;
      }
      if (!this.popWrap) return;
      await this.$nextTick();
      if (!this.initialLeft) {
        this.getInitialLeft();
      }
      if (!this.initialLeft) return;
      const totalWidth = this.popWrap.offsetWidth + this.initialLeft;
      const maxDisplayWidth = window.innerWidth;
      let dis = this.initialLeft;
      if (totalWidth > maxDisplayWidth) {
        dis = this.initialLeft - (totalWidth - maxDisplayWidth) - 10;
        if (dis < 0) dis = 0;
      }
      this.popWrap.style.left = `${dis}px`;
    },
    setInitState() { // 设置初始状态
      if (this.visible) {
        this.cascaderList = [{ list: this.localList, key: Math.random().toString(16).slice(-10) }];
        if (this.modelValue.length > 0) {
          this.activeIds = [...this.modelValue];
          this.modelValue.forEach(id => {
            const t = this.cascaderList[this.cascaderList.length - 1].list.find(_it => _it[this.defaultProps.ID] === id);
            if (t && t[this.defaultProps.children]) {
              const list = t[this.defaultProps.children];
              if (list.length > 0) {
                if (typeof this.level !== 'number' || this.cascaderList.length < this.level) {
                  this.cascaderList.push({ list: t[this.defaultProps.children], key: Math.random().toString(16).slice(-10) });
                }
              }
            }
          });
        }
        // 此处处理left值的变化
        this.handleLeftChange();
      }
    },
    onItemHover(index, it) {
      if (this.activeIds[index] === it[this.defaultProps.ID]) {
        this.activeIds = [...this.activeIds.slice(0, index), it[this.defaultProps.ID]];
        return;
      }
      this.activeIds = [...this.activeIds.slice(0, index), it[this.defaultProps.ID]];
      this.cascaderList.splice(index + 1);
      const t = this.cascaderList[this.cascaderList.length - 1].list.find(_it => _it[this.defaultProps.ID] === it[this.defaultProps.ID]);
      if (t && t[this.defaultProps.children]) {
        const list = t[this.defaultProps.children];
        if (list.length > 0) {
          if (typeof this.level !== 'number' || this.cascaderList.length < this.level) {
            this.cascaderList.push({ list: t[this.defaultProps.children], key: Math.random().toString(16).slice(-10) });
          }
        }
        // 此处处理left值的变化
        this.handleLeftChange();
      } else if (it[this.defaultProps.ID] === '' && this.withEmpty) {
        this.handleLeftChange();
      }
    },
    onItemClick(i) {
      if (this.onlyLastValid && i < this.cascaderList.length - 1) return;
      let _val = [...this.activeIds];
      if (_val.length === 1 && _val[0] === '') _val = [];
      if (JSON.stringify(_val) === JSON.stringify(this.modelValue)) {
        this.close();
        return;
      }
      this.$emit('update:modelValue', _val);
      this.$emit('change', _val);
      this.close();
      this.$nextTick(() => {
        window.dispatchEvent(new Event('resize'));
      });
    },
    handleResizeEventBind() {
      window.addEventListener('resize', this.onresize);
    },
    handleResizeEventRemove() {
      window.removeEventListener('resize', this.onresize);
    },
  },
  watch: {
    list() {
      this.setInitState();
    },
  },
  mounted() {
    this.onresize = debounce(this.getInitialLeft, 50);
    this.handleResizeEventBind();
  },
  beforeUnmount() {
    this.handleResizeEventRemove();
  },
  activated() {
    this.handleResizeEventBind();
  },
  deactivated() {
    this.handleResizeEventRemove();
  },

};
</script>
<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-common-comps-ep-cascader-comp-wrap {
  white-space: nowrap;
  display: inline-block;
  > .title {
    text-align: right;
    color: #444;
    font-size: 14px;
    font-weight: 700;
    min-width: 5em;
    display: inline-block;
    margin-right: 10px;
  }
  .btn {
    font-size: 13px;
    color: #444;
    min-width: 114px;
    text-align: left;
    border-radius: 4px;
    position: relative;
    box-sizing: border-box;
    line-height: 26px;
    padding: 0 30px 0 13px;
    transition: border-color 0.5s !important;
    background: #fff;
    height: 30px;
    .el-icon {
      position: absolute;
      right: 8px;
      top: 6px;
      color: #A8ABB2;
      font-size: 14px;
      transition: 0.3s ease;
    }
    // &::after {
    //   content: "";
    //   position: absolute;
    //   background: url('./assets/arrowbottom.png') no-repeat center;
    //   background-size: 100% 100%;
    //   height: 9px;
    //   width: 11px;
    //   right: 10px;
    //   top: 11px;
    //   background: none;
    //   border: 5px solid #eee;
    //   width: 0;
    //   height: 0;
    //   border-top-width: 6px;
    //   border-bottom-width: 0px;
    //   border-color: rgba($color: #000000, $alpha: 0);
    //   border-top-color: rgba($color: #000000, $alpha: 0.3);
    //   border-radius: 2px;
    // }
    &.none {
      color: #989898;
    }
    &:hover {
      border-color: #aaa;
      background: #fff;
    }
    &.active {
      border-color: $--color-primary;
      .el-icon {
        transform: rotate(180deg);
      }
    }
    > span {
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      display: inline-block;
      vertical-align: middle;
    }
  }
  &.show-line {
    .btn {
      height: auto;
      height: unset;
      border-left: none;
      border-right: none;
      border-top: none;
      border-radius: 0;
      line-height: 22px;
      padding: 0 7px 1px 5px;
      padding-right: 19px;
      margin-top: 1px;
      // &::after {
      //   top: 7px;
      //   right: 4px;
      // }
      .el-icon {
        top: 3px;
      }
      &::after {
        content: "";
        position: absolute;
        background-size: 100% 100%;
        height: 9px;
        width: 11px;
        right: 4px;
        top: 7px;
        background: none;
        border: 5px solid #eee;
        width: 0;
        height: 0;
        border-top-width: 6px;
        border-bottom-width: 0px;
        border-color: rgba($color: #000000, $alpha: 0);
        border-top-color: rgba($color: #000000, $alpha: 0.3);
        border-radius: 2px;
      }
    }
  }
}
.el-popover.mp-common-comps-ep-cascader-comp-popper-wrap {
  padding: 0;
  border: 1px solid #e4e7ed;
  width: unset !important;
  width: auto !important;
  .display-content {
    font-size: 14px;
    white-space: nowrap;
    .el-scrollbar {
      display: inline-block;
      vertical-align: top;
      border-right: 1px solid #e4e7ed;
      &:last-of-type {
        border-right: none;
      }
      .el-scrollbar__wrap {
        min-height: 204px;
        max-height: 260px;
        .el-scrollbar__view > ul {
          padding: 6px 0;
          > li {
            padding-left: 20px;
            padding-right: 30px;
            position: relative;
            height: 34px;
            > span.label {
              display: inline-block;
              padding: 5px 10px;
              line-height: 24px;
              min-width: 129px;
              box-sizing: border-box;
              overflow: hidden;
              white-space: nowrap;
            }
            > i.el-icon-arrow-right {
              position: absolute;
              right: 10px;
              top: 10px;
            }
            > i.el-icon-check {
              position: absolute;
              left: 10px;
              top: 10px;
            }
            &.selected {
              color: darken($color: $--color-primary, $amount: 10);
            }
            &.active, &:hover {
              color: $--color-primary;
              > span.label {
                font-weight: 700;
              }
            }
            &:hover {
              cursor: pointer;
              background-color: lighten($color: $--color-primary, $amount: 40);
            }
          }
        }
      }
    }
    > .empty {
      color: #989898;
      font-size: 13px;
      padding: 10px 15px;
      min-width: 129px;
    }
  }
}
</style>
