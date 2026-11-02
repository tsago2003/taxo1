import { createSignal } from "solid-js";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { CATEGORIES, CONDITIONS, SIZES } from "../lib/constants";

const inputCls =
  "rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-emerald-600 focus:outline-none";

export default function ProductFilters() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams<{
    q?: string;
    category?: string;
    size?: string;
    condition?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>();

  const [state, setState] = createSignal({
    q: searchParams.q || "",
    category: searchParams.category || "",
    size: searchParams.size || "",
    condition: searchParams.condition || "",
    sort: searchParams.sort || "newest",
    minPrice: searchParams.minPrice || "",
    maxPrice: searchParams.maxPrice || "",
  });

  function apply(partial: Partial<ReturnType<typeof state>>) {
    const merged = { ...state(), ...partial };
    setState(merged);
    const params = new URLSearchParams();
    Object.entries(merged).forEach(([key, value]) => {
      if (value && !(key === "sort" && value === "newest")) params.set(key, value);
    });
    const qs = params.toString();
    navigate(qs ? `/products?${qs}` : "/products", { scroll: false });
  }

  function clearAll() {
    setState({ q: "", category: "", size: "", condition: "", sort: "newest", minPrice: "", maxPrice: "" });
    navigate("/products", { scroll: false });
  }

  return (
    <div class="space-y-3 rounded-2xl border border-neutral-200 bg-white p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply({ q: state().q.trim() });
        }}
        class="flex gap-2"
      >
        <input
          value={state().q}
          onInput={(e) => setState({ ...state(), q: e.currentTarget.value })}
          placeholder="Search clothes, brands…"
          class={`${inputCls} flex-1`}
        />
        <button type="submit" class="rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800">
          Search
        </button>
      </form>

      <div class="grid grid-cols-2 gap-2 md:grid-cols-4">
        <select
          value={state().category}
          onChange={(e) => apply({ category: e.currentTarget.value })}
          class={inputCls}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option value={c}>{c}</option>
          ))}
        </select>

        <select
          value={state().size}
          onChange={(e) => apply({ size: e.currentTarget.value })}
          class={inputCls}
        >
          <option value="">All sizes</option>
          {SIZES.map((s) => (
            <option value={s}>{s}</option>
          ))}
        </select>

        <select
          value={state().condition}
          onChange={(e) => apply({ condition: e.currentTarget.value })}
          class={inputCls}
        >
          <option value="">All conditions</option>
          {CONDITIONS.map((c) => (
            <option value={c}>{c}</option>
          ))}
        </select>

        <select
          value={state().sort}
          onChange={(e) => apply({ sort: e.currentTarget.value })}
          class={inputCls}
        >
          <option value="newest">Newest first</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <input
          value={state().minPrice}
          onInput={(e) => setState({ ...state(), minPrice: e.currentTarget.value })}
          onBlur={() => apply({ minPrice: state().minPrice })}
          placeholder="Min price"
          inputMode="decimal"
          class={`${inputCls} w-28`}
        />
        <span class="text-neutral-400">–</span>
        <input
          value={state().maxPrice}
          onInput={(e) => setState({ ...state(), maxPrice: e.currentTarget.value })}
          onBlur={() => apply({ maxPrice: state().maxPrice })}
          placeholder="Max price"
          inputMode="decimal"
          class={`${inputCls} w-28`}
        />
        <button
          onClick={clearAll}
          class="ml-auto text-xs font-medium text-neutral-500 underline hover:text-emerald-700"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
