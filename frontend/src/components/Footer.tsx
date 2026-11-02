import { For } from "solid-js";
import { A } from "@solidjs/router";
import { CATEGORIES } from "../lib/constants";
import { useI18n } from "../stores/i18n";
import Logo from "./Logo";

export default function Footer() {
  const { t, categoryLabel } = useI18n();

  return (
    <footer class="border-t border-charcoal/[0.07] bg-cream-100">
      <div class="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <Logo />
          <p class="mt-4 max-w-xs text-sm leading-relaxed text-charcoal-500">
            {t("siteTagline")} {t("footer.tagline")}
          </p>
        </div>

        <div>
          <p class="text-sm font-semibold text-charcoal-700">{t("footer.shop")}</p>
          <ul class="mt-3 space-y-2 text-sm text-charcoal-500">
            <li>
              <A href="/products" class="transition-colors hover:text-moss-600">
                {t("footer.allProducts")}
              </A>
            </li>
            <li>
              <A href="/seller/register" class="transition-colors hover:text-moss-600">
                {t("footer.becomeSeller")}
              </A>
            </li>
            <li>
              <A href="/seller/login" class="transition-colors hover:text-moss-600">
                {t("footer.sellerLogin")}
              </A>
            </li>
          </ul>
        </div>

        <div>
          <p class="text-sm font-semibold text-charcoal-700">{t("footer.categories")}</p>
          <ul class="mt-3 flex flex-wrap gap-2">
            <For each={CATEGORIES}>
              {(category) => (
                <li>
                  <A
                    href={`/products?category=${encodeURIComponent(category)}`}
                    class="inline-block rounded-full border border-charcoal/10 bg-white px-3 py-1.5 text-xs text-charcoal-500 transition-all duration-300 hover:border-moss-300 hover:text-moss-600"
                  >
                    {categoryLabel(category)}
                  </A>
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>

      <div class="border-t border-charcoal/[0.07] py-6 text-center text-xs text-charcoal-400">
        © {new Date().getFullYear()} ReThread · რეთრედ. {t("footer.rights")} ·{" "}
        {t("hero.trust.gel")}
      </div>
    </footer>
  );
}
