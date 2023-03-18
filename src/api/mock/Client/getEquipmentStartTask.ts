// import Mock from 'mockjs';
// import {
//   IEquipmentChunkInfo,
//   ITaskOrderInfo, IEquipmentPlateInfo, ITaskDetail, ITaskWorkingInfo,
// } from '@/views/ProductionClient/assets/js/types';
// import { ProductiveTaskStatusEnum } from '@/views/ProductionClient/assets/js/enum';
// import { ReportModeEnum, WorkingTypeEnum } from '@/views/productionSetting/process/enums';
// import { IConvertAssistInfo } from '@/views/productionManagePages/ManualOrderHandlerPage/js/types';
// import { AssistInfoTypeEnum } from '@/views/productionResources/assistInfo/TypeClass/assistListConditionClass';
// import { TargetTypeEnum } from '@/views/ExceptionManage/_ExceptionCommonViews/SetupView/js/enum';

// export default () => {
//   const OrderInfo: ITaskOrderInfo = {
//     ID: 'ID',
//     ServerName: '名片之家',
//     OrderID: '1-10032155667',
//     Content: '大学生理论知识手册成品21+14厘米带封面52P 封面200克单面印单面亚膜 内文70克双胶双面黑色竖版胶装6000本骑马钉',
//     FirstLevel: '画册',
//     SecondLevel: '商务画册',
//     Product: '骑马订画册',
//     Unit: '本',
//     Size: '装订边260x宽185mm',
//     WorkingList: [],
//   };

//   const PlateInfo: IEquipmentPlateInfo = {
//     ID: '10032155667-1',
//     Code: 10032155667,
//     Template: '印刷版',
//     TemplateSize: '四开自翻200模位',
//     Material: '太阳牌 双胶纸 128g 超白',
//     Unit: '张',
//     WorkingList: [],
//   };

//   const ChunkInfo: IEquipmentChunkInfo = {
//     ID: '123',
//     Name: '封面-1/3',
//     Unit: '张',
//     Size: '装订边260x宽185mm',
//     WorkingList: [],
//   };

//   const AssistList: IConvertAssistInfo[] = [{
//     ID: '123',
//     _Name: '',
//     Name: '',
//     Type: AssistInfoTypeEnum.text,
//     Content: '烫印 [正面 哑金 30x30mm，反面 哑银 20x20mm]',
//     Value: '',
//     FilePath: '',
//     IsImage: false,
//   }, {
//     ID: '123456',
//     _Name: '',
//     Name: '',
//     Type: AssistInfoTypeEnum.text,
//     Content: '骑马钉',
//     Value: '',
//     FilePath: '',
//     IsImage: false,
//   }, {
//     ID: '123457',
//     _Name: '',
//     Name: '烫印示意图0',
//     Type: AssistInfoTypeEnum.file,
//     Content: '',
//     Value: '',
//     FilePath: '/abc.bmp',
//     IsImage: true,
//   }, {
//     ID: '123458',
//     _Name: '',
//     Name: '烫印示意图1',
//     Type: AssistInfoTypeEnum.file,
//     Content: '',
//     Value: '',
//     FilePath: 'https://erp.ybz888.com//Image/20221008/97a84f2dc4bf442ea781a591a12a0a33.jpeg',
//     IsImage: false,
//   }, {
//     ID: '123459',
//     _Name: '',
//     Name: '客户端安装包v3.0',
//     Type: AssistInfoTypeEnum.file,
//     Content: '',
//     Value: '',
//     FilePath: 'https://order.ybz888.com/Private/Files/mpzj_download_client_v3.rar',
//     IsImage: false,
//   }, {
//     ID: '123450',
//     _Name: '',
//     Name: '烫印示意图3',
//     Type: AssistInfoTypeEnum.file,
//     Content: '',
//     Value: '',
//     FilePath: '/Screensho2312321312t.png',
//     IsImage: true,
//   }, {
//   //   ID: '123460',
//   //   _Name: '',
//   //   Name: '烫印示意图4',
//   //   Type: AssistInfoTypeEnum.file,
//   //   Content: '',
//   //   Value: '',
//   //   FilePath: 'https://erp.ybz888.com//Image/20211216/b08aac4e59b94c99ae8f1993769c33a4.jpeg',
//   //   IsImage: true,
//   // }, {
//   //   ID: '123461',
//   //   _Name: '',
//   //   Name: '烫印示意图5',
//   //   Type: AssistInfoTypeEnum.file,
//   //   Content: '',
//   //   Value: '',
//   //   FilePath: 'https://erp.ybz888.com//Image/20211216/5b4ac059f77a4dc8bb2cb1db2c2a12bf.jpeg',
//   //   IsImage: true,
//   // }, {
//     ID: '123462',
//     _Name: '',
//     Name: '烫印示意图6',
//     Type: AssistInfoTypeEnum.file,
//     Content: '',
//     Value: '',
//     FilePath: 'https://erp.ybz888.com//Image/20220516/3a3793dcf4cb4004b4f27ad452b36f9b.png',
//     IsImage: true,
//   }, {
//     ID: '123463',
//     _Name: '',
//     Name: '烫印示意图7',
//     Type: AssistInfoTypeEnum.file,
//     Content: '',
//     Value: '',
//     FilePath: 'https://erp.ybz888.com//Image/20220513/0c965c7cc9ff453589c52abfd81d0efd.jpeg',
//     IsImage: true,
//   }];

