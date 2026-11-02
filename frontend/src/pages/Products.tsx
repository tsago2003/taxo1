import { createResource, For, Show } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { api } from "../lib/api";
import { useI18n } from "../stores/i18n";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import type { Product } from "../lib/types";

export default function Products() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams<{
    q?: string;
    category?: string;
    size?: string;
    condition?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>();

  const queryString = () => {
    const params = new URLSearchParams();
    const entries: [string, string | undefined][] = [
      ["q", searchParams.q],
      ["category", searchParams.category],
      ["size", searchParams.size],
      ["condition", searchParams.condition],
      ["sort", searchParams.sort],
      ["minPrice", searchParams.minPrice],
      ["maxPrice", searchParams.maxPrice],
    ];
    entries.forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  };

  const [products] = createResource(queryString, (qs) =>
    api.get(`/api/products${qs ? `?${qs}` : ""}`)
  );

  return (
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div class="pt-2">
        <h1 class="text-2xl font-bold text-charcoal-700 sm:text-3xl">{t("shop.title")}</h1>
        <p class="mt-1 text-sm text-charcoal-400">{t("shop.subtitle")}</p>
      </div>

      <div class="mt-6">
        <ProductFilters />
      </div>

      <div class="mt-6">
        <Show
          when={!products.loading}
          fallback={
            <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <For each={[0, 1, 2, 3, 4, 5, 6, 7]}>
                {() => (
                  <div class="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card">
                    <div class="skeleton aspect-[3/4] w-full" />
                    <div class="space-y-2 p-4">
                      <div class="skeleton h-4 w-3/4 rounded" />
                      <div class="skeleton h-3 w-1/2 rounded" />
                    </div>
                  </div>
                )}
              </For>
            </div>
          }
        >
          <p class="text-sm text-charcoal-400">
            {t("shop.found", { count: (products() || []).length })}
          </p>
          <Show
            when={(products() || []).length > 0}
            fallback={
              <div class="mt-6 rounded-3xl border border-dashed border-charcoal/15 p-12 text-center text-charcoal-400">
                {t("shop.empty")}
              </div>
            }
          >
            <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <For each={products() || []}>
                {(product) => <ProductCard product={product} />}
              </For>
            </div>
          </Show>
        </Show>
      </div>
    </div>
  );
}
