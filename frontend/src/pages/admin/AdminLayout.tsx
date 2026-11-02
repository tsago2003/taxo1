import { For, Show } from "solid-js";
import type { JSX } from "solid-js";
import { A, Navigate } from "@solidjs/router";
import { useAuth } from "../../stores/auth";
import { useI18n } from "../../stores/i18n";
import type { TranslationKey } from "../../lib/i18n";
import { GridIcon, PackageIcon, ReceiptIcon } from "../../components/icons";

const nav: { href: string; labelKey: TranslationKey; icon: typeof GridIcon }[] = [
  { href: "/seller", labelKey: "seller.dashboard", icon: GridIcon },
  { href: "/seller/products", labelKey: "seller.products", icon: PackageIcon },
  { href: "/seller/orders", labelKey: "seller.orders", icon: ReceiptIcon },
];

export default function AdminLayout(props: { children?: JSX.Element }) {
  const auth = useAuth();
  const { t } = useI18n();

  return (
    <Show when={auth.user()?.role === "seller"} fallback={<Navigate href="/seller/login" />}>
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:flex md:gap-8">
        <aside class="mb-6 md:mb-0 md:w-60 md:shrink-0">
          <div class="rounded-2xl border border-black/5 bg-white/80 p-3 shadow-card backdrop-blur-md md:sticky md:top-6">
            <div class="px-2 py-2">
              <p class="text-sm font-bold text-charcoal-900">{auth.user()?.shopName}</p>
              <p class="truncate text-xs text-charcoal-400">{auth.user()?.email}</p>
            </div>
            <nav class="mt-2 flex flex-wrap gap-1 md:flex-col">
              <For each={nav}>
                {(item) => {
                  const Icon = item.icon;
                  return (
                    <A
                      href={item.href}
                      end={item.href === "/seller"}
                      class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out"
                      activeClass="bg-moss-600 text-cream-50 shadow-soft"
                      inactiveClass="text-charcoal-500 hover:bg-cream-100 hover:text-charcoal-800"
                    >
                      <Icon class="h-[18px] w-[18px]" />
                      {t(item.labelKey)}
                    </A>
                  );
                }}
              </For>
              <A
                href="/"
                class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal-400 transition-colors duration-200 hover:bg-cream-100 hover:text-charcoal-700"
              >
                <ArrowIcon />
                {t("seller.viewSite")}
              </A>
            </nav>
            <div class="mt-3 border-t border-black/5 pt-3">
              <button
                onClick={() => auth.logout()}
                class="w-full rounded-xl border border-black/10 px-3 py-2 text-sm font-medium text-charcoal-500 transition-colors duration-200 hover:bg-cream-100 hover:text-charcoal-800"
              >
                {t("seller.logout")}
              </button>
            </div>
          </div>
        </aside>
        <div class="min-w-0 flex-1">{props.children}</div>
      </div>
    </Show>
  );
}

function ArrowIcon() {
  return (
    <svg class="h-[18px] w-[18px]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
