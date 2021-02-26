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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var better_sqlite3_1 = __importDefault(require("better-sqlite3"));
var fs_1 = __importDefault(require("fs"));
var PORT = 3000;
var db = new better_sqlite3_1.default('./db/persistency.db');
var dataLocation = 'C:/Users/sians/OneDrive/Desktop/SL/sunlife-persistency/server/db/';
var app = express_1.default();
app.use(express_1.default.json());
app.use(cors_1.default());
function toRows(stmt, params) {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, stmt.columns().map(function (column) { return column.name; })];
            case 1:
                _b.sent();
                if (!params) return [3 /*break*/, 3];
                return [5 /*yield**/, __values((_a = stmt.raw()).iterate.apply(_a, __spread(params)))];
            case 2:
                _b.sent();
                return [3 /*break*/, 5];
            case 3: return [5 /*yield**/, __values(stmt.raw().iterate())];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}
function writeToCSV(filename, stmt, params) {
    return new Promise(function (resolve, reject) {
        var e_1, _a;
        var stream = fs_1.default.createWriteStream(filename);
        try {
            for (var _b = __values(toRows(stmt, params)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var row = _c.value;
                stream.write(row.join(',') + '\n');
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        stream.on('error', reject);
        stream.end(resolve);
    });
}
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
function calculateOverallLIMRA(row, MA) {
    var collectedData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var collectableData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    Object.keys(row).forEach(function (item, index) {
        row[item].forEach(function (subItem, index) {
            var refMaxData = 0;
            var refIndex = 0;
            var maIndex = MA.findIndex(function (x) { return x.Prod_Name_Group == subItem.Prod_Name_Group; });
            var ma = MA[maIndex];
            for (var i = 1; i <= 13; i++) {
                collectedData[i - 1] += subItem["sum_MOB_" + i];
                if (subItem["sum_MOB_" + i] == 0) {
                    if (refMaxData == 0) {
                        refMaxData = subItem["sum_MOB_" + (i - 1)];
                        refIndex = i;
                    }
                    collectableData[i - 1] += (Math.round(refMaxData * multiply(ma, refIndex, i)));
                }
            }
        });
    });
    var initialValue = Math.round((collectedData[collectedData.length - 1] + collectableData[collectedData.length - 1]) / collectedData[0] * 1000) / 10;
    return initialValue;
}
app.get('/initial', function (req, res) {
    var row = db.prepare("SELECT * FROM Initial_DMTM_2021").all();
    // "SELECT mth_id, count(MOB_1) as total, count(payment_method='DEBITC' or null) as C , sum(MOB_1) as sum_MOB_1, sum(MOB_2) as sum_MOB_2, sum(MOB_3) as sum_MOB_3, sum(MOB_4) as sum_MOB_4, \
    // sum(MOB_5) as sum_MOB_5, sum(MOB_6) as sum_MOB_6, sum(MOB_7) as sum_MOB_7, sum(MOB_8) as sum_MOB_8, \
    // sum(MOB_9) as sum_MOB_9, sum(MOB_10) as sum_MOB_10, sum(MOB_11) as sum_MOB_11, sum(MOB_12) as sum_MOB_12, sum(MOB_13) as sum_MOB_13 \
    // FROM Persistency_Data GROUP BY mth_id ORDER BY mth_id DESC"
    var rowLastLIMRA = db.prepare("SELECT mth_id, count(MOB_1) as total , sum(MOB_3) as sum_MOB_3,   sum(MOB_6) as sum_MOB_6, sum(MOB_9) as sum_MOB_9, sum(MOB_12) as sum_MOB_12   FROM Persistency_Data   WHERE Prod_Name_Group IN ('DMTM_OTH')   AND Channel IN ('DMTM')   AND LIMRA IN (2020)").all();
    var lastLIMRAMOB = {
        mob3: Math.round(rowLastLIMRA[0].sum_MOB_3 / rowLastLIMRA[0].total * 1000) / 10,
        mob6: Math.round(rowLastLIMRA[0].sum_MOB_6 / rowLastLIMRA[0].total * 1000) / 10,
        mob9: Math.round(rowLastLIMRA[0].sum_MOB_9 / rowLastLIMRA[0].total * 1000) / 10,
        mob12: Math.round(rowLastLIMRA[0].sum_MOB_12 / rowLastLIMRA[0].total * 1000) / 10,
    };
    var newDBMA = db.prepare("SELECT * FROM MA WHERE Prod_Name_Group = 'DMTM_OTH'").all();
    var MA = Object.values(newDBMA[0]).slice(1).map(function (item) { return item * 100; });
    var processed = processData(row, MA);
    res.json({ row: processed.row, MA: MA, maxData: processed.maxData, lastLIMRAMOB: lastLIMRAMOB });
});
app.get('/new', function (req, res) {
    var row = db.prepare("SELECT mth_id, sum(MOB_1) as sum_MOB_1, sum(MOB_2) as sum_MOB_2, sum(MOB_3) as sum_MOB_3, sum(MOB_4) as sum_MOB_4, \
    sum(MOB_5) as sum_MOB_5, sum(MOB_6) as sum_MOB_6, sum(MOB_7) as sum_MOB_7, sum(MOB_8) as sum_MOB_8, \
    sum(MOB_9) as sum_MOB_9, sum(MOB_10) as sum_MOB_10, sum(MOB_11) as sum_MOB_11, sum(MOB_12) as sum_MOB_12, sum(MOB_13) as sum_MOB_13, \
    count(MOB_1) as total , avg(MOB_1) as avg_MOB_1, avg(MOB_2) as avg_MOB_2, avg(MOB_3) as avg_MOB_3, avg(MOB_4) as avg_MOB_4, \
    avg(MOB_5) as avg_MOB_5, avg(MOB_6) as avg_MOB_6, avg(MOB_7) as avg_MOB_7, avg(MOB_8) as avg_MOB_8, \
    avg(MOB_9) as avg_MOB_9, avg(MOB_10) as avg_MOB_10, avg(MOB_11) as avg_MOB_11, avg(MOB_12) as avg_MOB_12, avg(MOB_13) as avg_MOB_13 , \
    avg(est_MOB_1) as est_MOB_1, avg(est_MOB_2) as est_MOB_2, avg(est_MOB_3) as est_MOB_3, avg(est_MOB_4) as est_MOB_4, avg(est_MOB_5) as est_MOB_5, avg(est_MOB_6) as est_MOB_6, \
    avg(est_MOB_7) as est_MOB_7, avg(est_MOB_8) as est_MOB_8, avg(est_MOB_9) as est_MOB_9, avg(est_MOB_10) as est_MOB_10, avg(est_MOB_11) as est_MOB_11, avg(est_MOB_12) as est_MOB_12, \
    avg(est_MOB_11) as est_MOB_11 \
    FROM newData \
    WHERE Prod_Name_Group = 'DMTM_OTH' \
    GROUP BY mth_id ORDER BY mth_id DESC").all();
    res.json({ row: row });
});
app.get('/ma', function (req, res) {
    var MA = db.prepare("SELECT * FROM newMA WHERE Prod_Name_Group = 'DMTM_OTH' ").all();
    var row = db.prepare("SELECT mth_id, Prod_Name_Group,  count(MOB_1) as total , sum(MOB_1) as sum_MOB_1, sum(MOB_2) as sum_MOB_2, sum(MOB_3) as sum_MOB_3, sum(MOB_4) as sum_MOB_4, \
  sum(MOB_5) as sum_MOB_5, sum(MOB_6) as sum_MOB_6, sum(MOB_7) as sum_MOB_7, sum(MOB_8) as sum_MOB_8,  \
  sum(MOB_9) as sum_MOB_9, sum(MOB_10) as sum_MOB_10, sum(MOB_11) as sum_MOB_11, sum(MOB_12) as sum_MOB_12, sum(MOB_13) as sum_MOB_13  \
  FROM newData \
  WHERE LIMRA = 2021 AND Prod_Name_Group = 'DMTM_OTH' \
  GROUP BY mth_id, Prod_Name_Group \
  ORDER BY Prod_Name_Group, mth_id \
  ").all();
    row.map(function (a) { return a.mth_id = Date.parse(a.mth_id); });
    row.sort(function (a, b) { return a['Prod_Name_Group'].localeCompare(b['Prod_Name_Group']) || b.mth_id - a.mth_id; });
    var groupByProduct = groupBy("Prod_Name_Group");
    var groupResult = groupByProduct(row);
    var groupMAResult = groupByProduct(MA);
    var temp = {};
    Object.keys(groupResult).forEach(function (item) {
        temp[item] = newProcessData(groupResult[item], groupMAResult[item]);
    });
    res.json(temp[Object.keys(groupResult)[0]]);
});
app.post('/ma', function (req, res) {
    var _a = req.body, product = _a.product, limra = _a.limra;
    var MA = db.prepare("SELECT * FROM newMA   WHERE Prod_Name_Group = ?   ").all(product);
    var row = db.prepare("SELECT mth_id, Prod_Name_Group,  count(MOB_1) as total , sum(MOB_1) as sum_MOB_1, sum(MOB_2) as sum_MOB_2, sum(MOB_3) as sum_MOB_3, sum(MOB_4) as sum_MOB_4,   sum(MOB_5) as sum_MOB_5, sum(MOB_6) as sum_MOB_6, sum(MOB_7) as sum_MOB_7, sum(MOB_8) as sum_MOB_8,    sum(MOB_9) as sum_MOB_9, sum(MOB_10) as sum_MOB_10, sum(MOB_11) as sum_MOB_11, sum(MOB_12) as sum_MOB_12, sum(MOB_13) as sum_MOB_13    FROM newData   WHERE LIMRA = ? AND   Prod_Name_Group = ?   GROUP BY mth_id, Prod_Name_Group   ORDER BY Prod_Name_Group, mth_id   ").all(limra, product);
    row.map(function (a) { return a.mth_id = Date.parse(a.mth_id); });
    row.sort(function (a, b) { return a['Prod_Name_Group'].localeCompare(b['Prod_Name_Group']) || b.mth_id - a.mth_id; });
    var groupByProduct = groupBy("Prod_Name_Group");
    var groupResult = groupByProduct(row);
    var groupMAResult = groupByProduct(MA);
    var temp = {};
    Object.keys(groupResult).forEach(function (item) {
        temp[item] = newProcessData(groupResult[item], groupMAResult[item]);
    });
    res.json(temp[Object.keys(groupResult)[0]]);
});
app.get('/maAll', function (req, res) {
    var MA = db.prepare("SELECT * FROM newMA").all();
    var row = db.prepare("SELECT mth_id, Prod_Name_Group,  count(MOB_1) as total , sum(MOB_1) as sum_MOB_1, sum(MOB_2) as sum_MOB_2, sum(MOB_3) as sum_MOB_3, sum(MOB_4) as sum_MOB_4, \
  sum(MOB_5) as sum_MOB_5, sum(MOB_6) as sum_MOB_6, sum(MOB_7) as sum_MOB_7, sum(MOB_8) as sum_MOB_8,  \
  sum(MOB_9) as sum_MOB_9, sum(MOB_10) as sum_MOB_10, sum(MOB_11) as sum_MOB_11, sum(MOB_12) as sum_MOB_12, sum(MOB_13) as sum_MOB_13  \
  FROM newData \
  WHERE LIMRA = 2021 \
  GROUP BY mth_id, Prod_Name_Group \
  ORDER BY Prod_Name_Group, mth_id \
  ").all();
    row.map(function (a) { return a.mth_id = Date.parse(a.mth_id); });
    row.sort(function (a, b) { return a['Prod_Name_Group'].localeCompare(b['Prod_Name_Group']) || b.mth_id - a.mth_id; });
    var groupByProduct = groupBy("Prod_Name_Group");
    var groupResult = groupByProduct(row);
    var groupMAResult = groupByProduct(MA);
    var temp = {};
    Object.keys(groupResult).forEach(function (item) {
        temp[item] = newProcessData(groupResult[item], groupMAResult[item]);
    });
    temp['Overall'] = calculateOverallLIMRA(groupResult, MA);
    res.json(temp);
});
app.post('/prepareData', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, filename, filepath, row;
    return __generator(this, function (_a) {
        product = req.body;
        filename = 'persistency_' + product.toString() + '.csv';
        filepath = dataLocation + filename;
        if (product.length) {
            row = db.prepare("SELECT * FROM Persistency_Data WHERE Prod_Name_Group IN (" + product.map(function () { return '?'; }).join(',') + ")");
            writeToCSV(filepath, row, product).then(function () {
                res.json({ filename: filename });
            }).catch(function (e) { return res.status(500).send(e); });
        }
        else {
            res.json({ filename: 'Persistency_Data.csv' });
        }
        return [2 /*return*/];
    });
}); });
app.get('/downloadData/:filename', function (req, res) {
    var filename = req.params.filename;
    var fileLocation = dataLocation + filename;
    if (!fs_1.default.existsSync(fileLocation)) {
        res.status(400).send({ filename: fileLocation, message: "No such file available" });
    }
    res.download(fileLocation);
});
app.post('/filter', function (req, res) {
    var _a = req.body, product = _a.product, paymentMethod = _a.paymentMethod, staffDesignation = _a.staffDesignation, limra = _a.limra;
    var row = db.prepare("SELECT mth_id, count(MOB_1) as total , sum(MOB_1) as sum_MOB_1, sum(MOB_2) as sum_MOB_2, sum(MOB_3) as sum_MOB_3, sum(MOB_4) as sum_MOB_4,   sum(MOB_5) as sum_MOB_5, sum(MOB_6) as sum_MOB_6, sum(MOB_7) as sum_MOB_7, sum(MOB_8) as sum_MOB_8,   sum(MOB_9) as sum_MOB_9, sum(MOB_10) as sum_MOB_10, sum(MOB_11) as sum_MOB_11, sum(MOB_12) as sum_MOB_12, sum(MOB_13) as sum_MOB_13   FROM Persistency_Data   WHERE Prod_Name_Group IN (" + product.map(function () { return '?'; }).join(',') + ")   AND payment_method IN (" + paymentMethod.map(function () { return '?'; }).join(',') + ")   AND Channel IN (" + staffDesignation.map(function () { return '?'; }).join(',') + ")   AND LIMRA IN (" + limra.map(function () { return '?'; }).join(',') + ")   GROUP BY mth_id   ORDER BY mth_id DESC").all(product, paymentMethod, staffDesignation, limra);
    var lastLIMRA = [Number(limra[0]) - 1];
    var rowLastLIMRA = db.prepare("SELECT mth_id, count(MOB_1) as total , sum(MOB_3) as sum_MOB_3,   sum(MOB_6) as sum_MOB_6, sum(MOB_9) as sum_MOB_9, sum(MOB_12) as sum_MOB_12   FROM Persistency_Data   WHERE Prod_Name_Group IN (" + product.map(function () { return '?'; }).join(',') + ")   AND payment_method IN (" + paymentMethod.map(function () { return '?'; }).join(',') + ")   AND Channel IN (" + staffDesignation.map(function () { return '?'; }).join(',') + ")   AND LIMRA IN (" + limra.map(function () { return '?'; }).join(',') + ")").all(product, paymentMethod, staffDesignation, lastLIMRA);
    var lastLIMRAMOB = {
        mob3: Math.round(rowLastLIMRA[0].sum_MOB_3 / rowLastLIMRA[0].total * 1000) / 10,
        mob6: Math.round(rowLastLIMRA[0].sum_MOB_6 / rowLastLIMRA[0].total * 1000) / 10,
        mob9: Math.round(rowLastLIMRA[0].sum_MOB_9 / rowLastLIMRA[0].total * 1000) / 10,
        mob12: Math.round(rowLastLIMRA[0].sum_MOB_12 / rowLastLIMRA[0].total * 1000) / 10,
    };
    var newDBMA = db.prepare("SELECT * FROM MA WHERE Prod_Name_Group IN (" + product.map(function () { return '?'; }).join(',') + ") ").all(product);
    var MA = Object.values(newDBMA[0]).slice(1).map(function (item) { return item * 100; });
    var processed = processData(row, MA);
    res.json({ row: processed.row, MA: MA, maxData: processed.maxData, lastLIMRAMOB: lastLIMRAMOB });
});
app.get('/filterRawDataAll', function (req, res) {
    var row = db.prepare("SELECT * FROM newData WHERE Prod_Name_Group = 'DMTM_OTH' AND LIMRA = '2021' GROUP BY mth_id ORDER BY mth_id DESC LIMIT 100 ").all();
    row.map(function (a) { return a.mth_id = Date.parse(a.mth_id); });
    row.sort(function (a, b) { return a['Prod_Name_Group'].localeCompare(b['Prod_Name_Group']) || b.mth_id - a.mth_id; });
    res.json(row);
});
app.post('/filterRawData', function (req, res) {
    var _a = req.body, product = _a.product, paymentMethod = _a.paymentMethod, staffDesignation = _a.staffDesignation, mob = _a.mob, limra = _a.limra;
    var row;
    if (mob == 1) {
        row = db.prepare("SELECT *\n    FROM Persistency_Data     WHERE Prod_Name_Group IN (" + product.map(function () { return '?'; }).join(',') + ")     AND payment_method IN (" + paymentMethod.map(function () { return '?'; }).join(',') + ")     AND Channel IN (" + staffDesignation.map(function () { return '?'; }).join(',') + ")     AND LIMRA IN (" + limra.map(function () { return '?'; }).join(',') + ")     AND status_cd = 'IF'\n    ").all(product, paymentMethod, staffDesignation, limra);
    }
    else {
        row = db.prepare("SELECT *\n    FROM Persistency_Data     WHERE Prod_Name_Group IN (" + product.map(function () { return '?'; }).join(',') + ")     AND payment_method IN (" + paymentMethod.map(function () { return '?'; }).join(',') + ")     AND Channel IN (" + staffDesignation.map(function () { return '?'; }).join(',') + ")     AND LIMRA IN (" + limra.map(function () { return '?'; }).join(',') + ")     AND MOB_" + mob + " = 0     AND MOB_" + (mob - 1) + " != 0     AND status_cd = 'IF'\n    ").all(product, paymentMethod, staffDesignation, limra);
    }
    res.json(row);
});
app.post('/filterRawDataDownload', function (req, res) {
    var _a = req.body, product = _a.product, paymentMethod = _a.paymentMethod, staffDesignation = _a.staffDesignation, mob = _a.mob, limra = _a.limra;
    var filename = 'raw_persistency_' + product.toString() + limra.toString() + '_MOB_' + mob.toString() + '.csv';
    var filepath = dataLocation + filename;
    var row = db.prepare("SELECT *\n  FROM Persistency_Data   WHERE Prod_Name_Group IN (" + product.map(function () { return '?'; }).join(',') + ")   AND payment_method IN (" + paymentMethod.map(function () { return '?'; }).join(',') + ")   AND Channel IN (" + staffDesignation.map(function () { return '?'; }).join(',') + ")   AND LIMRA IN (" + limra.map(function () { return '?'; }).join(',') + ")   AND MOB_" + mob + " = 0   AND MOB_" + (mob - 1) + " != 0   AND status_cd = 'IF'\n  ");
    writeToCSV(filepath, row, [product, paymentMethod, staffDesignation, limra]).then(function () {
        res.json({ filename: filename });
    }).catch(function (e) { return res.status(500).send(e); });
});
app.listen(PORT, function () {
    console.log("Server is listening on port " + PORT);
});
