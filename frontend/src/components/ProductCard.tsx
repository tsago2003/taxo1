import { Show } from "solid-js";
import { A } from "@solidjs/router";
import type { Product } from "../lib/types";
import { formatPrice } from "../lib/format";
import { useI18n } from "../stores/i18n";
import ProductImage from "./ProductImage";
import WishlistButton from "./WishlistButton";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard(props: { product: Product }) {
  const p = props.product;
  const { t, categoryLabel, conditionLabel } = useI18n();

  const conditionTone = (c: string) =>
    c === "Like new" || c === "New with tags"
      ? "bg-moss-50 text-moss-700"
      : c === "Good"
        ? "bg-sand-100 text-charcoal-600"
        : "bg-charcoal-100 text-charcoal-500";

  return (
    <div class="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover">
      {/* Image */}
      <div class="relative aspect-[3/4] w-full overflow-hidden bg-cream-100">
        <A href={`/products/${p.id}`} class="absolute inset-0 z-[1]" aria-label={p.name}>
          <ProductImage
            src={p.image_url}
            alt={p.name}
            class="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        </A>

        <Show
          when={p.is_sold}
          fallback={
            <span class={`absolute left-3 top-3 z-[2] rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-soft backdrop-blur ${conditionTone(p.condition)}`}>
              {conditionLabel(p.condition)}
            </span>
          }
        >
          <span class="absolute left-3 top-3 z-[2] rounded-full bg-charcoal-700/85 px-2.5 py-1 text-xs font-semibold text-white">
            {t("product.sold")}
          </span>
        </Show>

        <Show when={p.sale_price}>
          <span class="absolute bottom-3 left-3 z-[2] rounded-full bg-terracotta-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-soft">
            -{Math.round((1 - p.sale_price! / p.price) * 100)}%
          </span>
        </Show>

        {/* Wishlist heart */}
        <div class="absolute right-3 top-3 z-[2]">
          <WishlistButton productId={p.id} />
        </div>

        {/* Desktop quick-add — slides up on hover */}
        <Show when={!p.is_sold}>
          <div class="absolute inset-x-3 bottom-3 z-[2] hidden translate-y-4 opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100 lg:block">
            <AddToCartButton
              product={p}
              class="w-full rounded-full bg-moss-600/95 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-soft-lg backdrop-blur transition-colors duration-300 hover:bg-moss-700"
            />
          </div>
        </Show>
      </div>

      {/* Info */}
      <A href={`/products/${p.id}`} class="flex flex-1 flex-col p-4 pb-3">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <h3 class="truncate text-sm font-semibold text-charcoal-700">{p.name}</h3>
            <p class="mt-0.5 truncate text-xs text-charcoal-400">
              {[p.brand, categoryLabel(p.category)].filter(Boolean).join(" · ")}
            </p>
            <Show when={p.rating_avg && p.rating_avg > 0}>
              <p class="mt-0.5 text-xs font-semibold text-terracotta-500">★ {p.rating_avg}</p>
            </Show>
          </div>
          <div class="shrink-0 text-right">
            <Show when={p.sale_price} fallback={<p class="text-base font-bold text-charcoal-800">{formatPrice(p.price)}</p>}>
              <p class="text-xs text-charcoal-400 line-through">{formatPrice(p.price)}</p>
              <p class="text-base font-bold text-terracotta-600">{formatPrice(p.sale_price!)}</p>
            </Show>
          </div>
        </div>
        {(p.size || p.brand) && (
          <p class="mt-1.5 text-[11px] font-medium text-charcoal-400">
            {p.size && p.brand
              ? t("product.sizeBrand", { size: p.size, brand: p.brand })
              : p.size
                ? t("product.size", { size: p.size })
                : p.brand}
          </p>
        )}
      </A>

      {/* Mobile add-to-cart */}
      <div class="px-4 pb-4 lg:hidden">
        <AddToCartButton
          product={p}
          class="w-full rounded-full bg-moss-600 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-soft transition-colors duration-300 hover:bg-moss-700"
        />
      </div>
    </div>
  );
}
