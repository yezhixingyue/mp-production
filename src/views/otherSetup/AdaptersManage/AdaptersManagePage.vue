<template>
  <section class="mp-erp-factory-adapters-manage-page-wrap">
    <header>
      <mp-button v-if="user && user.PermissionList.PermissionConvertServer.Obj.Setup" type="primary" @click="onAdapterEditClick(null, -1)">添加转换服务器</mp-button>
    </header>
    <main>
      <AdaptersManageTable :canSetup="user && user.PermissionList.PermissionConvertServer.Obj.Setup"
       :list="ConvertServerList" :loading="loading" @edit="onAdapterEditClick" @remove="onAdapterRemoveClick" />
      <AdaptersManageDialog :item="curEditData" v-model:visible="visible" :list="ConvertServerList" @saved="onItemSaved" />
    </main>
  </section>
</template>

<script>
import AdaptersManageDialog from '@/components/otherSetup/AdaptersManage/AdaptersManageDialog.vue';
import AdaptersManageTable from '@/components/otherSetup/AdaptersManage/AdaptersManageTable.vue';
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { mapState } from 'pinia';
import { useUserStore } from '@/store/modules/user';

export default {
  name: 'AdaptersManagePage',
  components: {
    AdaptersManageDialog,
    AdaptersManageTable,
  },
  data() {
    return {
      visible: false,
      curEditData: null,
      curEditDataIndex: -1,
      ConvertServerList: [],
      loading: false,
    };
  },
  computed: {
    ...mapState(useUserStore, ['user']),
  },
  methods: {
    onAdapterEditClick(editData, index) {
      this.curEditData = editData;
      this.curEditDataIndex = index;
      this.visible = true;
    },
    onItemSaved(item) { // 添加|编辑 成功后的处理
      if (this.curEditDataIndex > -1) {
        this.ConvertServerList.splice(this.curEditDataIndex, 1, item);
      } else {
        this.ConvertServerList.unshift(item);
      }
      this.visible = false;
    },
    async getConvertServerList() {
      this.loading = true;
      const resp = await api.getConvertServerList().catch(() => null);
      this.loading = false;
      if (resp && resp.data.Status === 1000) {
        this.ConvertServerList = resp.data.Data || [];
      }
    },
    async onAdapterRemoveClick(item, index) {
      const resp = await api.getConvertServerRemove(item.ID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.ConvertServerList.splice(index, 1);
        };
        MpMessage.success({
          title: '删除成功', onOk: cb, onCancel: cb,
        });
      }
    },
  },
  mounted() {
    this.getConvertServerList();
  },
};
</script>
<style lang='scss'>
.mp-erp-factory-adapters-manage-page-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  > header {
    flex: none;
    display: flex;
    align-items: center;
    height: 75px;
    background-color: #fff;
    padding-left: 20px;
    > :deep(.el-button) {
      width: 130px;
      height: 30px;
      border-radius: 3px;
      margin-right: 40px;
    }
  }
  > main {
    flex: 1;
    margin-top: 10px;
    background-color: #fff;
    overflow: hidden;
    > .el-table {
      height: 100%;
      // width: 900px;
    }
  }
}
</style>
