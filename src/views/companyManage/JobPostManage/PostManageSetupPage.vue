<template>
  <section class="mp-erp-post-manage-setup-page-wrap">
    <header>
      <p class="mp-common-title-wrap">设置岗位权限</p>
      <span v-if="detailData">当前设置岗位：{{detailData.PositionName}}</span>
    </header>
    <main>
      <ul v-if="detailData && detailData.PermissionList && detailData.PermissionList.length > 0">
        <li v-for="(it, i) of detailData.PermissionList" :key="it.Type" :class="{stripe: i % 2 !== 0}">
          <div class="title">
            <el-checkbox
             :modelValue='getItemAllChecked(i)'
             :indeterminate="getItemAllIsIndeterminate(i)"
             @change="e => setItemAllChecked(e, it)"
             >{{it.TypeName}}</el-checkbox>
          </div>
          <ul class="content">
            <li v-for="item in it.List" :key="item.key">
              <el-checkbox v-model="item.HavePermission" :title="item.Name">{{item.Name}}</el-checkbox>
            </li>
          </ul>
        </li>
      </ul>
    </main>
    <footer>
      <el-button type='primary' class="is-blue-button" :disabled='!detailData' @click="onSubmitClick">保存</el-button>
      <el-button class="cancel-blue-btn" @click="onGoBackClick"><i>＜＜</i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { MpMessage } from '@/assets/js/utils/MpMessage';

export default {
  name: 'PostManageSetupPage',
  data() {
    return {
      detailData: null,
    };
  },
  methods: {
    async getDetailData() {
      const { PositionID } = this.$route.params;
      const resp = await this.api.getJobPermissionsDetail(PositionID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        this.detailData = resp.data.Data;
      }
    },
    onGoBackClick() {
      this.$goback();
    },
    getItemAllChecked(index) {
      if (this.detailData?.PermissionList && this.detailData.PermissionList[index]?.List?.length > 0) {
        const t = this.detailData.PermissionList[index].List.find(it => !it.HavePermission);
        return !t;
      }
      return false;
    },
    getItemAllIsIndeterminate(index) {
      if (this.detailData?.PermissionList && this.detailData.PermissionList[index]?.List?.length > 0) {
        const list = this.detailData.PermissionList[index].List.filter(it => it.HavePermission);
        return list.length > 0 && list.length < this.detailData.PermissionList[index].List.length;
      }
      return false;
    },
    setItemAllChecked(bool, it) {
      if (it && it.List) {
        it.List.forEach(item => {
          const _item = item;
          _item.HavePermission = bool;
        });
      }
    },
    async onSubmitClick() {
      if (!this.detailData) return;
      const PermissionList = [];
      this.detailData.PermissionList.forEach(({ List, Type }) => {
        const temp = { Type, Obj: {} };
        if (List && List.length > 0) {
          List.forEach(({ Key, HavePermission }) => {
            temp.Obj[Key] = HavePermission;
          });
        }
        PermissionList.push(temp);
      });
      const resp = await this.api.getJobPermissionSave({ PermissionList, PositionID: this.detailData.PositionID }).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        MpMessage.success({ title: '保存成功', onOk: this.onGoBackClick, onCancel: this.onGoBackClick });
      }
    },
  },
  mounted() {
    this.getDetailData();
  },
};
</script>
<style lang='scss'>
.mp-erp-post-manage-setup-page-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: hidden;
  padding-right: 4px;
  box-sizing: border-box;
  background-color: #fff;
  > header {
    flex: none;
    padding: 25px;
    > span {
      color: #a2a2a2;
      font-size: 14px;
      margin-left: 35px;
    }
  }
  > main {
    flex: 1;
    margin-left: 25px;
    box-sizing: border-box;
    width: calc(100% - 50px);
    overflow: auto;
    > ul {
      display: inline-block;
      min-width: 100%;
      > li {
        display: flex;
        height: 60px;
        align-items: center;
        box-sizing: border-box;
        border: 1px solid #cbcbcb;
        > div.title {
          width: 300px;
          flex: none;
          box-sizing: border-box;
          height: 60px;
          padding: 15px 0;
          padding-left: 50px;
          line-height: 28px;
          .el-checkbox__label {
            font-weight: 700;
            color: #585858;
          }
          border-right: 1px solid #cbcbcb;
        }
        > ul.content {
          display: flex;
          align-items: center;
          padding-left: 20px;
          > li {
            > label {
              margin-right: 5px;
              .el-checkbox__label {
                font-size: 12px;
                color: #585858;
                width: 11em;
                overflow: hidden;
                vertical-align: -5px;
              }
            }
          }
        }
        & + li {
          border-top: 1px solid rgba($color: #000000, $alpha: 0);
        }
        &.stripe {
          background-color: #f5f5f5;
        }
      }
    }
  }
  > footer {
    flex: none;
    height: 65px;
    text-align: center;
    padding-top: 22px;
    button {
      width: 120px;
      height: 35px;
      padding: 0;
      border-radius: 3px;
      i {
        transform: scaleY(1.4);
        display: inline-block;
      }
      & + button.el-button {
        margin-left: 20px;
      }
    }
  }
}
</style>
