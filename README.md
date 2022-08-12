# 1.状态管理 - 使用pinia
   pinia中的状态可以在组件中直接修改或使用$patch修改，但推荐使用actions方法进行修改（pinia相比vuex取消了mutations对象，统一使用actions）

# 2.数据请求
  1.配置代理
  2.配置axios(拦截器、重复请求取消、ts验证提示，后续看情况是否添加全部loading及全局提示等)



遗留问题：
  无法阻止浏览器回退问题；
  深层路由页面刷新不能回到浅层页面；
  element plus不能分别导入的问题
  
    select选择器添加 filterable 后获取焦点下拉选项会隐藏





    左侧导航栏开关
    头部tab栏关闭所有
    分页的样式

    请求拦截不能 headers 不能设置 common 对象字段


    上传图片的

    物料类型管理 /Api/MaterialType/List CategoryName 字段没有值
