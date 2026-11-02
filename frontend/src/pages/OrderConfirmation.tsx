import { A, useParams, useSearchParams } from "@solidjs/router";
import { useI18n } from "../stores/i18n";
import { formatPrice } from "../lib/format";

export default function OrderConfirmation() {
  const params = useParams<{ id: string }>();
  const [searchParams] = useSearchParams<{ total?: string }>();
  const { t } = useI18n();

  return (
    <div class="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-moss-100 text-3xl">🎉</div>
      <h1 class="mt-6 text-3xl font-bold text-charcoal-700">{t("order.thankYou")}</h1>
      <p class="mt-3 text-charcoal-500">
        {t("order.placed")}{" "}
        <span class="font-semibold text-charcoal-700">#{params.id}</span>
      </p>
      {searchParams.total && (
        <p class="mt-3 text-lg font-semibold text-charcoal-700">
          {t("order.totalPaid")}: {formatPrice(parseFloat(searchParams.total))}
        </p>
      )}
      <p class="mt-3 text-sm text-charcoal-400">{t("order.willConfirm")}</p>
      <A href="/products" class="mt-8 inline-block rounded-full bg-moss-600 px-6 py-3 text-sm font-semibold text-cream-50 shadow-soft transition hover:bg-moss-700">
        {t("order.continue")}
      </A>
    </div>
  );
}
