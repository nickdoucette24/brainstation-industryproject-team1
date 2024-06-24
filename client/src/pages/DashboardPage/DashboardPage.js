import useAuth from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DashboardPage.scss";

const DashboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const loggedIn = useAuth();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/dashboard/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          setUser(response.data);
        } else {
          navigate("/auth");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/auth");
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };

    if (!loggedIn) {
      navigate("/auth");
      return null;
    }

    fetchUser();
    fetchProducts();
  }, [id, navigate]);

  if (!user || loading) {
    return <div>Loading...</div>;
  }

  return (
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
  );
};

export default DashboardPage;
