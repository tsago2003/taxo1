import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useWishlist } from "../stores/wishlist";
import { useI18n } from "../stores/i18n";
import { HeartIcon } from "./icons";

export default function WishlistButton(props: { productId: number; class?: string }) {
  const navigate = useNavigate();
  const wishlist = useWishlist();
  const { t } = useI18n();
  const [loading, setLoading] = createSignal(false);
  const [popped, setPopped] = createSignal(false);

  const inWishlist = () => wishlist.isWishlisted(props.productId);

  async function toggle() {
    if (loading()) return;
    setLoading(true);
    try {
      await wishlist.toggle(props.productId);
      setPopped(true);
      setTimeout(() => setPopped(false), 450);
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
      aria-label={
        inWishlist() ? t("product.wishlistRemove") : t("product.wishlistAdd")
      }
      class={`glass inline-flex h-9 w-9 items-center justify-center rounded-full text-charcoal-500 shadow-soft transition-all duration-200 ease-out hover:scale-110 active:scale-95 disabled:opacity-50 ${
        inWishlist() ? "text-terracotta-500" : "hover:text-terracotta-500"
      } ${props.class || ""}`}
    >
      <HeartIcon filled={inWishlist()} class={`h-5 w-5 ${popped() ? "animate-heart-pop" : ""}`} />
    </button>
  );
}
