"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.groupBy = void 0;
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
exports.verifyToken = function (req, res, next) {
    // const cookie = req.cookies.jwt
    // jwt.verify(cookie, 'dashboard', (err: any, unsigned: any) => {
    //   if(err) {
    //     res.sendStatus(403)
    //   } else if(unsigned) {
    //     const data = unsigned as UserToken
    //     req.user = data.username
    //     next()
    //   }
    // })
    next();
};
