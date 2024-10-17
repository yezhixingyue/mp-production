declare namespace NodeJS {
  export interface Process {
    env: {
      /** 环境变量：生产|开发环境 */
      NODE_ENV: 'development' | 'production'
      /** 打包目标：后台(未传值时)|下单  */
      VUE_APP_ENV_TYPE?: 'test' | 'prod'
      /** 该字段作废 */
      // VUE_APP_TARGET?: 'My Order App',
      /**  */
      BASE_URL: ''
      /** 版本号 */
      VUE_APP_VERSION: string
      VUE_APP_EQUIPMENT_API_URL:string
      VUE_APP_ENV_SITE_TYPE:string
    },
  }
}
