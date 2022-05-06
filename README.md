# 1.状态管理 - 使用pinia
   pinia中的状态可以在组件中直接修改或使用$patch修改，但推荐使用actions方法进行修改（pinia相比vuex取消了mutations对象，统一使用actions）

# 2.数据请求
  1.配置代理
  2.配置axios(拦截器、重复请求取消、ts验证提示，后续看情况是否添加全部loading及全局提示等)
