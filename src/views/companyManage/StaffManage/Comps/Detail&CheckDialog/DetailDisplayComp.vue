<template>
  <div class="mp-erp-staff-manage-detail-and-check-dialog-comp-detail-display-wrap" v-if="detailData">
    <div class="left">
      <el-image :src="detailData.HeadPic" fit="cover"></el-image>
      <div class="department">
        <span class="t">岗位：</span>
        <div class="list">
          <p v-for="(it, i) in departmentList" :key="it + i" :title="it">{{ it }}</p>
        </div>
      </div>
    </div>

    <ul class="right">
      <li v-for="it in rightDetailList" :key="it.label" :class="it.class || ''">
        <label>{{ it.label }}：</label>
        <div>
          <span>{{ it.content }}</span>
          <span v-if="it.addition">{{ it.addition }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    detailData: {
      type: Object,
      default: null,
    },
  },
  computed: {
    departmentList() { // 岗位列表
      if (this.detailData && this.detailData._department) {
        return this.detailData._department.split(' | ');
      }
      return [];
    },
    rightDetailList() { // 右侧展示列表
      if (!this.detailData) return [];
      const {
        StaffName, _gender, Mobile, _Birthday, IDCard, _EducationText, _IntranetContent, TimeRecord, _JoinDate, _address, DetailAddress, LastLoginRecord,
      } = this.detailData;
      const _RegTime = TimeRecord?.RegTime ? this.$utils.getDateFormat(TimeRecord.RegTime) : '';
      const _CheckTime = TimeRecord?.CheckTime ? this.$utils.getDateFormat(TimeRecord.CheckTime) : '';
      const _OutTime = TimeRecord?.OutTime ? this.$utils.getDateFormat2Date(TimeRecord.OutTime) : '';
      let _lastLoginTime = '';
      let _lastLoginIP = '';
      if (LastLoginRecord) {
        const { First, Second } = LastLoginRecord;
        if (First) _lastLoginTime = this.$utils.getDateFormat(First);
        if (Second) _lastLoginIP = Second;
      }

      return [
        { label: '姓名', content: StaffName, class: 'name' },
        { label: '性别', content: _gender },
        { label: '手机号', content: Mobile },
        { label: '出生日期', content: _Birthday },
        { label: '身份证号', content: IDCard },
        { label: '学历', content: _EducationText },
        { label: '网络限制', content: _IntranetContent },
        { label: '注册(添加)时间', content: _RegTime },
        { label: '审核时间', content: _CheckTime },
        { label: '入职日期', content: _JoinDate },
        { label: '离职日期', content: _OutTime },
        {
          label: '地址', content: _address, addition: DetailAddress, class: 'mt-40',
        },
        { label: '最后登录时间', content: _lastLoginTime, class: 'is-gray' },
        { label: '最后登录IP', content: _lastLoginIP, class: 'is-gray' },
      ];
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-staff-manage-detail-and-check-dialog-comp-detail-display-wrap {
  width: 100%;
  color: #585858;
  display: flex;
  > div.left {
    flex: none;
    width: 50%;
    border-right: 1px solid #eee;
    min-height: 100%;
    padding-left: 55px;
    box-sizing: border-box;
    overflow: hidden;
    > .el-image {
      width: 250px;
      height: 350px;
    }
    > div.department {
      display: flex;
      font-size: 12px;
      line-height: 17px;
      padding-top: 12px;
      overflow: hidden;
      > span.t {
        flex: none;
        white-space: nowrap;
        font-weight: 700;
      }
      > div.list {
        width: calc(100% - 3em - 15px);
        flex: none;
        > p {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          white-space: normal;
          text-overflow: ellipsis;
          margin-bottom: 6px;
        }
      }
    }
  }
  > ul.right {
    flex: none;
    width: 50%;
    > li {
      display: flex;
      width: 100%;
      overflow: hidden;
      font-size: 12px;
      line-height: 18px;
      margin-bottom: 9px;
      > label {
        width: 120px;
        text-align: right;
        flex: none;
      }
      > div {
        > span {
          display: block;
        }
      }
      &.name {
        font-weight: 700;
        font-size: 14px;
        margin-bottom: 18px;
      }
      &.mt-40 {
        margin-bottom: 40px;
      }
    }
  }
}
</style>
