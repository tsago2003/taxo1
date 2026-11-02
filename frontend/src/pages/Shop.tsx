import { createResource, For, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { api } from "../lib/api";
import { useI18n } from "../stores/i18n";
import ProductCard from "../components/ProductCard";
import type { Product } from "../lib/types";

interface ShopData {
  shop: {
    id: number;
    shop_name: string;
    shop_location: string | null;
    shop_hours: string | null;
    rating_avg: number;
    rating_count: number;
  };
  products: Product[];
}

export default function Shop() {
  const params = useParams<{ id: string }>();
  const { t } = useI18n();
  const [data] = createResource<ShopData>(() => api.get(`/api/shops/${params.id}`));

  return (
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Show when={data()} fallback={<p class="text-center text-charcoal-400">{t("common.loading")}</p>}>
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-moss-100 text-3xl font-bold text-moss-700">
            {(data()!.shop.shop_name || "?").charAt(0)}
          </div>
          <div>
            <h1 class="text-2xl font-bold text-charcoal-700">{data()!.shop.shop_name}</h1>
            <p class="mt-1 text-sm text-charcoal-400">
              {data()!.shop.shop_location || ""}
              {data()!.shop.shop_hours ? ` · ${data()!.shop.shop_hours}` : ""}
            </p>
            <Show when={data()!.shop.rating_count > 0}>
              <p class="mt-1 text-sm font-semibold text-terracotta-500">
                ★ {data()!.shop.rating_avg} ({data()!.shop.rating_count})
              </p>
            </Show>
          </div>
        </div>

        <h2 class="mt-8 text-lg font-semibold text-charcoal-700">{t("shop.all")}</h2>
        <div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <For each={data()!.products}>{(p) => <ProductCard product={p} />}</For>
        </div>
      </Show>
    </div>
  );
}
