import { createResource, For, Show } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import type { Product } from "../lib/types";

export default function Products() {
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
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 class="text-2xl font-bold text-neutral-800">Shop pre-loved clothes</h1>
      <p class="mt-1 text-sm text-neutral-500">
        {(products() || []).length} {(products() || []).length === 1 ? "item" : "items"} found
      </p>

      <div class="mt-6">
        <ProductFilters />
      </div>

      <Show when={!products.loading} fallback={<p class="mt-10 text-center text-neutral-500">Loading…</p>}>
        <Show
          when={(products() || []).length > 0}
          fallback={
            <div class="mt-10 rounded-2xl border border-dashed border-neutral-300 p-12 text-center text-neutral-500">
              No products match your filters. Try clearing some filters.
            </div>
          }
        >
          <div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <For each={products() || []}>
              {(product) => <ProductCard product={product} />}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
}
