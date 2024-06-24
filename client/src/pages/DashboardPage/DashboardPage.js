import useAuth from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SideNavigation from "../../components/SideNavigation/SideNavigation";
import Header from "../../components/Header/Header";
import "./DashboardPage.scss";

// Base Url
const url = process.env.REACT_APP_BASE_URL;

const DashboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const loggedIn = useAuth();
  const [products, setProducts] = useState([]);
  // const [user, setUser] = useState(null); // Commented out because it's not used yet
  // const [loading, setLoading] = useState(true); // Commented out because it's not used yet

  useEffect(() => {
    const fetchUser = async () => {
      if (loggedIn) {
        try {
          const token = localStorage.getItem("jwt");
          const response = await axios.get(`${url}/dashboard/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data) {
            // setUser(response.data); // Commented out because it's not used yet
            // setLoading(false); // Commented out because it's not used yet
          } else {
            navigate("/auth");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${url}/products`);
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        // setLoading(false); // Commented out because it's not used yet
      }
    };

    fetchUser();
    fetchProducts();
  }, [id, navigate, loggedIn]);

  return (
    <div className="main-page">
      <div className="main-page__nav">
        <SideNavigation />
      </div>
      <main className="main-page__body">
        <div className="header-container">
          <Header />
        </div>
        <div className="dashboard-container">
          <h1>Dashboard</h1>
          <div className="product-overview">
            <h2>Product Overview</h2>
            {products.map((product) => (
              <div key={product.id} className="product-item">
                <img src={product.image} alt={product.name} />
                <div>
                  <p>Name: {product.product_name}</p>
                  <p>Price: ${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;