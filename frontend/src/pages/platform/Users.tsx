import { createResource, createSignal, For, Show } from "solid-js";
import { api } from "../../lib/api";
import { useI18n } from "../../stores/i18n";
import { formatDate } from "../../lib/format";

interface AdminUser {
  id: number;
  email: string;
  name: string | null;
  role: string;
  shop_name: string | null;
  is_active: boolean;
  verification_status: string;
  shop_location: string | null;
  shop_hours: string | null;
  rating_avg: number;
  rating_count: number;
  created_at: string;
}

export default function Users() {
  const { t } = useI18n();
  const [role, setRole] = createSignal("");
  const [q, setQ] = createSignal("");

  const [users, { refetch }] = createResource<AdminUser[], string>(
    () => JSON.stringify({ role: role(), q: q() }),
    () => {
      const params = new URLSearchParams();
      if (role()) params.set("role", role());
      if (q()) params.set("q", q());
      const qs = params.toString();
      return api.get(`/api/admin/users${qs ? `?${qs}` : ""}`);
    }
  );

  async function setActive(id: number, active: boolean) {
    await api.patch(`/api/admin/users/${id}`, { isActive: active });
    refetch();
  }
  async function remove(id: number) {
    if (!window.confirm(t("admin.confirmDeleteUser"))) return;
    await api.delete(`/api/admin/users/${id}`);
    refetch();
  }
  async function setVerification(id: number, verification: string) {
    await api.patch(`/api/admin/users/${id}`, { verification });
    refetch();
  }

  const roleBadge = (r: string) =>
    r === "admin"
      ? "bg-charcoal-700 text-cream-50"
      : r === "seller"
        ? "bg-moss-100 text-moss-700"
        : "bg-terracotta-100 text-terracotta-700";

  const roleLabel = (r: string) =>
    r === "admin" ? t("admin.adminRole") : r === "seller" ? t("admin.seller") : t("admin.buyer");

  return (
    <div>
      <h1 class="text-2xl font-bold text-charcoal-700">{t("admin.users")}</h1>
      <p class="mt-1 text-sm text-charcoal-400">{t("admin.usersSub")}</p>

      <div class="mt-5 flex flex-wrap gap-2">
        <input
          value={q()}
          onInput={(e) => setQ(e.currentTarget.value)}
          placeholder={t("admin.search")}
          class="w-full min-w-[220px] flex-1 rounded-xl border border-charcoal/10 bg-white px-3 py-2.5 text-sm transition focus:border-moss-400 focus:outline-none"
        />
        <select
          value={role()}
          onChange={(e) => setRole(e.currentTarget.value)}
          class="rounded-xl border border-charcoal/10 bg-white px-3 py-2.5 text-sm transition focus:border-moss-400 focus:outline-none"
        >
          <option value="">{t("admin.allRoles")}</option>
          <option value="buyer">{t("admin.buyer")}</option>
          <option value="seller">{t("admin.seller")}</option>
          <option value="admin">{t("admin.adminRole")}</option>
        </select>
      </div>

      <Show when={!users.loading} fallback={<p class="mt-6 text-charcoal-400">{t("common.loading")}</p>}>
        <div class="mt-5 overflow-x-auto rounded-3xl border border-charcoal/[0.06] bg-white shadow-soft">
          <table class="w-full min-w-[720px] text-left text-sm">
            <thead class="border-b border-charcoal/[0.06] text-xs uppercase tracking-wide text-charcoal-400">
              <tr>
                <th class="px-4 py-3 font-medium">{t("admin.account")}</th>
                <th class="px-4 py-3 font-medium">{t("admin.role")}</th>
                <th class="px-4 py-3 font-medium">{t("admin.status")}</th>
                <th class="px-4 py-3 font-medium">{t("admin.joined")}</th>
                <th class="px-4 py-3 text-right font-medium">{t("admin.actions")}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-charcoal/[0.06]">
              <For each={users() || []}>
                {(u) => (
                  <tr class="hover:bg-cream-50">
                    <td class="px-4 py-3">
                      <p class="font-medium text-charcoal-700">{u.name || u.email}</p>
                      <p class="text-xs text-charcoal-400">
                        {u.email}
                        {u.shop_name ? ` · ${u.shop_name}` : ""}
                      </p>
                      {u.role === "seller" && (
                        <>
                          {(u.shop_location || u.shop_hours) && (
                            <p class="text-xs text-charcoal-400">
                              {u.shop_location ? `📍 ${u.shop_location}` : ""}
                              {u.shop_hours ? ` · 🕒 ${u.shop_hours}` : ""}
                            </p>
                          )}
                          {u.rating_count > 0 && (
                            <p class="text-xs text-terracotta-500">★ {u.rating_avg} ({u.rating_count})</p>
                          )}
                          <span
                            class={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
                              u.verification_status === "verified"
                                ? "bg-moss-50 text-moss-700"
                                : u.verification_status === "rejected"
                                  ? "bg-terracotta-50 text-terracotta-700"
                                  : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {u.verification_status === "verified"
                              ? t("admin.verified")
                              : u.verification_status === "rejected"
                                ? t("admin.rejected")
                                : t("admin.pending")}
                          </span>
                        </>
                      )}
                    </td>
                    <td class="px-4 py-3">
                      <span class={`rounded-full px-2.5 py-1 text-xs font-semibold ${roleBadge(u.role)}`}>
                        {roleLabel(u.role)}
                      </span>
                    </td>
                    <td class="px-4 py-3">
                      <span
                        class={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          u.is_active ? "bg-moss-50 text-moss-700" : "bg-charcoal-100 text-charcoal-500"
                        }`}
                      >
                        {u.is_active ? t("admin.active") : t("admin.suspended")}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-charcoal-500">{formatDate(u.created_at)}</td>
                    <td class="px-4 py-3">
                      <div class="flex items-center justify-end gap-3">
                        {u.role === "seller" && u.verification_status !== "verified" && (
                          <button
                            onClick={() => setVerification(u.id, "verified")}
                            class="text-sm font-medium text-moss-600 hover:underline"
                          >
                            {t("admin.verify")}
                          </button>
                        )}
                        {u.role === "seller" && u.verification_status === "verified" && (
                          <button
                            onClick={() => setVerification(u.id, "pending")}
                            class="text-sm font-medium text-charcoal-400 hover:underline"
                          >
                            {t("admin.unverify")}
                          </button>
                        )}
                        <button
                          onClick={() => setActive(u.id, !u.is_active)}
                          class="text-sm font-medium text-moss-600 hover:underline"
                        >
                          {u.is_active ? t("admin.suspend") : t("admin.activate")}
                        </button>
                        <button onClick={() => remove(u.id)} class="text-sm font-medium text-terracotta-500 hover:underline">
                          {t("admin.delete")}
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
