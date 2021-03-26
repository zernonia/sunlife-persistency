"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var db_1 = require("../db");
var json2csv_1 = require("json2csv");
var dndRouter = express_1.Router();
dndRouter.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, list, product, limra, mob, row, opts, json2csv, csv;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, list = _a.list, product = _a.product, limra = _a.limra, mob = _a.mob;
                return [4 /*yield*/, db_1.client.query('INSERT INTO public."generateLead"(file, priority, limra, product, mob) \
  VALUES ($1, $2, $3, $4, $5) RETURNING *', ["test" + product + ".csv", list, limra, product, mob])];
            case 1:
                row = (_b.sent()).rows;
                console.log(row);
                opts = { row: row };
                json2csv = new json2csv_1.Parser();
                csv = json2csv.parse(row);
                console.log(csv);
                res.header('Content-Type', 'text/csv');
                res.attachment('testing.csv');
                res.send(csv);
                return [2 /*return*/];
        }
    });
}); });
dndRouter.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var row, json2csv, csv;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.client.query('SELECT * FROM public."generateLead"')];
            case 1:
                row = (_a.sent()).rows;
                json2csv = new json2csv_1.Parser();
                csv = json2csv.parse(row);
                res.header('Content-Type', 'text/csv');
                res.attachment('testing.csv');
                res.send(csv);
                return [2 /*return*/];
        }
    });
}); });
dndRouter.post('/action', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, product, limra, row;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, product = _a.product, limra = _a.limra;
                return [4 /*yield*/, db_1.client.query('SELECT * FROM public."generateLead" WHERE limra = $1 AND product = $2 ORDER BY created_at DESC', [limra, product])];
            case 1:
                row = (_b.sent()).rows;
                res.json(row);
                return [2 /*return*/];
        }
    });
}); });
dndRouter.post('/old', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, product, limra, priority, mob, data, row, scoring, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, product = _a.product, limra = _a.limra, priority = _a.priority, mob = _a.mob;
                return [4 /*yield*/, db_1.client.query('SELECT "policy_no", "Client_Segment", "Age_Score", "Gender_Score", "Billing_Score", "Payment_Score" FROM public."clientData" WHERE "LIMRA" = $1 AND "Prod_Name_Group" = $2 AND "Next_Collection_Term" = $3', [limra, product, mob])];
            case 1:
                data = (_b.sent()).rows;
                return [4 /*yield*/, db_1.client.query('SELECT * FROM public."newData" WHERE "LIMRA" = $1 AND "Prod_Name_Group" = $2 AND "Next_Collection_Term" = $3', [limra, product, mob])];
            case 2:
                row = (_b.sent()).rows;
                scoring = priority.map(function (item, index) {
                    return {
                        priority: item,
                        score: 15 - (3 * index)
                    };
                });
                data.map(function (item, index) {
                    item.total_score = 0;
                    scoring.forEach(function (x) {
                        item.total_score += item[x.priority] * x.score;
                    });
                });
                result = row.map(function (a) { return (__assign(__assign({}, data.find(function (p) { return a.policy_no === p.policy_no; })), a)); });
                result.sort(function (a, b) {
                    if (a.total_score > b.total_score)
                        return -1;
                    if (a.total_score < b.total_score)
                        return 1;
                    return 0;
                });
                res.json({ priority: priority, scoring: scoring, data: data, row: row, result: result });
                return [2 /*return*/];
        }
    });
}); });
exports.default = dndRouter;
