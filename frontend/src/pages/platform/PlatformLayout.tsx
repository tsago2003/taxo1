import { For, Show } from "solid-js";
import type { JSX } from "solid-js";
import { A, Navigate } from "@solidjs/router";
import { useAuth } from "../../stores/auth";
import { useI18n } from "../../stores/i18n";
import type { TranslationKey } from "../../lib/i18n";

const nav: { href: string; labelKey: TranslationKey }[] = [
  { href: "/admin", labelKey: "admin.overview" },
  { href: "/admin/users", labelKey: "admin.users" },
  { href: "/admin/products", labelKey: "admin.products" },
  { href: "/admin/moderation", labelKey: "admin.moderation" },
  { href: "/admin/orders", labelKey: "admin.orders" },
  { href: "/admin/activity", labelKey: "admin.activity" },
];

export default function PlatformLayout(props: { children?: JSX.Element }) {
  const auth = useAuth();
  const { t } = useI18n();

  return (
    <Show when={auth.user()?.role === "admin"} fallback={<Navigate href="/admin/login" />}>
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:flex md:gap-8">
        <aside class="mb-6 md:mb-0 md:w-60 md:shrink-0">
          <div class="rounded-3xl border border-charcoal/[0.06] bg-white p-4 shadow-soft">
            <p class="text-sm font-bold text-charcoal-700">{t("admin.loginTitle")}</p>
            <p class="truncate text-xs text-charcoal-400">{auth.user()?.email}</p>
            <nav class="mt-4 flex flex-wrap gap-1 md:flex-col md:space-y-1">
              <For each={nav}>
                {(item) => (
                  <A
                    href={item.href}
                    class="rounded-xl px-3 py-2 text-sm font-medium text-charcoal-600 transition-colors hover:bg-moss-50 hover:text-moss-700"
                  >
                    {t(item.labelKey)}
                  </A>
                )}
              </For>
              <A
                href="/"
                class="rounded-xl px-3 py-2 text-sm font-medium text-charcoal-400 transition-colors hover:bg-cream-100"
              >
                {t("admin.viewSite")}
              </A>
            </nav>
            <div class="mt-4 border-t border-charcoal/[0.08] pt-4">
              <button
                onClick={() => auth.logout()}
                class="w-full rounded-xl border border-charcoal/10 px-3 py-2 text-sm font-medium text-charcoal-600 transition-colors hover:bg-cream-100"
              >
                {t("admin.logout")}
              </button>
            </div>
          </div>
        </aside>
        <div class="min-w-0 flex-1">{props.children}</div>
      </div>
    </Show>
  );
}
