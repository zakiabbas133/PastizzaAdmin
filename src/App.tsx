import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";

import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";

import AppLayout from "./layout/AppLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import AddMenu from "./pages/Menu/AddMenu";
import Menu from "./pages/Menu/Menu";
import MenuItemDetails from "./pages/Menu/MenuItem";
import EditMenu from "./pages/Menu/EditMenu";

import Categories from "./pages/Category/Categories";

import Deals from "./pages/Deals/Deals";
import CreateDeal from "./pages/Deals/CreateDeal";
import DealDetails from "./pages/Deals/DealDetails";
import EditDeal from "./pages/Deals/EditDeal";

import WebsiteSettings from "./pages/WebsiteSettings/WebsiteSettings";

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Menu />} />

            <Route path="/add-menu" element={<AddMenu />} />

            <Route path="/menu-items/:id" element={<MenuItemDetails />} />

            <Route path="/menu-items/:id/edit" element={<EditMenu />} />

            <Route path="/category" element={<Categories />} />

            <Route path="/deals" element={<Deals />} />

            <Route path="/deals/create" element={<CreateDeal />} />

            <Route path="/deals/:id" element={<DealDetails />} />

            <Route path="/deals/:id/edit" element={<EditDeal />} />

            <Route path="/website-settings" element={<WebsiteSettings />} />
          </Route>
        </Route>

        {/* Public Authentication */}
        <Route path="/signin" element={<SignIn />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
