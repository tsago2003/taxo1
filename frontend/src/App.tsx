import { Router, Route } from "@solidjs/router";
import type { JSX } from "solid-js";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SellerLogin from "./pages/SellerLogin";
import SellerRegister from "./pages/SellerRegister";
import Account from "./pages/Account";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import ProductFormNew from "./pages/admin/ProductFormNew";
import ProductFormEdit from "./pages/admin/ProductFormEdit";
import AdminOrders from "./pages/admin/AdminOrders";
import OrderDetail from "./pages/admin/OrderDetail";
import AdminLogin from "./pages/AdminLogin";
import PlatformLayout from "./pages/platform/PlatformLayout";
import PlatformDashboard from "./pages/platform/Dashboard";
import PlatformUsers from "./pages/platform/Users";
import PlatformProducts from "./pages/platform/Products";
import PlatformModeration from "./pages/platform/Moderation";
import PlatformOrders from "./pages/platform/Orders";
import PlatformActivity from "./pages/platform/Activity";

function Shell(props: { children?: JSX.Element }) {
  return (
    <div class="flex min-h-screen flex-col">
      <Navbar />
      <main class="flex-1">{props.children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      {/* Public storefront (with navbar + footer) */}
      <Route path="/" component={Shell}>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/products/:id" component={ProductDetail} />
        <Route path="/shops/:id" component={Shop} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/order-confirmation/:id" component={OrderConfirmation} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/account" component={Account} />
      </Route>

      {/* Seller dashboard — separate shell, no storefront chrome */}
      <Route path="/seller/login" component={SellerLogin} />
      <Route path="/seller/register" component={SellerRegister} />
      <Route path="/seller" component={AdminLayout}>
        <Route path="/" component={Dashboard} />
        <Route path="/products" component={AdminProducts} />
        <Route path="/products/new" component={ProductFormNew} />
        <Route path="/products/:id/edit" component={ProductFormEdit} />
        <Route path="/orders" component={AdminOrders} />
        <Route path="/orders/:id" component={OrderDetail} />
      </Route>

      {/* Platform admin — separate shell, no storefront chrome */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={PlatformLayout}>
        <Route path="/" component={PlatformDashboard} />
        <Route path="/users" component={PlatformUsers} />
        <Route path="/products" component={PlatformProducts} />
        <Route path="/moderation" component={PlatformModeration} />
        <Route path="/orders" component={PlatformOrders} />
        <Route path="/activity" component={PlatformActivity} />
      </Route>
    </Router>
  );
}
