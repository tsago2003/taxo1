import { createSignal, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { api } from "../../lib/api";
import { CATEGORIES, CONDITIONS, SIZES } from "../../lib/constants";
import ProductImage from "../../components/ProductImage";
import type { Product } from "../../lib/types";

const inputCls = "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-emerald-600 focus:outline-none";
const labelCls = "block text-sm font-medium text-neutral-700";

export default function ProductForm(props: { product?: Product }) {
  const navigate = useNavigate();
  const isEdit = () => !!props.product;

  const [name, setName] = createSignal(props.product?.name || "");
  const [description, setDescription] = createSignal(props.product?.description || "");
  const [price, setPrice] = createSignal(props.product ? String(props.product.price) : "");
  const [category, setCategory] = createSignal(props.product?.category || "");
  const [size, setSize] = createSignal(props.product?.size || "");
  const [condition, setCondition] = createSignal(props.product?.condition || "Good");
  const [brand, setBrand] = createSignal(props.product?.brand || "");
  const [imageUrl, setImageUrl] = createSignal(props.product?.image_url || "");
  const [isSold, setIsSold] = createSignal(props.product?.is_sold || false);
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal("");

  async function handleFile(e: Event) {
    const file = (e.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const data = await api.upload("/api/upload", fd);
      setImageUrl(data.url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: name(), description: description(), price: parseFloat(price()), category: category(),
      size: size() || null, condition: condition(), brand: brand() || null,
      imageUrl: imageUrl() || null, isSold: isSold(),
    };
    try {
      if (isEdit()) await api.put(`/api/products/${props.product!.id}`, payload);
      else await api.post("/api/products", payload);
      navigate("/admin/products");
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} class="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div class="space-y-4">
        <div>
          <label class={labelCls}>Product name *</label>
          <input value={name()} onInput={(e) => setName(e.currentTarget.value)} required class={`${inputCls} mt-1`} placeholder="e.g. Vintage denim jacket" />
        </div>
        <div>
          <label class={labelCls}>Description</label>
          <textarea value={description()} onInput={(e) => setDescription(e.currentTarget.value)} rows={4} class={`${inputCls} mt-1 resize-y`} placeholder="Describe the item, its condition, measurements…" />
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class={labelCls}>Price (₾) *</label>
            <input value={price()} onInput={(e) => setPrice(e.currentTarget.value)} required type="number" step="0.01" min="0" inputMode="decimal" class={`${inputCls} mt-1`} placeholder="25.00" />
          </div>
          <div>
            <label class={labelCls}>Brand</label>
            <input value={brand()} onInput={(e) => setBrand(e.currentTarget.value)} class={`${inputCls} mt-1`} placeholder="e.g. Levi's" />
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <div>
            <label class={labelCls}>Category *</label>
            <select value={category()} onChange={(e) => setCategory(e.currentTarget.value)} required class={`${inputCls} mt-1`}>
              <option value="">Select…</option>
              <For each={CATEGORIES}>{(c) => <option value={c}>{c}</option>}</For>
            </select>
          </div>
          <div>
            <label class={labelCls}>Size</label>
            <select value={size()} onChange={(e) => setSize(e.currentTarget.value)} class={`${inputCls} mt-1`}>
              <option value="">No size</option>
              <For each={SIZES}>{(s) => <option value={s}>{s}</option>}</For>
            </select>
          </div>
          <div>
            <label class={labelCls}>Condition</label>
            <select value={condition()} onChange={(e) => setCondition(e.currentTarget.value)} class={`${inputCls} mt-1`}>
              <For each={CONDITIONS}>{(c) => <option value={c}>{c}</option>}</For>
            </select>
          </div>
        </div>
        <label class="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <input type="checkbox" checked={isSold()} onChange={(e) => setIsSold(e.currentTarget.checked)} class="h-4 w-4 rounded border-neutral-300 text-emerald-700 focus:ring-emerald-600" />
          Mark as sold
        </label>
      </div>

      <div class="space-y-4">
        <div>
          <label class={labelCls}>Photo</label>
          <div class="mt-1 aspect-[3/4] w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100">
            <ProductImage src={imageUrl()} alt={name() || "Product preview"} class="h-full w-full object-cover" />
          </div>
          <input type="file" accept="image/*" onChange={handleFile} class="mt-2 block w-full text-sm text-neutral-500 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-800" />
          <div class="mt-2">
            <label class="text-xs font-medium text-neutral-500">…or paste an image URL</label>
            <input value={imageUrl()} onInput={(e) => setImageUrl(e.currentTarget.value)} class={`${inputCls} mt-1`} placeholder="https://…" />
          </div>
        </div>
        {error() && <p class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error()}</p>}
        <div class="flex gap-2">
          <button type="button" onClick={() => navigate("/admin/products")} class="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100">Cancel</button>
          <button type="submit" disabled={saving()} class="flex-1 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60">
            {saving() ? "Saving…" : isEdit() ? "Save changes" : "Publish product"}
          </button>
        </div>
      </div>
    </form>
  );
}