//   const ReportMode = [ReportModeEnum.order, ReportModeEnum.block, ReportModeEnum.board][Math.floor(Math.random() * 3)];

//   const Working: ITaskWorkingInfo = {
//     TaskWorkingID: '123222',
//     WorkingID: '123',
//     LineID: '123',
//     WorkingName: '覆膜',
//     TargetType: TargetTypeEnum.Order,
//     TargetID: '234',
//     Type: WorkingTypeEnum.normal,
//     ReportMode,
//     AllowPartReport: true,
//     MinPartReportNumber: 10000,
//     AllowBatchReport: false,
//     Wastage: 0,
//     PrepareDuration: 0,
//     ProductionDuration: 0,
//     DryDuration: 0,
//     WorkTimes: 1,
//     Index: 1,
//     // MaterialList: [],
//     AssistList,
//     /** 大版报工时没有该信息 */
//     OrderInfo,
//     /** 订单和块报工时没有该信息 */
//     PlateInfo,
//     ChunkInfo,
//     Number: 200,
//   };

//   const Data: Partial<ITaskDetail> = {
//     ID: 'ID',
//     Code: 10032155667,
//     Status: ProductiveTaskStatusEnum.Initial,
//     TotalNumber: 100000,
//     UnFinishNumber: 40000,
//     Index: 1,
//     Working,
//     Equipment: {
//       ID: 'ID',
//       Name: '覆膜机',
//       GroupID: 'GroupID',
//       GroupName: '覆膜组',
//       ClassID: 1,
//       ClassName: '分类名',
//       IsExternalFactory: false,
//     },
//     NextWorkingList: [{
//       ID: 'ID',
//       /** 名称 */
//       Name: '裁切',
//       /** 加工设备 */
//       Equipment: {
//         ID: 'ID',
//         Name: '3号机',
//         GroupID: 'GroupID',
//         GroupName: '裁切机',
//         ClassID: 1,
//         ClassName: '分类名',
//         IsExternalFactory: false,
//       },
//       /** 颜色 */
//       Color: '',
//       TaskWorkingID: '123',
//       NextTaskWorkingID: '233',
//       TargetID: '1222',
//       Type: 0,
//     }],
//     CreateTime: '',
//     StartTime: '',
//     LatestFinishTime: '',
//   };

//   console.log(Data);

//   return Mock.mock({
//     Status: 1000,
//     Message: '',
//     DataNumber: 20,
//     VersionCode: 0,
//     Data,
//   });
// };
