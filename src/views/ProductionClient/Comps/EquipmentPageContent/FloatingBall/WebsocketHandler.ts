import { MpMessage } from '@/assets/js/utils/MpMessage';
import { IManageEquipmentInfo } from '@/views/productionManagePages/ManageEquipment/ManageEquipmentListPage/js/types';
// import { io } from 'socket.io-client';

/**
 * 动态更改未送出工单数量
 *
 * 同时处理多台设备未送出数量的展示
 *
 * 应知内容：
 * 1. 设备信息列表
 * 2. 当前设备信息（基础信息、登录状态） - 切换后会更新 -- 或可在外部处理(该类中暂不处理，暂定外部按条件展示)
 *
 * 实现步骤：
 * 1. 初始化
 * 2. 建立连接并获取最新状态数据
 * 3. 监听连接事件 - 更新未送出数量数据 （未登录时也可获取）
 *
 * 内容展示：
 * 1. 未登录时隐藏（或也展示），登录后展示实时数据
 *
 * 构造与重构时机：
 * 1. 页面初始化时
 * 2. 重新设置关联机器时 --- 或在 ManageClientClass.setTerminalEquipmentList 事件中一并处理
 *
 * 断开连接：浏览器自动断开? 待测试  如果不行则写方法手动断开
 *
 * 连接事件(暂定)：update
 *
 * @export
 * @class WebsocketHandler
 */
export class WebsocketHandler {
  /** 当前终端绑定的设备列表 */
  private EquipmentList: IManageEquipmentInfo[]

  public UnsendNumberDataList: { ID: string, Number: number }[] = []

  constructor(EquipmentList: IManageEquipmentInfo[]) {
    this.EquipmentList = EquipmentList;

    // 初始化操作
    this.init();
  }

  private async init() { // 如果需要重新连接 则要先断开连接 （应尽量避免该情况发生，设备数据有变化时可使用单一事件触发进行新数据获取）
    try {
      console.log('WebSocket init', this.EquipmentList);

      // 存放到类中 - 如果已有值 则仅更新设备数据即可 -- 暂定
      // const socket = io('ws://192.168.3.85:8200');

      // socket.on('message', (e) => {
      //   console.log('接收到message信息', e);
      // });

      // setTimeout(() => {
      //   const btn: HTMLElement | null = document.querySelector('#test-send-socket-btn');

      //   if (btn) {
      //     btn.onclick = () => {
      //       socket.emit('message', `来自客户端的信息：${Math.random()}`);
      //     };
      //   }
      // }, 10);
    } catch (error) {
      const msg = error instanceof Error ? error.message : '将导致未送出数量显示不准确';
      MpMessage.error({ title: '创建socket连接失败', msg });
    }
  }
}
