export default class Draw {
  node:HTMLElement;

  constructor(node) {
    this.node = node;
  }

  // 画单元格
  tableCell(lint, isline = false) {
    console.log(this);
    console.log(lint);
  }
}
