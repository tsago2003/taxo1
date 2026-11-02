import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useCart } from "../stores/cart";
import { useI18n } from "../stores/i18n";
import ProductImage from "../components/ProductImage";
import { formatPrice } from "../lib/format";

export default function Cart() {
  const cart = useCart();
  const { t } = useI18n();

  return (
    <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 class="text-2xl font-bold text-charcoal-700">{t("cart.title")}</h1>

      <Show
        when={cart.items().length > 0}
        fallback={
          <div class="py-20 text-center">
            <h2 class="text-xl font-bold text-charcoal-700">{t("cart.empty")}</h2>
            <p class="mt-2 text-charcoal-500">{t("cart.emptySub")}</p>
            <A href="/products" class="mt-6 inline-block rounded-full bg-moss-600 px-6 py-3 text-sm font-semibold text-cream-50 shadow-soft transition hover:bg-moss-700">
              {t("cart.startShopping")}
            </A>
          </div>
        }
      >
        <div class="mt-6 space-y-4">
          <For each={cart.items()}>
            {(item) => (
              <div class="flex gap-4 rounded-3xl border border-charcoal/[0.06] bg-white p-4 shadow-soft">
                <div class="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-100">
                  <ProductImage src={item.product.image_url} alt={item.product.name} class="h-full w-full object-cover" />
                </div>
                <div class="flex flex-1 flex-col">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <A href={`/products/${item.product.id}`} class="font-semibold text-charcoal-700 hover:text-moss-600">
                        {item.product.name}
                      </A>
                      <p class="mt-0.5 text-xs text-charcoal-400">
                        {item.product.brand || item.product.category}
                        {item.product.size ? ` · ${t("product.size", { size: item.product.size })}` : ""}
                      </p>
                    </div>
                    <p class="font-semibold text-charcoal-700">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                  <div class="mt-auto flex items-center justify-between pt-3">
                    <div class="flex items-center gap-2">
                      <button onClick={() => cart.updateQuantity(item.product.id, item.quantity - 1)} class="flex h-7 w-7 items-center justify-center rounded-lg border border-charcoal/10 text-charcoal-600 hover:bg-cream-100" aria-label={t("cart.decrease")}>
                        −
                      </button>
                      <span class="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => cart.updateQuantity(item.product.id, item.quantity + 1)} class="flex h-7 w-7 items-center justify-center rounded-lg border border-charcoal/10 text-charcoal-600 hover:bg-cream-100" aria-label={t("cart.increase")}>
                        +
                      </button>
                    </div>
                    <button onClick={() => cart.removeItem(item.product.id)} class="text-sm font-medium text-terracotta-500 hover:underline">
                      {t("cart.remove")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>

        <div class="mt-8 flex flex-col items-end gap-4 rounded-3xl border border-charcoal/[0.06] bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-charcoal-400">{t("cart.shippingNote")}</p>
          <div class="flex items-center gap-4">
            <p class="text-lg font-bold text-charcoal-700">{t("cart.total")} {formatPrice(cart.totalPrice())}</p>
            <A href="/checkout" class="rounded-full bg-moss-600 px-6 py-3 text-sm font-semibold text-cream-50 shadow-soft transition hover:bg-moss-700">
              {t("cart.checkout")}
            </A>
          </div>
        </div>
      </Show>
    </div>
  );
}
