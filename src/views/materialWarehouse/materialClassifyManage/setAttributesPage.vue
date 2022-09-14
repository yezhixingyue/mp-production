<template>
  <div class="set-attributes-page">
    <header>
      <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/materialClassifyManage' }">物料类型管理</el-breadcrumb-item>
        <el-breadcrumb-item>设置属性：{{Data.CategoryName}}-{{Data.TypeName}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="header-top">
        <el-button type="primary" @click="Data.dialogShow = true">+ 添加属性</el-button>
      </div>
    </header>
    <main :style="`height:${h}px`">
      <MpCardContainer>
        <el-table border fit
        :data="Data.AttributesList" style="width: 100%">
          <el-table-column prop="AttributeName" label="名称" min-width="209" />
          <el-table-column prop="AttributeType" label="类型" min-width="218">
            <template #default="scope">
              {{scope.row.AttributeType === 1 ? '数字值' : '选择项'}}
            </template>
          </el-table-column>
          <el-table-column prop="RegularQuantity" label="描述" min-width="658">
            <template #default="scope">
              <template v-if="scope.row.AttributeType === 1">
                单位：{{scope.row.AttributeUnit}}；
                是否必填：{{scope.row.IsRequired?'必填':'非必填'}}；
                自定义值：{{scope.row.IsCustom?'允许':'不允许'}}；
                允许小数：{{scope.row.IsAllowDecimal?'允许':'不允许'}}；
              </template>
              <template v-else>
                选项数量：{{scope.row.AttributeSelects?.length}}；
                是否必选：{{scope.row.IsRequired?'必选':'非必选'}}；
                自定义值：{{scope.row.IsCustom?'允许':'不允许'}}；
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="Sort" label="显示顺序" min-width="176" />
          <el-table-column prop="name" label="操作" min-width="295">
            <template #default="scope">
              <el-button type="primary" link @click="editAttributes(scope.row)">
                <i class="iconfont icon-bianji"></i>编辑</el-button>
              <el-button type="danger" link
                @click="delAttributes(scope.row)">
                <i class="iconfont icon-delete"></i>删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </MpCardContainer>
    </main>
    <footer>
      <el-button type="primary" class="is-goback-button" @click="$goback">返回</el-button>
      <div class="bottom-count-box">
        <MpPagination
        :nowPage="Data.getAttributesData.Page"
        :pageSize="Data.getAttributesData.PageSize"
        :total="Data.DataTotal"
        :handlePageChange="PaginationChange" />
      </div>
    </footer>
    <DialogContainerComp
    :title="`${Data.addAttributesForm.AttributeID ? '修改' : '添加'}属性`"
    :visible='Data.dialogShow'
    :width="660"
    :primaryClick="primaryClick"
    :closeClick="closeClick"
    :closed="closed"
    >
    <template #default>
      <div class="add-attributes-dialog">
        <el-form :model="Data.addAttributesForm" label-width="82px">
          <el-form-item label="名称：">
            <el-input v-model="Data.addAttributesForm.AttributeName" />
          </el-form-item>
          <el-form-item label="显示顺序：">
            <el-input v-model="Data.addAttributesForm.Sort" style="width:100px"/>
            <span class="hint">数字越小显示越靠前</span>
          </el-form-item>
          <el-form-item label="类型：">
            <!-- <el-input v-model="Data.addAttributesForm.AttributeType" /> -->
            <el-radio-group v-model="Data.addAttributesForm.AttributeType">
              <el-radio :label="1" :value='1' size="small">数字值</el-radio>
              <el-radio :label="2" :value='2' size="small">选择项</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="Data.addAttributesForm.AttributeType === 1">
            <el-form-item label="数值类型：">
              <el-checkbox v-model="Data.addAttributesForm.IsAllowDecimal"
              label="允许小数"/>
            </el-form-item>
            <el-form-item label="常规数值：">
              <el-input v-model="Data.addAttributesForm.RegularQuantity" />
              <p class="hint">可为空，用空格、逗号分开，分隔符不限全角半角</p>
            </el-form-item>
            <el-form-item label="单位：">
              <el-input v-model="Data.addAttributesForm.AttributeUnit"  style="width:100px"/>
            </el-form-item>
          </template>
          <template v-if="Data.addAttributesForm.AttributeType === 2">
            <el-form-item label="选项：" style="margin-bottom:8px">
              <div class="attribute-selects">
                <p><el-button type="primary" link @click="addAttributeSelect">添加一行</el-button></p>
                  <el-scrollbar>
                <div style="max-height:222px;padding-right:10px">
                    <p v-for="(item, index) in Data.addAttributesForm.AttributeSelects"
                      :key="item.SelectID">
                      <el-input v-model="item.SelectItemValue" />
                      <el-button type="primary"
                        :disabled="index===0" link @click="toUp(index)">
                        上移
                      </el-button>
                      <el-button type="primary"
                        :disabled="index===Data.addAttributesForm.AttributeSelects.length-1" link
                        @click="toDown(index)">
                        下移
                      </el-button>
                      <el-button type="danger" link @click="delAttributeSelect(index)">删除</el-button>
                    </p>
                </div>
                  </el-scrollbar>
              </div>
            </el-form-item>
          </template>
          <el-form-item label="是否必填：">
            <el-checkbox v-model="Data.addAttributesForm.IsRequired"
            label="必填项"/>
          </el-form-item>
          <el-form-item label="自定义值：">
            <el-checkbox v-model="Data.addAttributesForm.IsCustom"
            label="允许自定义"/>
          </el-form-item>
        </el-form>
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
  ref, reactive, onMounted, nextTick, watch, onActivated,
} from 'vue';
import autoHeightMixins from '@/assets/js/mixins/autoHeight';
import api from '@/api/request/MaterialStorage';
import { useRoute } from 'vue-router';
import messageBox from '@/assets/js/utils/message';
import { useCommonStore } from '@/store/modules/common';

