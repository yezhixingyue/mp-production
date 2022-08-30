<template>
  <div class="set-dimensions-page">
    <header>
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/materialClassifyManage' }">物料类型管理</el-breadcrumb-item>
        <el-breadcrumb-item>尺寸规格：{{Data.CategoryName}}-{{Data.TypeName}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="header-top">
        <el-button type="primary" @click="Data.dialogShow = true">+ 添加尺寸</el-button>
      </div>
    </header>
    <main :style="`height:${h}px`">
      <MpCardContainer>
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
              <el-button type="primary" link @click="editDimensions(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</el-button>
              <el-button type="danger" link
                @click="delDimensions(scope.row)">
                <i class="iconfont icon-delete"></i>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="bottom-count-box">
          <MpPagination
          :nowPage="Data.getDimensisnsData.Page"
          :pageSize="Data.getDimensisnsData.PageSize"
          :total="Data.DataTotal"
          :handlePageChange="PaginationChange" />
        </div>
      </MpCardContainer>
    </main>
    <footer>
      <el-button type="primary" @click="$goback">返回</el-button>
    </footer>
    <DialogContainerComp
    :title="`${Data.addDimensionsForm.SizeID ? '修改' : '添加'}尺寸`"
    :visible='Data.dialogShow'
    :width="660"
    :primaryClick="primaryClick"
    :closeClick="closeClick"
    >
    <template #default>
      <div class="add-dimensions-dialog">
        <el-form :model="Data.addDimensionsForm" label-width="100px">
          <el-form-item label="尺寸名称：">
            <el-input :maxlength="30" v-model="Data.addDimensionsForm.SizeName" />
          </el-form-item>
          <el-form-item label="尺寸编码：">
            <el-input :maxlength="3" v-model="Data.addDimensionsForm.SizeCode" style="width:100px"/>
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
import MpCardContainer from '@/components/common/MpCardContainerComp.vue';
import MpPagination from '@/components/common/MpPagination.vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import {
  ref, reactive, onMounted, watch, onActivated,
} from 'vue';
import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import api from '@/api/request/MaterialStorage';
import { useRoute } from 'vue-router';
import messageBox from '@/assets/js/utils/message';
import { useCommonStore } from '@/store/modules/common';

export default {
  name: 'setDimensionsPage',
  components: {
    MpCardContainer,
    MpPagination,
    DialogContainerComp,
  },
  setup() {
    const h = ref(0);
    const CommonStore = useCommonStore();
    const route = useRoute();
    const Data = reactive({
      CategoryName: '',
      TypeName: '',
      dialogTitle: '添加属性',
      dialogShow: false,
      addDimensionsForm: {
        TypeID: 0,
        SizeID: null,
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
        TypeID: 0,
        Page: 0,
        PageSize: 20,
      },
    });
    function closeClick() {
      Data.dialogShow = false;
      Data.addDimensionsForm = {
        TypeID: Data.addDimensionsForm.TypeID,
        SizeID: null,
        SizeName: '',
        SizeCode: '',
        SizeLength: null,
        SizeWidth: null,
        SizeLengthIsChange: false,
        SizeWidthIsChange: false,
      };
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
            messageBox.successSingle(`${Data.addDimensionsForm.SizeID ? '修改' : '添加'}成功`, cb, cb);
          }
        });
      }
    }
    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.set-dimensions-page header', 72);
    }
    watch(() => CommonStore.size, () => {
      setHeight();
    });
    onActivated(() => {
      setHeight();
    });
    onMounted(() => {
      Data.CategoryName = route.params.CategoryName as string;
      Data.TypeName = route.params.TypeName as string;
      Data.getDimensisnsData.TypeID = Number(route.params.TypeID);
      Data.addDimensionsForm.TypeID = Number(route.params.TypeID);
      setHeight();
      getDimensisnsList();
    });
    return {
      h,
      Data,
      editDimensions,
      delDimensions,
      primaryClick,
      closeClick,
      PaginationChange,
    };
  },

};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.set-dimensions-page{
  >header{
    >.el-breadcrumb{
      margin-bottom: 20px;
    }
    >.header-top{
      margin-bottom: 20px;
    }
    >.mp-card-container{
      >.top-main{
        display: flex;
        justify-content: space-between;
        .mp-search-input-comp{
          display: flex;
        }
      }
    }
  }
  >main{
    margin-top: 20px;
    overflow-x: auto;
    >.mp-card-container{
      display: flex;
      flex-direction: column;
      height: 100%;
      .el-table{
        flex: 1;
        max-height: calc(100% - 21px);
      }
    }
  }
  >footer{
    padding-top: 20px;
    text-align: center;
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
          content: '!';
          width: 13px;
          height: 13px;
          margin: 0 10px;
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
