<template>
 <DialogContainerComp
   :visible='localVisible'
   :width='960'
   title='查看列表'
   top='12vh'
   primaryText="确定"
   :showClose="false"
   @open='onOpen'
   @submit='localVisible = false'
   >
   <div class='dialog-content'>
    <ul class="header" v-if="row">
      <li>
        <template v-if="row.Working.ReportMode === ReportModeEnum.board && row.Working.PlateInfo">
          <span class="label">大版ID：{{ row.Working.PlateInfo.Code }}</span>
        </template>
        <template v-if="row.Working.ReportMode !== ReportModeEnum.board && row.Working.OrderInfo">
          <span class="label">订单ID：</span>
          <span class="mr-5">{{ row.Working.OrderInfo.ServerName }} {{ row.Working.OrderInfo.OrderID }}</span>
        </template>
        <span>{{ row.Working.WorkingName }}</span>
        <span>{{ row.Equipment.Name }}</span>
      </li>
      <li>
        <span class="label">任务ID：{{ row.Code }}</span>
        <span>{{ row.Working.Number }}{{ localInfo?.Unit || '' }}</span>
        <span>{{ row._AssistText }}</span>
      </li>
    </ul>
    <dl v-if="_NextWorkingList.length > 0" class="wrap">
      <!-- <dt>色彩示例</dt> -->
      <dd v-for="it in _NextWorkingList" :key="it.ID">
        <div class="block" :style="`background-color:${it.Color}`"></div>
        <h5>下一道工序：</h5>
        <h4>{{ it.Name }}</h4>
        <h4>{{ [it.Equipment.GroupName, it.Equipment.Name].filter(it => it).join('-') }}</h4>
      </dd>
    </dl>
   </div>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { filterNextWorkingList } from '@/views/ProductionClient/assets/js/utils';
import { getLocalTaskList } from '@/views/ProductionClient/Comps/EquipmentPageContent/TaskActivateAndList/BatchReport/getLocalTaskList';
import { ReportModeEnum } from '@/views/productionSetting/process/enums';
import { getTaskDisplayInfo } from '@/views/ProductionClient/Comps/EquipmentPageContent/CurTaskPanel';
import { INextWorkingProduction } from '@/views/ProductionClient/assets/js/types';
// import { MyTDClass } from '@/assets/js/decorator/MyTDClass';

const props = defineProps<{
  visible: boolean
  row: ReturnType<typeof getLocalTaskList>[number] | null
}>();

const emit = defineEmits(['update:visible']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const localInfo = computed(() => (props.row ? getTaskDisplayInfo(props.row, false) : null));

const _NextWorkingList = ref<INextWorkingProduction[]>([]);

const onOpen = async () => {
  // const td = new MyTDClass();
  // const errors = td._validate();
  // console.log('onOpen td', td, errors);
  _NextWorkingList.value = [];

  if (props.row) _NextWorkingList.value = await filterNextWorkingList(props.row.Working.TaskWorkingID);
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.dialog-content {
 margin-top: -20px;
 min-height: 160px;
 max-height: 425px;
 overflow: auto;
 overflow: overlay;

 @include scroll;

 > .header {
  font-size: 18px;
  line-height: 20px;
  li {
    margin-bottom: 8px;
  }
  span {
    margin-right: 30px;
    &.label {
      display: inline-block;
      min-width: 172px;
    }
  }
 }
 dl.wrap {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  margin-top: 12px;
    dd {
      min-width: 50%;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 10px;
      box-sizing: border-box;
      padding-right: 10px;
      .block {
        width: 60px;
        height: 30px;
        flex: none;
        box-sizing: border-box;
        border-radius: 2px;
        border: 1px solid rgb(121, 121, 121);
      }
      h5 {
        font-size: 16px;
        margin-left: 10px;
        margin-right: 4px;
        flex: none;
        font-weight: 400;
      }
      h4 {
        color: #FF0000;
        font-size: 19px;
        margin-right: 15px;
        &:last-of-type {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
