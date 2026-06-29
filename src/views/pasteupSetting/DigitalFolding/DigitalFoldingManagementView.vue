<template>
  <section class="digital-folding-manage-view-wrap">
    <header>
      <p>数码折手设置</p>
    </header>

    <main>
      <p>
        <mp-button type="primary" @click="onAddClick" style="height: 30px;" v-if="localPermission?.Setup">+ 添加一行</mp-button>
      </p>

      <ul>
        <li v-for="it in localManageModel.list" :key="it.key">
          <div>
            <span class="bold ml-2">审稿宽：</span>
            <el-input maxlength="4" class="num" v-model.trim="it.MinValue" style="width: 60px;" :disabled="!it.isEditing" />
            <span class="mr-2 ml-1"> ＜ 值mm ≤ </span>
            <el-input maxlength="4" class="num" v-model.trim="it.MaxValue" style="width: 60px;" :disabled="!it.isEditing" />
          </div>

          <div>
            <span class="ml-45 bold">折手方式：</span>
            <el-select v-model="it.FoldType" style="width: 100px;" :disabled="!it.isEditing">
              <el-option v-for="enumItem in DigitalFoldTypeEnumList" :key="enumItem.ID" :label="enumItem.Name" :value="enumItem.ID" />
            </el-select>
          </div>

          <div>
            <span class="ml-45 bold">用料卷宽：</span>
            <el-select v-model="it.RollWidth" style="width: 100px;" :disabled="!it.isEditing">
              <el-option v-for="num in DigitalFoldRollWidthList" :key="num" :label="num" :value="num" />
            </el-select>
            <i class="ml-4">mm</i>
          </div>

          <div class="ctrl ml-50" v-if="localPermission?.Setup">
            <mp-button type="primary" link :icon="Edit" v-if="!it.isEditing" @click="it.isEditing = true">编辑</mp-button>
            <mp-button type="primary" link :icon="CircleCheckFilled" v-else
             @click="it.save(localManageModel.list.map(it => it.rawData!).filter(Boolean))">保存</mp-button>
            <mp-button type="danger" link :icon="RemoveFilled" :disabled="!it.isEditing" @click="() => it.cancelEdit()">取消</mp-button>
            <mp-button type="danger" link :icon="Delete" @click="onRemoveClick(it)">删除</mp-button>
          </div>
        </li>

        <li v-if="localManageModel.list.length === 0 && !localManageModel.loading" class="is-gray ft-13 ml-2">暂无数据</li>
      </ul>
    </main>

    <footer>
      <ul>
        <li class="bold">折手方式说明：</li>
        <li>F4：表示对折4P</li>
        <li>F6：表示风琴折折手6P</li>
        <li>F8：表示对对折8P</li>
      </ul>
    </footer>
  </section>
</template>

<script setup lang='ts'>
import { onMounted, ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Delete, Edit, RemoveFilled, CircleCheckFilled } from '@element-plus/icons-vue';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { useUserStore } from '@/store/modules/user';
import { DigitalFoldingManageModel } from './model/DigitalFoldingManageModel';
import { DigitalFoldItemModel } from './model/DigitalFoldItemModel';
import { DigitalFoldRollWidthList, DigitalFoldTypeEnumList } from './types/enum';

const localManageModel = ref(new DigitalFoldingManageModel());

const userStore = useUserStore();
const { user } = userStore;
const localPermission = computed(() => user?.PermissionList?.PermissionDigitalFolding?.Obj);

const onAddClick = () => {
  const newItem = new DigitalFoldItemModel(null);
  localManageModel.value.list.unshift(newItem);

  newItem.isEditing = true;
};

const onRemoveClick = (it: DigitalFoldItemModel) => {
  if (!it.rawData) {
    localManageModel.value.remove(it);
    return;
  }

  MpMessage.warn({
    title: '确定删除该项吗 ?',
    msg: '删除后不可恢复',
    onOk: async () => {
      const bool = await localManageModel.value.remove(it);
      if (bool) {
        ElMessage.success('删除成功');
      }
    },
  });
};

onMounted(() => {
  localManageModel.value.getList();
});
</script>

<script lang="ts">
export default {
  name: 'DigitalFoldingManagementView',
};
</script>

<style scoped lang='scss'>
.digital-folding-manage-view-wrap {
  height: 100%;
  background-color: #fff;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 70px auto 150px;

  > header {
    padding: 16px 20px;

    > p {
      font-weight: 700;
      font-size: 14px;
      padding-left: 10px;
      border-left: 3px solid #26bcf9;
      line-height: 16px;
    }
  }

  > main {
    padding: 0 32px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    > p {
      flex: none;
    }

    > ul {
      flex: 0 1 auto;
      overflow-y: auto;
      margin-top: 25px;
      font-size: 13px;

      > li {
        display: flex;
        align-items: center;
        white-space: nowrap;
        margin-bottom: 20px;

        .ctrl {
          button {
            font-size: 13px;
            & + button {
              margin-left: 10px;
            }
          }
        }
      }
    }
  }

  > footer {
    padding-left: 33px;
    padding-top: 10px;

    > ul {
      > li {
        font-size: 13px;
        color: #ee1193;
        margin-bottom: 5px;
      }
    }
  }

  :deep(.el-input) {
    --el-input-height: 28px;
    --el-input-border-color: #ababab;
    --el-disabled-border-color: #ababab;

    input {
      height: 26px !important;
    }

    &.num {
      input {
        text-align: center;
      }
    }
  }
}
</style>
