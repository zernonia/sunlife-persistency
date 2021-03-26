"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
var pg_1 = require("pg");
exports.client = new pg_1.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Dashboard',
    password: '970107',
    port: 5432,
});
