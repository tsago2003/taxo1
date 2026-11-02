import { createResource, For, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { api } from "../../lib/api";
import ProductImage from "../../components/ProductImage";
import { formatPrice } from "../../lib/format";
import type { Product } from "../../lib/types";

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, { refetch }] = createResource<Product[]>(() => api.get("/api/products/mine"));

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    await api.delete(`/api/products/${id}`);
    refetch();
  }

  return (
    <div>
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-neutral-900">Products</h1>
        <A href="/admin/products/new" class="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
          + Add product
        </A>
      </div>

      <Show
        when={(products() || []).length > 0}
        fallback={
          <div class="mt-8 rounded-2xl border border-dashed border-neutral-300 p-12 text-center text-neutral-500">
            You haven't listed any products yet.
          </div>
        }
      >
        <div class="mt-6 overflow-x-auto rounded-2xl border border-neutral-200 bg-white">
          <table class="w-full min-w-[640px] text-left text-sm">
            <thead class="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-400">
              <tr>
                <th class="px-4 py-3 font-medium">Product</th>
                <th class="px-4 py-3 font-medium">Price</th>
                <th class="px-4 py-3 font-medium">Category</th>
                <th class="px-4 py-3 font-medium">Status</th>
                <th class="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <For each={products() || []}>
                {(product) => (
                  <tr class="hover:bg-neutral-50">
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-3">
                        <div class="h-12 w-10 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                          <ProductImage src={product.image_url} alt={product.name} class="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p class="font-medium text-neutral-800">{product.name}</p>
                          <p class="text-xs text-neutral-500">
                            {product.brand || "No brand"}
                            {product.size ? ` · ${product.size}` : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 font-medium text-neutral-800">{formatPrice(product.price)}</td>
                    <td class="px-4 py-3 text-neutral-600">{product.category}</td>
                    <td class="px-4 py-3">
                      {product.is_sold ? (
                        <span class="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500">Sold</span>
                      ) : (
                        <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">Available</span>
                      )}
                    </td>
                    <td class="px-4 py-3">
                      <div class="flex items-center justify-end gap-4">
                        <A href={`/admin/products/${product.id}/edit`} class="text-sm font-medium text-emerald-700 hover:underline">
                          Edit
                        </A>
                        <button onClick={() => handleDelete(product.id)} class="text-sm font-medium text-red-600 hover:underline">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
    </div>
  );
}
