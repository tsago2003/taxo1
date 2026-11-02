import { createSignal } from "solid-js";
import { useCart } from "../stores/cart";
import type { Product } from "../lib/types";

export default function AddToCartButton(props: { product: Product; class?: string }) {
  const cart = useCart();
  const [added, setAdded] = createSignal(false);

  if (props.product.is_sold) {
    return (
      <button
        disabled
        class="w-full cursor-not-allowed rounded-full bg-neutral-200 py-3 text-sm font-semibold text-neutral-500"
      >
        Sold out
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
        "w-full rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
      }
    >
      {added() ? "Added ✓" : "Add to cart"}
    </button>
  );
}
