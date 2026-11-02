import { createResource, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { api } from "../../lib/api";
import { useI18n } from "../../stores/i18n";
import type { Product } from "../../lib/types";
import ProductForm from "./ProductForm";

export default function ProductFormEdit() {
  const params = useParams<{ id: string }>();
  const { t } = useI18n();
  const [product] = createResource<Product>(() => api.get(`/api/products/${params.id}`));

  return (
    <div>
      <h1 class="mb-6 text-2xl font-bold text-neutral-900">{t("form.editProduct")}</h1>
      <Show when={product()} fallback={<p class="text-neutral-500">{t("common.loading")}</p>}>
        <ProductForm product={product()!} />
      </Show>
    </div>
  );
}
