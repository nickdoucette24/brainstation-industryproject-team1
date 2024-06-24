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
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (loggedIn) {
        try {
          const token = localStorage.getItem("jwt");
          const response = await axios.get(`${url}/api/dashboard/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data) {
            setUser(response.data);
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
        const response = await axios.get(`${url}/api/products`);
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${url}/api/data/dashboard`);
        setDashboardData(response.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    const initializeData = async () => {
      await fetchUser();
      await fetchProducts();
      await fetchDashboardData();
      setLoading(false);
    };

    initializeData();
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
          {user && (
            <div className="user-info">
              <h2>Welcome, {user.first_name} {user.last_name}</h2>
            </div>
          )}
          {dashboardData && (
            <div className="dashboard-metrics">
              <p>Total Offenders: {dashboardData.totalOffenders}</p>
              <p>Total Deviated Products (BestBuy): {dashboardData.totalDeviatedProductsBestBuy}</p>
              <p>Average Price Deviation (BestBuy): {dashboardData.averageDeviationBestBuy.toFixed(2)}%</p>
              <p>Average Price Deviation (Newegg): {dashboardData.averageDeviationNewegg.toFixed(2)}%</p>
              <p>Compliance Rate (BestBuy): {dashboardData.complianceRateBestBuy.toFixed(2)}%</p>
              <p>Compliance Rate (Newegg): {dashboardData.complianceRateNewegg.toFixed(2)}%</p>
            </div>
          )}
          {dashboardData && (
            <>
              <h2>Top 5 Offending Products (BestBuy)</h2>
              <ul>
                {dashboardData.bestbuyTop5.map(product => (
                  <li key={product.Dell_product}>
                    {product.Dell_product} - Deviation: {product.Deviation}%
                  </li>
                ))}
              </ul>
              <h2>Top 5 Offending Products (Newegg)</h2>
              <ul>
                {dashboardData.neweggTop5.map(product => (
                  <li key={product.Dell_product}>
                    {product.Dell_product} - Deviation: {product.Deviation}%
                  </li>
                ))}
              </ul>
              <h2>Combined Top Offenders</h2>
              <table>
                <thead>
                  <tr>
                    <th>Retailer</th>
                    <th>Product Name</th>
                    <th>MSRP</th>
                    <th>Current Price</th>
                    <th>Deviation</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.combinedTopOffenders.map(product => (
                    <tr key={product.Dell_product}>
                      <td>{product.Retailer}</td>
                      <td>{product.Dell_product}</td>
                      <td>{product.Dell_price}</td>
                      <td>{product.Current_price}</td>
                      <td>{product.Deviation}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
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