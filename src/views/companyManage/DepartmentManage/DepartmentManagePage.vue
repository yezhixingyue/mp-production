<template>
  <section class="mp-erp-basic-set-up-sell-area-set-up-page-wrap">
    <main>
      <LRWidthDragAutoChangeComp leftWidth='460px'>
        <template v-slot:left>
          <DepartmentManageLeft
           v-model='isSorting'
           :departmentList='departmentList'
           :departmentParentID='departmentParentID'
           @totalManage='onManageTotalClick'
           @subManage='onManageSubClick'
           @sort='onSortClick'
          />
        </template>
        <template v-slot:right>
          <DepartmentManageRight
           :departmentParentID='departmentParentID'
           :departmentList='departmentList'
            ref="oRight"
           @level1Submit='handleLevel1Submit'
          />
        </template>
      </LRWidthDragAutoChangeComp>
    </main>
  </section>
</template>

<script>
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import LRWidthDragAutoChangeComp from '@/components/common/General/LRWidthDragAutoChangeComp.vue';
import DepartmentManageLeft from './Comps/DepartmentManageLeft.vue';
import DepartmentManageRight from './Comps/DepartmentManageRight.vue';

export default {
  name: 'DepartmentManagePage',
  components: {
    LRWidthDragAutoChangeComp,
    DepartmentManageLeft,
    DepartmentManageRight,
  },
  data() {
    return {
      isSorting: false, // 是否正在排序中
      subAreaID: '', // 当前正在管理的子类ID
      departmentList: [],
      departmentParentID: -1,
    };
  },
  methods: {
    onManageTotalClick(needCheck) { // 点击管理一级部门
      const handler = async () => { // 切换执行函数
        this.departmentParentID = -1;
      };
      if (needCheck === true) {
        handler();
        return;
      }
      this.handleSwitch(handler);
    },
    onManageSubClick(ID) { // 点击管理子区域，此处应传递该子区域大区ID
      const handler = async () => {
        this.departmentParentID = ID;
      };

      this.handleSwitch(handler);
    },
    handleSwitch(handler) { // 处理右侧切换（ 根据情况看是否显示确认弹窗 ）
      if (this.$refs.oRight && (this.$refs.oRight.checkLevel1IsOrNotChange())) { // 此处判断右侧数据是否需要保存 -- 确认提示
        MpMessage.warn({
          title: '有数据未保存，确定切换区域吗',
          msg: '切换后未保存数据将丢失，如需继续请点击确认',
          onOk: handler,
        });
      } else {
        handler();
      }
    },
    onSortClick(Array) { // 点击保存排序
      if (this.$refs.oRight && (this.$refs.oRight.checkLevel1IsOrNotChange())) { // 此处判断右侧数据是否需要保存 -- 确认提示
        MpMessage.warn({
          title: '右侧有数据未保存，确定保存排序吗',
          msg: '保存排序将丢失改动内容，如需继续请点击确认',
          onOk: () => {
            this.handleSort(Array);
          },
        });
      } else {
        this.handleSort(Array);
      }
    },
    async handleSort(Array) { // 处理保存排序
      const resp = await this.api.getDepartmentOrder(Array).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        await this.getDepartmentList();
        MpMessage.success({ title: '保存排序成功' });
        this.isSorting = false;
      }
    },
    async handleLevel1Submit({ returnData, removeIds, callback }) {
      // 删除
      if (removeIds.length) {
        const removeRes = await api.getDepartmentRemove(removeIds.map(ID => ({ ID })));
        if (removeRes.status !== 200 || removeRes.data.Status !== 1000) return;
      }
      // 保存
      const res = await api.getDepartmentSave(returnData);
      if (res.status === 200 && res.data.Status === 1000) {
        await this.getDepartmentList();
        callback();
        MpMessage.success({ title: '保存成功' });
      }
    },
    async getDepartmentList() { // getDepartmentList 获取部门列表数据
      const res = await api.getDepartmentList();
      if (res && res.data.Status === 1000) {
        this.departmentList = res.data.Data;
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.getDepartmentList();
  },
};
</script>
<style lang='scss'>
.mp-erp-basic-set-up-sell-area-set-up-page-wrap {
  background: #f5f5f5;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding-left: 8px;
  > main {
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: hidden;
    padding: 20px;
    box-sizing: border-box;
  }
}
</style>
