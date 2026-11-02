import { A, useParams, useSearchParams } from "@solidjs/router";
import { formatPrice } from "../lib/format";

export default function OrderConfirmation() {
  const params = useParams<{ id: string }>();
  const [searchParams] = useSearchParams<{ total?: string }>();

  return (
    <div class="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
      <div class="text-6xl">🎉</div>
      <h1 class="mt-6 text-3xl font-bold text-neutral-900">Thank you for your order!</h1>
      <p class="mt-3 text-neutral-600">
        Your order <span class="font-semibold text-neutral-900">#{params.id}</span> has been placed successfully.
      </p>
      {searchParams.total && (
        <p class="mt-3 text-lg font-semibold text-neutral-900">
          Total paid: {formatPrice(parseFloat(searchParams.total))}
        </p>
      )}
      <p class="mt-3 text-sm text-neutral-500">
        The seller will review and confirm your order shortly. You will receive updates by email.
      </p>
      <A href="/products" class="mt-8 inline-block rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">
        Continue shopping
      </A>
    </div>
  );
}
