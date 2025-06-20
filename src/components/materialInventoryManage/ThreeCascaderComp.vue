<template>
  <!-- 三级级联选择框 用于选择物料 -->
  <el-cascader v-if="!reseta && MaterialTypeGroup.length"
  no-data-text="无数据" :props="cascaderProps" @change="cascaderChange" filterable placeholder="请选择物料">
    <template #empty>
      <div style="color:#c0c4cc;line-height:30px">
        无数据
      </div>
    </template>
  </el-cascader>
  <el-cascader v-else no-data-text="无数据" filterable placeholder="请选择物料">
    <template #empty>
      <div style="color:#c0c4cc;line-height:30px">
        无数据
      </div>
    </template>
  </el-cascader>
</template>

<script lang='ts'>
import api from '@/api';
import { onMounted, ref } from 'vue';

interface UnitSelectsType {
  UnitID: string,
  Unit: string,
  ProportionUp: number,
  ProportionDown: number,
  UnitPurpose: number
}
interface MaterialAttributesType {
  MaterialID: string,
  CodeID: number,
  AttributeID: string,
  SelectID: string,
  NumericValue: number,
  InputSelectValue: string,
  SelectValue: string,
  AttributeUnit: string,
  IsBrand: true
}
interface SizeSelectsType {
  MaterialID: string,
}
interface MaterialSelectsType {
  CodeID: number,
  Code: string,
  MaterialAttributes: MaterialAttributesType[],
  SizeSelects: SizeSelectsType[]
  key:string,
  AttributeDescribe:string
}
interface MaterialDataItemType {
  StockUnit: string,
  UnitSelects: UnitSelectsType[],
  MaterialSelects: MaterialSelectsType[]
}

interface MaterialTypes {
  TypeID: string,
  TypeName: string
}
interface MaterialTypeGroupType {
  CategoryID: number,
  CategoryName: string,
  MaterialTypes: MaterialTypes[]
}

export default {
  props: {
    change: {
      type: Function,
      default: () => null,
    },
  },
  setup(props) {
    const MaterialTypeGroup = ref<MaterialTypeGroupType[]>([]);
    const MaterialData:MaterialDataItemType[] = [];
    const reseta = ref(false);
    const cascaderProps = {
      lazy: true,
      multiple: false,
      expandTrigger: 'hover',
      lazyLoad(node, resolve) {
        const { level } = node;
        // 没有值时为第一层级
        if (level === 0) {
          // 二级没有的时候一级也不显示
          const temp = MaterialTypeGroup.value.filter(res => res.MaterialTypes.length);
          const nodes = temp.map(res => ({
            value: res.CategoryID,
            label: res.CategoryName,
            disabled: !res.MaterialTypes.length,
          }));
          resolve(nodes);
          // const callback = () => {
          // };
          // console.log(MaterialWarehouseStore.MaterialTypeGroup, 'aaaaaaaaa');

          // MaterialWarehouseStore.getMaterialCategoryList({}, callback);
        }

        // 第二层级
        if (level === 1) {
          const CategoryGroup = MaterialTypeGroup.value.find(it => it.CategoryID === node.value);
          const nodes = CategoryGroup?.MaterialTypes.map(res => ({
            value: res.TypeID,
            label: res.TypeName,
          }));
          resolve(nodes || []);
          // const callback = () => {
          // };
          // MaterialWarehouseStore.getMaterialTypeAll({ categoryID: node.value as number }, callback);
        }
        // 第三层级
        if (level === 2) {
          api.getSingleMaterialByType(node.value).then(res => {
            if (res?.data?.Status === 1000) {
              const temp = res.data.Data as MaterialDataItemType;
              if (temp) {
                if (temp.MaterialSelects.length) {
                  temp.MaterialSelects.forEach((item, i) => {
                    temp.MaterialSelects[i].key = `${Math.random().toString(16).slice(-10)}`;
                  });
                  MaterialData.push(temp);
                }
                resolve(temp.MaterialSelects.map(it => ({
                  value: it.key,
                  label: it.AttributeDescribe,
                  leaf: level >= 2,
                })));
              } else {
                resolve([]);
              }
            }
          });
        }
      },
    };

    function cascaderChange(vaslus) {
      if (Array.isArray(vaslus) && vaslus.length === 3) {
        let allMaterial:MaterialDataItemType | null = null;
        let itemMaterial:MaterialSelectsType | null = null;
        MaterialData.forEach(item => {
          item.MaterialSelects.forEach(it => {
            if (it.key === vaslus[2]) {
              allMaterial = item;
              itemMaterial = it;
            }
          });
        });
        props.change(itemMaterial, allMaterial, vaslus[1] || '');
      } else {
        props.change('', '', '');
      }
    }
    function reset() {
      reseta.value = true;
      props.change(null, null, '');
      setTimeout(() => {
        reseta.value = false;
      }, 5);
    }
    onMounted(() => {
      api.getMaterialTypeGroup(true).then(res => {
        if (res?.data?.isSuccess) {
          MaterialTypeGroup.value = res.data.Data as MaterialTypeGroupType[];
        }
      });
    });

    return {
      reseta,
      cascaderProps,
      cascaderChange,
      reset,
      MaterialTypeGroup,
    };
  },

};
</script>
<style lang="scss">
  .el-cascader-menu{
    max-width: 200px;
  }
</style>
