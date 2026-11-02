import { createSignal } from "solid-js";
import { api } from "../lib/api";
import { ORDER_STATUSES } from "../lib/constants";

export default function StatusSelect(props: { orderId: number; current: string }) {
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
      class="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm capitalize focus:border-emerald-600 focus:outline-none"
    >
      {ORDER_STATUSES.map((s) => (
        <option value={s} class="capitalize">
          {s}
        </option>
      ))}
    </select>
  );
}
