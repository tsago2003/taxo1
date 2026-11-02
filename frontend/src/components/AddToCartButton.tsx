import { createSignal } from "solid-js";
import { useCart } from "../stores/cart";
import { useI18n } from "../stores/i18n";
import type { Product } from "../lib/types";

export default function AddToCartButton(props: { product: Product; class?: string }) {
  const cart = useCart();
  const { t } = useI18n();
  const [added, setAdded] = createSignal(false);

  if (props.product.is_sold) {
    return (
      <button
        disabled
        class="w-full cursor-not-allowed rounded-full bg-cream-200 py-2.5 text-sm font-semibold text-charcoal-400"
      >
        {t("product.soldOut")}
      </button>
    );
  }

  function handleAdd() {
    cart.addItem(props.product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      class={
        props.class ||
        "w-full rounded-full bg-moss-600 px-6 py-2.5 text-sm font-semibold text-cream-50 shadow-soft transition-all duration-300 hover:bg-moss-700"
      }
    >
      {added() ? (
        <span class="inline-flex items-center gap-1 animate-check">{t("product.added")}</span>
      ) : (
        t("product.addToCart")
      )}
    </button>
  );
}
