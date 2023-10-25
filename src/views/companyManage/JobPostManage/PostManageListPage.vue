<template>
  <section class="mp-erp-post-manage-list-page-wrap">
    <header>
      <p class="mp-common-title-wrap">岗位管理</p>
    </header>
    <main >
      <div v-if="JobPostManagePageData.list.length === 0 && !JobPostManagePageData.loading" class="em">
        <AddMenu title="添加一行" @click="onAddClick" />
      </div>
      <ul ref="oScrollBox">
        <li v-for="(it, i) in JobPostManagePageData.list" :key="it.PositionID || it.key">
          <el-input :modelValue="it.PositionName" @input="e => onInput(e, i)" placeholder="" maxlength="10" />
          <span v-if="localPermission?.SetupPermission" class="is-blue-span ft-13 mr-25" @click="onPermissionSetupClick(it)"
           :class="{disabled: !it.PositionID}">权限设置</span>
          <RemoveMenu @click='onRemoveClick(it, i)' />
          <AddMenu title="添加一行" @click="onAddClick" />
        </li>
      </ul>
    </main>
    <footer>
      <mp-button
        type='primary'
        class="is-blue-button"
        :disabled='!JobPostManagePageData.list || JobPostManagePageData.list.length === 0'
        @click="onSubmitClick">
       保存
      </mp-button>
    </footer>
  </section>
</template>

<script lang="ts" setup>
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import AddMenu from '@/components/common/menus/AddMenu.vue';
import RemoveMenu from '@/components/common/menus/RemoveMenu.vue';
import { useCompanyStore } from '@/store/modules/companyManage';
import { storeToRefs } from 'pinia';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { useRouter } from 'vue-router';
import { IJobPost } from './js/types';

const userStore = useUserStore();
const localPermission = computed(() => userStore.user?.PermissionList.PermissionManageJob.Obj);

const router = useRouter();

const companyStore = useCompanyStore();
const { JobPostManagePageData } = storeToRefs(companyStore);

const onInput = (value, index) => { // 岗位名称修改
  JobPostManagePageData.value.setItemChange([value, index]);
};

const onRemoveClick = (item: IJobPost, index: number) => {
  if (!item.PositionID && !item.PositionName) {
    JobPostManagePageData.value.list.splice(index, 1);
    return;
  }
  MpMessage.warn({
    title: '确定删除该岗位吗 ?',
    msg: item.PositionName ? `岗位名称：[ ${item.PositionName} ]` : '岗位名称为空',
    onOk: () => {
      JobPostManagePageData.value.list.splice(index, 1);
    },
  });
};

const oScrollBox = ref<InstanceType<typeof HTMLElement>>();

const onAddClick = async () => {
  const temp = {
    PositionID: '',
    PositionName: '',
    key: Math.random().toString(16).slice(-8),
  };
  JobPostManagePageData.value.list.push(temp);
  if (oScrollBox.value) {
    await nextTick();
    oScrollBox.value.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
};

const onPermissionSetupClick = ({ PositionID }: IJobPost) => {
  if (!PositionID) {
    return;
  }
  router.push({ name: 'PostManageSetup', params: { PositionID } });
};

const onSubmitClick = async () => { // 处理： 岗位ID为空，保存后的处理
  const t = JobPostManagePageData.value.list.find(it => !it.PositionName || it.PositionName.length > 10);
  if (t) {
    MpMessage.error({ title: '保存失败', msg: '职务名称不能为空且不能超过10个字' });
    return;
  }
  const resp = await api.getJobSave(JobPostManagePageData.value.list).catch(() => null);
  if (resp && resp.data.Status === 1000) {
    const cb = () => {
      JobPostManagePageData.value.list = resp.data.Data as IJobPost[];
    };
    MpMessage.success({ title: '保存成功', onOk: cb, onCancel: cb });
  }
};

onMounted(() => {
  JobPostManagePageData.value.getList();
});

</script>

<script lang="ts">
export default {
  name: 'PostManageListPage',
};
</script>
<style lang='scss'>
.mp-erp-post-manage-list-page-wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  padding-right: 4px;
  background-color: #fff;
  > header {
    flex: none;
    padding: 25px 35px;
    height: 70px;
    box-sizing: border-box;
  }
  > main {
    flex: 1;
    padding: 0 35px;
    overflow-y: auto;
    box-sizing: border-box;
    min-width: 800px;
    .em {
      line-height: 32px;
    }
    > ul {
      > li {
        font-size: 14px;
        margin-bottom: 12px;
        > .el-input {
          width: 160px;
          input {
            text-align: center;
            padding: 0 8px;
            font-size: 14px;
            color: #585858;
            border-radius: 3px;
            border-color: #aaa;
          }
          margin-right: 65px;
        }
        > .blue-span {
          margin-right: 40px;
        }
        > .ctrl-menus-container {
          > span {
            > i {
              font-size: 14px;
            }
            & + span {
              margin-left: 25px;
            }
          }
        }
      }
    }
  }
  > footer {
    flex: none;
    height: 70px;
    text-align: center;
    padding-top: 30px;
    button {
      width: 120px;
      height: 35px;
      padding: 0;
      border-radius: 3px;
    }
  }
}
</style>
