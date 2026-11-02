import { For, Show } from "solid-js";
import type { JSX } from "solid-js";
import { A, Navigate } from "@solidjs/router";
import { useAuth } from "../../stores/auth";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminLayout(props: { children?: JSX.Element }) {
  const auth = useAuth();

  return (
    <Show when={auth.user()?.role === "seller"} fallback={<Navigate href="/seller/login" />}>
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:flex md:gap-8">
        <aside class="mb-6 md:mb-0 md:w-56 md:shrink-0">
          <div class="rounded-2xl border border-neutral-200 bg-white p-4">
            <p class="text-sm font-bold text-neutral-900">{auth.user()?.shopName}</p>
            <p class="truncate text-xs text-neutral-500">{auth.user()?.email}</p>
            <nav class="mt-4 flex flex-wrap gap-1 md:flex-col md:space-y-1">
              <For each={nav}>
                {(item) => (
                  <A href={item.href} class="rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-emerald-50 hover:text-emerald-700">
                    {item.label}
                  </A>
                )}
              </For>
              <A href="/" class="rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-50">
                View site
              </A>
            </nav>
            <div class="mt-4 border-t border-neutral-200 pt-4">
              <button onClick={() => auth.logout()} class="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">
                Log out
              </button>
            </div>
          </div>
        </aside>
        <div class="min-w-0 flex-1">{props.children}</div>
      </div>
    </Show>
  );
}
