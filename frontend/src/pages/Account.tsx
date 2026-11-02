import { createResource, For, Show } from "solid-js";
import { A, Navigate, useSearchParams } from "@solidjs/router";
import { api } from "../lib/api";
import { useAuth } from "../stores/auth";
import ProductCard from "../components/ProductCard";
import { formatPrice, formatDate } from "../lib/format";
import type { Order, Product } from "../lib/types";

export default function Account() {
  const auth = useAuth();
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
      ? "border-b-2 border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-700"
      : "border-b-2 border-transparent px-4 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-800";

  return (
    <Show when={auth.user()?.role === "buyer"} fallback={<Navigate href="/login" />}>
      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 class="text-2xl font-bold text-neutral-900">Hi, {auth.user()?.name}</h1>
        <p class="mt-1 text-sm text-neutral-500">{auth.user()?.email}</p>

        <nav class="mt-6 flex gap-2 border-b border-neutral-200">
          <A href="/account?tab=recommendations" class={tabCls(tab() === "recommendations")}>For you</A>
          <A href="/account?tab=orders" class={tabCls(tab() === "orders")}>Orders</A>
          <A href="/account?tab=wishlist" class={tabCls(tab() === "wishlist")}>Wishlist</A>
        </nav>

        <div class="mt-8">
          <Show when={tab() === "recommendations"}>
            <Show
              when={(recommendations() || []).length > 0}
              fallback={
                <div class="rounded-2xl border border-dashed border-neutral-300 p-12 text-center text-neutral-500">
                  Browse a few products and we'll start learning what you love.
                </div>
              }
            >
              <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                <For each={recommendations() || []}>
                  {(p) => <ProductCard product={p} wishlisted />}
                </For>
              </div>
            </Show>
          </Show>

          <Show when={tab() === "orders"}>
            <Show
              when={(orders() || []).length > 0}
              fallback={
                <div class="rounded-2xl border border-dashed border-neutral-300 p-12 text-center text-neutral-500">
                  You have no orders yet.
                </div>
              }
            >
              <div class="space-y-4">
                <For each={orders() || []}>
                  {(order) => (
                    <div class="rounded-2xl border border-neutral-200 bg-white p-5">
                      <div class="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p class="font-semibold text-neutral-900">Order #{order.id}</p>
                          <p class="text-xs text-neutral-500">{formatDate(order.created_at)}</p>
                        </div>
                        <div class="flex items-center gap-3">
                          <span class="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium capitalize text-neutral-600">{order.status}</span>
                          <span class="font-bold text-neutral-900">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                      <ul class="mt-4 space-y-2 border-t border-neutral-100 pt-4">
                        <For each={order.items}>
                          {(item) => (
                            <li class="flex items-center justify-between text-sm">
                              <span class="text-neutral-700">{item.product_name} × {item.quantity}</span>
                              <span class="font-medium text-neutral-900">{formatPrice(item.price * item.quantity)}</span>
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
                <div class="rounded-2xl border border-dashed border-neutral-300 p-12 text-center text-neutral-500">
                  Your wishlist is empty. Tap the heart on any product to save it here.
                </div>
              }
            >
              <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                <For each={wishlist() || []}>
                  {(p) => <ProductCard product={p} wishlisted />}
                </For>
              </div>
            </Show>
          </Show>
        </div>
      </div>
    </Show>
  );
}
