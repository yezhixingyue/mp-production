import { Base64 } from 'js-base64';

const k = () => {
  let _k = 'bGRse1nl6eCFAJCUlc0BTMTE1NCMj44CQIyQjJCMxNTZ9';
  _k = _k.slice(0, 5) + _k.slice(6);
  return Base64.decode(_k);
};

export default k;
