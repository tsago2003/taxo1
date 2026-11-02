import { createSignal, For, Show, type JSX } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { api } from "../../lib/api";
import { CATEGORIES, CONDITIONS, SIZES } from "../../lib/constants";
import { useI18n } from "../../stores/i18n";
import ProductImage from "../../components/ProductImage";
import type { Product } from "../../lib/types";

const inputCls =
  "w-full rounded-2xl border-2 border-charcoal/10 bg-white px-4 py-3 text-base text-charcoal-700 placeholder:text-charcoal-300 transition focus:border-moss-400 focus:outline-none";
const labelCls = "mb-2 block text-base font-semibold text-charcoal-700";

function PillButton(props: { active: boolean; onClick: () => void; children: JSX.Element }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      class={`rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-200 ${
        props.active
          ? "border-moss-600 bg-moss-600 text-cream-50 shadow-soft"
          : "border-charcoal/10 bg-white text-charcoal-600 hover:border-moss-300"
      }`}
    >
      {props.children}
    </button>
  );
}

export default function ProductForm(props: { product?: Product }) {
  const navigate = useNavigate();
  const { t, categoryLabel, conditionLabel } = useI18n();
  const isEdit = () => !!props.product;

  const [name, setName] = createSignal(props.product?.name || "");
  const [description, setDescription] = createSignal(props.product?.description || "");
  const [price, setPrice] = createSignal(props.product ? String(props.product.price) : "");
  const [category, setCategory] = createSignal(props.product?.category || "");
  const [size, setSize] = createSignal(props.product?.size || "");
  const [condition, setCondition] = createSignal(props.product?.condition || "Good");
  const [brand, setBrand] = createSignal(props.product?.brand || "");
  const [quantity, setQuantity] = createSignal(props.product?.quantity || 1);
  const [images, setImages] = createSignal<string[]>(
    props.product?.images?.length ? props.product.images : props.product?.image_url ? [props.product.image_url] : []
  );
  const [salePrice, setSalePrice] = createSignal(props.product?.sale_price != null ? String(props.product.sale_price) : "");
  const [moderation, setModeration] = createSignal<{
    status: string;
    reasons: string[];
  } | null>(null);
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal("");
  const [dragging, setDragging] = createSignal(false);

  async function uploadFile(file: File) {
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const data = await api.upload("/api/upload", fd);
      setImages((prev) => [...prev, data.url].slice(0, 5));
      setModeration(data.moderation || null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function handleFile(e: Event) {
    const files = (e.currentTarget as HTMLInputElement).files;
    if (files?.length) {
      const remaining = Math.max(1, 5 - images().length);
      Array.from(files).slice(0, remaining).forEach(uploadFile);
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer?.files;
    if (files?.length) {
      const remaining = 5 - images().length;
      Array.from(files).slice(0, remaining).forEach(uploadFile);
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const priceNum = parseFloat(price());
    if (!name().trim() || !category()) {
      setError(t("form.fillRequired"));
      return;
    }
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setError(t("form.invalidPrice"));
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      name: name().trim(),
      description: description(),
      price: priceNum,
      category: category(),
      size: size() || null,
      condition: condition(),
      brand: brand() || null,
      imageUrl: images()[0] || null,
      images: images(),
      salePrice: salePrice() ? parseFloat(salePrice()) : null,
      quantity: quantity(),
      isSold: false,
    };
    try {
      if (isEdit()) await api.put(`/api/products/${props.product!.id}`, payload);
      else await api.post("/api/products", payload);
      navigate("/seller/products");
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} class="mx-auto max-w-2xl space-y-7">
      {/* Photos (1–5) */}
      <div>
        <label class={labelCls}>{t("form.photo")} <span class="text-sm font-normal text-charcoal-400">(1–5)</span></label>
        <div
          class={`flex flex-wrap gap-3 rounded-2xl p-2 transition-all duration-200 ease-out ${
            dragging() ? "bg-moss-50 ring-2 ring-moss-300" : ""
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <For each={images()}>
            {(img, i) => (
              <div class="relative">
                <div class="aspect-[3/4] w-24 overflow-hidden rounded-2xl border-2 border-charcoal/10 bg-cream-100">
                  <ProductImage src={img} alt={name() || t("form.photo")} class="h-full w-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, j) => j !== i()))}
                  class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-charcoal-700 text-xs font-bold text-white transition-transform duration-150 hover:scale-110"
                >
                  ×
                </button>
              </div>
            )}
          </For>
          <Show when={images().length < 5}>
            <label class="flex aspect-[3/4] w-24 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-charcoal/20 bg-cream-50 text-charcoal-400 transition-all duration-200 hover:border-moss-300 hover:bg-moss-50 hover:text-moss-600">
              <span class="text-3xl font-bold">+</span>
              <span class="px-2 text-center text-xs">{t("form.addPhoto")}</span>
              <input type="file" accept="image/*" multiple onChange={handleFile} class="hidden" />
            </label>
          </Show>
        </div>
        <Show when={moderation()}>
          {moderation()!.status === "approved" ? (
            <p class="mt-2 rounded-xl bg-moss-50 px-3 py-2 text-sm font-medium text-moss-700">✓ {t("form.uploadPassed")}</p>
          ) : (
            <p class="mt-2 rounded-xl bg-terracotta-50 px-3 py-2 text-sm font-medium text-terracotta-700">
              {t("form.uploadFlagged", { reasons: moderation()!.reasons.join(", ") })}
            </p>
          )}
        </Show>
      </div>

      {/* Name */}
      <div>
        <label class={labelCls}>{t("form.name")} *</label>
        <input value={name()} onInput={(e) => setName(e.currentTarget.value)} placeholder={t("form.namePlaceholder")} class={inputCls} />
      </div>

      {/* Price + quantity */}
      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label class={labelCls}>{t("form.price")} *</label>
          <input value={price()} onInput={(e) => setPrice(e.currentTarget.value)} type="number" step="0.01" min="0" inputMode="decimal" placeholder="25" class={inputCls} />
        </div>
        <div>
          <label class={labelCls}>{t("form.quantity")}</label>
          <div class="flex items-center gap-3">
            <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} class="h-12 w-12 shrink-0 rounded-2xl border-2 border-charcoal/10 bg-white text-2xl font-bold text-charcoal-600 transition hover:border-moss-300">−</button>
            <div class="flex-1 text-center">
              <span class="text-2xl font-bold text-charcoal-700">{quantity()}</span>
              <p class="text-xs text-charcoal-400">{t("form.quantityHint")}</p>
            </div>
            <button type="button" onClick={() => setQuantity((q) => Math.min(999, q + 1))} class="h-12 w-12 shrink-0 rounded-2xl border-2 border-charcoal/10 bg-white text-2xl font-bold text-charcoal-600 transition hover:border-moss-300">+</button>
          </div>
        </div>
      </div>

      {/* Sale price */}
      <div>
        <label class={labelCls}>
          {t("form.salePrice")} <span class="text-sm font-normal text-charcoal-400">({t("form.optional")})</span>
        </label>
        <input value={salePrice()} onInput={(e) => setSalePrice(e.currentTarget.value)} type="number" step="0.01" min="0" placeholder={t("form.salePriceHint")} class={inputCls} />
      </div>

      {/* Category */}
      <div>
        <label class={labelCls}>{t("form.category")} *</label>
        <div class="flex flex-wrap gap-2">
          <For each={CATEGORIES}>
            {(c) => (
              <PillButton active={category() === c} onClick={() => setCategory(c)}>
                {categoryLabel(c)}
              </PillButton>
            )}
          </For>
        </div>
      </div>

      {/* Size */}
      <div>
        <label class={labelCls}>{t("form.size")}</label>
        <div class="flex flex-wrap gap-2">
          <PillButton active={size() === ""} onClick={() => setSize("")}>
            {t("form.noSize")}
          </PillButton>
          <For each={SIZES}>
            {(s) => (
              <PillButton active={size() === s} onClick={() => setSize(s)}>
                {s}
              </PillButton>
            )}
          </For>
        </div>
      </div>

      {/* Condition */}
      <div>
        <label class={labelCls}>{t("form.condition")}</label>
        <div class="flex flex-wrap gap-2">
          <For each={CONDITIONS}>
            {(c) => (
              <PillButton active={condition() === c} onClick={() => setCondition(c)}>
                {conditionLabel(c)}
              </PillButton>
            )}
          </For>
        </div>
      </div>

      {/* Brand */}
      <div>
        <label class={labelCls}>
          {t("form.brand")} <span class="text-sm font-normal text-charcoal-400">({t("form.optional")})</span>
        </label>
        <input value={brand()} onInput={(e) => setBrand(e.currentTarget.value)} placeholder={t("form.brandPlaceholder")} class={inputCls} />
      </div>

      {/* Description */}
      <div>
        <label class={labelCls}>
          {t("form.description")} <span class="text-sm font-normal text-charcoal-400">({t("form.optional")})</span>
        </label>
        <textarea value={description()} onInput={(e) => setDescription(e.currentTarget.value)} rows={3} placeholder={t("form.descriptionPlaceholder")} class={`${inputCls} resize-y`} />
      </div>

      {error() && <p class="rounded-2xl bg-terracotta-50 px-4 py-3 text-sm font-medium text-terracotta-700">{error()}</p>}

      <div class="flex gap-3 pt-1">
        <button type="button" onClick={() => navigate("/seller/products")} class="flex-1 rounded-2xl border-2 border-charcoal/10 bg-white px-6 py-3.5 text-base font-semibold text-charcoal-600 transition hover:bg-cream-100">
          {t("form.cancel")}
        </button>
        <button type="submit" disabled={saving()} class="flex-[2] rounded-2xl bg-moss-600 px-6 py-3.5 text-base font-bold text-cream-50 shadow-soft transition hover:bg-moss-700 disabled:opacity-60">
          {saving() ? t("form.saving") : isEdit() ? t("form.save") : t("form.publish")}
        </button>
      </div>
    </form>
  );
}
