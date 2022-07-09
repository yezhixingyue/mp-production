/* eslint-disable max-len */
const jsonstringify = (data) => {
  // Check if an object has a circular reference
  const isCyclic = (object) => { // 检查一个对象是否有循环引用
    // Use a Set to store the detected objects
    const stackSet = new Set(); // 堆栈集合
    let detected = false; // 是否检测到

    const detect = (obj) => {
      // If it is not an object, we can skip it directly
      if (obj && typeof obj !== 'object') {
        return;
      }
      // When the object to be checked already exists in the stackSet,
      // it means that there is a circular reference
      if (stackSet.has(obj)) {
        detected = true;
        return;
      }
      // save current obj to stackSet
      stackSet.add(obj);

      // check all property of `obj`
      Object.keys(obj).forEach(key => {
        detect(obj[key]);
      });
      // After the detection of the same level is completed,
      // the current object should be deleted to prevent misjudgment
      /*
        For example: different properties of an object may point to the same reference,
        which will be considered a circular reference if not deleted

        let tempObj = {
          name: 'bytefish'
        }
        let obj4 = {
          obj1: tempObj,
          obj2: tempObj
        }
      */
      stackSet.delete(obj);
    };

    detect(object);

    return detected;
  };

  // Throws a TypeError ("cyclic object value") exception when a circular reference is found.
  if (isCyclic(data)) { // 一个循环引用的对象无法转换为json格式
    throw new TypeError('Converting circular structure to JSON');
  }

  // Throws a TypeError  when trying to stringify a BigInt value.
  if (typeof data === 'bigint') { // bigint格式的数据无法转换为json格式
    throw new TypeError('Do not know how to serialize a BigInt');
  }

  const type = typeof data;
  const commonKeys1 = ['undefined', 'function', 'symbol'];
  const getType = (s) => Object.prototype.toString.call(s).replace(/\[object (.*?)\]/, '$1').toLowerCase();

  if (type !== 'object' || data === null) {
    let result = data;
    // The numbers Infinity and NaN, as well as the value null, are all considered null.
    if ([NaN, Infinity, null].includes(data)) {
      result = 'null';

      // undefined, arbitrary functions, and symbol values are converted individually and return undefined
    } else if (commonKeys1.includes(type)) {
      return undefined;
    } else if (type === 'string') {
      result = `"${data}"`;
    }

    return String(result);
  }
  // If the target object has a toJSON() method, it's responsible to define what data will be serialized.

  // The instances of Date implement the toJSON() function by returning a string (the same as date.toISOString()). Thus, they are treated as strings.
  if (typeof data.toJSON === 'function') {
    return jsonstringify(data.toJSON());
  }
  if (Array.isArray(data)) {
    // 3# undefined, Functions, and Symbols are not valid JSON values. If any such values are encountered during conversion they are either omitted (when found in an object) or changed to null (when found in an array).
    const result = data.map((it) => (commonKeys1.includes(typeof it) ? 'null' : jsonstringify(it)));

    return `[${result}]`.replace(/'/g, '"');
  }
  // 2# Boolean, Number, and String objects are converted to the corresponding primitive values during stringification, in accord with the traditional conversion semantics.
  if (['boolean', 'number'].includes(getType(data))) {
    return String(data);
  }
  if (getType(data) === 'string') {
    return `"${data}"`;
  }
  const result = [];
  // 7# All the other Object instances (including Map, Set, WeakMap, and WeakSet) will have only their enumerable properties serialized.
  Object.keys(data).forEach((key) => {
    // 4# All Symbol-keyed properties will be completely ignored
    if (typeof key !== 'symbol') {
      const value = data[key];
      // 3# undefined, Functions, and Symbols are not valid JSON values. If any such values are encountered during conversion they are either omitted (when found in an object) or changed to null (when found in an array).
      if (!commonKeys1.includes(typeof value)) {
        result.push(`"${key}":${jsonstringify(value)}`);
      }
    }
  });

  return `{${result}}`.replace(/'/, '"');
};

export default jsonstringify;
