import { createDiagnosticTable } from "./createDiagnosticTable";
import { createLocationTable } from "./createLocationTable";
import { createPatientTable } from "./createPatientTable";
import { createProgressTable } from "./createProgressTable";
import { createRefreshTokenTable } from "./createRefreshTokenTable";
import { createSchedulingTable } from "./createSchedulingTable";
import { createServicesTable } from "./createServicesTable";
import { createUserTable } from "./createUserTable";

export function createMigration(){
    console.log("executou")
    createUserTable()
    createRefreshTokenTable()
    createServicesTable()
    createPatientTable()
    createLocationTable()
    createDiagnosticTable()
    createProgressTable()
    createSchedulingTable()
}

createMigration()