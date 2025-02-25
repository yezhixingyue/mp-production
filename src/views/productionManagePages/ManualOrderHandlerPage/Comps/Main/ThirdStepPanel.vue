<template>
  <section class="third-panel-wrap" v-if="ManualOrderHandlerPageData">
    <header>
      <ul class="left">
        <li>
          <span class="title">产品数量:</span>
          <span>
            <i class="is-pink is-bold">{{ ManualOrderHandlerPageData.CreateOrderInfo.Attribute.ProductAmount }}</i>
            <em>{{ ManualOrderHandlerPageData.CreateOrderInfo.Attribute.Unit }}</em>
          </span>
          <span v-if="ManualOrderHandlerPageData.CreateOrderInfo.NeedPacked">（需要打包）</span>
        </li>
        <li>
          <span class="title">印刷内容:</span>
          <span>{{ ManualOrderHandlerPageData.CreateOrderInfo.Content }}</span>
        </li>
        <li v-if="isCombineLine">
          <span class="title">成品尺寸:</span>
          <span>{{ ManualOrderHandlerPageData.CreateOrderInfo.Attribute.Size }}</span>
        </li>
      </ul>
      <ul class="right" v-if="isCombineLine">
        <li>
          <h4>{{ ManualOrderHandlerPageData.CreateOrderInfo._curCombineLine?.Name }}</h4>
        </li>
        <li>
          <span class="title">生产工序:</span>
          <span >
            <i v-for="(it, i) in worksDisplayList" :key="i">
              <template v-if="i > 0">、</template>
              {{ it.Name }}
              <em v-show="it.Content" class="is-gray ft-12">({{ it.Content }})</em>
            </i>
          </span>
        </li>
        <li v-if="_AssistFileList.length > 0" style="display: flex; flex-wrap: wrap;">
          <span class="title">辅助文件:</span>
          <div class="f-list">
            <p v-for="it in _AssistFileList" :key="it._NoteInfo?.ID">
              <span class="file-type-name" :title="it._NoteInfo?.Name">{{ it._NoteInfo?.Name }}</span>
              <span class="file-name" :title='it._File?.name' v-if="it._File">
                <i v-if="it._File.name.length > 6">{{ it._File.name.slice(0, -6) }}</i>
                <i v-else>{{ it._File.name }}</i>
                <em v-if="it._File.name.length > 6">{{ it._File.name.slice(-6) }}</em>
              </span>
            </p>
          </div>
        </li>
        <li v-if="_NumbericalList && _NumbericalList.length > 0">
        <span class="title">数值设置:</span>
        <span>
          <i v-for="(it, i) in _NumbericalList" :key="it.ID">
            <template v-if="i > 0">、</template>
            {{ it._Name }}
            <i class="ft-12 is-gray">({{ it.Value }})</i>
          </i>
        </span>
      </li>
      </ul>
    </header>
    <main>
      <template v-if="!isCombineLine">
        <SingleInstanceComp v-for="it in ManualOrderHandlerPageData.CreateOrderInfo._SingleInstanceList" :key="it._key" :item="it" />
      </template>
      <template v-else>
        <SingleInstanceComp v-for="it in ManualOrderHandlerPageData.CreateOrderInfo._CombineInstanceList" :key="it.SemiFinished?.ID" :item="it" />
      </template>
    </main>
    <footer>
      <div>
        <span class="title">价格:</span>
        <el-input v-model.trim="price" maxlength="9"></el-input>
        <em>元</em>
      </div>
      <div>
        <span class="title">运费:</span>
        <el-input v-model.trim="freight" maxlength="9"></el-input>
        <em>元</em>
      </div>
      <div>
        <span class="title">合计:</span>
        <span class="is-pink is-bold">{{ totalPrice }}<em class="black"> 元</em></span>
      </div>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { LineTypeEnum } from '@/assets/Types/ProductionLineSet/enum';
import { computed } from 'vue';
import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
import { ManualOrderHandlerPageData } from '../../js';
import SingleInstanceComp from './ThirdStepComps/SingleInstanceComp.vue';
import { getWorkProcessContent } from './ThirdStepComps/utils';

/** 当前生产线类型：单一或组合 */
const isCombineLine = computed(() => ManualOrderHandlerPageData.value?.CreateOrderInfo._curLineType === LineTypeEnum.combine);

const price = computed({
  get() {
    return ManualOrderHandlerPageData.value?.CreateOrderInfo.Funds.FinalPrice || '';
  },
  set(val) {
    if (ManualOrderHandlerPageData.value && /^(\d+(\.\d{0,2})?)?$/.test(val)) ManualOrderHandlerPageData.value.CreateOrderInfo.Funds.FinalPrice = val;
  },
});

const freight = computed({
  get() {
    return ManualOrderHandlerPageData.value?.CreateOrderInfo.Funds.Freight || '';
  },
  set(val) {
    if (ManualOrderHandlerPageData.value && /^(\d+(\.\d{0,2})?)?$/.test(val)) ManualOrderHandlerPageData.value.CreateOrderInfo.Funds.Freight = val;
  },
});

const totalPrice = computed(() => {
  if (!ManualOrderHandlerPageData.value) return '';
  const { FinalPrice, Freight } = ManualOrderHandlerPageData.value.CreateOrderInfo.Funds;
  if (!FinalPrice && !Freight) return '';
  const p = FinalPrice ? +FinalPrice : 0;
  const f = Freight ? +Freight : 0;

  return +(p + f).toFixed(1);
});

const worksDisplayList = computed(() => getWorkProcessContent(
  ManualOrderHandlerPageData.value?.CreateOrderInfo.WorkingList || [],
  ManualOrderHandlerPageData.value?.CreateOrderInfo.AssistList || [],
));

/** 辅助文件列表 */
const _AssistFileList = computed(() => (ManualOrderHandlerPageData.value?.CreateOrderInfo.FileList || []).filter(it => it._NoteInfo));

/** 数值列表 */
const _NumbericalList = computed(() => ManualOrderHandlerPageData.value?.CreateOrderInfo.AssistList.filter(it => it.Type === AssistInfoTypeEnum.numerical));
</script>

<style scoped lang='scss'>
.third-panel-wrap {
  width: 1280px;
  margin: 0 auto;
  flex: none;
  margin-top: -10px;
  > header {
    display: flex;
    padding-bottom: 12px;
    > ul {
      box-sizing: border-box;
      li {
        line-height: 28px;
      }
      &.left {
        flex: 1;
        padding-left: 112px;
      }
      &.right {
        flex: none;
        width: 769px;
        padding-left: 100px;
      }
    }
  }
  .title {
    font-weight: 700;
    margin-right: 10px;
  }

  .f-list {
    flex: 1;
    overflow: hidden;
    p {
      display: flex;
      width: 100%;
      padding-bottom: 10px;
      > span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &.file-type-name {
          flex: none;
          width: 165px;
          padding-right: 15px;
        }
        &.file-name {
          display: flex;
          > i {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      &:last-of-type {
        padding-bottom: 0;
      }
    }
  }

  > footer {
    text-align: center;
    padding: 30px 0;
    > div {
      margin-bottom: 15px;
      .el-input {
        width: 140px;
        margin-right: 10px;
      }
      .is-pink {
        width: 154px;
        display: inline-block;
        margin-right: 10px;
        text-align: left;
        font-size: 16px;
        padding-left: 2px;
        .black {
          color: #444;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
