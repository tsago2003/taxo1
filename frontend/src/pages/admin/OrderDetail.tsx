import { createResource, For, Show } from "solid-js";
import { A, useParams } from "@solidjs/router";
import { api } from "../../lib/api";
import { useI18n } from "../../stores/i18n";
import StatusSelect from "../../components/StatusSelect";
import { formatPrice, formatDate } from "../../lib/format";
import type { Order } from "../../lib/types";

export default function OrderDetail() {
  const params = useParams<{ id: string }>();
  const { t } = useI18n();
  const [order] = createResource<Order>(() => api.get(`/api/orders/${params.id}`));

  return (
    <div>
      <A href="/seller/orders" class="text-sm font-medium text-neutral-500 hover:text-emerald-700">
        {t("seller.backToOrders")}
      </A>

      <Show when={order()} fallback={<p class="mt-8 text-neutral-500">{t("common.loading")}</p>}>
        <div>
          <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
            <h1 class="text-2xl font-bold text-neutral-900">{t("admin.order")} #{order()!.id}</h1>
            <div class="flex items-center gap-3">
              <span class="text-sm text-neutral-500">{t("admin.status")}:</span>
              <StatusSelect orderId={order()!.id} current={order()!.status} />
            </div>
          </div>
          <p class="mt-1 text-sm text-neutral-500">{t("seller.placedOn", { date: formatDate(order()!.created_at) })}</p>

          <div class="mt-6 grid gap-6 lg:grid-cols-2">
            <div class="rounded-2xl border border-neutral-200 bg-white p-5">
              <h2 class="text-base font-semibold text-neutral-900">{t("seller.items", { count: order()!.items.length })}</h2>
              <ul class="mt-4 space-y-3">
                <For each={order()!.items}>
                  {(item) => (
                    <li class="flex items-center justify-between gap-3">
                      <div>
                        <p class="text-sm font-medium text-neutral-800">{item.product_name}</p>
                        <p class="text-xs text-neutral-500">
                          {t("seller.qty", { qty: item.quantity })}
                          {item.size ? ` · ${t("seller.size", { size: item.size })}` : ""}
                        </p>
                      </div>
                      <p class="text-sm font-semibold text-neutral-900">{formatPrice(item.price * item.quantity)}</p>
                    </li>
                  )}
                </For>
              </ul>
              <div class="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
                <span class="font-semibold text-neutral-800">{t("seller.yourTotal")}</span>
                <span class="text-lg font-bold text-neutral-900">
                  {formatPrice(order()!.items.reduce((s, i) => s + i.price * i.quantity, 0))}
                </span>
              </div>
            </div>

            <div class="rounded-2xl border border-neutral-200 bg-white p-5">
              <h2 class="text-base font-semibold text-neutral-900">{t("seller.customerDetails")}</h2>
              <dl class="mt-4 space-y-3 text-sm">
                <div>
                  <dt class="text-neutral-400">{t("seller.name")}</dt>
                  <dd class="font-medium text-neutral-800">{order()!.customer_name}</dd>
                </div>
                <div>
                  <dt class="text-neutral-400">{t("seller.email")}</dt>
                  <dd class="font-medium text-neutral-800">{order()!.customer_email}</dd>
                </div>
                <div>
                  <dt class="text-neutral-400">{t("seller.phone")}</dt>
                  <dd class="font-medium text-neutral-800">{order()!.customer_phone}</dd>
                </div>
                <div>
                  <dt class="text-neutral-400">{t("seller.address")}</dt>
                  <dd class="font-medium text-neutral-800">
                    {order()!.customer_address}
                    {order()!.customer_city ? `, ${order()!.customer_city}` : ""}
                    {order()!.customer_postal ? ` ${order()!.customer_postal}` : ""}
                  </dd>
                </div>
                <Show when={order()!.notes}>
                  <div>
                    <dt class="text-neutral-400">{t("seller.notes")}</dt>
                    <dd class="font-medium text-neutral-800">{order()!.notes}</dd>
                  </div>
                </Show>
              </dl>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
