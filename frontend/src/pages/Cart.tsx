import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useCart } from "../stores/cart";
import ProductImage from "../components/ProductImage";
import { formatPrice } from "../lib/format";

export default function Cart() {
  const cart = useCart();

  return (
    <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 class="text-2xl font-bold text-neutral-800">Your cart</h1>

      <Show
        when={cart.items().length > 0}
        fallback={
          <div class="py-20 text-center">
            <h2 class="text-xl font-bold text-neutral-800">Your cart is empty</h2>
            <p class="mt-2 text-neutral-500">Browse our pre-loved collection and find something you love.</p>
            <A href="/products" class="mt-6 inline-block rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
              Start shopping
            </A>
          </div>
        }
      >
        <div class="mt-6 space-y-4">
          <For each={cart.items()}>
            {(item) => (
              <div class="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-4">
                <div class="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                  <ProductImage src={item.product.image_url} alt={item.product.name} class="h-full w-full object-cover" />
                </div>
                <div class="flex flex-1 flex-col">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <A href={`/products/${item.product.id}`} class="font-semibold text-neutral-800 hover:text-emerald-700">
                        {item.product.name}
                      </A>
                      <p class="mt-0.5 text-xs text-neutral-500">
                        {item.product.brand || item.product.category}
                        {item.product.size ? ` · Size ${item.product.size}` : ""}
                      </p>
                    </div>
                    <p class="font-semibold text-neutral-800">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                  <div class="mt-auto flex items-center justify-between pt-3">
                    <div class="flex items-center gap-2">
                      <button onClick={() => cart.updateQuantity(item.product.id, item.quantity - 1)} class="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100" aria-label="Decrease quantity">
                        −
                      </button>
                      <span class="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => cart.updateQuantity(item.product.id, item.quantity + 1)} class="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-100" aria-label="Increase quantity">
                        +
                      </button>
                    </div>
                    <button onClick={() => cart.removeItem(item.product.id)} class="text-sm font-medium text-red-600 hover:underline">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>

        <div class="mt-8 flex flex-col items-end gap-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-neutral-500">Shipping is arranged by the seller after your order.</p>
          <div class="flex items-center gap-4">
            <p class="text-lg font-bold text-neutral-900">Total {formatPrice(cart.totalPrice())}</p>
            <A href="/checkout" class="rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
              Proceed to checkout
            </A>
          </div>
        </div>
      </Show>
    </div>
  );
}