interface AttributeSelectsType {
    SelectID: string,
    Sort: number,
    SelectItemValue: string
}
interface AttributeType {
   AttributeID: string,
   AttributeName: string,
   Sort: number,
   AttributeType: number,
   IsAllowDecimal: true,
   RegularQuantity: string,
   AttributeUnit: string,
   IsRequired: true,
   IsCustom: true,
   AttributeSelects: AttributeSelectsType[]
}
interface DataType {
   AttributesList:AttributeType[],
   [key:string]:any
}

export default {
  name: 'setAttributesPage',
  components: {
    MpCardContainer,
    MpPagination,
    DialogContainerComp,
  },
  setup() {
    const h = ref(0);
    const CommonStore = useCommonStore();
    const dialog = ref(false);
    const route = useRoute();
    const Data:DataType = reactive({
      CategoryName: '',
      TypeName: '',
      dialogTitle: '添加属性',
      dialogShow: false,
      AttributesList: [],
      addAttributesForm: {
        TypeID: '',
        AttributeID: '',
        AttributeName: '',
        Sort: 0,
        AttributeType: 1,
        IsAllowDecimal: true,
        RegularQuantity: '',
        AttributeUnit: '',
        IsRequired: true,
        IsCustom: true,
        AttributeSelects: [
          // {
          //   SelectID: 0,
          //   Sort: 0,
          //   SelectItemValue: 'string',
          // },
        ],

      },
      DataTotal: 0,
      getAttributesData: {
        TypeID: '',
        Page: 1,
        PageSize: 20,
      },
    });

    function closeClick() {
      Data.dialogShow = false;
    }
    function closed() {
      Data.addAttributesForm = {
        TypeID: Data.addAttributesForm.TypeID,
        AttributeID: '',
        AttributeName: '',
        Sort: 0,
        AttributeType: 1,
        IsAllowDecimal: true,
        RegularQuantity: '',
        AttributeUnit: '',
        IsRequired: true,
        IsCustom: true,
        AttributeSelects: [],

      };
    }
    function getAttributesList() {
      console.log(Data.getAttributesData, 'Data.getAttributesData');

      api.getMaterialTypeAttributeList(Data.getAttributesData).then(res => {
        if (res.data.Status === 1000) {
          Data.AttributesList = res.data.Data as AttributeType[];
          Data.DataTotal = res.data.DataNumber as number;
        }
      });
    }
    function PaginationChange(newVal) {
      if (Data.getAttributesData.Page === newVal) return;
      Data.getAttributesData.Page = newVal;
      getAttributesList();
    }
    function editAttributes(AttributesItem:AttributeType) {
      console.log(AttributesItem);
      console.log(AttributesItem.AttributeSelects);

      Data.addAttributesForm = { TypeID: Data.addAttributesForm.TypeID, ...AttributesItem };
      Data.addAttributesForm.AttributeSelects = [...AttributesItem.AttributeSelects || []] || [];
      Data.dialogShow = true;
    }
    function setStorage() { // 设置会话存储
      sessionStorage.setItem('updataMaterialClassifyManagePage', 'true');
    }
    function delAttributes(item) {
      messageBox.warnCancelBox('确定要删除此属性吗？', `${item.AttributeName}`, () => {
        api.getMaterialTypeAttributeRemove(item.AttributeID).then(res => {
          if (res.data.Status === 1000) {
          // 删除成功
            getAttributesList();
            closeClick();
            setStorage();
          }
        });
      }, () => undefined);
    }
    function addAttributeSelect() {
      console.log(Data.addAttributesForm.AttributeSelects);

      Data.addAttributesForm.AttributeSelects.push({
        SelectID: Math.random() + new Date().getTime(),
        Sort: 0,
        SelectItemValue: '',
      });
    }

    function toUp(i:number) {
      // 交换变量
      [Data.addAttributesForm.AttributeSelects[i - 1],
        Data.addAttributesForm.AttributeSelects[i]] = [Data.addAttributesForm.AttributeSelects[i],
        Data.addAttributesForm.AttributeSelects[i - 1]];
    }
    function toDown(i:number) {
      // 交换变量
      [Data.addAttributesForm.AttributeSelects[i + 1],
        Data.addAttributesForm.AttributeSelects[i]] = [Data.addAttributesForm.AttributeSelects[i],
        Data.addAttributesForm.AttributeSelects[i + 1]];
    }
    function delAttributeSelect(i) {
      Data.addAttributesForm.AttributeSelects.splice(i, 1);
    }

    function primaryClick() {
      api.getMaterialTypeAttributeSave(Data.addAttributesForm).then(res => {
        if (res.data.Status === 1000) {
          const cb = () => {
            closeClick();
            getAttributesList();
            setStorage();
          };
            // 成功
          messageBox.successSingle(`${Data.addAttributesForm.AttributeID ? '修改' : '添加'}成功`, cb, cb);
        }
      });
    }
    function setHeight() {
      const { getHeight } = autoHeightMixins();
      h.value = getHeight('.set-attributes-page header', 72);
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
      Data.addAttributesForm.TypeID = route.params.TypeID;
      Data.getAttributesData.TypeID = route.params.TypeID;
      nextTick(() => {
        setHeight();
      });
      getAttributesList();
    });
    return {
      h,
      Data,
      dialog,
      addAttributeSelect,
      delAttributeSelect,
      toUp,
      toDown,
      primaryClick,
      closeClick,
      closed,
      editAttributes,
      delAttributes,
      PaginationChange,
    };
  },
};
</script>
<style lang='scss'>
@import '@/assets/css/var.scss';
.set-attributes-page{
  >header{
    padding: 20px;
    padding-bottom: 0;
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
      }
    }
  }
  >footer{
    min-height: 50px;
    height: 50px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .el-button{
      align-self: center;
    }
    .bottom-count-box{
      min-width: calc((100% - 100px) / 2);
      justify-content: flex-end;
      display: flex;
      align-items: center;
    }
  }
  .add-attributes-dialog{
    .el-form{
      margin: 0 auto;
      width: 380px;
      .hint{
        font-size: 12px;
        line-height: 30px;
        color: #F4A307;
        position: relative;
        padding-left: 33px;
        &::before{
          content: '';
          background-image: url('@/assets/images/warn.png');
          display: inline-block;
          background-size: 13px 13px;
          width: 13px;
          height: 13px;
          margin: 0 10px;
          position: absolute;
          left: 0;
          top: 9px;
        }
      }
      .el-form-item{
        .attribute-selects{
          p{
            margin-bottom: 12px;
            display: flex;
            line-height: 32px;
            .el-button{
              height: 32px;
            }
            .el-input{
              margin-right: 15px;
            }
          }
        }
      }
    }
  }
}
</style>
