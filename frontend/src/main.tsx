import { render } from "solid-js/web";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./stores/auth";
import { CartProvider } from "./stores/cart";
import { I18nProvider } from "./stores/i18n";
import { WishlistProvider } from "./stores/wishlist";

render(
  () => (
    <AuthProvider>
      <I18nProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </I18nProvider>
    </AuthProvider>
  ),
  document.getElementById("root")!
);

