"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupBy = void 0;
function groupBy(key) {
    return function group(array) {
        return array.reduce(function (acc, obj) {
            var property = obj[key];
            acc[property] = acc[property] || [];
            acc[property].push(obj);
            return acc;
        }, {});
    };
}
exports.groupBy = groupBy;
