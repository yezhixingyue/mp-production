<template>
  <ul class="center column scroll">
    <!-- 处理方式 -->
    <li>
      <p class="mp-common-title-wrap black top">处理方式：</p>
      <div>
        <h4 :class="{continue: HandlingDetail.SolveType === SolveTypeEnum.continue}">
          {{ getEnumNameByID(HandlingDetail.SolveType, SolveTypeEnumList)}}<i>：</i>
        </h4>
        <div class="handle-content">
          <!-- 撤销内容 -->
          <RevocationInfoDisplayComp
            v-if="HandlingDetail.SolveType === SolveTypeEnum.rollbackBeforeMakeup"
            :RevocationInfo="HandlingDetail.RevocationInfo"
            :ReportMode="handleDetailData.TaskDetail.Working.ReportMode"
          />
          <!-- 重做内容 -->
          <RedoInfoDisaplayComp
            v-if="HandlingDetail.SolveType === SolveTypeEnum.remake"
            :RedoInfo="HandlingDetail.RedoInfo"
            :ReportMode="handleDetailData.TaskDetail.Working.ReportMode"
          />
        </div>
      </div>
    </li>
    <!-- 外协处理 -->
    <li v-if="IsOutSourcing && handleDetailData.HandlingDetail.ExternalFactory">
      <p class="mp-common-title-wrap black">外协处理：</p>
      <div v-if="typeof handleDetailData.HandlingDetail.ExternalFactory.ReduceAmount === 'number'">
        <h4>外协减款：</h4><span>{{ handleDetailData.HandlingDetail.ExternalFactory.ReduceAmount }}元</span>
      </div>
      <template v-if="HandlingDetail.SolveType === SolveTypeEnum.remake">
        <div v-if="handleDetailData.HandlingDetail.ExternalFactory.LimitType !== ExternalErrorLimitTypeEnum.None">
          <h4>{{  handleDetailData.HandlingDetail.ExternalFactory.LimitType === ExternalErrorLimitTypeEnum.Fixed ? '锁定' : '排除'}}外协工厂：</h4>
          <span>{{ handleDetailData.HandlingDetail.ExternalFactory.LimitType === ExternalErrorLimitTypeEnum.Fixed
            ? handleDetailData.HandlingDetail.ExternalFactory.Factory.Name
            : handleDetailData.TaskDetail.Equipment.Name }}</span>
        </div>
        <div v-if="typeof handleDetailData.HandlingDetail.ExternalFactory.FixedAmount === 'number'">
          <h4>锁定外协价格：</h4><span>{{ handleDetailData.HandlingDetail.ExternalFactory.FixedAmount }}元</span>
        </div>
        <div v-if="handleDetailData.HandlingDetail.ExternalFactory.ProcessContent">
          <h4>修改加工信息：</h4><span>{{ handleDetailData.HandlingDetail.ExternalFactory.ProcessContent }}</span>
        </div>
      </template>
    </li>

    <!-- 处理人信息 -->
    <li class="operator">
      <p class="mp-common-title-wrap black">处理详情：</p>
      <div>
        <h4>处理时间：</h4>
        <span class="ft-13">{{ format2MiddleLangTypeDateFunc2(HandlingDetail.CreateTime) }}</span>
      </div>
      <div>
        <h4>提交人：</h4>
        <span class="ft-13">{{ HandlingDetail.Operator.Name }}</span>
      </div>
    </li>
  </ul>
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { ExternalErrorLimitTypeEnum, SolveTypeEnum } from '../../SetupView/js/enum';
import { SolveTypeEnumList } from '../../SetupView/js/EnumList';
import { ITaskExceptionHandlingDetail } from '../js/type';
import RevocationInfoDisplayComp from './RevocationInfoDisplayComp.vue';
import RedoInfoDisaplayComp from './RedoInfoDisaplayComp.vue';

const props = defineProps<{
  /** 处理详情信息 */
  handleDetailData: ITaskExceptionHandlingDetail
  IsOutSourcing: boolean
}>();

const HandlingDetail = computed(() => props.handleDetailData.HandlingDetail);

</script>

<style scoped lang='scss'>
@import '@/assets/css/mixins.scss';

.center {
  max-width: 700px;
  min-width: 450px;
  padding-right: 50px;
  padding-left: 80px;
  line-height: 24px;

  @include scroll;

  > li {
    .mp-common-title-wrap {
      margin-bottom: 8px;
      &.top {
        line-height: 16px;
      }
    }

    > div {
      display: flex;
      font-size: 13px;
      > h4 {
        min-width: 8em;
        text-align: right;
        &.continue {
          min-width: 13em;
          i {
            display: none;
          }
        }
      }

      // .handle-content {
      //   font-size: 12px;
      // }
    }

    & + li {
      margin-top: 30px;
    }
  }
}
</style>
