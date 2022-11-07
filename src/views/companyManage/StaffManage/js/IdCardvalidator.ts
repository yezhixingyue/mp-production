import { SexEnum } from './enums';

/**
 * 验证身份证是否正确
 *
 * @param {*} idCard
 * @returns
 */
export const validateIdCard = (idCard: string) => {
  const code = idCard.toUpperCase();

  // 前2位城市码
  const city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 ',
  };
  // 加权因子
  const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  // 校验位
  const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
  // 身份证简单正则
  const Reg = /^\d{6}(18|19|20)?\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  // 身份证号码数组
  const arrCode = code.split('');

  // 校验编码为空，简单正则，城市编码
  if (!code || !Reg.test(code) || !city[code.substr(0, 2)] || code.length !== 18) {
    return false;
  }

  // 校验18位身份证需要验证最后一位校验位
  // ∑(ai×Wi)(mod 11)
  let sum = 0;
  for (let i = 0; i < 17; i += 1) {
    sum += +arrCode[i] * factor[i];
  }

  return parity[sum % 11].toString() === arrCode[17];
};

/**
 * 从身份证号中提取生日及性别信息
 *
 * @param {*} idCard
 * @returns
 */
export const getInfoFormIdCard = (idCard: string) => {
  if (!idCard) return null;

  const _idCard = idCard.toUpperCase();
  let sexBit;
  let birthString;

  if (_idCard.length === 18 && validateIdCard(_idCard)) {
    sexBit = _idCard.substr(16, 1);
    birthString = _idCard.substr(6, 8);
  } else if (_idCard.length === 15) {
    sexBit = _idCard.substr(13, 1);
    birthString = `19${_idCard.substr(6, 6)}`;
  }

  if (birthString && Number.isInteger(+sexBit)) {
    const Birthday = `${birthString.substr(0, 4)}-${birthString.substr(4, 2)}-${birthString.substr(6, 2)}T00:00:00`;
    const Sex = +sexBit % 2 === 0 ? SexEnum.female : SexEnum.male;
    return { Birthday, Sex };
  }
  return null;
};
