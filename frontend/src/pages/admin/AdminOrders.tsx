import { createResource, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { api } from "../../lib/api";
import { useI18n } from "../../stores/i18n";
import { formatPrice, formatDate } from "../../lib/format";
import type { Order } from "../../lib/types";

export default function AdminOrders() {
  const { t, statusLabel } = useI18n();
  const [orders] = createResource<Order[]>(() => api.get("/api/orders"));

  return (
    <div>
      <h1 class="text-2xl font-bold text-neutral-900">{t("seller.orders")}</h1>
      <p class="mt-1 text-sm text-neutral-500">{t("seller.ordersSub")}</p>

      <Show
        when={(orders() || []).length > 0}
        fallback={
          <div class="mt-8 rounded-2xl border border-dashed border-neutral-300 p-12 text-center text-neutral-500">
            {t("seller.noOrdersYet")}
          </div>
        }
      >
        <div class="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
          <table class="w-full min-w-[640px] text-left text-sm">
            <thead class="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-400">
              <tr>
                <th class="px-4 py-3 font-medium">{t("admin.order")}</th>
                <th class="px-4 py-3 font-medium">{t("admin.customer")}</th>
                <th class="px-4 py-3 font-medium">{t("admin.date")}</th>
                <th class="px-4 py-3 font-medium">{t("admin.status")}</th>
                <th class="px-4 py-3 text-right font-medium">{t("admin.total")}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <For each={orders() || []}>
                {(order) => (
                  <tr class="hover:bg-neutral-50">
                    <td class="px-4 py-3">
                      <A href={`/seller/orders/${order.id}`} class="font-semibold text-emerald-700 hover:underline">
                        #{order.id}
                      </A>
                    </td>
                    <td class="px-4 py-3 text-neutral-700">{order.customer_name}</td>
                    <td class="px-4 py-3 text-neutral-500">{formatDate(order.created_at)}</td>
                    <td class="px-4 py-3">
                      <span class="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">{statusLabel(order.status)}</span>
                    </td>
                    <td class="px-4 py-3 text-right font-semibold text-neutral-900">{formatPrice(order.total)}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
    </div>
  );
}
