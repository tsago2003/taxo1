import { createResource, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { api } from "../../lib/api";
import { useAuth } from "../../stores/auth";
import { formatPrice, formatDate } from "../../lib/format";
import type { Order, Product } from "../../lib/types";

export default function Dashboard() {
  const auth = useAuth();
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
      { label: "Products listed", value: String(p.length) },
      { label: "Sold", value: String(sold) },
      { label: "Orders received", value: String(o.length) },
      { label: "Total revenue", value: formatPrice(revenue) },
    ];
  };

  return (
    <div>
      <h1 class="text-2xl font-bold text-neutral-900">Dashboard</h1>
      <p class="mt-1 text-sm text-neutral-500">Welcome back, {auth.user()?.shopName}.</p>

      <div class="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <For each={stats()}>
          {(stat) => (
            <div class="rounded-2xl border border-neutral-200 bg-white p-5">
              <p class="text-sm text-neutral-500">{stat.label}</p>
              <p class="mt-1 text-2xl font-bold text-neutral-900">{stat.value}</p>
            </div>
          )}
        </For>
      </div>

      <div class="mt-8 rounded-2xl border border-neutral-200 bg-white p-5">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-neutral-900">Recent orders</h2>
          <A href="/admin/orders" class="text-sm font-semibold text-emerald-700 hover:underline">
            View all →
          </A>
        </div>

        <Show
          when={(orders() || []).length > 0}
          fallback={
            <p class="mt-4 text-sm text-neutral-500">
              No orders yet. Once customers buy your items, orders will appear here.
            </p>
          }
        >
          <div class="mt-4 divide-y divide-neutral-100">
            <For each={(orders() || []).slice(0, 5)}>
              {(order) => (
                <A href={`/admin/orders/${order.id}`} class="flex items-center justify-between py-3 transition hover:bg-neutral-50">
                  <div>
                    <p class="text-sm font-semibold text-neutral-800">#{order.id} · {order.customer_name}</p>
                    <p class="text-xs text-neutral-500">{formatDate(order.created_at)}</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium capitalize text-neutral-600">{order.status}</span>
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
