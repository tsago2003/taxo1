import { createResource, For } from "solid-js";
import { A } from "@solidjs/router";
import { api } from "../../lib/api";
import { useI18n } from "../../stores/i18n";
import { formatPrice, formatDate } from "../../lib/format";

interface Stats {
  sellers: number;
  buyers: number;
  products: number;
  soldProducts: number;
  orders: number;
  revenue: number;
  newSignups7d: number;
}
interface ActivityRow {
  id: number;
  action: string;
  entity_type: string;
  entity_id: string | null;
  actor_email: string | null;
  created_at: string;
}

export default function Dashboard() {
  const { t } = useI18n();
  const [stats] = createResource<Stats>(() => api.get("/api/admin/stats"));
  const [activity] = createResource<ActivityRow[]>(() => api.get("/api/admin/activity"));

  const cards = () => {
    const s = stats() ?? {
      sellers: 0, buyers: 0, products: 0, soldProducts: 0, orders: 0, revenue: 0, newSignups7d: 0,
    };
    return [
      { label: t("admin.sellers"), value: String(s.sellers) },
      { label: t("admin.buyers"), value: String(s.buyers) },
      { label: t("admin.productsCount"), value: String(s.products) },
      { label: t("admin.ordersCount"), value: String(s.orders) },
      { label: t("admin.revenue"), value: formatPrice(s.revenue) },
      { label: t("admin.newSignups7d"), value: String(s.newSignups7d) },
    ];
  };

  return (
    <div>
      <h1 class="text-2xl font-bold text-charcoal-700">{t("admin.overview")}</h1>
      <p class="mt-1 text-sm text-charcoal-400">{t("admin.overviewSub")}</p>

      <div class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <For each={cards()}>
          {(card) => (
            <div class="rounded-3xl border border-charcoal/[0.06] bg-white p-5 shadow-soft">
              <p class="text-sm text-charcoal-400">{card.label}</p>
              <p class="mt-1 text-2xl font-bold text-charcoal-700">{card.value}</p>
            </div>
          )}
        </For>
      </div>

      <div class="mt-8 rounded-3xl border border-charcoal/[0.06] bg-white p-5 shadow-soft">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-charcoal-700">{t("admin.recentActivity")}</h2>
          <A href="/admin/activity" class="text-sm font-semibold text-moss-600 hover:underline">
            {t("section.viewAll")}
          </A>
        </div>
        <div class="mt-4 divide-y divide-charcoal/[0.06]">
          <For each={(activity() || []).slice(0, 8)}>
            {(row) => (
              <div class="flex items-center justify-between gap-4 py-2.5 text-sm">
                <div class="min-w-0">
                  <p class="font-medium text-charcoal-700">{row.action}</p>
                  <p class="truncate text-xs text-charcoal-400">
                    {row.actor_email ?? "system"} · {row.entity_type}
                    {row.entity_id ? ` #${row.entity_id}` : ""}
                  </p>
                </div>
                <span class="shrink-0 text-xs text-charcoal-400">{formatDate(row.created_at)}</span>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}
