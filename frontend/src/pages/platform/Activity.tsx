import { createResource, For, Show } from "solid-js";
import { api } from "../../lib/api";
import { useI18n } from "../../stores/i18n";
import { formatDate } from "../../lib/format";

interface ActivityRow {
  id: number;
  action: string;
  entity_type: string;
  entity_id: string | null;
  detail: string | null;
  actor_email: string | null;
  actor_role: string | null;
  created_at: string;
}

export default function Activity() {
  const { t } = useI18n();
  const [activity] = createResource<ActivityRow[]>(() => api.get("/api/admin/activity"));

  return (
    <div>
      <h1 class="text-2xl font-bold text-charcoal-700">{t("admin.activityLog")}</h1>
      <p class="mt-1 text-sm text-charcoal-400">{t("admin.activitySub")}</p>

      <Show when={!activity.loading} fallback={<p class="mt-6 text-charcoal-400">{t("common.loading")}</p>}>
        <div class="mt-5 space-y-2">
          <For each={activity() || []}>
            {(row) => (
              <div class="flex items-start justify-between gap-4 rounded-2xl border border-charcoal/[0.06] bg-white p-4 shadow-soft">
                <div class="min-w-0">
                  <p class="font-semibold text-charcoal-700">{row.action}</p>
                  <p class="mt-0.5 text-xs text-charcoal-400">
                    {row.actor_email ?? "system"}
                    {row.actor_role ? ` (${row.actor_role})` : ""} · {row.entity_type}
                    {row.entity_id ? ` #${row.entity_id}` : ""}
                    {row.detail ? ` · ${row.detail}` : ""}
                  </p>
                </div>
                <span class="shrink-0 text-xs text-charcoal-400">{formatDate(row.created_at)}</span>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
