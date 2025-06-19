<template>
  <div class="outside-material-print-area">
      <!-- 二维码 -->
      <div class="left">
        <div class="img-box">
          <img :src="QRCodeSrc" alt="" v-show="QRCodeSrc">
        </div>
        <p>领料编号: {{ materialData.Code }}</p>
      </div>
      <!-- 右侧信息 -->
      <div class="right">
        <div class="top">
          <h2>
            <span class="label" style="letter-spacing: 0.032em;">生产线：</span>
            <span>{{ materialData.LineName }}</span>
          </h2>
          <h2>
            <span class="label">{{ materialData.TargetType === TargetTypeEnum.Order ? '订单' : '大版' }}ID：</span>
            <span>{{ materialData.TargetCode }}</span>
          </h2>
          <h2 style="color: rgb(122, 139, 156);">
            <span class="label">SKU：</span>
            <span>{{ materialData.SKU }}</span>
          </h2>
          <h2 style="color: rgb(122, 139, 156);">
            <span class="label">物料：</span>
            <div>
              <span>{{ materialData.Name }}</span>
              <span>{{ materialData.SizeName }}</span>
            </div>
          </h2>
        </div>

        <div class="bottom">
          <h2 style="color: #ee1d23;">
            <span class="label">物料来源：</span>
            <span>{{ getEnumNameByID(materialData.MaterialSource, PlaceOrderMaterialSourceEnumList) }}</span>
          </h2>
          <h2>
            <span class="label">领料数量：</span>
            <span style="color: rgb(122, 139, 156);">{{ materialData.Number }}{{ materialData.Unit }}</span>
          </h2>
          <h2>
            <span class="label">开数：</span>
            <span>{{ materialData.Multiple }}</span>
          </h2>
          <h2>
            <span class="label">开料数量：</span>
            <span>{{ materialData.Multiple * materialData.Number }}{{ materialData.Unit }}</span>
          </h2>
          <h2 style="color: #ee1d23;">
            <span class="label">开料机台：</span>
            <span v-if="materialData.SplitEquipment">{{ materialData.SplitEquipment.GroupName }} {{ materialData.SplitEquipment.Name }}</span>
            <span v-else>无需开料</span>
          </h2>
          <h2 v-if="materialData.ReceiveEquipment">
            <span class="label">交接机台：</span>
            <span>{{ materialData.ReceiveEquipment.GroupName }} {{ materialData.ReceiveEquipment.Name }}</span>
          </h2>
        </div>
      </div>
    </div>
</template>

<script setup lang='ts'>
import { TargetTypeEnum } from '@/views/ExceptionManage/_ExceptionCommonViews/SetupView/js/enum';
import { getEnumNameByID } from '@/assets/js/utils/getListByEnums';
import { PlaceOrderMaterialSourceEnumList } from '@/views/productionManagePages/ManualOrderHandlerPage/js/EnumList';
import { ExternalMaterialPrintDataType } from '../../js/types';

defineProps<{
  materialData: ExternalMaterialPrintDataType
  QRCodeSrc: string
}>();

</script>

<style scoped lang='scss'>
</style>
