import { BrowserRouter, Routes, Route } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import LandingPage from "./pages/LandingPage/LandingPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import RetailerPage from "./pages/RetailerPage/RetailerPage";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import AccountSettingsPage from "./pages/AccountSettingsPage/AccountSettingsPage";
import CsvToJsonConverter from "./components/CsvToJsonConverter/CsvToJsonConverter";
import "./App.scss";

// Base URL for API calls
const baseUrl = process.env.REACT_APP_BASE_URL;

function App() {
  const loggedIn = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {!loggedIn ? (
          <Route path="/auth" element={<AuthPage />} />
        ) : (
          <Route path="/dashboard/:id" element={<DashboardPage />} />
        )}
        <Route
          path="/dashboard/:id/settings"
          element={<AccountSettingsPage />}
        />
        <Route path="/retailer/:id" element={<RetailerPage />} />
        <Route path="/product-list" element={<ProductListPage />} />
        <Route
          path="/convert"
          element={<CsvToJsonConverter baseURL={baseUrl} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
