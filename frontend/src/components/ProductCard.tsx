import { A } from "@solidjs/router";
import type { Product } from "../lib/types";
import { formatPrice } from "../lib/format";
import ProductImage from "./ProductImage";
import WishlistButton from "./WishlistButton";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard(props: { product: Product; wishlisted?: boolean }) {
  const p = props.product;

  return (
    <div class="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <A href={`/products/${p.id}`} class="flex flex-1 flex-col">
        <div class="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
          <ProductImage
            src={p.image_url}
            alt={p.name}
            class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          {p.is_sold && (
            <span class="absolute left-3 top-3 rounded-full bg-neutral-900/80 px-2.5 py-1 text-xs font-semibold text-white">
              Sold
            </span>
          )}
        </div>
        <div class="flex flex-1 flex-col p-4 pb-3">
          <div class="flex items-start justify-between gap-2">
            <h3 class="line-clamp-1 text-sm font-semibold text-neutral-800">{p.name}</h3>
            <p class="shrink-0 text-sm font-bold text-emerald-700">{formatPrice(p.price)}</p>
          </div>
          <p class="mt-1 line-clamp-1 text-xs text-neutral-500">
            {[p.brand, p.category, p.condition].filter(Boolean).join(" · ")}
          </p>
          {p.size && <p class="mt-1 text-xs text-neutral-400">Size {p.size}</p>}
        </div>
      </A>

      <div class="absolute right-3 top-3 z-10">
        <WishlistButton productId={p.id} initial={props.wishlisted} />
      </div>

      <div class="px-4 pb-4">
        <AddToCartButton
          product={p}
          class="w-full rounded-full border border-emerald-200 bg-emerald-50 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
        />
      </div>
    </div>
  );
}
