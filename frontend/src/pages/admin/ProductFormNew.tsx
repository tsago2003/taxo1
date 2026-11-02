import { useI18n } from "../../stores/i18n";
import ProductForm from "./ProductForm";

export default function ProductFormNew() {
  const { t } = useI18n();

  return (
    <div>
      <h1 class="mb-6 text-2xl font-bold text-neutral-900">{t("form.addProduct")}</h1>
      <ProductForm />
    </div>
  );
}
