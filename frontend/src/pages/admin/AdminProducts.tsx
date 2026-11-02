import { createResource, For, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { api } from "../../lib/api";
import { useI18n } from "../../stores/i18n";
import ProductImage from "../../components/ProductImage";
import { formatPrice } from "../../lib/format";
import type { Product } from "../../lib/types";

export default function AdminProducts() {
  const navigate = useNavigate();
  const { t, categoryLabel } = useI18n();
  const [products, { refetch }] = createResource<Product[]>(() => api.get("/api/products/mine"));

  async function handleDelete(id: number) {
    if (!window.confirm(t("seller.confirmDelete"))) return;
    await api.delete(`/api/products/${id}`);
    refetch();
  }

  return (
    <div>
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-neutral-900">{t("seller.products")}</h1>
        <A href="/seller/products/new" class="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
          {t("seller.addProduct")}
        </A>
      </div>

      <Show
        when={(products() || []).length > 0}
        fallback={
          <div class="mt-8 rounded-2xl border border-dashed border-neutral-300 p-12 text-center text-neutral-500">
            {t("seller.noProducts")}
          </div>
        }
      >
        <div class="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
          <table class="w-full min-w-[700px] text-left text-sm">
            <thead class="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-400">
              <tr>
                <th class="px-4 py-3 font-medium">{t("seller.product")}</th>
                <th class="px-4 py-3 font-medium">{t("seller.price")}</th>
                <th class="px-4 py-3 font-medium">{t("form.quantity")}</th>
                <th class="px-4 py-3 font-medium">{t("seller.status")}</th>
                <th class="px-4 py-3 text-right font-medium">{t("seller.actions")}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <For each={products() || []}>
                {(product) => (
                  <tr class="hover:bg-neutral-50">
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <div class="h-12 w-10 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                          <ProductImage src={product.image_url} alt={product.name} class="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p class="font-medium text-neutral-800">{product.name}</p>
                          <p class="text-xs text-neutral-500">
                            {product.brand || "—"}
                            {product.size ? ` · ${product.size}` : ""}
                            {" · "}
                            {categoryLabel(product.category)}
                          </p>
                          {product.moderation_status === "pending" && (
                            <span class="mt-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                              {t("seller.underReview")}
                            </span>
                          )}
                          {product.moderation_status === "rejected" && (
                            <span class="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">
                              {t("seller.rejected")}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 font-medium text-neutral-800">{formatPrice(product.price)}</td>
                    <td class="px-4 py-3 text-neutral-600">{product.quantity ?? 1} {t("form.quantityHint")}</td>
                    <td class="px-4 py-3">
                      {product.is_sold ? (
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-charcoal-100 px-2.5 py-1 text-xs font-medium text-charcoal-500">
                          <span class="h-1.5 w-1.5 rounded-full bg-charcoal-400" />
                          {t("seller.soldOut")}
                        </span>
                      ) : (
                        <span class="inline-flex items-center gap-1.5 rounded-full bg-moss-50 px-2.5 py-1 text-xs font-medium text-moss-700">
                          <span class="h-1.5 w-1.5 rounded-full bg-moss-500" />
                          {t("seller.available")}
                        </span>
                      )}
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex items-center justify-end gap-4">
                        <A href={`/seller/products/${product.id}/edit`} class="text-sm font-medium text-emerald-700 hover:underline">
                          {t("seller.edit")}
                        </A>
                        <button onClick={() => handleDelete(product.id)} class="text-sm font-medium text-red-600 hover:underline">
                          {t("seller.delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
    </div>
  );
}
