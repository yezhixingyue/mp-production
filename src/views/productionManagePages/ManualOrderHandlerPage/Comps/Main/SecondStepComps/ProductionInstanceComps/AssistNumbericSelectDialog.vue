<template>
  <DialogContainerComp
    :title="`添加数值`"
    :visible='localVisible'
    :width="700"
    @open="onOpen"
    @submit="submit"
    @cancel="localVisible = false"
    primary-text="确定"
    >
    <ul class="assist-numberical-select-content">
      <li v-for="it in localAssistNumbericalList" :key="it.ID" class="item">
        <el-checkbox :label="it.ID" :disabled="checkedIds.includes(it.ID)" v-model="it.isSelect" :title="it.Name" >{{it.Name}}</el-checkbox>
        <span class="t" v-show="it.isSelect">值：</span>
        <el-input :disabled="checkedIds.includes(it.ID)" v-show="it.isSelect" v-model.trim="it.Value" maxlength="9"></el-input>
      </li>
      <el-empty :description="`暂无数据`" v-if="(AssistNumbericalList.length === 0)" />
    </ul>
  </DialogContainerComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import DialogContainerComp from '@/components/common/DialogComps/DialogContainerComp.vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IConvertAssistInfo } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
import { IAssistListItem } from '@/views/productionResources/assistInfo/types';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';

const props = defineProps<{
  visible: boolean
  AssistList: IConvertAssistInfo[]
  AssistNumbericalList: IAssistListItem[]
}>();

const emit = defineEmits(['update:visible', 'submit']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const checkedIds = ref<string[]>([]);

interface ILocalAssistListItem extends IAssistListItem {
  Value: '' | number
  isSelect: boolean
}

const localAssistNumbericalList = ref<ILocalAssistListItem[]>([]);

const onOpen = () => {
  const list = [...props.AssistList.filter(it => it.Type === AssistInfoTypeEnum.numerical)];
  checkedIds.value = list.map(it => it.ID).filter(id => id);
  localAssistNumbericalList.value = props.AssistNumbericalList.map(it => {
    const t = list.find(_it => _it.ID === it.ID);
    return {
      ...it,
      Value: t?.Value ? t.Value : '',
      isSelect: !!t,
    };
  });
};

const submit = () => {
  const checkList = localAssistNumbericalList.value.filter(it => it.isSelect);
  if (checkList.length === 0) {
    MpMessage.error({
      title: '操作失败',
      msg: '请选择数值',
    });
    return;
  }

  let t = checkList.find(it => it.Value === '');
  if (t) {
    MpMessage.error({ title: '操作失败', msg: `[${t.Name}] 未设置值` });
    return;
  }
  t = checkList.find(it => (!/^\d+(.\d{1,2})?$/.test(`${it.Value}`)));
  if (t) {
    MpMessage.error({ title: '操作失败', msg: `[${t.Name}] 值设置不正确，必须为数字类型，不能小于0，最多两位小数` });
    return;
  }

  const list: IConvertAssistInfo[] = checkList.map(it => ({
    /** 辅助信息ID */
    ID: it.ID,
    /** 未赋值前不能用该字段 */
    _Name: it.Name,
    /** 辅助信息类型 */
    Type: AssistInfoTypeEnum.numerical,
    /** 文字信息 */
    Content: '',
    /** 数值信息 */
    Value: it.Value,
  })).filter(it => it);

  emit('submit', list);
  localVisible.value = false;
};

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';
.assist-numberical-select-content {
  max-height: 400px;
  min-height: 160px;
  overflow: auto;
  overflow: overlay;
  padding-left: 25px;
  text-align: left;
  @include scroll;
  margin-top: -20px;
  .el-checkbox {
    margin-right: 10px;
  }
  :deep(.el-checkbox__label) {
    min-width: 10em;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    top: 1px;
    text-align: left;
  }
  :deep(.el-empty) {
    padding: 0;
    padding-bottom: 15px;
    margin-top: -30px;
  }
  .item {
    display: flex;
    align-items: center;
    font-size: 12px;
    margin-bottom: 10px;
    .el-input {
      width: 140px;
    }
    .t {
      margin-left: 20px;
      margin-right: 4px;
    }
  }
}
</style>
