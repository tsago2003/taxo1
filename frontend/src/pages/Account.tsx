import { createResource, For, Show } from "solid-js";
import { A, Navigate, useSearchParams } from "@solidjs/router";
import { api } from "../lib/api";
import { useAuth } from "../stores/auth";
import { useI18n } from "../stores/i18n";
import ProductCard from "../components/ProductCard";
import { formatPrice, formatDate } from "../lib/format";
import type { Order, Product } from "../lib/types";

export default function Account() {
  const auth = useAuth();
  const { t } = useI18n();
  const [searchParams] = useSearchParams<{ tab?: string }>();
  const tab = () => searchParams.tab || "recommendations";

  const [recommendations] = createResource<Product[]>(() =>
    tab() === "recommendations" && auth.user()?.role === "buyer"
      ? api.get("/api/recommendations")
      : []
  );
  const [orders] = createResource<Order[]>(() =>
    tab() === "orders" && auth.user()?.role === "buyer"
      ? api.get("/api/account/orders")
      : []
  );
  const [wishlist] = createResource<Product[]>(() =>
    tab() === "wishlist" && auth.user()?.role === "buyer"
      ? api.get("/api/wishlist")
      : []
  );

  const tabCls = (active: boolean) =>
    active
      ? "border-b-2 border-moss-600 px-4 py-2 text-sm font-semibold text-moss-700"
      : "border-b-2 border-transparent px-4 py-2 text-sm font-medium text-charcoal-400 hover:text-charcoal-700";

  return (
    <Show when={auth.user()?.role === "buyer"} fallback={<Navigate href="/login" />}>
      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 class="text-2xl font-bold text-charcoal-700">{t("account.hi", { name: auth.user()?.name ?? "" })}</h1>
        <p class="mt-1 text-sm text-charcoal-400">{auth.user()?.email}</p>

        <nav class="mt-6 flex gap-2 border-b border-charcoal/[0.08]">
          <A href="/account?tab=recommendations" class={tabCls(tab() === "recommendations")}>{t("account.forYou")}</A>
          <A href="/account?tab=orders" class={tabCls(tab() === "orders")}>{t("account.orders")}</A>
          <A href="/account?tab=wishlist" class={tabCls(tab() === "wishlist")}>{t("account.wishlist")}</A>
        </nav>

        <div class="mt-8">
          <Show when={tab() === "recommendations"}>
            <Show
              when={(recommendations() || []).length > 0}
              fallback={
                <div class="rounded-3xl border border-dashed border-charcoal/15 p-12 text-center text-charcoal-400">
                  {t("account.noRecommendations")}
                </div>
              }
            >
              <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                <For each={recommendations() || []}>
                  {(p) => <ProductCard product={p} />}
                </For>
              </div>
            </Show>
          </Show>

          <Show when={tab() === "orders"}>
            <Show
              when={(orders() || []).length > 0}
              fallback={
                <div class="rounded-3xl border border-dashed border-charcoal/15 p-12 text-center text-charcoal-400">
                  {t("account.noOrders")}
                </div>
              }
            >
              <div class="space-y-4">
                <For each={orders() || []}>
                  {(order) => (
                    <div class="rounded-3xl border border-charcoal/[0.06] bg-white p-5 shadow-soft">
                      <div class="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p class="font-semibold text-charcoal-700">{t("account.order", { id: order.id })}</p>
                          <p class="text-xs text-charcoal-400">{formatDate(order.created_at)}</p>
                        </div>
                        <div class="flex items-center gap-3">
                          <span class="rounded-full bg-cream-100 px-2.5 py-1 text-xs font-medium capitalize text-charcoal-500">{order.status}</span>
                          <span class="font-bold text-charcoal-700">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                      <ul class="mt-4 space-y-2 border-t border-charcoal/[0.08] pt-4">
                        <For each={order.items}>
                          {(item) => (
                            <li class="flex items-center justify-between text-sm">
                              <span class="text-charcoal-500">{item.product_name} × {item.quantity}</span>
                              <span class="font-medium text-charcoal-700">{formatPrice(item.price * item.quantity)}</span>
                            </li>
                          )}
                        </For>
                      </ul>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </Show>

          <Show when={tab() === "wishlist"}>
            <Show
              when={(wishlist() || []).length > 0}
              fallback={
                <div class="rounded-3xl border border-dashed border-charcoal/15 p-12 text-center text-charcoal-400">
                  {t("account.emptyWishlist")}
                </div>
              }
            >
              <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                <For each={wishlist() || []}>
                  {(p) => <ProductCard product={p} />}
                </For>
              </div>
            </Show>
          </Show>
        </div>
      </div>
    </Show>
  );
}
