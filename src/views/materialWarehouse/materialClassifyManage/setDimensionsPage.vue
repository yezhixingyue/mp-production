<template>
  <div class="set-dimensions-page">
    <header>
      <MpBreadcrumb :list="BreadcrumbList"></MpBreadcrumb>
      <div class="header-top">
        <mp-button type="primary" @click="Data.dialogShow = true">+ 添加尺寸</mp-button>
      </div>
    </header>
    <main>
        <el-table border fit
        :data="Data.dimensisnsList" style="width: 100%">

          <el-table-column prop="SizeName" label="尺寸名称" min-width="315">
            <template #default="scope">
              {{scope.row.SizeName}}
            </template>
          </el-table-column>
          <el-table-column prop="SizeCode" label="尺寸编码" min-width="315">
            <template #default="scope">
              {{scope.row.SizeCode}}
            </template>
          </el-table-column>
          <el-table-column prop="SizeLength" label="长度" min-width="287">
            <template #default="scope">
              {{scope.row.SizeLength}}mm{{scope.row.SizeLengthIsChange?'（长度可加工）':''}}
            </template>
          </el-table-column>
          <el-table-column prop="SizeWidth" label="宽度" min-width="287">
            <template #default="scope">
              {{scope.row.SizeWidth}}mm{{scope.row.SizeWidthIsChange?'（宽度可加工）':''}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" min-width="287">
            <template #default="scope">
              <mp-button type="info" link @click="editDimensions(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</mp-button>
              <mp-button type="info" link
                @click="delDimensions(scope.row)">
                <i class="iconfont icon-delete"></i>删除</mp-button>
            </template>
          </el-table-column>
        </el-table>
    </main>
    <footer>
      <mp-button class="blue" @click="$goback">返回</mp-button>
      <div class="bottom-count-box">
        <MpPagination
        :nowPage="Data.getDimensisnsData.Page"
        :pageSize="Data.getDimensisnsData.PageSize"
        :total="Data.DataTotal"
        :handlePageChange="PaginationChange" />
      </div>
    </footer>
    <DialogContainerComp
    :title="`${Data.addDimensionsForm.SizeID ? '修改' : '添加'}尺寸`"
    :visible='Data.dialogShow'
    :width="660"
    :primaryClick="primaryClick"
    :closeClick="closeClick"
    :closed="closeedClick"
    >
    <template #default>
      <div class="add-dimensions-dialog">
        <el-form :model="Data.addDimensionsForm" label-width="100px">
          <el-form-item label="尺寸名称：">
            <el-input :maxlength="30" v-model="Data.addDimensionsForm.SizeName" />
          </el-form-item>
          <el-form-item label="尺寸编码：">
            <el-input :maxlength="3" v-model.trim="Data.addDimensionsForm.SizeCode" style="width:100px"/>
          </el-form-item>
          <p class="hint">编码由 1 到 3 位的英文字母或数字组成，附在物料编码之后，可快速定位具体物料尺寸</p>
          <el-form-item label="长度：">
            <el-input-number :max="999999999"
            v-model="Data.addDimensionsForm.SizeLength" :controls="false"/>
            mm
            <el-checkbox v-model="Data.addDimensionsForm.SizeLengthIsChange"
            label="长度可加工"/>
          </el-form-item>
          <el-form-item label="宽度：">
            <el-input-number :max="999999999"
            v-model="Data.addDimensionsForm.SizeWidth" :controls="false"/>
            mm
            <el-checkbox v-model="Data.addDimensionsForm.SizeWidthIsChange"
            label="宽度可加工"/>
          </el-form-item>
        </el-form>
        <div class="Prompt">
          <p>1.所有尺寸必须大于零，也不能设置为无限尺寸。</p>
          <p>2.尺寸可加工指的是该物料是否可以改变固有尺寸，例如纸张开白料。</p>
        </div>
      </div>
    </template>
    </DialogContainerComp>
  </div>
</template>

<script lang='ts'>
import MpPagination from '@/components/common/MpPagination.vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { reactive, onMounted, computed } from 'vue';
import api from '@/api';
import { useRoute } from 'vue-router';
import messageBox from '@/assets/js/utils/message';
import MpBreadcrumb from '@/components/common/ElementPlusContainners/MpBreadcrumb.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';

export default {
  name: 'setDimensionsPage',
  components: {
    MpPagination,
    DialogContainerComp,
    MpBreadcrumb,
  },
  setup() {
    const route = useRoute();
    const Data = reactive({
      CategoryName: '',
      TypeName: '',
      dialogTitle: '添加属性',
      dialogShow: false,
      addDimensionsForm: {
        TypeID: '',
        SizeID: '',
        SizeName: '',
        SizeCode: '',
        SizeLength: null,
        SizeWidth: null,
        SizeLengthIsChange: false,
        SizeWidthIsChange: false,
      },
      dimensisnsList: [],
      DataTotal: 0,
      getDimensisnsData: {
        TypeID: '',
        Page: 0,
        PageSize: 20,
      },
    });

    const BreadcrumbList = computed(() => [
      { to: { path: '/materialClassifyManage' }, name: '物料类型管理' },
      { name: `尺寸规格：${Data.CategoryName}-${Data.TypeName}` },
    ]);
    function closeedClick() {
      Data.addDimensionsForm = {
        TypeID: Data.addDimensionsForm.TypeID,
        SizeID: '',
        SizeName: '',
        SizeCode: '',
        SizeLength: null,
        SizeWidth: null,
        SizeLengthIsChange: false,
        SizeWidthIsChange: false,
      };
    }
    function closeClick() {
      Data.dialogShow = false;
    }
    function getDimensisnsList() {
      api.getMaterialTypeSizeList(Data.getDimensisnsData).then(res => {
        if (res.data.Status === 1000) {
          Data.dimensisnsList = res.data.Data as never[];
          Data.DataTotal = res.data.DataNumber as number;
        }
      });
    }
    function PaginationChange(newVal) {
      if (Data.getDimensisnsData.Page === newVal) return;
      Data.getDimensisnsData.Page = newVal;
      getDimensisnsList();
    }
    function editDimensions(item) {
      Data.dialogShow = true;
      Data.addDimensionsForm = { ...item };
    }
    function setStorage() { // 设置会话存储
      sessionStorage.setItem('updataMaterialClassifyManagePage', 'true');
    }
    function delDimensions(item) {
      messageBox.warnCancelBox('确定要删除此尺寸吗？', `${item.SizeName}`, () => {
        api.getMaterialTypeSizeRemove(item.SizeID).then(res => {
          if (res.data.Status === 1000) {
          // 删除成功
            getDimensisnsList();
            setStorage();
          }
        });
      }, () => undefined);
    }

    function primaryClick() {
      if (!Data.addDimensionsForm.SizeName) {
        messageBox.failSingleError('保存失败', '请输入尺寸名称', () => null, () => null);
      } else if (!Data.addDimensionsForm.SizeCode) {
        messageBox.failSingleError('保存失败', '请输入尺寸编码', () => null, () => null);
      } else if (!Data.addDimensionsForm.SizeLength) {
        messageBox.failSingleError('保存失败', '请输入尺寸长度', () => null, () => null);
      } else if (!Data.addDimensionsForm.SizeWidth) {
        messageBox.failSingleError('保存失败', '请输入尺寸宽度', () => null, () => null);
      } else {
        api.getMaterialTypeSizeSave(Data.addDimensionsForm).then(res => {
          if (res.data.Status === 1000) {
            // 成功
            const cb = () => {
              closeClick();
              getDimensisnsList();
              setStorage();
            };
              // 成功
            MpMessage.dialogSuccess(`${Data.addDimensionsForm.SizeID ? '修改' : '添加'}成功`, cb, cb);
          }
        });
      }
    }

    onMounted(() => {
      Data.CategoryName = route.params.CategoryName as string;
      Data.TypeName = route.params.TypeName as string;
      Data.getDimensisnsData.TypeID = route.params.TypeID as string;
      Data.addDimensionsForm.TypeID = route.params.TypeID as string;
      getDimensisnsList();
    });
    return {
      BreadcrumbList,
      Data,
      editDimensions,
      delDimensions,
      primaryClick,
      closeClick,
      closeedClick,
      PaginationChange,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.set-dimensions-page{
  display: flex;
  flex-direction: column;
  height: 100%;
  >header{
    padding: 20px;
    background-color: #fff;
    >.el-breadcrumb{
      margin-bottom: 20px;
    }
  }
  >main{
    flex: 1;
    margin-top: 10px;
    overflow-x: auto;
      .el-table{
        height: 100%;
        flex: 1;
      }
    background-color: #fff;
  }
  >footer{
    background-color: #fff;
    min-height: 50px;
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .bottom-count-box{
      width: calc((100% - 100px) / 2);
      justify-content: flex-end;
      display: flex;
      align-items: center;
      min-width: 639px;
    }
    .el-button{
      width: 100px;
    }
  }
  .add-dimensions-dialog{
    .el-form{
      .hint{
        font-size: 12px;
        line-height: 30px;
        color: #F4A307;
        text-align: center;
        margin-bottom: 20px;
        &::before{
          content: '';
          background-image: url('@/assets/images/warn.png');
          display: inline-block;
          background-size: 13px 13px;
          width: 13px;
          height: 13px;
          margin: 0 10px;
          position: relative;
          left: 0;
          top: 2px;
        }
      }
      .el-form-item{
        margin: 0 auto;
        margin-bottom: 12px;
        width: 370px;
        .el-input-number{
          margin-right: 10px;
          width: 100px;
        }
        .el-checkbox{
          margin-left: 20px;
        }
      }
    }
    .Prompt{
      padding: 0 90px;
      font-size: 12px;
      text-indent: -0.8em;
      color: #F4A307;
      line-height: 30px;
      margin-top: 45px;
      p{
        padding-left: 20px;
      }
    }
  }
}
</style>
