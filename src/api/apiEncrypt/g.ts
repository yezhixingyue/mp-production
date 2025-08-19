/* eslint-disable no-bitwise */
/* eslint-disable no-undef */
import api from '../index';

function timestampToUint8Array(timestamp, littleEndian) {
  const uint8Array = new Uint8Array(8);
  const high = Math.floor(timestamp / 0x100000000);
  const low = timestamp % 0x100000000;

  if (littleEndian) {
    for (let i = 0; i < 4; i += 1) {
      uint8Array[i] = (low >> (i * 8)) & 0xff;
    }
    for (let j = 4; j < 8; j += 1) {
      uint8Array[j] = (high >> ((j - 4) * 8)) & 0xff;
    }
  } else {
    for (let k = 0; k < 4; k += 1) {
      uint8Array[k] = (high >> ((3 - k) * 8)) & 0xff;
    }
    for (let l = 4; l < 8; l += 1) {
      uint8Array[l] = (low >> ((7 - l) * 8)) & 0xff;
    }
  }

  return uint8Array;
}

let diff = 0;
let serverTimestamp = 0;
let getServerTimestampTime = 0;
const _getTimestamp = async () => {
  if (diff) {
    return diff + Date.now();
  }

  const _fetchTimestamp = async () => {
    const res = await api.getTimestamp().catch(() => null);
    if (res?.data?.isSuccess) {
      return Number(res.data.Data);
    }
    return null;
  };

  const timestamp = await _fetchTimestamp();
  if (timestamp) {
    serverTimestamp = timestamp;
    getServerTimestampTime = Date.now();

    diff = timestamp - getServerTimestampTime;

    return diff + Date.now();
  }

  return Date.now();
};

const getTimestamp = async () => {
  const timestamp2Server = await _getTimestamp();

  return {
    timestampUint8Array: timestampToUint8Array(timestamp2Server, true),
    timeContent: `${Date.now()}-${timestamp2Server}-${serverTimestamp}-${getServerTimestampTime}-${diff}`,
  };
};

export default getTimestamp;
