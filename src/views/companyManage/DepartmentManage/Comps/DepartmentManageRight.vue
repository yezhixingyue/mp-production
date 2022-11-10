<template>
  <section class="mp-erp-basic-set-up-sell-area-set-up-page-right-content-wrap">
    <header>
      <p class="mp-common-title-wrap">{{title}}</p>
    </header>
    <main>
      <Level1ManageComp :departmentList="departmentList" :departmentParentID="departmentParentID" :level1List='level1List' ref="oLevel1Comp"  />
    </main>
    <footer>
      <el-button type="primary" size="small" @click="onSubmitClick">保存</el-button>
    </footer>
  </section>
</template>

<script>
import Level1ManageComp from './Right/Level1ManageComp.vue';
// import SubAreaManageComp from './Right/SubAreaManageComp/index';

export default {
  props: {
    departmentList: {
      type: Array,
      default: () => [],
    },
    departmentParentID: {
      type: Number,
      default: -1,
    },
  },
  components: {
    Level1ManageComp,
    // SubAreaManageComp,
  },
  computed: {
    title() {
      if (this.departmentParentID === -1) return '一级部门';
      if (this.departmentParentID !== -1) return this.departmentList.find((item) => item.ID === this.departmentParentID).Name;
      return '子部门管理';
    },
    level1List() { // 当前一级部门数据（不含子部门）
      return this.departmentList.filter((item) => item.ParentID === this.departmentParentID);
      // return this.isManageRoot ? this.allAreaTreeList.map(it => ({ ...it, children: null, canRemove: !it.children || it.children.length === 0 })) : [];
    },
  },
  methods: {
    checkLevel1IsOrNotChange() { // 判断一级区域是否有改变
      return this.$refs.oLevel1Comp ? this.$refs.oLevel1Comp.getIsOrNotChange() : false;
    },
    // checkSubAreaIsOrNotChange() { // 判断子区域设置是否有改变
    //   return this.$refs.oSubAreaComp ? this.$refs.oSubAreaComp.getIsOrNotChange() : false;
    // },
    onSubmitClick() { // 提交
      const oLevel1CompData = this.$refs.oLevel1Comp.save();
      if (!oLevel1CompData) return;
      this.$emit('level1Submit', oLevel1CompData);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-basic-set-up-sell-area-set-up-page-right-content-wrap {
  display: flex;
  flex-direction: column;
  padding-left: 12px;
  height: 100%;
  overflow: hidden;
  font-size: 14px;
  color: #585858;
  min-width: 600px;
  > header {
    flex: none;
    padding-bottom: 20px;
  }
  > main {
    flex: 1;
    overflow: hidden;
  }
  > footer {
    flex: none;
    padding-top: 32px;
    padding-bottom: 12px;
    text-align: center;
    button {
      height: 30px;
      padding: 0;
      width: 100px;
      border-radius: 3px;
      & + button.el-button {
        margin-left: 20px;
      }
    }
  }
}
</style>
