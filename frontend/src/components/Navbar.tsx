import { A } from "@solidjs/router";
import { Show } from "solid-js";
import { useAuth } from "../stores/auth";
import { useCart } from "../stores/cart";
import { SITE_NAME } from "../lib/constants";

export default function Navbar() {
  const auth = useAuth();
  const cart = useCart();

  return (
    <header class="sticky top-0 z-40 border-b border-neutral-200 bg-white/85 backdrop-blur">
      <nav class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <A href="/" class="text-xl font-extrabold tracking-tight text-emerald-700">
          {SITE_NAME}
        </A>

        <form action="/products" method="get" class="hidden flex-1 md:block md:max-w-md">
          <div class="relative">
            <svg
              class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              name="q"
              type="search"
              placeholder="Search pre-loved clothes…"
              class="w-full rounded-full border border-neutral-200 bg-neutral-50 py-2 pl-10 pr-4 text-sm text-neutral-800 transition focus:border-emerald-600 focus:bg-white focus:outline-none"
            />
          </div>
        </form>

        <div class="flex items-center gap-3">
          <A href="/products" class="hidden text-sm font-medium text-neutral-700 hover:text-emerald-700 md:inline">
            Shop
          </A>

          <A
            href="/cart"
            class="relative inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-emerald-600 hover:text-emerald-700"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span class="hidden sm:inline">Cart</span>
            <Show when={cart.totalItems() > 0}>
              <span class="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-xs font-semibold text-white">
                {cart.totalItems()}
              </span>
            </Show>
          </A>

          <Show
            when={auth.user()?.role === "seller"}
            fallback={
              <Show
                when={auth.user()?.role === "buyer"}
                fallback={
                  <div class="flex items-center gap-3">
                    <A href="/login" class="hidden text-sm font-medium text-neutral-700 hover:text-emerald-700 sm:inline">
                      Sign in
                    </A>
                    <A href="/seller/register" class="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
                      Sell with us
                    </A>
                  </div>
                }
              >
                <div class="flex items-center gap-3">
                  <A href="/account" class="hidden text-sm font-medium text-neutral-700 hover:text-emerald-700 sm:inline">
                    My account
                  </A>
                  <A href="/account?tab=wishlist" class="hidden text-sm font-medium text-neutral-700 hover:text-emerald-700 sm:inline">
                    Wishlist
                  </A>
                  <button onClick={() => auth.logout()} class="text-sm font-medium text-neutral-700 hover:text-emerald-700">
                    Sign out
                  </button>
                </div>
              </Show>
            }
          >
            <div class="flex items-center gap-3">
              <A href="/admin" class="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
                Dashboard
              </A>
              <button onClick={() => auth.logout()} class="text-sm font-medium text-neutral-700 hover:text-emerald-700">
                Sign out
              </button>
            </div>
          </Show>
        </div>
      </nav>
    </header>
  );
}
