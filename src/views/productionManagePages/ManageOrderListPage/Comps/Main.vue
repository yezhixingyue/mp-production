<template>
  <main class="main-comp-wrap">
    <table>
      <thead>
        <tr>
          <th :style="`width:${widthList[0].width}px`">销售端</th>
          <th :style="`width:${widthList[1].width}px`">订单ID</th>
          <th :style="`width:${widthList[2].width}px`">销售端产品</th>
          <th :style="`width:${widthList[3].width}px`">内容</th>
          <th :style="`width:${widthList[4].width}px`">尺寸</th>
          <th :style="`width:${widthList[5].width}px`">数量</th>
          <th :style="`width:${widthList[6].width}px`">下单时间</th>
          <th :style="`width:${widthList[7].width}px`">预计生产完成时间</th>
          <th :style="`width:${widthList[8].width}px`">置顶</th>
          <th :style="`width:${widthList[9].width}px`">操作</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="row in localList" :key="row.ID">
          <tr class="row-title">
            <td :style="`width:${widthList[0].width}px`" :title="row.SalesPlatfrom?.Name || ''">{{ row.SalesPlatfrom?.Name || '' }}</td>
            <td :style="`width:${widthList[1].width}px`" :title="row.OrderID || ''">{{ row.OrderID || '' }}</td>
            <td :style="`width:${widthList[2].width}px`" :title="row._SellSideProductName || ''">{{ row._SellSideProductName || '' }}</td>
            <td :style="`width:${widthList[3].width}px`" :title="row.Content || ''">{{ row.Content || '' }}</td>
            <td :style="`width:${widthList[4].width}px`" :title="row._Size">{{ row._Size }}</td>
            <td :style="`width:${widthList[5].width}px`" :title="row._Count || ''">{{ row._Count || '' }}</td>
            <td :style="`width:${widthList[6].width}px`" :title="row._CreateTime || ''">{{ row._CreateTime || '' }}</td>
            <td :style="`width:${widthList[7].width}px`" :title="row._ProduceEndTime || ''">{{ row._ProduceEndTime || '' }}</td>
            <td :style="`width:${widthList[8].width}px`">
              <span class="top-text" :class="{'v-hide': row._isTop}">已置顶</span>
              <mp-button link type="primary">一键置顶</mp-button>
            </td>
            <td :style="`width:${widthList[9].width}px`">
              <mp-button link type="primary">生产流程</mp-button>
              <mp-button link type="primary">时间线</mp-button>
              <mp-button link @click="onSpreadClick(row)" class="spread" :disabled="!row._isCombineLine">
                <span class="mr-2">{{ row._isSpread ? '隐藏' : '展开' }}</span>
                <el-icon v-show="!row._isSpread"><CaretBottom /></el-icon>
                <el-icon v-show="row._isSpread"><CaretTop /></el-icon>
              </mp-button>
            </td>
          </tr>
          <template v-if="row._isSpread">
            <tr class="combine-line-info">
              <td>
                <span>组合生产线：</span>
                <h4>{{ row.LineList[0]?.Name || '未知生产线' }}</h4>
              </td>
            </tr>
            <tr v-for="instance in row.InstanceList" :key="instance.ID" class="instance-list" :style="`width:${totalWidth}px`">
              <td class="name">
                <span class="title">{{ instance.SemiFinished?.Name ? `${instance.SemiFinished?.Name}：` : ''}}</span>
                <span class="m">{{ getMaterialName(instance.Material) }}</span>
              </td>
              <td class="number">{{ instance.Number }}{{ instance.Unit }}</td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </main>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import { format2MiddleLangTypeDateFunc2 } from '@/assets/js/filters/dateFilters';
import { IManageOrderInfo, IFactoryMaterialList } from '../../ManualOrderHandlerPage/js/types';

const props = defineProps<{
  list: IManageOrderInfo[]
  MaterialList: IFactoryMaterialList[]
}>();

const getSellSideProductName = (it: IManageOrderInfo) => {
  const { FirstLevel, SecondLevel, Product } = it.Attribute;
  const list = [FirstLevel?.Name || '', SecondLevel?.Name || '', Product?.Name || ''];
  return list.filter(it => it).join('-');
};

