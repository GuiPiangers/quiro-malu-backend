"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMigration = void 0;
var createDiagnosticTable_1 = require("./createDiagnosticTable");
var createLocationTable_1 = require("./createLocationTable");
var createPatientTable_1 = require("./createPatientTable");
var createProgressTable_1 = require("./createProgressTable");
var createRefreshTokenTable_1 = require("./createRefreshTokenTable");
var createSchedulingTable_1 = require("./createSchedulingTable");
var createServicesTable_1 = require("./createServicesTable");
var createUserTable_1 = require("./createUserTable");
function createMigration() {
    console.log("executou");
    (0, createUserTable_1.createUserTable)();
    (0, createRefreshTokenTable_1.createRefreshTokenTable)();
    (0, createServicesTable_1.createServicesTable)();
    (0, createPatientTable_1.createPatientTable)();
    (0, createLocationTable_1.createLocationTable)();
    (0, createDiagnosticTable_1.createDiagnosticTable)();
    (0, createProgressTable_1.createProgressTable)();
    (0, createSchedulingTable_1.createSchedulingTable)();
}
exports.createMigration = createMigration;
createMigration();
