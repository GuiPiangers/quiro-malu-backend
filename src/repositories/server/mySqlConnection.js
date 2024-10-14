"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.order = exports.escapeSansQuotes = void 0;
var mysql2_1 = require("mysql2");
var dotenv = require("dotenv");
var ApiError_1 = require("../../utils/ApiError");
dotenv.config();
var connection = mysql2_1.default.createConnection({
    host: process.env.DB_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});
connection.connect(function (err) {
    if (err)
        throw new ApiError_1.ApiError("falha ao realizar a conexão com o banco de dados" + err, 500);
    console.log('Conexão realizada com sucesso');
});
function escapeSansQuotes(criterion) {
    var value = connection.escape(criterion).match(/^'(.+)'$/);
    if (value)
        return value[1];
}
exports.escapeSansQuotes = escapeSansQuotes;
function order(_a) {
    var field = _a.field, orientation = _a.orientation;
    return (escapeSansQuotes("".concat(field, " ").concat(orientation)) || '').replace(/[\\]/g, '');
}
exports.order = order;
var query = function (errorMessage, sql, data) {
    return new Promise(function (resolve, reject) {
        connection.query(sql, data, function (err, result) {
            if (err)
                reject(errorMessage);
            resolve(JSON.parse(JSON.stringify(result)));
        });
    });
};
exports.query = query;
exports.default = connection;
