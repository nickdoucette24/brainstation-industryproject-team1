import { BrowserRouter, Routes, Route } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import LandingPage from "./pages/LandingPage/LandingPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import RetailerPage from "./pages/RetailerPage/RetailerPage";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import AccountSettingsPage from "./pages/AccountSettingsPage/AccountSettingsPage";
import "./App.scss";

// Base URL for API calls
// const baseUrl = process.env.REACT_APP_BASE_URL;

function App() {
  const loggedIn = useAuth();

  console.log("Is user logged in?", loggedIn);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard/:userId" element={<DashboardPage />} />
        <Route
          path="/dashboard/:userId/settings"
          element={<AccountSettingsPage />}
        />
        <Route path="/retailer/:retailerId" element={<RetailerPage />} />
        <Route path="/product-list" element={<ProductListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;