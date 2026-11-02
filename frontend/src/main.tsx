import { render } from "solid-js/web";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./stores/auth";
import { CartProvider } from "./stores/cart";

render(
  () => (
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  ),
  document.getElementById("root")!
);

