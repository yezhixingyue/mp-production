# 项目所用node版本
16.17.0  -> 20.15.0

# 1.状态管理 - 使用pinia
   pinia中的状态可以在组件中直接修改或使用$patch修改，但推荐使用actions方法进行修改（pinia相比vuex取消了mutations对象，统一使用actions）

# 2.数据请求
  1.配置代理
  2.配置axios(拦截器、重复请求取消、ts验证提示，后续看情况是否添加全部loading及全局提示等)

# 3. 作废内容

  1. serve.order与build.order 两个打包命令作废

遗留问题：
  从其他页面跳转过来之后 onresize 事件不执行的问题
  无法阻止浏览器回退问题；
  element plus不能分别导入的问题
  
  表单项添加 required 字段 输入框会一直出 is required





    左侧导航栏开关
    头部tab栏关闭所有
    
    表单验证

    请求拦截不能 headers 不能设置 common 对象字段

    盘库没有上一个货位的数据

    入库的时候选择货位是否可以同时选择跨 仓库/货位编号 的货位，切换 仓库/货位编号 得时候是否保留他们的选中状态
