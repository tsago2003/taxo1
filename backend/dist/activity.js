"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = logActivity;
const db_1 = require("./db");
/**
 * Append an entry to the platform-wide audit log. Never throws — logging
 * failures must not break the primary request flow.
 */
async function logActivity(actor, action, entityType, entityId, detail) {
    try {
        await (0, db_1.query)(`INSERT INTO activity_log (actor_id, actor_role, action, entity_type, entity_id, detail)
       VALUES ($1, $2, $3, $4, $5, $6)`, [
            actor?.id ?? null,
            actor?.role ?? null,
            action,
            entityType,
            entityId ?? null,
            detail ?? null,
        ]);
    }
    catch {
        // intentionally swallowed
    }
}
//# sourceMappingURL=activity.js.map