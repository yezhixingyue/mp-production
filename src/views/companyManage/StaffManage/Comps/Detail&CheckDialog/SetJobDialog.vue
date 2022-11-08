<template>
  <DialogContainerComp
    width="560px"
    top="18vh"
    title="设置员工岗位/所属部门"
    v-model:visible="visible"
    @submit="onSubmit"
    @cancle="visible = false"
    @open="onOpen"
    @closed="onClosed"
    class="staff-set-job-dialog-wrap"
  >
    <!-- 内容区 -->
    <ul class="content-list">
      <li v-for="(it, i) in PositionList" :key="it.key">
        <AreaSelector
          title='部门'
          hasNullOption
          :hasNoLimitItem='false'
          :changePropsFunc='e => handleSelect(e, i)'
          :propList='departmentList'
          :RegionalID='it.First.FirstDepartmentID'
          :CityID='it.First.SecondDepartmentID'
          :CountyID='it.First.ThirdDepartmentID'
          :typeList="[['First', 'FirstDepartmentID'],['First', 'SecondDepartmentID'],['First', 'ThirdDepartmentID']]"
        />
        <div class="bt">
          <OrderChannelSelector
            initSelect
            :options='jobPermissionsList'
            :changePropsFunc='e => handleSelect(e, i)'
            :typeList="[['Second', 'PositionID']]"
            :value='it.Second.PositionID'
            :defaultProps='{label: "PositionName", value: "PositionID"}'
            label='岗位'
          />
          <CtrlMenus
            addText='添加'
            addBefore
            :showList="['add','del']"
            :canRemove='PositionList.length > 1'
            :canAdd='PositionList.length < 3'
            @remove="() => PositionList.splice(i, 1)"
            @add="add"
           />
        </div>
      </li>
    </ul>
  </DialogContainerComp>
</template>

<script>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import AreaSelector from '@/components/common/SelectorComps/AreaSelectorIndex.vue';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => [],
    },
    departmentList: {
      type: Array,
      default: () => [],
    },
    jobPermissionsList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    DialogContainerComp,
    AreaSelector,
    OrderChannelSelector,
    CtrlMenus,
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  data() {
    return {
      PositionList: [],
    };
  },
  methods: {
    createNewItem(itemDate) {
      return {
        First: {
          FirstDepartmentID: itemDate?.First.FirstDepartmentID || -666,
          SecondDepartmentID: itemDate?.First.SecondDepartmentID || -666,
          ThirdDepartmentID: itemDate?.First.ThirdDepartmentID || -666,
        },
        Second: {
          PositionID: itemDate?.Second.PositionID || '', // 没有值的话，应默认一个岗位
          PositionName: itemDate?.Second.PositionName || '', // 没有值的话，应默认一个岗位
        },
        key: Math.random().toString(16).slice(-10),
      };
    },
    onOpen() {
      this.PositionList = this.list.map(it => this.createNewItem(it));
      if (this.PositionList.length === 0) this.add();
    },
    onClosed() {
      this.PositionList = [];
    },
    async add() {
      this.PositionList.push(this.createNewItem());
      if (this.PositionList.length < 3) return;
      await this.$nextTick();
      const el = document.querySelector('.staff-set-job-dialog-wrap .el-dialog__body .content-list');
      if (el) this.$utils.scrollToBottom(el);
    },
    handleSelect([[key1, key2], value], i) {
      if (!key1 || !this.PositionList[i]) return;
      if (key2) {
        this.PositionList[i][key1][key2] = value;
      } else {
        this.PositionList[i][key1] = value;
      }
      if (key1 === 'Second' && key2 === 'PositionID') { // 如果修改了岗位ID的话则同步修改下岗位名称
        const t = this.jobPermissionsList.find(_it => _it.PositionID === value);
        this.PositionList[i].Second.PositionName = t && t.PositionName ? t.PositionName : '';
      }
    },
    check() {
      const getStringifyList = _list => _list.map(it => {
        const { FirstDepartmentID, SecondDepartmentID, ThirdDepartmentID } = it.First;
        return `${FirstDepartmentID}${SecondDepartmentID}${ThirdDepartmentID}${it.Second.PositionID}`;
      });
      const curStrList = getStringifyList(this.PositionList);
      if (curStrList.length > [...new Set(curStrList)].length) {
        this.messageBox.failSingleError('保存失败', '存在重复设置');
        return false;
      }
      const lastStrList = getStringifyList(this.list);
      if (JSON.stringify(lastStrList) === JSON.stringify(curStrList)) {
        this.messageBox.failSingleError('保存失败', '未发生更改');
        return false;
      }
      return true;
    },
    onSubmit() {
      if (!this.check()) return;
      this.$emit('submit', this.PositionList);
    },
  },
};
</script>
<style lang='scss'>
</style>
