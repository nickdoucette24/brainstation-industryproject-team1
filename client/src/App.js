import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { useState, useEffect } from "react";
import useAuth from "./hooks/useAuth";
import LandingPage from "./pages/LandingPage/LandingPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import RetailerPage from "./pages/RetailerPage/RetailerPage";
import ProductLinePage from "./pages/ProductLinePage/ProductLinePage";
import AccountSettingsPage from "./pages/AccountSettingsPage/AccountSettingsPage";
// import axios from "axios";
import CsvToJsonConverter from "./components/CsvToJsonConverter/CsvToJsonConverter";
import "./App.scss";

// Base URL for API calls
const baseUrl = process.env.REACT_APP_BASE_URL;

// // Axios instance with a base URL
// const axiosInstance = axios.create({
//   baseURL: baseUrl,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// function ProductList() {
//   const [productList, setProductList] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axiosInstance.get("/products"); // Use axios instance for API call
//         setProductList(response.data); // Update state with fetched product list
//       } catch (error) {
//         console.error("Error fetching product list:", error); // Log error if request fails
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       <h1>Product List</h1>
//       <ul>
//         {productList.map((product) => (
//           <li key={product.id}>{product.name}</li> // Render each product name
//         ))}
//       </ul>
//     </div>
//   );
// }

// function ProductDetail() {
//   const { id } = useParams(); // Get product ID from URL parameters
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axiosInstance.get(`/products/${id}`); // Fetch product details by ID
//         setProduct(response.data); // Update state with fetched product details
//       } catch (error) {
//         console.error("Error fetching product details:", error); // Log error if request fails
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   return (
//     <div>
//       {product ? (
//         <>
//           <h1>{product.name}</h1>
//           <p>{product.description}</p>
//         </>
//       ) : (
//         <p>Loading...</p> // Show loading message while fetching data
//       )}
//     </div>
//   );
// }

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
        <Route path="/product-line/:id" element={<ProductLinePage />} />
        <Route
          path="/convert"
          element={<CsvToJsonConverter baseURL={baseUrl} />}
        />{" "}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
