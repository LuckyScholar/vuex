export const forEachValue = (obj, callback) => {
    Object.keys(obj).forEach(key => callback(obj[key], key))
}

forEachValue({ a: 1 }, function (value, key) {})
