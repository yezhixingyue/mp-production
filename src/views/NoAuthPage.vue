<template>
  <div class="no-auth-page-wrap">
    <div>
        <i class="el-icon-warning is-red"></i>
        无该页面访问权限!
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang='scss'>
.no-auth-page-wrap {
  // margin: 30vh auto 0;
//   background-color: #eee;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding-right: 120px;
  padding-bottom: 60px;
  > div {
      font-size: 14px;
      line-height: 70px;
      height: 70px;
      padding: 0 30px;
      background-color: #eee;
      border: 1px solid #ccc;
      color: #444;
      > i {
          font-size: 30px;
          vertical-align: middle;
          margin-right: 10px;
      }
  }
}
</style>
