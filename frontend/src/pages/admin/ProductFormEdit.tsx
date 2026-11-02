import { createResource, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { api } from "../../lib/api";
import type { Product } from "../../lib/types";
import ProductForm from "./ProductForm";

export default function ProductFormEdit() {
  const params = useParams<{ id: string }>();
  const [product] = createResource<Product>(() => api.get(`/api/products/${params.id}`));

  return (
    <div>
      <h1 class="mb-6 text-2xl font-bold text-neutral-900">Edit product</h1>
      <Show when={product()} fallback={<p class="text-neutral-500">Loading…</p>}>
        <ProductForm product={product()!} />
      </Show>
    </div>
  );
}
