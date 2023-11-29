/* eslint-disable @typescript-eslint/no-explicit-any */
import clientApi from '@/api/client';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import { getLocalMachineCode } from '@/views/ProductionClient/assets/js/getLocalMachineCode';

export interface IUndeliveredListItem {
  EquipmentID: string
  UndeliveredNumber: number
}

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
  private terminal = ''

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private chatServer: any = null;

  public UndeliveredList: IUndeliveredListItem[] = []

  private async init() { // websocket连接初始化
    try {
      const createLinks = (url: string) => {
        const t = document.head.querySelector(`script[src="${url}"]`);
        if (t) return true;

        return new Promise((resolve) => {
          const link = document.createElement('script');

          link.src = url;
          link.type = 'text/javascript';

          link.onload = () => {
            resolve(true);
          };

          document.head.appendChild(link);
        });
      };

      const basicUrl = process.env.NODE_ENV === 'production' ? '' : 'http://192.168.3.68:8052';

      await createLinks(`${basicUrl}/Scripts/jquery-3.6.0.min.js`);
      await createLinks(`${basicUrl}/Scripts/jquery.signalR-2.4.3.min.js`);
      await createLinks(`${basicUrl}/signalr/hubs`);

      if (!this.terminal) {
        this.terminal = await getLocalMachineCode();
      }

      const chat = ($ as any).connection.messageHub;
      chat.connection.url = '/signalr';

      chat.client.UpdateUnReceivedNumber = (EquipmentID: string, UndeliveredNumber: number) => { // 单个设备未送出信息有变动
        const t = this.UndeliveredList.find(it => it.EquipmentID === EquipmentID);
        if (t) {
          t.UndeliveredNumber = UndeliveredNumber;
        } else {
          this.UndeliveredList.push({
            EquipmentID,
            UndeliveredNumber,
          });
        }

        console.log('UpdateUnReceivedNumber', EquipmentID, UndeliveredNumber);
        console.log('target UndeliveredList', t, this.UndeliveredList);
      };

      ($ as any).connection.hub.start().done(() => {
        this.chatServer = chat.server;

        chat.server.connect(this.terminal).done(() => {
          this.getAllUndeliveredList();
        });
      });
    } catch (error) {
      this.UndeliveredList = [];
      const msg = error instanceof Error ? error.message : '将导致未送出数量显示不准确';
      MpMessage.error({ title: '创建socket连接失败', msg });
    }
  }

  /** 获取当前终端全部设备的未送出数据 */
  public getAllUndeliveredList() {
    if (!this.chatServer) {
      this.init();
      return;
    }

    this.chatServer.getUndeliveredList(this.terminal)
      .done((result: IUndeliveredListItem[]) => {
        this.UndeliveredList = result || [];
        console.log('getAllUndeliveredList getUndeliveredList done result', result);
      })
      .catch((error) => {
        this.UndeliveredList = [];

        const msg = error instanceof Error ? error.message : '将导致未送出数量显示不准确';
        MpMessage.error({ title: '创建socket连接失败', msg });
      });
  }

  private timer: undefined | number

  public async start() { // 暂不使用websocket
    if (typeof this.timer === 'number') {
      clearTimeout(this.timer);
      this.timer = undefined;
    }

    if (!this.terminal) {
      this.terminal = await getLocalMachineCode();
    }
    const resp = await clientApi.getEquipmentUndeliveredList(this.terminal).catch(() => null);

    let needRepeat = true;

    if (resp?.data.isSuccess) {
      this.UndeliveredList = resp.data.Data || [];
      if (!this.UndeliveredList.find(it => it.UndeliveredNumber > 0)) {
        needRepeat = false;
      }
    }

    if (needRepeat) {
      this.timer = setTimeout(() => {
        this.start();
      }, 10 * 1000);
    }
  }
}
