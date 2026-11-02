import { createSignal } from "solid-js";

const PLACEHOLDER = "/placeholder.svg";

export default function ProductImage(props: {
  src?: string | null;
  alt: string;
  class?: string;
}) {
  const [errored, setErrored] = createSignal(false);
  const url = () => (!props.src || errored() ? PLACEHOLDER : props.src);

  return (
    <img
      src={url()}
      alt={props.alt}
      loading="lazy"
      class={props.class}
      onError={() => setErrored(true)}
    />
  );
}
