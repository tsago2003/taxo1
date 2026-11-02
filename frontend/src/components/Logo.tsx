import { A } from "@solidjs/router";
import { useI18n } from "../stores/i18n";
import { LeafIcon } from "./icons";

export default function Logo(props: { class?: string }) {
  const { t } = useI18n();

  return (
    <A
      href="/"
      class={`group inline-flex items-center gap-2.5 ${props.class || ""}`}
      aria-label="ReThread — რეთრედ"
    >
      <span class="relative inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-moss-600 text-cream-50 shadow-soft transition-transform duration-300 group-hover:-rotate-6">
        <LeafIcon class="h-5 w-5" />
      </span>
      <span class="flex flex-col leading-none">
        <span class="font-display text-lg font-extrabold tracking-tight text-charcoal-700">
          ReThread
        </span>
        <span class="mt-0.5 text-[11px] font-semibold tracking-wide text-moss-600/80">
          {t("siteNameKa")}
        </span>
      </span>
    </A>
  );
}
