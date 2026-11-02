import { createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { api } from "../lib/api";
import { useAuth } from "../stores/auth";
import { useI18n } from "../stores/i18n";
import type { User } from "../lib/types";

const inputCls =
  "w-full rounded-xl border border-charcoal/10 bg-white px-3 py-2.5 text-sm text-charcoal-700 transition focus:border-moss-400 focus:outline-none";

export default function Register() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useI18n();
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await api.post("/api/auth/register", { name: name(), email: email(), password: password() });
      auth.login(data.token, data.user as User);
      navigate("/account");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div class="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div class="rounded-3xl border border-charcoal/[0.06] bg-white p-8 shadow-soft">
        <h1 class="text-2xl font-bold text-charcoal-700">{t("auth.createAccountTitle")}</h1>
        <p class="mt-1 text-sm text-charcoal-400">{t("auth.createAccountSub")}</p>

        <form onSubmit={handleSubmit} class="mt-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-charcoal-600">{t("auth.fullName")}</label>
            <input value={name()} onInput={(e) => setName(e.currentTarget.value)} required class={`${inputCls} mt-1`} placeholder="Your name" />
          </div>
          <div>
            <label class="block text-sm font-medium text-charcoal-600">{t("auth.email")}</label>
            <input type="email" value={email()} onInput={(e) => setEmail(e.currentTarget.value)} required class={`${inputCls} mt-1`} placeholder="you@email.com" />
          </div>
          <div>
            <label class="block text-sm font-medium text-charcoal-600">{t("auth.password")}</label>
            <input type="password" value={password()} onInput={(e) => setPassword(e.currentTarget.value)} required minLength={6} class={`${inputCls} mt-1`} placeholder="At least 6 characters" />
          </div>

          {error() && <p class="rounded-xl bg-terracotta-50 px-3 py-2 text-sm text-terracotta-700">{error()}</p>}

          <button type="submit" disabled={loading()} class="w-full rounded-full bg-moss-600 px-6 py-3 text-sm font-semibold text-cream-50 shadow-soft transition hover:bg-moss-700 disabled:opacity-60">
            {loading() ? t("auth.creatingAccount") : t("auth.createAccountBtn")}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-charcoal-400">
          {t("auth.alreadyHave")}{" "}
          <A href="/login" class="font-semibold text-moss-600 hover:underline">{t("auth.signIn")}</A>
        </p>
        <p class="mt-2 text-center text-sm text-charcoal-400">
          {t("auth.sellingClothes")}{" "}
          <A href="/seller/register" class="font-medium text-moss-600 hover:underline">{t("auth.createShopAccount")}</A>
        </p>
      </div>
    </div>
  );
}
