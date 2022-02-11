export const forEachValue = (obj, callback) => {
    Object.keys(obj).forEach(key => callback(obj[key], key))
}

// 类似这样调用  forEachValue({ a: 1 }, function (value, key) {})
