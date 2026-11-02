import { createResource, For, Show } from "solid-js";
import { A, useParams } from "@solidjs/router";
import { api } from "../lib/api";
import { useAuth } from "../stores/auth";
import ProductImage from "../components/ProductImage";
import AddToCartButton from "../components/AddToCartButton";
import WishlistButton from "../components/WishlistButton";
import ProductCard from "../components/ProductCard";
import { formatPrice } from "../lib/format";
import type { Product } from "../lib/types";

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const auth = useAuth();

  const productId = () => Number(params.id);

  const fetchProduct = (id: number): Promise<Product> => api.get(`/api/products/${id}`);
  const fetchSimilar = (id: number): Promise<Product[]> => api.get(`/api/products/${id}/similar`);
  const fetchWishlist = (): Promise<Product[]> =>
    auth.user()?.role === "buyer" ? api.get("/api/wishlist") : Promise.resolve([]);

  const [product] = createResource<Product, number>(productId, fetchProduct);
  const [similar] = createResource<Product[], number>(productId, fetchSimilar);
  const [wishlist] = createResource<Product[]>(fetchWishlist);

  const inWishlist = () => (wishlist() || []).some((p) => p.id === productId());

  return (
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <A href="/products" class="text-sm font-medium text-neutral-500 hover:text-emerald-700">← Back to shop</A>

      <Show when={product()} fallback={<p class="mt-8 text-center text-neutral-500">Loading…</p>}>
        <div>
          <div class="mt-6 grid gap-10 lg:grid-cols-2">
            <div class="aspect-[3/4] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
              <ProductImage src={product()!.image_url} alt={product()!.name} class="h-full w-full object-cover" />
            </div>
            <div>
              <p class="text-sm font-semibold uppercase tracking-wide text-emerald-700">{product()!.category}</p>
              <h1 class="mt-2 text-3xl font-bold text-neutral-900">{product()!.name}</h1>
              <p class="mt-3 text-2xl font-bold text-neutral-900">{formatPrice(product()!.price)}</p>
              <p class="mt-6 whitespace-pre-line text-neutral-600">{product()!.description || "This pre-loved piece is ready for a new home."}</p>
              <dl class="mt-6 grid grid-cols-2 gap-4 border-t border-neutral-200 pt-6 text-sm">
                <div><dt class="font-medium text-neutral-400">Condition</dt><dd class="mt-1 font-medium text-neutral-800">{product()!.condition}</dd></div>
                <div><dt class="font-medium text-neutral-400">Category</dt><dd class="mt-1 font-medium text-neutral-800">{product()!.category}</dd></div>
                <div><dt class="font-medium text-neutral-400">Size</dt><dd class="mt-1 font-medium text-neutral-800">{product()!.size || "One size"}</dd></div>
                <div><dt class="font-medium text-neutral-400">Brand</dt><dd class="mt-1 font-medium text-neutral-800">{product()!.brand || "Unbranded"}</dd></div>
                <div><dt class="font-medium text-neutral-400">Shop</dt><dd class="mt-1 font-medium text-neutral-800">{product()!.shop_name || "Unknown"}</dd></div>
              </dl>
              <div class="mt-8 flex max-w-sm items-stretch gap-3">
                <div class="flex-1"><AddToCartButton product={product()!} /></div>
                <WishlistButton productId={product()!.id} initial={inWishlist()} class="h-12 w-12 rounded-full border border-neutral-300 bg-white text-neutral-700" />
              </div>
            </div>
          </div>

          <Show when={(similar() || []).length > 0}>
            <section class="mt-20">
              <h2 class="text-2xl font-bold text-neutral-800">More like this</h2>
              <div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                <For each={similar() || []}>{(item) => <ProductCard product={item} />}</For>
              </div>
            </section>
          </Show>
        </div>
      </Show>
    </div>
  );
}
