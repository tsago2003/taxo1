import { createSignal, For, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { api } from "../lib/api";
import { useCart } from "../stores/cart";
import { useI18n } from "../stores/i18n";
import ProductImage from "../components/ProductImage";
import { formatPrice } from "../lib/format";

const inputCls =
  "w-full rounded-xl border border-charcoal/10 bg-white px-3 py-2.5 text-sm text-charcoal-700 transition focus:border-moss-400 focus:outline-none";

export default function Checkout() {
  const navigate = useNavigate();
  const cart = useCart();
  const { t } = useI18n();
  const [form, setForm] = createSignal({ name: "", email: "", phone: "", address: "", city: "", postal: "", notes: "" });
  const [submitting, setSubmitting] = createSignal(false);
  const [error, setError] = createSignal("");

  function update(key: keyof ReturnType<typeof form>, value: string) {
    setForm({ ...form(), [key]: value });
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const f = form();
      const data = await api.post("/api/orders", {
        customerName: f.name, email: f.email, phone: f.phone, address: f.address,
        city: f.city, postal: f.postal, notes: f.notes,
        items: cart.items().map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      });
      cart.clearCart();
      navigate(`/order-confirmation/${data.id}?total=${data.total}`);
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  }

  return (
    <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 class="text-2xl font-bold text-charcoal-700">{t("checkout.title")}</h1>
      <Show
        when={cart.items().length > 0}
        fallback={
          <div class="py-20 text-center">
            <h2 class="text-xl font-bold text-charcoal-700">{t("checkout.empty")}</h2>
            <A href="/products" class="mt-4 inline-block font-semibold text-moss-600 hover:underline">
              {t("checkout.browse")}
            </A>
          </div>
        }
      >
        <div class="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
          <form onSubmit={handleSubmit} class="space-y-4">
            <div class="rounded-3xl border border-charcoal/[0.06] bg-white p-5 shadow-soft">
              <h2 class="text-base font-semibold text-charcoal-700">{t("checkout.contact")}</h2>
              <div class="mt-4 grid gap-4 sm:grid-cols-2">
                <div><label class="block text-sm font-medium text-charcoal-600">{t("checkout.name")}</label><input value={form().name} onInput={(e) => update("name", e.currentTarget.value)} required class={`${inputCls} mt-1`} /></div>
                <div><label class="block text-sm font-medium text-charcoal-600">{t("checkout.email")}</label><input type="email" value={form().email} onInput={(e) => update("email", e.currentTarget.value)} required class={`${inputCls} mt-1`} /></div>
                <div><label class="block text-sm font-medium text-charcoal-600">{t("checkout.phone")}</label><input value={form().phone} onInput={(e) => update("phone", e.currentTarget.value)} required class={`${inputCls} mt-1`} /></div>
                <div><label class="block text-sm font-medium text-charcoal-600">{t("checkout.address")}</label><input value={form().address} onInput={(e) => update("address", e.currentTarget.value)} required class={`${inputCls} mt-1`} /></div>
                <div><label class="block text-sm font-medium text-charcoal-600">{t("checkout.city")}</label><input value={form().city} onInput={(e) => update("city", e.currentTarget.value)} class={`${inputCls} mt-1`} /></div>
                <div><label class="block text-sm font-medium text-charcoal-600">{t("checkout.postal")}</label><input value={form().postal} onInput={(e) => update("postal", e.currentTarget.value)} class={`${inputCls} mt-1`} /></div>
                <div class="sm:col-span-2"><label class="block text-sm font-medium text-charcoal-600">{t("checkout.notes")}</label><textarea value={form().notes} onInput={(e) => update("notes", e.currentTarget.value)} rows={3} class={`${inputCls} mt-1 resize-y`} /></div>
              </div>
            </div>
            <Show when={error()}><p class="rounded-xl bg-terracotta-50 px-4 py-3 text-sm text-terracotta-700">{error()}</p></Show>
            <button type="submit" disabled={submitting()} class="w-full rounded-full bg-moss-600 px-6 py-3 text-sm font-semibold text-cream-50 shadow-soft transition hover:bg-moss-700 disabled:opacity-60">
              {submitting() ? t("checkout.placing") : `${t("checkout.placeOrder")} · ${formatPrice(cart.totalPrice())}`}
            </button>
          </form>
          <aside class="h-fit rounded-3xl border border-charcoal/[0.06] bg-white p-5 shadow-soft">
            <h2 class="text-base font-semibold text-charcoal-700">{t("checkout.summary")}</h2>
            <ul class="mt-4 space-y-3">
              <For each={cart.items()}>
                {(item) => (
                  <li class="flex items-center gap-3">
                    <div class="h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-cream-100"><ProductImage src={item.product.image_url} alt={item.product.name} class="h-full w-full object-cover" /></div>
                    <div class="flex-1">
                      <p class="line-clamp-1 text-sm font-medium text-charcoal-700">{item.product.name}</p>
                      <p class="text-xs text-charcoal-400">{t("checkout.qty", { qty: item.quantity })} × {formatPrice(item.product.price)}</p>
                    </div>
                    <p class="text-sm font-semibold text-charcoal-700">{formatPrice(item.product.price * item.quantity)}</p>
                  </li>
                )}
              </For>
            </ul>
            <div class="mt-4 flex items-center justify-between border-t border-charcoal/[0.08] pt-4">
              <span class="font-semibold text-charcoal-700">{t("cart.total")}</span>
              <span class="text-lg font-bold text-charcoal-800">{formatPrice(cart.totalPrice())}</span>
            </div>
          </aside>
        </div>
      </Show>
    </div>
  );
}
