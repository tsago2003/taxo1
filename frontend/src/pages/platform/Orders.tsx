import { createResource, For, Show } from "solid-js";
import { api } from "../../lib/api";
import { useI18n } from "../../stores/i18n";
import { formatPrice, formatDate } from "../../lib/format";
import { ORDER_STATUSES } from "../../lib/constants";
import type { Order } from "../../lib/types";

export default function Orders() {
  const { t, statusLabel } = useI18n();
  const [orders, { refetch }] = createResource<Order[]>(() => api.get("/api/admin/orders"));

  async function setStatus(id: number, status: string) {
    await api.patch(`/api/admin/orders/${id}`, { status });
    refetch();
  }

  return (
    <div>
      <h1 class="text-2xl font-bold text-charcoal-700">{t("admin.orders")}</h1>
      <p class="mt-1 text-sm text-charcoal-400">{t("admin.ordersSub")}</p>

      <Show when={!orders.loading} fallback={<p class="mt-6 text-charcoal-400">{t("common.loading")}</p>}>
        <Show
          when={(orders() || []).length > 0}
          fallback={
            <div class="mt-6 rounded-3xl border border-dashed border-charcoal/15 p-12 text-center text-charcoal-400">
              {t("admin.noOrders")}
            </div>
          }
        >
          <div class="mt-5 overflow-x-auto rounded-3xl border border-charcoal/[0.06] bg-white shadow-soft">
            <table class="w-full min-w-[820px] text-left text-sm">
              <thead class="border-b border-charcoal/[0.06] text-xs uppercase tracking-wide text-charcoal-400">
                <tr>
                  <th class="px-4 py-3 font-medium">{t("admin.order")}</th>
                  <th class="px-4 py-3 font-medium">{t("admin.customer")}</th>
                  <th class="px-4 py-3 font-medium">{t("admin.items")}</th>
                  <th class="px-4 py-3 font-medium">{t("admin.date")}</th>
                  <th class="px-4 py-3 font-medium">{t("admin.status")}</th>
                  <th class="px-4 py-3 text-right font-medium">{t("admin.total")}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-charcoal/[0.06]">
                <For each={orders() || []}>
                  {(order) => (
                    <tr class="hover:bg-cream-50">
                      <td class="px-4 py-3 font-semibold text-charcoal-700">#{order.id}</td>
                      <td class="px-4 py-3">
                        <p class="text-charcoal-700">{order.customer_name}</p>
                        <p class="text-xs text-charcoal-400">{order.customer_email}</p>
                      </td>
                      <td class="px-4 py-3 text-charcoal-500">
                        {order.items.reduce((s, i) => s + i.quantity, 0)}
                      </td>
                      <td class="px-4 py-3 text-charcoal-500">{formatDate(order.created_at)}</td>
                      <td class="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => setStatus(order.id, e.currentTarget.value)}
                          class="rounded-lg border border-charcoal/10 bg-white px-2 py-1.5 text-sm capitalize text-charcoal-700 focus:border-moss-400 focus:outline-none"
                        >
                          <For each={ORDER_STATUSES}>
                            {(s) => <option value={s}>{statusLabel(s)}</option>}
                          </For>
                        </select>
                      </td>
                      <td class="px-4 py-3 text-right font-semibold text-charcoal-700">{formatPrice(order.total)}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Show>
      </Show>
    </div>
  );
}
