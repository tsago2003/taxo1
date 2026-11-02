import { createResource, createSignal, For, Show } from "solid-js";
import { A, useParams } from "@solidjs/router";
import { api } from "../lib/api";
import { useI18n } from "../stores/i18n";
import ProductImage from "../components/ProductImage";
import AddToCartButton from "../components/AddToCartButton";
import WishlistButton from "../components/WishlistButton";
import ProductCard from "../components/ProductCard";
import { formatPrice } from "../lib/format";
import type { Product } from "../lib/types";

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const { t, categoryLabel, conditionLabel } = useI18n();

  const productId = () => Number(params.id);

  const fetchProduct = (id: number): Promise<Product> => api.get(`/api/products/${id}`);
  const fetchSimilar = (id: number): Promise<Product[]> => api.get(`/api/products/${id}/similar`);

  const [product] = createResource<Product, number>(productId, fetchProduct);
  const [similar] = createResource<Product[], number>(productId, fetchSimilar);
  const [activeImage, setActiveImage] = createSignal(0);
  const images = () =>
    product()?.images?.length ? product()!.images! : product()?.image_url ? [product()!.image_url!] : [];

  return (
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <A href="/products" class="text-sm font-medium text-charcoal-500 transition-colors hover:text-moss-600">
        {t("detail.back")}
      </A>

      <Show when={product()} fallback={<p class="mt-8 text-center text-charcoal-400">{t("detail.loading")}</p>}>
        <div>
          <div class="mt-6 grid gap-10 lg:grid-cols-2">
            <div>
              <div class="aspect-[3/4] w-full overflow-hidden rounded-3xl border border-charcoal/[0.06] bg-cream-100 shadow-soft">
                <ProductImage src={images()[activeImage()]} alt={product()!.name} class="h-full w-full object-cover" />
              </div>
              <Show when={images().length > 1}>
                <div class="mt-3 flex gap-2">
                  <For each={images()}>
                    {(img, i) => (
                      <button
                        onClick={() => setActiveImage(i())}
                        class={`h-20 w-16 overflow-hidden rounded-xl border-2 ${activeImage() === i() ? "border-moss-600" : "border-transparent"}`}
                      >
                        <ProductImage src={img} alt="" class="h-full w-full object-cover" />
                      </button>
                    )}
                  </For>
                </div>
              </Show>
            </div>
            <div>
              <p class="text-sm font-semibold uppercase tracking-wide text-moss-600">
                {categoryLabel(product()!.category)}
              </p>
              <h1 class="mt-2 text-3xl font-bold text-charcoal-700">{product()!.name}</h1>
              <div class="mt-3 flex flex-wrap items-center gap-3">
                <Show when={product()!.sale_price} fallback={<p class="text-2xl font-bold text-charcoal-800">{formatPrice(product()!.price)}</p>}>
                  <p class="text-2xl font-bold text-terracotta-600">{formatPrice(product()!.sale_price!)}</p>
                  <p class="text-lg text-charcoal-400 line-through">{formatPrice(product()!.price)}</p>
                </Show>
                <Show when={(product()!.rating_avg ?? 0) > 0}>
                  <span class="rounded-full bg-terracotta-50 px-2.5 py-1 text-sm font-semibold text-terracotta-600">★ {product()!.rating_avg}</span>
                </Show>
              </div>
              <p class="mt-6 whitespace-pre-line leading-relaxed text-charcoal-500">
                {product()!.description || t("detail.defaultDescription")}
              </p>
              <Show when={product()!.measurements}>
                <div class="mt-6 rounded-2xl border border-black/5 bg-cream-100 p-4">
                  <p class="text-sm font-semibold text-charcoal-700">{t("detail.measurements")}</p>
                  <div class="mt-3 grid grid-cols-3 gap-3">
                    <Show when={product()!.measurements!.waist}>
                      <div>
                        <p class="text-xs text-charcoal-400">{t("detail.waist")}</p>
                        <p class="mt-1 text-sm font-semibold text-charcoal-800">{product()!.measurements!.waist} სმ</p>
                      </div>
                    </Show>
                    <Show when={product()!.measurements!.length}>
                      <div>
                        <p class="text-xs text-charcoal-400">{t("detail.length")}</p>
                        <p class="mt-1 text-sm font-semibold text-charcoal-800">{product()!.measurements!.length} სმ</p>
                      </div>
                    </Show>
                    <Show when={product()!.measurements!.sleeve}>
                      <div>
                        <p class="text-xs text-charcoal-400">{t("detail.sleeve")}</p>
                        <p class="mt-1 text-sm font-semibold text-charcoal-800">{product()!.measurements!.sleeve} სმ</p>
                      </div>
                    </Show>
                  </div>
                </div>
              </Show>
              <dl class="mt-6 grid grid-cols-2 gap-4 border-t border-charcoal/[0.08] pt-6 text-sm">
                <div>
                  <dt class="font-medium text-charcoal-400">{t("detail.condition")}</dt>
                  <dd class="mt-1 font-medium text-charcoal-700">{conditionLabel(product()!.condition)}</dd>
                </div>
                <div>
                  <dt class="font-medium text-charcoal-400">{t("detail.category")}</dt>
                  <dd class="mt-1 font-medium text-charcoal-700">{categoryLabel(product()!.category)}</dd>
                </div>
                <div>
                  <dt class="font-medium text-charcoal-400">{t("detail.size")}</dt>
                  <dd class="mt-1 font-medium text-charcoal-700">{product()!.size || t("product.oneSize")}</dd>
                </div>
                <div>
                  <dt class="font-medium text-charcoal-400">{t("detail.brand")}</dt>
                  <dd class="mt-1 font-medium text-charcoal-700">{product()!.brand || t("detail.unbranded")}</dd>
                </div>
                <div>
                  <dt class="font-medium text-charcoal-400">{t("product.stock")}</dt>
                  <dd class="mt-1 font-medium text-charcoal-700">{t("product.inStock", { count: product()!.quantity ?? 1 })}</dd>
                </div>
              </dl>
              <div class="mt-8 flex max-w-sm items-stretch gap-3">
                <div class="flex-1"><AddToCartButton product={product()!} /></div>
                <WishlistButton productId={product()!.id} class="h-12 w-12 rounded-full border border-charcoal/10 bg-white text-charcoal-500" />
              </div>

              {/* Seller mini-card */}
              <A
                href={`/shops/${product()!.user_id}`}
                class="mt-6 flex max-w-sm items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-card transition-all duration-200 ease-out hover:shadow-card-hover"
              >
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-moss-100 text-lg font-bold text-moss-700">
                  {(product()!.shop_name || "?").charAt(0)}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-charcoal-800">{product()!.shop_name || t("detail.unknownShop")}</p>
                  <Show when={product()!.verification_status === "verified"}>
                    <span class="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-moss-600">
                      ✓ {t("detail.verifiedShop")}
                    </span>
                  </Show>
                </div>
                <span class="shrink-0 text-sm font-semibold text-moss-600">{t("detail.viewShop")}</span>
              </A>

              {/* Trust & delivery */}
              <div class="mt-6 max-w-sm space-y-2 rounded-2xl border border-black/5 bg-cream-100 p-4 text-sm text-charcoal-600">
                <div class="flex items-start gap-2.5">
                  <span class="mt-0.5 shrink-0">🚚</span>
                  <span>{t("trust.delivery")}</span>
                </div>
                <div class="flex items-start gap-2.5">
                  <span class="mt-0.5 shrink-0 text-moss-600">✓</span>
                  <span>{t("trust.quality")}</span>
                </div>
                <div class="flex items-start gap-2.5">
                  <span class="mt-0.5 shrink-0 text-moss-600">↩</span>
                  <span>{t("trust.returns")}</span>
                </div>
              </div>
            </div>
          </div>

          <Show when={(similar() || []).length > 0}>
            <section class="mt-20">
              <h2 class="text-2xl font-bold text-charcoal-700">{t("detail.moreLikeThis")}</h2>
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
