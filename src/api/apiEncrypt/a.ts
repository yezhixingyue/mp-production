import { md5 } from 'js-md5';
import base64 from 'base64-js';
import _getTimestamp from './g';
import k from './k';

const string2Uint8Array = (str) => {
  const escaped = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

  const bytes = new Uint8Array(escaped.length);
  for (let i = 0; i < escaped.length; i += 1) {
    bytes[i] = escaped.charCodeAt(i);
  }

  return bytes;
};

const encrypt = async (token: string, mobile: string) => {
  const key = k();

  const { timestampUint8Array, timeContent } = await _getTimestamp();

  const strUint8Array = string2Uint8Array(mobile + (token || '') + key);

  const combineUint8Array = new Uint8Array([...timestampUint8Array, ...strUint8Array]);

  const _content = new Uint8Array([...md5.array(combineUint8Array), ...string2Uint8Array(';'), ...timestampUint8Array]);

  return {
    authStr: base64.fromByteArray(_content),
    timeContent,
  };
};

export default encrypt;