const widthList = [
  { width: 130 },
  { width: 120 },
  { width: 255 },
  { width: 208 },
  { width: 188 },
  { width: 120 },
  { width: 160 },
  { width: 155 },
  { width: 150 },
  { width: 230 },
];

const totalWidth = computed(() => widthList.map(it => it.width).reduce((a, b) => a + b, 0));

const spreadList = ref<string[]>([]);

const onSpreadClick = (it: IManageOrderInfo) => {
  if (spreadList.value.includes(it.ID)) {
    spreadList.value = spreadList.value.filter(id => id !== it.ID);
  } else {
    spreadList.value.push(it.ID);
  }
};

const localList = computed(() => props.list.map(it => ({
  ...it,
  /** 销售端产品 */
  _SellSideProductName: getSellSideProductName(it),
  _Count: `${`${it.Attribute.ProductAmount}`.replace(/(?=(\B)(\d{3})+$)/g, ',')}${it.Attribute.Unit}`,
  _CreateTime: format2MiddleLangTypeDateFunc2(it.CreateTime),
  _ProduceEndTime: format2MiddleLangTypeDateFunc2(it.ProducePeriod.ProduceEndTime),
  _isTop: false,
  _isSpread: spreadList.value.includes(it.ID),
  _isCombineLine: it.LineList.length > 0,
  _Size: it.LineList.length > 0 ? it.Attribute.Size || '' : it.InstanceList[0]?.Size || '',
})));

const getMaterialName = (MaterialID: string) => {
  const t = props.MaterialList.find(it => it.ID === MaterialID);
  return t ? t.Name : '';
};

</script>

<style scoped lang='scss'>
.main-comp-wrap {
  overflow: hidden;
  width: 100%;
  > table {
    width: 100%;
    border-collapse: collapse;
    border-left: 1px solid #E5E5E5;
    border-right: 1px solid #E5E5E5;
    display: block;
    height: 100%;
    overflow: auto;
    overflow: overlay;
    > thead {
      height: 38px;
      box-sizing: border-box;
      display: block;
      position: sticky;
      top: 0;
      z-index: 9;
      min-width: 100%;
      tr {
        line-height: 36px;
        background-color: #f5f5f5;
        display: inline-block;
        border-top: 1px solid #E5E5E5;
        border-bottom: 1px solid #E5E5E5;
        white-space: nowrap;
        min-width: 100%;
        th {
          display: inline-block;
          text-align: center;
          font-weight: 700;
          white-space: nowrap;
          position: relative;
          &:not(:last-of-type)::after {
            content: '';
            height: 15px;
            width: 1px;
            background-color: #d0d0d0;
            position: absolute;
            right: 0;
            top: 10px;
          }
        }
      }
    }
    > tbody {
      display: block;
      tr {
        display: inline-block;
        white-space: nowrap;
        min-width: 100%;
        transition: background-color 0.15s ease-in-out;
        td {
          display: inline-block;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          button {
            font-size: 12px;
            padding: 0;
            & + .el-button  {
              margin-left: 30px;
            }
            &.spread {
              color: #989898;
              .el-icon {
                font-size: 14px;
              }
            }
          }
        }

        &.row-title {
          background-color: #f8f8f8;
          line-height: 40px;
          border-top: 1px solid #E5E5E5;
          border-bottom: 1px solid #E5E5E5;
          margin-top: 15px;
          > td {
            text-align: center;
            .top-text {
              vertical-align: middle;
              margin-right: 30px;
              &.v-hide {
                visibility: hidden;
              }
            }
          }
          &:hover {
            background-color: #f2f2f2;
          }
        }

        &.instance-list, &.combine-line-info {
          border-bottom: 1px solid #E5E5E5;
          line-height: 39px;
          text-align: left;
          &:hover {
            background-color: #d8effc;
          }
          > td {
              overflow: hidden;
              text-overflow: ellipsis;
              display: inline-block;
              vertical-align: top;
            &.name {
              margin-left: 36px;
              min-width: 240px;
              margin-right: 15px;
              .title {
                margin-right: 8px;
              }
            }
            &.number {
              min-width: 65px;
              margin-right: 15px;
            }
          }
        }
        &.combine-line-info {
          td {
            margin-left: 36px;
            h4 {
              display: inline-block;
            }
          }
        }
      }
    }
  }
}
</style>
