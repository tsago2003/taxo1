import {
  createContext,
  createEffect,
  createSignal,
  useContext,
  type JSX,
} from "solid-js";
import { api } from "../lib/api";
import { useAuth } from "./auth";

interface WishlistContextValue {
  ids: () => Set<number>;
  count: () => number;
  isWishlisted: (id: number) => boolean;
  toggle: (id: number) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue>();

export function WishlistProvider(props: { children: JSX.Element }) {
  const auth = useAuth();
  const [ids, setIds] = createSignal<Set<number>>(new Set());

  function load() {
    if (auth.user()?.role === "buyer") {
      api
        .get("/api/wishlist")
        .then((list: Array<{ id: number }>) => {
          setIds(new Set(list.map((p) => p.id)));
        })
        .catch(() => setIds(new Set<number>()));
    } else {
      setIds(new Set<number>());
    }
  }

  // Re-fetch whenever the signed-in user changes.
  createEffect(load);

  const isWishlisted = (id: number) => ids().has(id);

  async function toggle(id: number) {
    const present = ids().has(id);

    // Optimistic update — the heart reacts instantly (fine-grained, no re-render).
    setIds((prev) => {
      const next = new Set(prev);
      if (present) next.delete(id);
      else next.add(id);
      return next;
    });

    try {
      const data = present
        ? await api.delete(`/api/wishlist/${id}`)
        : await api.post("/api/wishlist", { productId: id });
      setIds((prev) => {
        const next = new Set(prev);
        if (data.inWishlist) next.add(id);
        else next.delete(id);
        return next;
      });
    } catch (err) {
      // Revert on failure (e.g. unauthorized) and re-throw for the caller.
      setIds((prev) => {
        const next = new Set(prev);
        if (present) next.add(id);
        else next.delete(id);
        return next;
      });
      throw err;
    }
  }

  const count = () => ids().size;

  return (
    <WishlistContext.Provider value={{ ids, count, isWishlisted, toggle }}>
      {props.children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
