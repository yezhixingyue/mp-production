function ParentPickError() {
  this.result = '';
}

/** 处理validate-class校验得出的结果，提取其中第一条错误信息，如果没有错误则返回空字符串 */
ParentPickError.prototype.pickError = (list) => {
  const arr = list.map(it => Object.values(it.constraints || {})).flat().filter(it => it);

  return arr.length > 0 ? arr[0] : '';
};

const o = new ParentPickError();

console.log(o);
