import { A } from "@solidjs/router";
import { CATEGORIES, COUNTRY, SITE_NAME, SITE_TAGLINE } from "../lib/constants";

export default function Footer() {
  return (
    <footer class="border-t border-neutral-200 bg-white">
      <div class="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p class="text-lg font-extrabold text-emerald-700">{SITE_NAME}</p>
          <p class="mt-2 max-w-xs text-sm text-neutral-500">
            {SITE_TAGLINE} Shop sustainably and give quality clothes a second life.
          </p>
        </div>
        <div>
          <p class="text-sm font-semibold text-neutral-800">Shop</p>
          <ul class="mt-3 space-y-2 text-sm text-neutral-500">
            <li>
              <A href="/products" class="hover:text-emerald-700">All products</A>
            </li>
            <li>
              <A href="/seller/register" class="hover:text-emerald-700">Become a seller</A>
            </li>
            <li>
              <A href="/seller/login" class="hover:text-emerald-700">Seller login</A>
            </li>
          </ul>
        </div>
        <div>
          <p class="text-sm font-semibold text-neutral-800">Categories</p>
          <ul class="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <li>
                <A
                  href={`/products?category=${encodeURIComponent(category)}`}
                  class="inline-block rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 transition hover:border-emerald-600 hover:text-emerald-700"
                >
                  {category}
                </A>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div class="border-t border-neutral-200 py-5 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} {SITE_NAME}. All rights reserved. · Prices in GEL (₾) · Serving {COUNTRY}.
      </div>
    </footer>
  );
}
