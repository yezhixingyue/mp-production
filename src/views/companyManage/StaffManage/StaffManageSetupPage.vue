<template>
  <section class="wrap">
    <main>
      <LRWidthDragAutoChangeComp v-if="staffForm" leftWidth='450px'>
        <template v-slot:left>
          <StaffSetupLeftComp :staffForm='staffForm' ref="oLeft" />
        </template>
        <template v-slot:right>
          <div class="right-content-img-upload-box">
            <p class="mp-common-title-wrap">员工照片</p>
            <LicensePathPhotoComp v-model="staffForm.HeadPic" :options="photoOptions" @error="HeadPicError = true" @change="HeadPicError = false" cutting />
          </div>
        </template>
      </LRWidthDragAutoChangeComp>
    </main>
    <footer>
      <mp-button type="primary" @click="submit">保存</mp-button>
      <mp-button class="blue" @click="goback">＜＜ 返回</mp-button>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import api from '@/api';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import LRWidthDragAutoChangeComp from '@/components/common/General/LRWidthDragAutoChangeComp.vue';
import LicensePathPhotoComp from '@/components/common/LicensePathPhotoComp/LicensePathPhotoComp.vue';
import { useCompanyStore } from '@/store/modules/companyManage';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import StaffSetupLeftComp from './Comps/StaffSetupLeftComp.vue';
import { Staff } from './js/StaffClass';
import { IStaff } from './js/types';

const router = useRouter();
const companyStore = useCompanyStore();
const { StaffManagePageData } = storeToRefs(companyStore);

const staffForm = ref<null | Staff>(null);

const photoOptions = {
  width: 250,
  height: 350,
  limitWidth: 250,
  limitHeight: 350,
  title: '员工',
  fit: 'cover',
};
const HeadPicError = ref(false);

const init = async () => {
  if (!StaffManagePageData.value.curEditStaff) { // 新增
    staffForm.value = new Staff();
  } else { // 编辑
    const temp = {
      ID: StaffManagePageData.value.curEditStaff.StaffID,
      FieldType: 3,
    };
    const resp = await api.getStaffList(temp).catch(() => null);
    if (resp && resp.data.Status === 1000 && resp.data.Data?.[0]) {
      staffForm.value = new Staff(resp.data.Data[0]);
    }
  }
};

const goback = () => {
  router.replace('/StaffList');
};

const oLeft = ref<InstanceType<typeof StaffSetupLeftComp>>();

const submit = async () => {
  if (oLeft.value && staffForm.value) {
    const result: null | Staff = await oLeft.value.submit();
    if (!result) return;
    if (!staffForm.value.HeadPic || HeadPicError.value) {
      MpMessage.error({ title: '保存失败', msg: '请上传员工照片' });
      return;
    }
    result.HeadPic = staffForm.value.HeadPic;
    // 信息提取转换(性别、出生日期)
    const temp: Partial<IStaff | null> = result.getSubmitData();
    if (!temp) {
      MpMessage.error({ title: '保存失败', msg: '身份证号解析失败' });
      return;
    }
    if (!StaffManagePageData.value.showIntranet) {
      delete temp.UseIntranet;
    }
    // 提交
    const resp = await api.getStaffBaseInfoSave(temp).catch(() => null);
    if (resp && resp.data.Status === 1000) {
      const cb = () => {
        StaffManagePageData.value.getDataList(StaffManagePageData.value.condition.Page); // 暂定
        goback();
      };
      MpMessage.success({ title: '保存成功', onOk: cb, onCancel: cb });
    }
  }
};

onMounted(() => {
  init();
});

</script>

<script lang="ts">
export default {
  name: 'StaffManageSetupPage',
};
</script>

<style scoped lang='scss'>
.wrap {
  background-color: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  > main {
    flex: 1;
    overflow: hidden;
    .right-content-img-upload-box {
      padding-left: 120px;
      > p.mp-common-title-wrap {
        padding-bottom: 25px;
      }
    }
  }
  > footer {
    flex: none;
    height: 100px;
    box-sizing: border-box;
    padding-top: 35px;
    width: 450px;
    text-align: center;
    button {
      width: 100px;
      height: 30px;
      padding: 0;
      border-radius: 2px;
      & + button.el-button {
        margin-left: 20px;
      }
    }
  }
}
</style>
