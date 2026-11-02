import { createResource, createSignal, For, Show } from "solid-js";
import { api } from "../../lib/api";
import { useI18n } from "../../stores/i18n";
import { formatPrice } from "../../lib/format";
import ProductImage from "../../components/ProductImage";

interface AdminProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  brand: string | null;
  is_sold: boolean;
  quantity: number;
  image_url: string | null;
  shop_name: string;
  seller_email: string;
}

export default function Products() {
  const { t } = useI18n();
  const [q, setQ] = createSignal("");
  const [products, { refetch }] = createResource<AdminProduct[], string>(
    () => q(),
    (search) => api.get(`/api/admin/products${search ? `?q=${encodeURIComponent(search)}` : ""}`)
  );

  async function toggleSold(id: number, isSold: boolean) {
    await api.patch(`/api/admin/products/${id}`, { isSold });
    refetch();
  }
  async function remove(id: number) {
    if (!window.confirm(t("admin.confirmDeleteProduct"))) return;
    await api.delete(`/api/admin/products/${id}`);
    refetch();
  }

  return (
    <div>
      <h1 class="text-2xl font-bold text-charcoal-700">{t("admin.products")}</h1>
      <p class="mt-1 text-sm text-charcoal-400">{t("admin.productsSub")}</p>

      <input
        value={q()}
        onInput={(e) => setQ(e.currentTarget.value)}
        placeholder={t("admin.search")}
        class="mt-5 w-full rounded-xl border border-charcoal/10 bg-white px-3 py-2.5 text-sm transition focus:border-moss-400 focus:outline-none"
      />

      <Show when={!products.loading} fallback={<p class="mt-6 text-charcoal-400">{t("common.loading")}</p>}>
        <div class="mt-5 overflow-x-auto rounded-3xl border border-charcoal/[0.06] bg-white shadow-soft">
          <table class="w-full min-w-[820px] text-left text-sm">
            <thead class="border-b border-charcoal/[0.06] text-xs uppercase tracking-wide text-charcoal-400">
              <tr>
                <th class="px-4 py-3 font-medium">{t("seller.product")}</th>
                <th class="px-4 py-3 font-medium">{t("admin.shop")}</th>
                <th class="px-4 py-3 font-medium">{t("seller.price")}</th>
                <th class="px-4 py-3 font-medium">{t("form.quantity")}</th>
                <th class="px-4 py-3 font-medium">{t("admin.status")}</th>
                <th class="px-4 py-3 text-right font-medium">{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-charcoal/[0.06]">
              <For each={products() || []}>
                {(p) => (
                  <tr class="hover:bg-cream-50">
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <div class="h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-cream-100">
                          <ProductImage src={p.image_url} alt={p.name} class="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p class="font-medium text-charcoal-700">{p.name}</p>
                          <p class="text-xs text-charcoal-400">{p.brand || p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <p class="text-charcoal-600">{p.shop_name}</p>
                      <p class="text-xs text-charcoal-400">{p.seller_email}</p>
                    </td>
                    <td class="px-4 py-3 font-medium text-charcoal-700">{formatPrice(p.price)}</td>
                    <td class="px-4 py-3 text-charcoal-600">{p.quantity ?? 1}</td>
                    <td class="px-4 py-3">
                      <span
                        class={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          p.is_sold ? "bg-charcoal-100 text-charcoal-500" : "bg-moss-50 text-moss-700"
                        }`}
                      >
                        {p.is_sold ? t("seller.soldOut") : t("seller.available")}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex items-center justify-end gap-3">
                        <button
                          onClick={() => toggleSold(p.id, !p.is_sold)}
                          class="text-sm font-medium text-moss-600 hover:underline"
                        >
                          {p.is_sold ? t("admin.markAvailable") : t("admin.markSold")}
                        </button>
                        <button onClick={() => remove(p.id)} class="text-sm font-medium text-terracotta-500 hover:underline">
                          {t("admin.delete")}
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
