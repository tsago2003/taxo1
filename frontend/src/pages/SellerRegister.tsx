import { createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { api } from "../lib/api";
import { useAuth } from "../stores/auth";
import type { User } from "../lib/types";

const inputCls =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 focus:border-emerald-600 focus:outline-none";

export default function SellerRegister() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [shopName, setShopName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api.post("/api/seller/register", { shopName: shopName(), email: email(), password: password() });
      auth.login(data.token, data.user as User);
      navigate("/admin");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div class="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div class="rounded-2xl border border-neutral-200 bg-white p-8">
        <h1 class="text-2xl font-bold text-neutral-900">Create your shop</h1>
        <p class="mt-1 text-sm text-neutral-500">Start selling your pre-loved clothes in minutes.</p>

        <form onSubmit={handleSubmit} class="mt-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700">Shop name</label>
            <input value={shopName()} onInput={(e) => setShopName(e.currentTarget.value)} required class={`${inputCls} mt-1`} placeholder="e.g. Vintage Vibes Thrift" />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700">Email</label>
            <input type="email" value={email()} onInput={(e) => setEmail(e.currentTarget.value)} required class={`${inputCls} mt-1`} placeholder="you@shop.com" />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700">Password</label>
            <input type="password" value={password()} onInput={(e) => setPassword(e.currentTarget.value)} required minLength={6} class={`${inputCls} mt-1`} placeholder="At least 6 characters" />
          </div>

          {error() && <p class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error()}</p>}

          <button type="submit" disabled={loading()} class="w-full rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60">
            {loading() ? "Creating shop…" : "Create shop"}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-neutral-500">
          Already have a shop? <A href="/seller/login" class="font-semibold text-emerald-700 hover:underline">Sign in</A>
        </p>
      </div>
    </div>
  );
}
