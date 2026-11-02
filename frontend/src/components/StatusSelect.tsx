import { createSignal, For } from "solid-js";
import { api } from "../lib/api";
import { ORDER_STATUSES } from "../lib/constants";
import { useI18n } from "../stores/i18n";

export default function StatusSelect(props: { orderId: number; current: string }) {
  const { statusLabel } = useI18n();
  const [status, setStatus] = createSignal(props.current);

  async function update(e: Event) {
    const value = (e.currentTarget as HTMLSelectElement).value;
    await api.patch(`/api/orders/${props.orderId}`, { status: value });
    setStatus(value);
  }

  return (
    <select
      value={status()}
      onChange={update}
      class="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm focus:border-emerald-600 focus:outline-none"
    >
      <For each={ORDER_STATUSES}>
        {(s) => <option value={s}>{statusLabel(s)}</option>}
      </For>
    </select>
  );
}
