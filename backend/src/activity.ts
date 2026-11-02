import { query } from "./db";

export interface Actor {
  id?: number | null;
  role?: string | null;
}

/**
 * Append an entry to the platform-wide audit log. Never throws — logging
 * failures must not break the primary request flow.
 */
export async function logActivity(
  actor: Actor | undefined,
  action: string,
  entityType: string,
  entityId?: number | string | null,
  detail?: string | null
): Promise<void> {
  try {
    await query(
      `INSERT INTO activity_log (actor_id, actor_role, action, entity_type, entity_id, detail)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        actor?.id ?? null,
        actor?.role ?? null,
        action,
        entityType,
        entityId ?? null,
        detail ?? null,
      ]
    );
  } catch {
    // intentionally swallowed
  }
}
