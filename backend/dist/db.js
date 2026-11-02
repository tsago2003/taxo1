"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.query = query;
const pg_1 = require("pg");
const fs_1 = __importDefault(require("fs"));
const config_1 = require("./config");
// Parse NUMERIC columns (price) as JS numbers instead of strings.
pg_1.types.setTypeParser(1700, (val) => val === null ? null : parseFloat(val));
const connectionString = config_1.config.databaseUrl.split("?")[0];
function getSslConfig() {
    if (fs_1.default.existsSync(config_1.config.caCertPath)) {
        return {
            ca: fs_1.default.readFileSync(config_1.config.caCertPath, "utf8"),
            rejectUnauthorized: true,
        };
    }
    return { rejectUnauthorized: false };
}
exports.pool = new pg_1.Pool({
    connectionString,
    ssl: getSslConfig(),
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});
async function query(text, params = []) {
    const result = await exports.pool.query(text, params);
    return result.rows;
}
//# sourceMappingURL=db.js.map