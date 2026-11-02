import { createSignal, For, Show } from "solid-js";
import { useNavigate, useSearchParams } from "@solidjs/router";
import { CATEGORIES, CONDITIONS, SIZES } from "../lib/constants";
import { useI18n } from "../stores/i18n";
import { ChevronDownIcon, SearchIcon } from "./icons";

type Option = { value: string; label: string };

function Dropdown(props: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = createSignal(false);

  const current = () =>
    props.options.find((o) => o.value === props.value)?.label ?? props.label;

  return (
    <div class="relative">
      <button
        type="button"
        onClick={() => setOpen(!open())}
        aria-haspopup="listbox"
        aria-expanded={open()}
        class="inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-white px-4 py-2.5 text-sm font-medium text-charcoal-600 transition-all duration-300 hover:border-moss-300 hover:text-moss-700"
      >
        <span>{current()}</span>
        <ChevronDownIcon
          class={`h-4 w-4 transition-transform duration-300 ${open() ? "rotate-180" : ""}`}
        />
      </button>

      <Show when={open()}>
        <div class="fixed inset-0 z-10" onClick={() => setOpen(false)} />
        <div class="absolute left-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-charcoal/[0.06] bg-white p-1.5 shadow-soft-lg animate-scale-in">
          <For each={props.options}>
            {(option) => (
              <button
                type="button"
                onClick={() => {
                  props.onChange(option.value);
                  setOpen(false);
                }}
                class={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors duration-200 ${
                  option.value === props.value
                    ? "bg-moss-50 font-semibold text-moss-700"
                    : "text-charcoal-600 hover:bg-cream-100"
                }`}
              >
                {option.label}
                <Show when={option.value === props.value}>
                  <span class="h-2 w-2 rounded-full bg-moss-600" />
                </Show>
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}

export default function ProductFilters() {
  const navigate = useNavigate();
  const { t, categoryLabel, conditionLabel } = useI18n();
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

  const hasFilters = () =>
    state().category !== "" ||
    state().size !== "" ||
    state().condition !== "" ||
    state().minPrice !== "" ||
    state().maxPrice !== "";

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

  const categoryOptions: Option[] = [
    { value: "", label: t("filter.allCategories") },
    ...CATEGORIES.map((c) => ({ value: c, label: categoryLabel(c) })),
  ];
  const sizeOptions: Option[] = [
    { value: "", label: t("filter.allSizes") },
    ...SIZES.map((s) => ({ value: s, label: s })),
  ];
  const conditionOptions: Option[] = [
    { value: "", label: t("filter.allConditions") },
    ...CONDITIONS.map((c) => ({ value: c, label: conditionLabel(c) })),
  ];
  const sortOptions: Option[] = [
    { value: "newest", label: t("filter.sortNewest") },
    { value: "price-asc", label: t("filter.sortPriceAsc") },
    { value: "price-desc", label: t("filter.sortPriceDesc") },
  ];

  return (
    <div class="sticky top-[76px] z-30 rounded-3xl border border-charcoal/[0.06] bg-white/90 p-3 shadow-card backdrop-blur-md">
      <div class="flex flex-wrap items-center gap-2">
        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            apply({ q: state().q.trim() });
          }}
          class="relative min-w-[200px] flex-1"
        >
          <SearchIcon class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" />
          <input
            value={state().q}
            onInput={(e) => setState({ ...state(), q: e.currentTarget.value })}
            placeholder={t("filter.searchPlaceholder")}
            class="w-full rounded-full border border-charcoal/10 bg-cream-50 py-2.5 pl-10 pr-3 text-sm text-charcoal-700 transition focus:border-moss-400 focus:bg-white focus:outline-none"
          />
        </form>

        <Dropdown label={t("filter.category")} value={state().category} options={categoryOptions} onChange={(v) => apply({ category: v })} />
        <Dropdown label={t("filter.size")} value={state().size} options={sizeOptions} onChange={(v) => apply({ size: v })} />
        <Dropdown label={t("filter.condition")} value={state().condition} options={conditionOptions} onChange={(v) => apply({ condition: v })} />
        <Dropdown label={t("filter.sort")} value={state().sort} options={sortOptions} onChange={(v) => apply({ sort: v })} />

        {/* Price range */}
        <div class="flex items-center gap-1.5 rounded-full border border-charcoal/10 bg-white px-2 py-1">
          <div class="relative">
            <input
              value={state().minPrice}
              onInput={(e) => setState({ ...state(), minPrice: e.currentTarget.value })}
              onBlur={() => apply({ minPrice: state().minPrice })}
              placeholder={t("filter.minPrice")}
              inputMode="decimal"
              class="w-24 rounded-lg bg-cream-50 py-1.5 pl-2.5 pr-6 text-sm text-charcoal-700 placeholder:text-charcoal-300 focus:outline-none"
            />
            <span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-charcoal-400">₾</span>
          </div>
          <span class="text-charcoal-300">–</span>
          <div class="relative">
            <input
              value={state().maxPrice}
              onInput={(e) => setState({ ...state(), maxPrice: e.currentTarget.value })}
              onBlur={() => apply({ maxPrice: state().maxPrice })}
              placeholder={t("filter.maxPrice")}
              inputMode="decimal"
              class="w-24 rounded-lg bg-cream-50 py-1.5 pl-2.5 pr-6 text-sm text-charcoal-700 placeholder:text-charcoal-300 focus:outline-none"
            />
            <span class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-charcoal-400">₾</span>
          </div>
        </div>

        <Show when={hasFilters()}>
          <button
            onClick={clearAll}
            class="ml-auto rounded-full px-3 py-2 text-xs font-semibold text-terracotta-500 transition-colors hover:bg-terracotta-50"
          >
            {t("filter.clear")}
          </button>
        </Show>
      </div>
    </div>
  );
}
