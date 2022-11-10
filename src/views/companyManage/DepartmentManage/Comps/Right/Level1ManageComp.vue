<template>
  <ul class="mp-erp-basic-set-up-sell-area-set-up-page-right-content-level1-manage-wrap department-manage ml-10" ref="oWrap">
    <li v-for="(it, i) in localList" :key="it.ID || it.key">
      <div class="operate-row">
        <el-input v-model.trim="it.Name" class="mr-15 mp-line-input" maxlength="10" placeholder="在此输入区域名称" :disabled='it.Index === 999' />
        <AddMenu @click="onAddClick" />
        <RemoveMenu @click="onRemoveClick(it, i)" :disabled="!!childrenLingth(it.ID)" />
      </div>
    </li>

  </ul>
</template>

<script>
import { MpMessage } from '@/assets/js/utils/MpMessage';
import AddMenu from '@/components/common/menus/AddMenu.vue';
import RemoveMenu from '@/components/common/menus/RemoveMenu.vue';

export default {
  props: {
    level1List: {
      type: Array,
      default: () => [],
    },
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
    AddMenu,
    RemoveMenu,
  },
  data() {
    return {
      localList: [],
      // 被删除的id列表
      removeIds: [],
    };
  },
  computed: {
    childrenLingth() {
      return (id) => this.departmentList.filter((item) => item.ParentID === id).length;
    },
  },
  methods: {
    getIsOrNotChange() { // 是否发生变化 （切换时使用）
      const list = this.localList.filter(it => it.Name);
      return JSON.stringify(list) !== JSON.stringify(this.level1List);
    },
    createAAreaItem() {
      const temp = {
        Name: '',
        ID: '',
        Index: this.localList.length,
        Level: 1,
        ParentID: this.departmentParentID,
        Type: 1,
        canRemove: true,
        key: Math.random().toString(16).slice(-10),
      };
      return temp;
    },
    async onAddClick() { // 添加一行
      this.localList.push(this.createAAreaItem());
      await this.$nextTick();
      if (this.$refs.oWrap) this.$refs.oWrap.scrollTop = 10000;
    },
    onRemoveClick(it, i) { // 删除一行
      if (this.childrenLingth(it.ID)) return;
      if (!it.ID) { // 没有ID时可以直接删除
        this.localList.splice(i, 1);
        return;
      }
      MpMessage.warn({
        title: '确定删除该部门吗',
        msg: `部门名称：[ ${it.Name || '未设置'} ]`,
        onOk: () => {
          this.removeIds.push(it.ID);
          this.localList.splice(i, 1);
        },
      });
    },
    save() {
      const returnData = this.localList.filter((item) => item.Name !== '');
      const clearRemoveIds = () => {
        this.removeIds = [];
      };
      return { returnData, removeIds: this.removeIds, callback: clearRemoveIds };
    },
  },
  mounted() {
    this.localList = JSON.parse(JSON.stringify(this.level1List)) || [];
    this.localList.push(this.createAAreaItem());
  },
  watch: {
    level1List(newVal) {
      this.localList = JSON.parse(JSON.stringify(newVal)) || [];
      this.localList.push(this.createAAreaItem());
    },
    departmentParentID() {
      this.removeIds = [];
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-basic-set-up-sell-area-set-up-page-right-content-level1-manage-wrap {
  max-height: 100%;
  overflow: auto;
  scroll-behavior: smooth;
  &.department-manage{

    >li{
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }
  > li {
    margin-bottom: 12px;
    > .operate-row {
      display: flex;
      align-items: center;
      justify-content: left;
      > .el-input {
        width: 240px;
        > input {
          font-weight: 700;
          border-left: none;
          border-right: none;
          border-top: none;
          padding: 0;
        }
        &.is-disabled .el-input__inner {
          background-color: #fcfcfc;
        }
      }

      > .el-button:hover{
        color: red;
      }
    }
  }
}
</style>
