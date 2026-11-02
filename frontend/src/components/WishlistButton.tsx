import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { api } from "../lib/api";

function HeartIcon(props: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={props.filled ? "currentColor" : "none"}
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export default function WishlistButton(props: {
  productId: number;
  initial?: boolean;
  class?: string;
}) {
  const navigate = useNavigate();
  const [inWishlist, setInWishlist] = createSignal(!!props.initial);
  const [loading, setLoading] = createSignal(false);

  async function toggle() {
    setLoading(true);
    try {
      const data = inWishlist()
        ? await api.delete(`/api/wishlist/${props.productId}`)
        : await api.post("/api/wishlist", { productId: props.productId });
      setInWishlist(data.inWishlist);
    } catch (err) {
      if ((err as Error).message === "Unauthorized") {
        navigate("/login");
        return;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading()}
      aria-label={inWishlist() ? "Remove from wishlist" : "Add to wishlist"}
      class={`inline-flex items-center justify-center rounded-full bg-white/90 p-2 text-neutral-600 shadow-sm transition hover:text-red-500 disabled:opacity-50 ${props.class || ""}`}
    >
      <HeartIcon filled={inWishlist()} />
    </button>
  );
}
