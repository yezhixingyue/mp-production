<template>
  <DialogContainerComp
    :width="560"
    top="18vh"
    title="设置员工岗位/所属部门"
    v-model:visible="visible"
    @submit="onSubmit"
    @cancel="visible = false"
    @open="onOpen"
    @closed="onClosed"
    class="staff-set-job-dialog-wrap"
  >
    <!-- 内容区 -->
    <ul class="content-list">
      <li v-for="(it, i) in PositionList" :key="it.key">
        <EpCascaderWithLevel3
          :setCondition='e => handleSelect(e, i)'
          :levelTreeList='departmentLevelList'
          :First='it.First.FirstDepartmentID'
          :Second='it.First.SecondDepartmentID'
          :Third='it.First.ThirdDepartmentID'
          :withEmpty="false"
          withNullValue
          :fiexdWidth="0"
          onlyLastValid
          title="部门"
          :typeList="[['First', 'FirstDepartmentID'],['First', 'SecondDepartmentID'],['First', 'ThirdDepartmentID']]"
        />
        <div class="bt">
          <div>
            <span class="title">岗位：</span>
            <el-select v-model="it.Second.PositionID" class="mp-select mr-60">
              <el-option v-for="item in jobPermissionsList" :key="item.PositionID" :label="item.PositionName" :value="item.PositionID" />
            </el-select>
          </div>
          <AddMenu @click="add" :disabled="PositionList.length >= 3" />
          <RemoveMenu @click="() => PositionList.splice(i, 1)" :disabled="PositionList.length <= 1" />
        </div>
      </li>
    </ul>
  </DialogContainerComp>
</template>

<script>
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import AddMenu from '@/components/common/menus/AddMenu.vue';
import RemoveMenu from '@/components/common/menus/RemoveMenu.vue';
import EpCascaderWithLevel3 from '@/components/common/EpCascader/EpCascaderWrap/EpCascaderWithLevel3.vue';
import { scrollToBottom } from '@/assets/js/utils';
import { MpMessage } from '@/assets/js/utils/MpMessage';

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => [],
    },
    departmentLevelList: {
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
    EpCascaderWithLevel3,
    AddMenu,
    RemoveMenu,
  },
  computed: {
    visible: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
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
      if (el) scrollToBottom(el);
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
      const t = this.PositionList.find(it => !it.Second.PositionID);
      if (t) {
        MpMessage.error({ title: '保存失败', msg: '有岗位未设置，请检查' });
        return false;
      }
      const getStringifyList = _list => _list.map(it => {
        const { FirstDepartmentID, SecondDepartmentID, ThirdDepartmentID } = it.First;
        return `${FirstDepartmentID}${SecondDepartmentID}${ThirdDepartmentID}${it.Second.PositionID}`;
      });
      const curStrList = getStringifyList(this.PositionList);
      if (curStrList.length > [...new Set(curStrList)].length) {
        MpMessage.error({ title: '保存失败', msg: '存在重复设置' });
        return false;
      }
      return true;
    },
    onSubmit() {
      if (!this.check()) return;
      this.$emit('submitData', this.PositionList);
    },
  },
};
</script>
<style lang='scss'>
</style>
