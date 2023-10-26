export interface ILoginSubmitForm {
  Password: string;
  Mobile: string;
  /** 0. 客户端   1. 网页 */
  Terminal: 1 | 2;
  EquipmentID?: string;
  /** 1. 后台 2. 报工 3. 下单和外协回货  */
  Site: 1 | 2 | 3;
}

export interface IUser {
  StaffID: string;
  StaffName: string;
  Account: {
    Token: string;
  };
  Token: string;
  PermissionList: {
    /** 文章管理权限 */
    PermissionManageArticle: {
      HavePomission: boolean
      Obj: {
        Setup: boolean
        ReadLevel1: boolean
        ReadLevel2: boolean
        ReadLevel3: boolean
        ReadLevel4: boolean
        ReadLevel5: boolean
      };
    };
    /** 外协入库 */
    PermissionExternalInStored: {
      HavePomission: boolean
      Obj: {
        Setup: boolean
      };
    };
    /** 报工管理 */
    PermissionTaskReport: {
      HavePomission: boolean
      Obj: {
        Report: boolean
      };
    };
    /** 拼版工具 */
    PermissionImpositionTools: {
      HavePomission: boolean
      Obj: {
        UseTools: boolean
      };
    };
    /** 手工单 */
    PermissionManualOrder: {
      HavePomission: boolean
      Obj: {
        CreateOrder: boolean
      };
    };
    /** 外协异常管理 */
    PermissionExternalException: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Deal: boolean
      };
    };
    /** 生产异常管理 */
    PermissionTaskException: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Deal: boolean
      };
    };
    /** 排程异常管理 */
    PermissionScheduleException: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Deal: boolean
      };
    };
    /** 设备状态管理 */
    PermissionEquipmentStatus: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        QueryTask: boolean
        ChangeEquipemnt: boolean
      };
    };
    /** 大版管理 */
    PermissionManagePlate: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Print: boolean
      };
    };
    /** 块管理 */
    PermissionManageChunk: {
      HavePomission: boolean
      Obj: {
        Query: boolean
      };
    };
    /** 订单管理 */
    PermissionManageOrder: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        TopShow: boolean
        Cancle: boolean
      };
    };
    /** 外来物料管理 */
    PermissionExternalMaterial: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Receive: boolean
        Print: boolean
        Excel: boolean
      };
    };
    /** 设备管理 */
    PermissionManageEquipment: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Relieve: boolean
        Setup: boolean
      };
    };
    /** 生产任务管理 */
    PermissionManageTask: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Excel: boolean
      };
    };
    /** 外协管理 */
    PermissionManageExternalTask: {
      HavePomission: boolean
      Obj: {
        WaitQuery: boolean
        WaitSetup: boolean
        InstoredQuery: boolean
        InstoredSetup: boolean
        Query: boolean
        Excel: boolean
      };
    };
    /** 生产线管理 */
    PermissionManageNormalLine: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
      };
    };
    /** 组合生产线管理 */
    PermissionManageUnionLine: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
      };
    };
    /** 制版组管理 */
    PermissionManagePlateMakeGroup: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
      };
    };
    /** 工序管理 */
    PermissionManageWorking: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
      };
    };
    /** 发货班次管理 */
    PermissionManageShift: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
      };
    };
    /** 辅助信息管理 */
    PermissionManageAssist: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
      };
    };
    /** 物料资源包管理 */
    PermissionManageResourceGroup: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
      };
    };
    /** 加工设备管理 */
    PermissionManageProduceEquipment: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
      };
    };
    /** 设备组管理 */
    PermissionManageEquipmentGroup: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
        MaterialTypeLimit: boolean
        ColorLimit: boolean
      };
    };
    /** 外协工厂管理 */
    PermissionManageExternalFactory: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
      };
    };
    /** 设备分类管理 */
    PermissionManageEquipmentCatergry: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
      };
    };
    /** 拼版模板管理 */
    PermissionManageImposition: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
        SpecQuery: boolean
        SpecSetup: boolean
      };
    };
    /** 折手管理 */
    PermissionManageFolding: {
      HavePomission: boolean
      Obj: {
        ManageCatergry: boolean
        Query: boolean
        Setup: boolean
      };
    };
    /** 印色管理 */
    PermissionManageColor: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
      };
    };
    /** 领料管理 */
    PermissionRequisition: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
      };
    };
    /** 库存管理 */
    PermissionStorage: {
      HavePomission: boolean
      Obj: {
        Out: boolean
        In: boolean
        StockWarnQuery: boolean
        Inventory: boolean
        StockWarnSetup: boolean
      };
    };
    /** 出入库管理 */
    PermissionInOutStored: {
      HavePomission: boolean
      Obj: {
        OutStored: boolean
        Intored: boolean
      };
    };
    /** 物料管理 */
    PermissionMaterial: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
      };
    };
    /** 物料类型管理 */
    PermissionMaterialType: {
      HavePomission: boolean
      Obj: {
        ManageCatagry: boolean
        Query: boolean
        Setup: boolean
      };
    };
    /** 供应商管理 */
    PermissionSupplier: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
      };
    };
    /** 仓库管理 */
    PermissionWarehouse: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
        SetCode: boolean
        SetupMap: boolean
        QueryMap: boolean
      };
    };
    /** 员工管理 */
    PermissionManageStaffBase: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        ViewStaffDetail: boolean
        Add: boolean
        Edit: boolean
        Delete: boolean
        Dimission: boolean
        Check: boolean
        ImpositionUnLock: boolean
      };
    };
    /** 部门管理 */
    PermissionManageDepartment: {
      HavePomission: boolean
      Obj: {
        Manage: boolean
      };
    };
    /** 岗位管理 */
    PermissionManageJob: {
      HavePomission: boolean
      Obj: {
        Setup: boolean
        SetupPermission: boolean
      };
    };
    /** 转换服务器管理 */
    PermissionConvertServer: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
      };
    };
    /** 设置管理密码 */
    PermissionPassword: {
      HavePomission: boolean
      Obj: {
        Query: boolean
        Setup: boolean
      };
    };
  };
  Mobile: string;
  HeadPic: string;
}
