import { createResource, For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { api } from "../lib/api";
import { useAuth } from "../stores/auth";
import { CATEGORIES, CATEGORY_IMAGES, SITE_NAME, SITE_TAGLINE } from "../lib/constants";
import ProductCard from "../components/ProductCard";
import type { Product } from "../lib/types";

export default function Home() {
  const auth = useAuth();

  const [newArrivals] = createResource<Product[]>(() => api.get("/api/products?sort=newest"));
  const [trending] = createResource<Product[]>(() => api.get("/api/products?sort=trending"));
  const [recommendations] = createResource<Product[]>(() =>
    auth.user()?.role === "buyer" ? api.get("/api/recommendations") : []
  );
  const [wishlist] = createResource<Product[]>(() =>
    auth.user()?.role === "buyer" ? api.get("/api/wishlist") : []
  );
  const wishlistIds = () => new Set((wishlist() || []).map((p) => p.id));

  return (
    <div class="animate-fade-in">
      {/* Hero */}
      <section class="relative overflow-hidden bg-emerald-900">
        <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div class="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-lime-400/10 blur-3xl" />
        <div class="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div class="animate-fade-up">
            <span class="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-800/40 px-3 py-1 text-xs font-semibold text-emerald-100">
              ♻️ Sustainable fashion in Georgia
            </span>
            <h1 class="mt-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl">{SITE_TAGLINE}</h1>
            <p class="mt-4 max-w-md text-emerald-100/90">
              Discover unique, quality-checked pre-loved clothes from trusted local second-hand shops — all in one cozy place.
            </p>
            <form action="/products" method="get" class="mt-7 flex max-w-md overflow-hidden rounded-full bg-white p-1 shadow-lg">
              <input name="q" type="search" placeholder="What are you looking for?" class="min-w-0 flex-1 bg-transparent px-4 text-sm text-neutral-800 focus:outline-none" />
              <button type="submit" class="rounded-full bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">Search</button>
            </form>
            <div class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-emerald-100/90">
              <span>✓ Quality checked</span>
              <span>✓ Local shops</span>
              <span>✓ Prices in GEL</span>
            </div>
          </div>
          <div class="relative hidden lg:block">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80" alt="Rack of second-hand clothes" class="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl" />
            <div class="absolute -left-6 bottom-8 rounded-2xl bg-white px-4 py-3 shadow-xl">
              <p class="text-xs text-neutral-500">From</p>
              <p class="text-lg font-bold text-emerald-700">₾12.00</p>
            </div>
            <div class="absolute -right-4 top-8 rounded-2xl bg-white px-4 py-3 shadow-xl">
              <p class="text-xs text-neutral-500">Trusted</p>
              <p class="text-lg font-bold text-neutral-900">Local shops</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-neutral-800">Shop by category</h2>
          <A href="/products" class="text-sm font-semibold text-emerald-700 hover:underline">Browse all →</A>
        </div>
        <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <For each={CATEGORIES}>
            {(category) => (
              <A href={`/products?category=${encodeURIComponent(category)}`} class="group relative aspect-square overflow-hidden rounded-2xl">
                <img src={CATEGORY_IMAGES[category]} alt={category} class="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span class="absolute bottom-3 left-4 text-sm font-semibold text-white">{category}</span>
              </A>
            )}
          </For>
        </div>
      </section>

      {/* Recommended for you */}
      <Show when={auth.user()?.role === "buyer" && (recommendations() || []).length > 0}>
        <section class="bg-emerald-50/70">
          <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-neutral-800">Recommended for you</h2>
                <p class="mt-1 text-sm text-neutral-500">Picked from your interests, {auth.user()?.name}.</p>
              </div>
              <A href="/account?tab=recommendations" class="text-sm font-semibold text-emerald-700 hover:underline">View all →</A>
            </div>
            <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <For each={recommendations() || []}>{(product) => <ProductCard product={product} wishlisted={wishlistIds().has(product.id)} />}</For>
            </div>
          </div>
        </section>
      </Show>

      {/* Trending */}
      <section class="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <h2 class="text-2xl font-bold text-neutral-800">Trending now</h2>
        <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <For each={trending() || []}>{(product) => <ProductCard product={product} wishlisted={wishlistIds().has(product.id)} />}</For>
        </div>
      </section>

      {/* New arrivals */}
      <section class="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-neutral-800">New arrivals</h2>
          <A href="/products" class="text-sm font-semibold text-emerald-700 hover:underline">View all →</A>
        </div>
        <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <For each={newArrivals() || []}>{(product) => <ProductCard product={product} wishlisted={wishlistIds().has(product.id)} />}</For>
        </div>
      </section>

      {/* Why shop with us */}
      <section class="border-t border-neutral-200 bg-white">
        <div class="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-3">
          <div class="text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl">🌱</div>
            <h3 class="mt-3 font-semibold text-neutral-900">Sustainable</h3>
            <p class="mt-1 text-sm text-neutral-500">Every purchase gives clothes a second life and keeps them out of landfill.</p>
          </div>
          <div class="text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl">🛍️</div>
            <h3 class="mt-3 font-semibold text-neutral-900">Unique finds</h3>
            <p class="mt-1 text-sm text-neutral-500">One-of-a-kind pieces you won't see anywhere else.</p>
          </div>
          <div class="text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl">🤝</div>
            <h3 class="mt-3 font-semibold text-neutral-900">Support local</h3>
            <p class="mt-1 text-sm text-neutral-500">Buy directly from independent second-hand shops in Georgia.</p>
          </div>
        </div>
      </section>

      {/* Seller CTA */}
      <section class="bg-emerald-900">
        <div class="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <h2 class="text-2xl font-bold text-white">Are you a second-hand shop?</h2>
          <p class="mx-auto mt-3 max-w-xl text-emerald-100/90">List your items on {SITE_NAME}, reach more customers, and manage your orders from one simple dashboard.</p>
          <A href="/seller/register" class="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50">Create your shop account</A>
        </div>
      </section>
    </div>
  );
}
