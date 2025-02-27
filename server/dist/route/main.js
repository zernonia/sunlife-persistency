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
var db_1 = require("../db");
var func_1 = require("../utils/func");
var mainRouter = express_1.Router();
mainRouter.get('/');
function processData(row, MA) {
    var resObj = {};
    row.map(function (a) { return a.mth_id = Date.parse(a.mth_id); });
    row.sort(function (a, b) { return a.mth_id - b.mth_id; });
    var maxData = [];
    if (row.length) {
        for (var i = 1; i <= 12; i++) {
            if (i == 1) {
                maxData.push(row[row.length - i]["sum_MOB_" + i]);
            }
            else {
                maxData.push(row[row.length - i]["sum_MOB_" + i]);
            }
        }
    }
    row.map(function (a) {
        for (var i = 1; i <= 13; i++) {
            a["MOB_" + i + "_perc"] = Math.round(a["sum_MOB_" + i] / a.total * 1000) / 10;
            if (a["sum_MOB_" + i] == 0) {
                var index = i - 1;
                if (a["sum_MOB_" + index] == 0) {
                    a["MOB_" + i + "_predict"] = Math.round(a["MOB_" + index + "_predict"] * MA[index] / 100);
                }
                else {
                    a["MOB_" + i + "_predict"] = Math.round(a["sum_MOB_" + index] * MA[index] / 100);
                }
                a["MOB_" + i + "_predict_perc"] = Math.round(a["MOB_" + i + "_predict"] / a.total * 1000) / 10;
            }
        }
    });
    return { row: row, maxData: maxData };
}
function multiply(obj, start, end) {
    var startTime = start;
    var multiplier = 1;
    while (startTime <= end) {
        multiplier *= obj["target_MA_MOB_" + startTime];
        startTime++;
    }
    return multiplier;
}
function newProcessData(row, MA, single) {
    if (single === void 0) { single = false; }
    var collectedData = [];
    row.forEach(function (item, index) {
        if (index == 0) {
            for (var i = 1; i <= 13; i++) {
                collectedData.push(item["sum_MOB_" + i]);
            }
        }
        else {
            for (var i = 1; i <= 13; i++) {
                collectedData[i - 1] += item["sum_MOB_" + i];
            }
        }
    });
    var collectableDataArray = [];
    MA.forEach(function (ma, maIndex) {
        var _a, _b;
        var temp = (_a = {},
            _a[maIndex] = Object.values(collectedData),
            _a);
        row.forEach(function (item, index) {
            for (var i = 1; i <= 13; i++) {
                if (i == 1) {
                    temp[maIndex][i - 1] = temp[maIndex][i - 1] * ma["target_MA_MOB_" + i];
                }
                else {
                    temp[maIndex][i - 1] = temp[maIndex][i - 2] * ma["target_MA_MOB_" + i];
                }
            }
        });
        var tempMinusActual = (_b = {},
            _b[maIndex] = temp[maIndex].map(function (a, ai) { return a - collectedData[ai]; }),
            _b);
        var tempReturnArray = [];
        //// operate Kent Calculation
        var refIndex = 1;
        // looping Column (MOB1 - MOB13)
        var prevCol = [];
        for (var i = 0; i < 13; i++) {
            var sumPrevRef = 0;
            if (i == 0) {
                for (var j = 0; j < row.length; j++) {
                    prevCol.push(row[j]["sum_MOB_" + (i + 1)]);
                }
            }
            else {
                // sum up Previous column reference cell
                for (var k = 0; k < refIndex && k < row.length; k++) {
                    if (row[k]["sum_MOB_" + (i + 1)] == 0) {
                        sumPrevRef += prevCol[k];
                    }
                }
                sumPrevRef == 0 ? '' : refIndex++;
                for (var j = 0; j < row.length; j++) {
                    if (row[j]["sum_MOB_" + (i + 1)] == 0) {
                        // perform MIN(CELL , CELL / TOTALCELL * Multiplier)
                        var x = Math.min(prevCol[j], prevCol[j] / sumPrevRef * tempMinusActual[maIndex][i]);
                        prevCol[j] = x;
                    }
                    else {
                        prevCol[j] = row[j]["sum_MOB_" + (i + 1)];
                    }
                }
            }
            tempReturnArray.push(prevCol.reduce(function (a, b) { return a + b; }, 0));
        }
        collectableDataArray.push(tempReturnArray);
    });
    return { collectedData: collectedData, collectableDataArray: collectableDataArray };
}
function calculateOverallLIMRA(row, target) {
    var total = 0;
    var limra = 0;
    var limraTarget = 0;
    Object.keys(row).forEach(function (prod) {
        total += row[prod]['collectableDataArray'][target[prod][0]['target']][0];
        limra += row[prod]['collectableDataArray'][0][12];
        limraTarget += row[prod]['collectableDataArray'][target[prod][0]['target']][12];
    });
    return {
        actual: limra / total * 100,
        target: limraTarget / total * 100
    };
}
var querySum = "SELECT mth_id, \"Prod_Name_Group\",  count(\"MOB_1\") as total , sum(\"MOB_1\") as \"sum_MOB_1\", sum(\"MOB_2\") as \"sum_MOB_2\", sum(\"MOB_3\") as \"sum_MOB_3\", sum(\"MOB_4\") as \"sum_MOB_4\",   sum(\"MOB_5\") as \"sum_MOB_5\", sum(\"MOB_6\") as \"sum_MOB_6\", sum(\"MOB_7\") as \"sum_MOB_7\", sum(\"MOB_8\") as \"sum_MOB_8\",    sum(\"MOB_9\") as \"sum_MOB_9\", sum(\"MOB_10\") as \"sum_MOB_10\", sum(\"MOB_11\") as \"sum_MOB_11\", sum(\"MOB_12\") as \"sum_MOB_12\", sum(\"MOB_13\") as \"sum_MOB_13\",   sum(\"FYAP\") as \"sum_AFYP\"\n  ";
mainRouter.get('/maAll/:limra', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var limra, MA, target, row, groupByProduct, groupResult, groupMAResult, temp, groupByProduct2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                limra = req.params.limra;
                return [4 /*yield*/, db_1.client.query('SELECT * FROM public."newMA"')];
            case 1:
                MA = (_a.sent()).rows;
                return [4 /*yield*/, db_1.client.query('SELECT * FROM public.target')];
            case 2:
                target = (_a.sent()).rows;
                return [4 /*yield*/, db_1.client.query(querySum + "   FROM public.\"newData\"   WHERE \"LIMRA\" = $1   GROUP BY mth_id, \"Prod_Name_Group\"   ORDER BY \"Prod_Name_Group\", mth_id DESC ", [limra])];
            case 3:
                row = (_a.sent()).rows;
                groupByProduct = func_1.groupBy("Prod_Name_Group");
                groupResult = groupByProduct(row);
                groupMAResult = groupByProduct(MA);
                temp = {};
                Object.keys(groupResult).forEach(function (item) {
                    temp[item] = newProcessData(groupResult[item], groupMAResult[item]);
                });
                groupByProduct2 = func_1.groupBy('product');
                temp['Overall'] = calculateOverallLIMRA(temp, groupByProduct2(target));
                res.json(temp);
                return [2 /*return*/];
        }
    });
}); });
mainRouter.get('/ma', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var MA, row, groupByProduct, groupResult, groupMAResult, temp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.client.query("SELECT * FROM public.\"newMA\" WHERE \"Prod_Name_Group\" = 'DMTM_OTH'")];
            case 1:
                MA = (_a.sent()).rows;
                return [4 /*yield*/, db_1.client.query(" " + querySum + "   FROM public.\"newData\"   WHERE \"LIMRA\" = 2021 AND \"Prod_Name_Group\" = 'DMTM_OTH'   GROUP BY mth_id, \"Prod_Name_Group\"   ORDER BY \"Prod_Name_Group\", mth_id DESC ")];
            case 2:
                row = (_a.sent()).rows;
                groupByProduct = func_1.groupBy("Prod_Name_Group");
                groupResult = groupByProduct(row);
                groupMAResult = groupByProduct(MA);
                temp = {};
                Object.keys(groupResult).forEach(function (item) {
                    temp[item] = newProcessData(groupResult[item], groupMAResult[item]);
                });
                res.json(temp[Object.keys(groupResult)[0]]);
                return [2 /*return*/];
        }
    });
}); });
mainRouter.post('/ma', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, product, limra, MA, row, groupByProduct, groupResult, groupMAResult, temp;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, product = _a.product, limra = _a.limra;
                return [4 /*yield*/, db_1.client.query('SELECT * FROM public."newMA" WHERE "Prod_Name_Group" = $1', [product])];
            case 1:
                MA = (_b.sent()).rows;
                return [4 /*yield*/, db_1.client.query(querySum + "   FROM public.\"newData\"   WHERE \"LIMRA\" = $1 AND \"Prod_Name_Group\" = $2   GROUP BY mth_id, \"Prod_Name_Group\"   ORDER BY \"Prod_Name_Group\", mth_id DESC ", [limra, product])];
            case 2:
                row = (_b.sent()).rows;
                groupByProduct = func_1.groupBy("Prod_Name_Group");
                groupResult = groupByProduct(row);
                groupMAResult = groupByProduct(MA);
                temp = {};
                Object.keys(groupResult).forEach(function (item) {
                    temp[item] = newProcessData(groupResult[item], groupMAResult[item]);
                });
                res.json(temp[Object.keys(groupResult)[0]]);
                return [2 /*return*/];
        }
    });
}); });
exports.default = mainRouter;
