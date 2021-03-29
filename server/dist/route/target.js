"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var targetRouter = express_1.Router();
var db_1 = require("../db");
var func_1 = require("../utils/func");
targetRouter.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, product, limra, target, row, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, product = _a.product, limra = _a.limra, target = _a.target;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 5]);
                return [4 /*yield*/, db_1.client.query('SELECT * FROM public.target WHERE product = $1 AND limra = $2', [product, limra])];
            case 2:
                row = (_b.sent()).rows;
                return [3 /*break*/, 5];
            case 3:
                err_1 = _b.sent();
                return [4 /*yield*/, db_1.client.query('INSERT INTO public.target(product, limra, target) \
      VALUES ($1, $2, $3) RETURNING *', [product, limra, target])];
            case 4:
                row = (_b.sent()).rows;
                return [3 /*break*/, 5];
            case 5:
                res.json(row);
                return [2 /*return*/];
        }
    });
}); });
targetRouter.put('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, product, limra, target, row;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, product = _a.product, limra = _a.limra, target = _a.target;
                return [4 /*yield*/, db_1.client.query('UPDATE public.target SET target = $3 WHERE product = $1 AND limra = $2 RETURNING *', [product, limra, target])];
            case 1:
                row = (_b.sent()).rows;
                res.json(row);
                return [2 /*return*/];
        }
    });
}); });
targetRouter.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var row, groupByProduct, groupResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.client.query('SELECT * FROM public.target WHERE limra = 2021')];
            case 1:
                row = (_a.sent()).rows;
                groupByProduct = func_1.groupBy('product');
                groupResult = groupByProduct(row);
                res.json(groupResult);
                return [2 /*return*/];
        }
    });
}); });
exports.default = targetRouter;
