/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { md5 } from 'js-md5';
import _0x52942a from 'base64-js';
import _0xa7e259 from './g';
import _0x2182aa from './k';

// eslint-disable-next-line max-len
const _0x1676 = ['length', 'replace', 'charCodeAt']; const _0x43dc = function (_0x16769b, _0x43dcbb) { _0x16769b -= 0x0; const _0x433066 = _0x1676[_0x16769b]; return _0x433066; }; const string2Uint8Array = _0x3d73bb => { const _0x348598 = encodeURIComponent(_0x3d73bb)[_0x43dc('0x1')](/%([0-9A-F]{2})/g, (_0x25d679, _0x3e42ca) => String.fromCharCode(parseInt(_0x3e42ca, 0x10))); const _0x4e6e49 = new Uint8Array(_0x348598[_0x43dc('0x0')]); for (let _0x4bb9bd = 0x0; _0x4bb9bd < _0x348598.length; _0x4bb9bd += 0x1) { _0x4e6e49[_0x4bb9bd] = _0x348598[_0x43dc('0x2')](_0x4bb9bd); } return _0x4e6e49; }; const e = async (_0x3b322c, _0x53f8a6) => { const _0x2e4e66 = _0x2182aa(); const { timestampUint8Array, timeContent } = await _0xa7e259(); const _0x56198a = string2Uint8Array(_0x53f8a6 + (_0x3b322c || '') + _0x2e4e66); const _0x27f047 = new Uint8Array([...timestampUint8Array, ..._0x56198a]); const _0x2620b2 = new Uint8Array([...md5.array(_0x27f047), ...string2Uint8Array(';'), ...timestampUint8Array]); return { authStr: _0x52942a.fromByteArray(_0x2620b2), timeContent }; }; export default e;
