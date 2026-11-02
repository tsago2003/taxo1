import { createResource, For, Show } from "solid-js";
import { api } from "../../lib/api";
import { useI18n } from "../../stores/i18n";
import { formatPrice } from "../../lib/format";
import ProductImage from "../../components/ProductImage";

interface PendingProduct {
  id: number;
  name: string;
  price: number;
  brand: string | null;
  category: string;
  image_url: string | null;
  shop_name: string;
  seller_email: string;
  moderation_reasons: string[];
}

const REASON_LABELS: Record<string, string> = {
  low_resolution: "Low resolution",
  too_landscape: "Too wide (landscape)",
  too_tall: "Too narrow/tall",
  too_dark: "Too dark",
  too_bright: "Too bright / overexposed",
  blurry: "Blurry / out of focus",
  possible_nudity: "Possible nudity / skin detection",
  unreadable_image: "Unreadable image",
  manual_review_required: "Manual review required",
};

export default function Moderation() {
  const { t } = useI18n();
  const [queue, { refetch }] = createResource<PendingProduct[]>(() => api.get("/api/admin/moderation"));

  async function approve(id: number) {
    await api.post(`/api/admin/moderation/${id}/approve`);
    refetch();
  }
  async function reject(id: number) {
    if (!window.confirm("Reject this product? It will stay hidden from the store.")) return;
    await api.post(`/api/admin/moderation/${id}/reject`);
    refetch();
  }

  return (
    <div>
      <h1 class="text-2xl font-bold text-charcoal-700">{t("admin.moderationQueue")}</h1>
      <p class="mt-1 text-sm text-charcoal-400">{t("admin.moderationSub")}</p>

      <Show when={!queue.loading} fallback={<p class="mt-6 text-charcoal-400">{t("common.loading")}</p>}>
        <Show
          when={(queue() || []).length > 0}
          fallback={
            <div class="mt-6 rounded-3xl border border-dashed border-charcoal/15 p-12 text-center text-charcoal-400">
              {t("admin.allClear")}
            </div>
          }
        >
          <div class="mt-5 space-y-4">
            <For each={queue() || []}>
              {(p) => (
                <div class="flex flex-col gap-4 rounded-3xl border border-charcoal/[0.06] bg-white p-4 shadow-soft sm:flex-row">
                  <div class="h-40 w-full shrink-0 overflow-hidden rounded-2xl bg-cream-100 sm:w-32">
                    <ProductImage src={p.image_url} alt={p.name} class="h-full w-full object-cover" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-2">
                      <div>
                        <p class="font-semibold text-charcoal-700">{p.name}</p>
                        <p class="text-xs text-charcoal-400">
                          {p.shop_name} · {p.seller_email}
                        </p>
                        <p class="mt-1 text-xs text-charcoal-400">
                          {p.category}
                          {p.brand ? ` · ${p.brand}` : ""}
                        </p>
                      </div>
                      <p class="shrink-0 font-bold text-charcoal-700">{formatPrice(p.price)}</p>
                    </div>

                    <div class="mt-3 flex flex-wrap gap-2">
                      <For each={p.moderation_reasons || []}>
                        {(reason) => (
                          <span class="rounded-full bg-terracotta-50 px-2.5 py-1 text-xs font-medium text-terracotta-700">
                            {REASON_LABELS[reason] ?? reason}
                          </span>
                        )}
                      </For>
                    </div>
                  </div>
                  <div class="flex shrink-0 gap-2 sm:flex-col">
                    <button
                      onClick={() => approve(p.id)}
                      class="rounded-full bg-moss-600 px-4 py-2 text-sm font-semibold text-cream-50 shadow-soft transition hover:bg-moss-700"
                    >
                      {t("admin.approve")}
                    </button>
                    <button
                      onClick={() => reject(p.id)}
                      class="rounded-full border border-terracotta-300 px-4 py-2 text-sm font-semibold text-terracotta-600 transition hover:bg-terracotta-50"
                    >
                      {t("admin.reject")}
                    </button>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
}
