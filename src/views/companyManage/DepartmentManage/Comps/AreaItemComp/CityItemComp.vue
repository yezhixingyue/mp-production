<template>
  <li>
    <p class="header hover-margin" @dblclick="onExtendClick" @click="onActiveIDClick(item.ID)"
    :class="{active: activeId === item.ID,'moving-tow': this.moving}">
      <span>{{item.Name}}</span>
      <span class="menu-btn" @dblclick.stop  @click="onManageSubClick" >
        <template v-if="item.Level < 3">
          <img src="@/assets/images/menu/setup.png" alt="">
          <span>管理子部门</span>
        </template>
      </span>
      <i v-if="localSortList.length" class="el-icon-arrow-right" :class="{extend: extend}" @dblclick.stop @click.stop="onExtendClick"></i>
      <i style="width:18px;" v-else></i>
    </p>
    <div class="countys" v-show="extend">
      <draggable
      :scroll="true"
      tag='ul'
      v-bind="dragOptions"
      v-model="localSortList"
      item-key="ID"
      group="three">
        <template #item="{element}">
          <li @click="onActiveIDClick(element.ID)" :class="{active: activeId === element.ID,'moving-tow': moving}">
            {{element.Name}}
          </li>
        </template>
      </draggable>
    </div>
  </li>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    activeId: {
      default: '',
    },
    departmentList: {
      type: Array,
    },
    moving: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    draggable,
  },
  data() {
    return {
      extend: true,
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        disabled: !this.moving,
        ghostClass: 'ghost',
      };
    },
    localSortList: {
      get() {
        return this.item.children || [];
      },
      set(val) {
        this.$emit('sortLast', val);
      },
    },
  },
  methods: {
    onExtendClick() {
      if (this.localSortList.length === 0) {
        return;
      }
      this.extend = !this.extend;
    },
    onActiveIDClick(id) {
      this.$emit('active', id);
    },
    onManageSubClick() { // 管理子区域
      if (this.item.Level < 3 && !this.moving) {
        this.$emit('subManage', this.item.ID);
      }
    },
  },
};
</script>
<style lang='scss' >
.moving-tow:hover {
    cursor: move;
  }
.menu-btn{
  display: flex;
  justify-content: flex-end;
  margin-right: 25px;
  align-items: center;
  &:hover {
    cursor: pointer;
    color: #585858;
  }
  span{
    margin-left: 11px;
  }
  img {
    width: 16px;
    height: 16px;
  }
}
.countys{
  li {
    padding: 10px;
    padding-left: 100px;
  }
}

</style>
