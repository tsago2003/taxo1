import { createResource, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { api } from "../../lib/api";
import { useAuth } from "../../stores/auth";
import { useI18n } from "../../stores/i18n";
import { formatPrice, formatDate } from "../../lib/format";
import type { Order, Product } from "../../lib/types";

export default function Dashboard() {
  const auth = useAuth();
  const { t, statusLabel } = useI18n();
  const [products] = createResource<Product[]>(() => api.get("/api/products/mine"));
  const [orders] = createResource<Order[]>(() => api.get("/api/orders"));

  const stats = () => {
    const p = products() || [];
    const o = orders() || [];
    const sold = p.filter((x) => x.is_sold).length;
    const revenue = o.reduce(
      (sum, order) => sum + order.items.reduce((s, i) => s + i.price * i.quantity, 0),
      0
    );
    return [
      { label: t("seller.productsListed"), value: String(p.length) },
      { label: t("seller.sold"), value: String(sold) },
      { label: t("seller.ordersReceived"), value: String(o.length) },
      { label: t("seller.totalRevenue"), value: formatPrice(revenue) },
    ];
  };

  return (
    <div>
      <h1 class="text-2xl font-bold text-neutral-900">{t("seller.dashboard")}</h1>
      <p class="mt-1 text-sm text-neutral-500">{t("seller.welcomeBack", { name: auth.user()?.shopName ?? "" })}</p>

      <div class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <For each={stats()}>
          {(stat) => (
            <div class="rounded-2xl border border-black/5 bg-gradient-to-br from-white to-cream-100 p-5 shadow-card transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card-hover">
              <p class="text-xs font-semibold uppercase tracking-wide text-charcoal-400">{stat.label}</p>
              <p class="mt-2 text-3xl font-extrabold tracking-tight text-charcoal-900">{stat.value}</p>
            </div>
          )}
        </For>
      </div>

      <div class="mt-8 rounded-2xl border border-neutral-200 bg-white p-5">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-neutral-900">{t("seller.recentOrders")}</h2>
          <A href="/seller/orders" class="text-sm font-semibold text-emerald-700 hover:underline">
            {t("seller.viewAll")}
          </A>
        </div>

        <Show when={(orders() || []).length > 0} fallback={<p class="mt-4 text-sm text-neutral-500">{t("seller.noOrdersYet")}</p>}>
          <div class="mt-4 divide-y divide-neutral-100">
            <For each={(orders() || []).slice(0, 5)}>
              {(order) => (
                <A href={`/seller/orders/${order.id}`} class="flex items-center justify-between py-3 transition hover:bg-neutral-50">
                  <div>
                    <p class="text-sm font-semibold text-neutral-800">#{order.id} · {order.customer_name}</p>
                    <p class="text-xs text-neutral-500">{formatDate(order.created_at)}</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">{statusLabel(order.status)}</span>
                    <span class="text-sm font-bold text-neutral-900">{formatPrice(order.total)}</span>
                  </div>
                </A>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}
