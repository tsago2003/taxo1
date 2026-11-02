import { createResource, createSignal, For, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { api } from "../lib/api";
import { useAuth } from "../stores/auth";
import { useI18n } from "../stores/i18n";
import { CATEGORIES, CATEGORY_IMAGES, HERO_IMAGES } from "../lib/constants";
import ProductCard from "../components/ProductCard";
import { ArrowRightIcon, CheckIcon, SearchIcon } from "../components/icons";
import { formatPrice } from "../lib/format";
import type { Product } from "../lib/types";

export default function Home() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { t, categoryLabel } = useI18n();

  const [newArrivals] = createResource<Product[]>(() => api.get("/api/products?sort=newest"));
  const [trending] = createResource<Product[]>(() => api.get("/api/products?sort=trending"));
  const [recommendations] = createResource<Product[]>(() =>
    auth.user()?.role === "buyer" ? api.get("/api/recommendations") : []
  );

  const [query, setQuery] = createSignal("");
  const [focused, setFocused] = createSignal(false);

  const suggestions = () => {
    const q = query().trim().toLowerCase();
    if (!q) return [];
    return (newArrivals() || [])
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand || "").toLowerCase().includes(q)
      )
      .slice(0, 5);
  };

  function submitSearch(e: Event) {
    e.preventDefault();
    const q = query().trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setFocused(false);
  }

  return (
    <div class="animate-fade-in">
      {/* Hero */}
      <section class="relative overflow-hidden">
        <div class="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-terracotta-100/60 blur-3xl" />
        <div class="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-moss-100/70 blur-3xl" />
        <div class="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24 lg:pt-20">
          <div class="animate-fade-up">
            <span class="inline-flex items-center gap-2 rounded-full border border-moss-200 bg-moss-50 px-3 py-1 text-xs font-semibold text-moss-700">
              🌿 {t("hero.badge")}
            </span>
            <h1 class="mt-5 max-w-xl text-4xl font-extrabold leading-[1.15] tracking-tight text-charcoal-700 sm:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p class="mt-5 max-w-md text-base leading-relaxed text-charcoal-500 sm:text-lg">
              {t("hero.subtitle")}
            </p>

            {/* Dual action: primary CTA + compact search + quick chips */}
            <div class="mt-8 max-w-md">
              <A
                href="/products"
                class="inline-flex items-center gap-2 rounded-full bg-moss-600 px-7 py-3.5 text-base font-bold text-cream-50 shadow-soft-lg transition-all duration-200 ease-out hover:bg-moss-700 hover:shadow-card-hover active:scale-[0.98]"
              >
                {t("hero.cta")}
                <ArrowRightIcon class="h-4 w-4" />
              </A>

              <form onSubmit={submitSearch} class="relative mt-4">
                <div class="flex items-center gap-2 rounded-full border border-charcoal/[0.08] bg-white p-1.5 shadow-pill">
                  <SearchIcon class="ml-2.5 h-5 w-5 shrink-0 text-charcoal-400" />
                  <input
                    value={query()}
                    onInput={(e) => setQuery(e.currentTarget.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 150)}
                    placeholder={t("hero.searchPlaceholder")}
                    class="min-w-0 flex-1 bg-transparent py-2 text-sm text-charcoal-700 focus:outline-none"
                  />
                  <button
                    type="submit"
                    class="shrink-0 rounded-full bg-charcoal-900 px-4 py-2 text-sm font-semibold text-cream-50 transition-colors hover:bg-charcoal-800"
                  >
                    {t("hero.searchButton")}
                  </button>
                </div>

                <Show when={focused() && suggestions().length > 0}>
                  <div class="animate-scale-in absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-charcoal/[0.06] bg-white p-1.5 shadow-soft-lg">
                    <For each={suggestions()}>
                      {(p) => (
                        <A
                          href={`/products/${p.id}`}
                          class="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-cream-100"
                        >
                          <span class="truncate text-charcoal-600">{p.name}</span>
                          <span class="shrink-0 font-bold text-charcoal-800">{formatPrice(p.price)}</span>
                        </A>
                      )}
                    </For>
                  </div>
                </Show>
              </form>

              <div class="mt-4 flex flex-wrap gap-2">
                <A href="/products?q=ვინტაჟი" class="rounded-full border border-charcoal/10 bg-white/60 px-3.5 py-1.5 text-xs font-medium text-charcoal-600 transition-colors duration-200 hover:border-moss-300 hover:text-moss-700">
                  {t("hero.chip.vintage")}
                </A>
                <A href="/products?category=Outerwear" class="rounded-full border border-charcoal/10 bg-white/60 px-3.5 py-1.5 text-xs font-medium text-charcoal-600 transition-colors duration-200 hover:border-moss-300 hover:text-moss-700">
                  {t("hero.chip.jackets")}
                </A>
                <A href="/products?category=Shoes" class="rounded-full border border-charcoal/10 bg-white/60 px-3.5 py-1.5 text-xs font-medium text-charcoal-600 transition-colors duration-200 hover:border-moss-300 hover:text-moss-700">
                  {t("hero.chip.shoes")}
                </A>
                <A href="/products?maxPrice=30" class="rounded-full border border-charcoal/10 bg-white/60 px-3.5 py-1.5 text-xs font-medium text-charcoal-600 transition-colors duration-200 hover:border-moss-300 hover:text-moss-700">
                  {t("hero.chip.under30")}
                </A>
              </div>
            </div>

            {/* Trust badges */}
            <div class="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-charcoal-500">
              <span class="inline-flex items-center gap-1.5">
                <CheckIcon class="h-4 w-4 text-moss-600" /> {t("hero.trust.quality")}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <CheckIcon class="h-4 w-4 text-moss-600" /> {t("hero.trust.local")}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <CheckIcon class="h-4 w-4 text-moss-600" /> {t("hero.trust.gel")}
              </span>
            </div>
          </div>

          {/* Editorial collage */}
          <div class="relative hidden lg:block">
            <div class="grid grid-cols-2 gap-4">
              <img
                src={HERO_IMAGES.main}
                alt={t("hero.title")}
                class="col-span-2 aspect-[16/10] w-full rounded-3xl object-cover shadow-soft-lg"
              />
              <img
                src={HERO_IMAGES.top}
                alt=""
                class="aspect-[3/4] w-full rounded-3xl object-cover shadow-soft-lg"
              />
              <div class="flex flex-col gap-4">
                <img src={HERO_IMAGES.bottom} alt="" class="aspect-square w-full rounded-3xl object-cover shadow-soft-lg" />
                <img src={HERO_IMAGES.accent} alt="" class="aspect-square w-full rounded-3xl object-cover shadow-soft-lg" />
              </div>
            </div>

            <div class="animate-float absolute -left-8 top-10 rounded-2xl bg-white px-4 py-3 shadow-float">
              <p class="text-xs text-charcoal-400">{t("hero.tag.from")}</p>
              <p class="text-lg font-bold text-terracotta-500">₾35.00</p>
            </div>
            <div class="absolute -right-4 bottom-16 rounded-2xl bg-white px-4 py-3 shadow-float">
              <p class="text-xs text-charcoal-400">{t("hero.tag.trusted")}</p>
              <p class="text-lg font-bold text-charcoal-700">{t("hero.tag.localShops")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div class="flex items-end justify-between">
          <h2 class="text-2xl font-bold text-charcoal-700">{t("section.shopByCategory")}</h2>
          <A href="/products" class="inline-flex items-center gap-1 text-sm font-semibold text-moss-600 transition-colors hover:text-moss-700">
            {t("section.viewAll")}
            <ArrowRightIcon class="h-4 w-4" />
          </A>
        </div>
        <div class="no-scrollbar mt-6 flex gap-4 overflow-x-auto pb-4">
          <For each={CATEGORIES}>
            {(category) => (
              <A
                href={`/products?category=${encodeURIComponent(category)}`}
                class="group relative h-44 w-36 shrink-0 overflow-hidden rounded-3xl shadow-soft transition-shadow duration-300 hover:shadow-soft-lg sm:h-52 sm:w-44"
              >
                <img
                  src={CATEGORY_IMAGES[category]}
                  alt={categoryLabel(category)}
                  class="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/10 to-transparent" />
                <span class="absolute bottom-3 left-4 right-3 text-sm font-semibold text-white">
                  {categoryLabel(category)}
                </span>
              </A>
            )}
          </For>
        </div>
      </section>

      {/* Recommended for you */}
      <Show when={auth.user()?.role === "buyer" && (recommendations() || []).length > 0}>
        <section class="bg-moss-50/60">
          <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-charcoal-700">{t("section.recommended")}</h2>
                <p class="mt-1 text-sm text-charcoal-400">
                  {t("section.recommendedSub", { name: auth.user()?.name ?? "" })}
                </p>
              </div>
              <A href="/account?tab=recommendations" class="text-sm font-semibold text-moss-600 transition-colors hover:text-moss-700">
                {t("section.viewAll")}
              </A>
            </div>
            <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <For each={recommendations() || []}>{(product) => <ProductCard product={product} />}</For>
            </div>
          </div>
        </section>
      </Show>

      {/* Trending / Stories */}
      <section id="stories" class="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-charcoal-700">{t("section.trending")}</h2>
          <A href="/products" class="text-sm font-semibold text-moss-600 transition-colors hover:text-moss-700">
            {t("section.viewAll")}
          </A>
        </div>
        <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <For each={trending() || []}>{(product) => <ProductCard product={product} />}</For>
        </div>
      </section>

      {/* New arrivals */}
      <section class="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-charcoal-700">{t("section.newArrivals")}</h2>
          <A href="/products" class="text-sm font-semibold text-moss-600 transition-colors hover:text-moss-700">
            {t("section.viewAll")}
          </A>
        </div>
        <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <For each={newArrivals() || []}>{(product) => <ProductCard product={product} />}</For>
        </div>
      </section>

      {/* Why shop with us */}
      <section id="about" class="scroll-mt-24 border-t border-charcoal/[0.07] bg-cream-100">
        <div class="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-3">
          <div class="text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-moss-100 text-2xl">🌱</div>
            <h3 class="mt-3 font-semibold text-charcoal-700">{t("why.sustainable")}</h3>
            <p class="mt-1 text-sm leading-relaxed text-charcoal-500">{t("why.sustainableSub")}</p>
          </div>
          <div class="text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-terracotta-100 text-2xl">🛍️</div>
            <h3 class="mt-3 font-semibold text-charcoal-700">{t("why.unique")}</h3>
            <p class="mt-1 text-sm leading-relaxed text-charcoal-500">{t("why.uniqueSub")}</p>
          </div>
          <div class="text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-moss-100 text-2xl">🤝</div>
            <h3 class="mt-3 font-semibold text-charcoal-700">{t("why.local")}</h3>
            <p class="mt-1 text-sm leading-relaxed text-charcoal-500">{t("why.localSub")}</p>
          </div>
        </div>
      </section>

      {/* Seller CTA */}
      <section class="bg-moss-700">
        <div class="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <h2 class="text-2xl font-bold text-cream-50">{t("cta.title")}</h2>
          <p class="mx-auto mt-3 max-w-xl text-moss-100/90">
            {t("cta.subtitle", { site: "ReThread" })}
          </p>
          <A
            href="/seller/register"
            class="mt-6 inline-block rounded-full bg-terracotta-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:bg-terracotta-600"
          >
            {t("cta.button")}
          </A>
        </div>
      </section>
    </div>
  );
}
