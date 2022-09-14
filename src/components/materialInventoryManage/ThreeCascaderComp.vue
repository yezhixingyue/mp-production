<template>
  <!-- 三级级联选择框 用于选择物料 -->
  <el-cascader no-data-text="无数据" :props="cascaderProps" @change="cascaderChange" filterable placeholder="请选择物料">
    <template #empty>
      <div style="color:#c0c4cc;line-height:30px">
        无数据
      </div>
    </template>
  </el-cascader>
</template>

<script lang='ts'>
import { useMaterialWarehouseStore } from '@/store/modules/materialWarehouse/materialWarehouse';
import api from '@/api/request/MaterialStorage';
import { onMounted } from 'vue';

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
  SizeID: string,
  SizeDescribe: string
}
interface MaterialSelectsType {
  CodeID: number,
  Code: string,
  MaterialAttributes: MaterialAttributesType[],
  SizeSelects: SizeSelectsType[]
  key:string,
}
interface MaterialDataItemType {
  StockUnit: string,
  UnitSelects: UnitSelectsType[],
  MaterialSelects: MaterialSelectsType[]
}
export default {
  props: {
    change: {
      type: Function,
      default: () => null,
    },
  },
  setup(props) {
    const MaterialWarehouseStore = useMaterialWarehouseStore();
    const MaterialData:MaterialDataItemType[] = [];
    const cascaderProps = {
      lazy: true,
      multiple: false,
      expandTrigger: 'hover',
      lazyLoad(node, resolve) {
        const { level } = node;
        // 没有值时为第一层级
        if (level === 0) {
          const callback = () => {
            const nodes = MaterialWarehouseStore.CategoryList.map(res => ({
              value: res.CategoryID,
              label: res.CategoryName,
            }));
            resolve(nodes);
          };

          MaterialWarehouseStore.getMaterialCategoryList({}, callback);
        }

        // 第二层级
        if (level === 1) {
          const callback = () => {
            const nodes = MaterialWarehouseStore.MaterialTypeList.map(res => ({
              value: res.TypeID,
              label: res.TypeName,
              disabled: node.loaded && node.chchildren === 0,
            }));
            console.log(nodes, 'nodes');

            resolve(nodes || []);
          };
          MaterialWarehouseStore.getMaterialTypeAll({ categoryID: node.value as number }, callback);
        }
        // 第三层级
        if (level === 2) {
          api.getSingleMaterialByType(node.value).then(res => {
            if (res.data.Status === 1000) {
              const temp = res.data.Data as MaterialDataItemType;
              if (temp) {
                if (temp.MaterialSelects.length) {
                  temp.MaterialSelects.forEach((item, i) => {
                    temp.MaterialSelects[i].key = `${Math.random().toString(16).slice(-10)}`;
                  });
                  MaterialData.push(temp);
                }
                resolve(temp.MaterialSelects.map(it => {
                  let msg = '';
                  it.MaterialAttributes.forEach((item, index) => {
                    if (item.NumericValue) {
                      msg += item.NumericValue || '';
                      msg += item.AttributeUnit || '';
                    } else {
                      msg += item.InputSelectValue || item.SelectValue || '';
                    }
                    if (item.NumericValue || item.InputSelectValue || item.SelectValue) {
                      msg += index === it.MaterialAttributes.length - 1 ? '' : ' ';
                    }
                  });
                  return {
                    value: it.key,
                    label: msg,
                    leaf: level >= 2,
                  };
                }));
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
        console.log(MaterialData, 'MaterialData');
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
      }
    }

    onMounted(() => {
      // currentInstance = getCurrentInstance() as ComponentInternalInstance;
    });

    return {
      cascaderProps,
      cascaderChange,
    };
  },

};
</script>
<style lang="scss">
  .el-cascader-menu{
    max-width: 200px;
  }
</style>
