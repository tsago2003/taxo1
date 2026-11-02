import { createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../stores/auth";
import { useCart } from "../stores/cart";
import { useWishlist } from "../stores/wishlist";
import { useI18n } from "../stores/i18n";
import type { Language } from "../lib/i18n";
import Logo from "./Logo";
import { BagIcon, CloseIcon, HeartIcon } from "./icons";

function LangSwitcher() {
  const { lang, setLang } = useI18n();

  const option = (value: Language, label: string) => (
    <button
      onClick={() => setLang(value)}
      aria-pressed={lang() === value}
      class={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-300 ${
        lang() === value
          ? "bg-moss-600 text-cream-50 shadow-soft"
          : "text-charcoal-500 hover:text-charcoal-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div class="flex items-center rounded-full border border-charcoal/10 bg-white/70 p-0.5">
      {option("ka", "ქარ")}
      {option("en", "Eng")}
    </div>
  );
}

export default function Navbar() {
  const auth = useAuth();
  const cart = useCart();
  const wishlist = useWishlist();
  const { t } = useI18n();
  const [open, setOpen] = createSignal(false);

  const navLinkCls =
    "text-sm font-medium text-charcoal-500 transition-colors duration-300 hover:text-moss-600";

  return (
    <header class="sticky top-0 z-40 border-b border-charcoal/[0.07] bg-cream/80 backdrop-blur-md">
      <nav class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Logo />

        {/* Desktop navigation */}
        <div class="hidden items-center gap-7 lg:flex">
          <A href="/products" class={navLinkCls}>
            {t("nav.shop")}
          </A>
          <A href="/#stories" class={navLinkCls}>
            {t("nav.stories")}
          </A>
          <A href="/#about" class={navLinkCls}>
            {t("nav.about")}
          </A>
          <A
            href="/seller/register"
            class="rounded-full border border-moss-600 px-4 py-2 text-sm font-semibold text-moss-700 transition-all duration-200 ease-out hover:bg-moss-600/10"
          >
            {t("nav.sellWithUs")}
          </A>
        </div>

        {/* Right cluster */}
        <div class="flex items-center gap-2 sm:gap-3">
          <LangSwitcher />

          {/* Wishlist */}
          <A
            href="/account?tab=wishlist"
            class="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-charcoal-500 transition-colors duration-300 hover:bg-white hover:text-terracotta-500"
            aria-label={t("nav.wishlist")}
          >
            <HeartIcon />
            <Show when={wishlist.count() > 0}>
              <span class="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta-500 px-1 text-[11px] font-bold text-white shadow-soft">
                {wishlist.count()}
              </span>
            </Show>
          </A>

          {/* Cart */}
          <A
            href="/cart"
            class="relative inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-white/70 px-3 py-2 text-sm font-medium text-charcoal-600 transition-all duration-300 hover:border-moss-300 hover:text-moss-600 sm:px-4"
          >
            <BagIcon />
            <span class="hidden sm:inline">{t("nav.cart")}</span>
            <Show when={cart.totalItems() > 0}>
              <span class="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-moss-600 px-1 text-[11px] font-bold text-white shadow-soft">
                {cart.totalItems()}
              </span>
            </Show>
          </A>

          {/* Auth — desktop */}
          <Show
            when={auth.user()}
            fallback={
              <A
                href="/login"
                class="hidden rounded-full px-4 py-2 text-sm font-semibold text-charcoal-600 transition-colors duration-300 hover:text-moss-600 sm:inline"
              >
                {t("nav.signIn")}
              </A>
            }
          >
            <div class="hidden items-center gap-3 sm:flex">
              <Show when={auth.user()?.role === "seller"}>
                <A
                  href="/seller"
                  class="rounded-full bg-moss-600 px-4 py-2 text-sm font-semibold text-cream-50 transition hover:bg-moss-700"
                >
                  {t("nav.dashboard")}
                </A>
              </Show>
              <Show when={auth.user()?.role === "admin"}>
                <A
                  href="/admin"
                  class="rounded-full bg-charcoal-700 px-4 py-2 text-sm font-semibold text-cream-50 transition hover:bg-charcoal-800"
                >
                  {t("nav.admin")}
                </A>
              </Show>
              <A
                href="/account"
                class="text-sm font-medium text-charcoal-500 transition-colors hover:text-moss-600"
              >
                {t("nav.myAccount")}
              </A>
              <button
                onClick={() => auth.logout()}
                class="text-sm font-medium text-charcoal-500 transition-colors hover:text-terracotta-500"
              >
                {t("nav.signOut")}
              </button>
            </div>
          </Show>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open())}
            class="inline-flex h-10 w-10 items-center justify-center rounded-full text-charcoal-600 transition hover:bg-white lg:hidden"
            aria-label="Menu"
            aria-expanded={open()}
          >
            <Show when={open()} fallback={<MenuIcon />}>
              <CloseIcon class="h-5 w-5" />
            </Show>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <Show when={open()}>
        <div class="animate-scale-in border-t border-charcoal/[0.07] bg-cream/95 px-4 py-4 lg:hidden">
          <div class="flex flex-col gap-1">
            <A href="/products" onClick={() => setOpen(false)} class="rounded-xl px-3 py-3 text-sm font-medium text-charcoal-600 hover:bg-white">
              {t("nav.shop")}
            </A>
            <A href="/#stories" onClick={() => setOpen(false)} class="rounded-xl px-3 py-3 text-sm font-medium text-charcoal-600 hover:bg-white">
              {t("nav.stories")}
            </A>
            <A href="/#about" onClick={() => setOpen(false)} class="rounded-xl px-3 py-3 text-sm font-medium text-charcoal-600 hover:bg-white">
              {t("nav.about")}
            </A>
            <A href="/seller/register" onClick={() => setOpen(false)} class="rounded-xl px-3 py-3 text-sm font-semibold text-moss-600 hover:bg-white">
              {t("nav.sellWithUs")}
            </A>
            <Show
              when={auth.user()}
              fallback={
                <A href="/login" onClick={() => setOpen(false)} class="rounded-xl px-3 py-3 text-sm font-medium text-charcoal-600 hover:bg-white">
                  {t("nav.signIn")}
                </A>
              }
            >
              <Show when={auth.user()?.role === "seller"}>
                <A href="/seller" onClick={() => setOpen(false)} class="rounded-xl px-3 py-3 text-sm font-semibold text-moss-600 hover:bg-white">
                  {t("nav.dashboard")}
                </A>
              </Show>
              <Show when={auth.user()?.role === "admin"}>
                <A href="/admin" onClick={() => setOpen(false)} class="rounded-xl px-3 py-3 text-sm font-semibold text-charcoal-700 hover:bg-white">
                  {t("nav.admin")}
                </A>
              </Show>
              <A href="/account" onClick={() => setOpen(false)} class="rounded-xl px-3 py-3 text-sm font-medium text-charcoal-600 hover:bg-white">
                {t("nav.myAccount")}
              </A>
              <button
                onClick={() => {
                  setOpen(false);
                  auth.logout();
                }}
                class="rounded-xl px-3 py-3 text-left text-sm font-medium text-terracotta-500 hover:bg-white"
              >
                {t("nav.signOut")}
              </button>
            </Show>
          </div>
        </div>
      </Show>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
