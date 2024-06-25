import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Chart from "chart.js/auto";
import SideNavigation from "../../components/SideNavigation/SideNavigation";
import Header from "../../components/Header/Header";
import "./DashboardPage.scss";

// Base Url
const url = process.env.REACT_APP_BASE_URL;

const DashboardPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get(`${url}/dashboard/${userId}`, {
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
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${url}/api/products`);
        console.log("Fetched products:", response.data);
        if (
          Array.isArray(response.data.dellData) &&
          Array.isArray(response.data.bestbuyData) &&
          Array.isArray(response.data.neweggData)
        ) {
          setProducts(response.data);
        } else {
          console.error("Invalid products data structure:", response.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${url}/api/data/dashboard`);
        console.log("Fetched dashboard data:", response.data);
        setDashboardData(response.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchProducts();
    fetchDashboardData();
  }, [userId, navigate]);

  useEffect(() => {
    if (dashboardData) {
      const bestbuyTop5 = dashboardData.bestbuyTop5.map((product) => ({
        name: product.Dell_product,
        deviation: parseFloat(product.Deviation) || 0,
      }));
      const neweggTop5 = dashboardData.neweggTop5.map((product) => ({
        name: product.Dell_product,
        deviation: parseFloat(product.Deviation) || 0,
      }));

      // BestBuy Top 5 Offending Products Chart
      const bestbuyCtx = document.getElementById("bestbuyChart").getContext("2d");
      new Chart(bestbuyCtx, {
        type: "bar",
        data: {
          labels: bestbuyTop5.map((product) => product.name),
          datasets: [
            {
              label: "Price Deviation ($CAD)",
              data: bestbuyTop5.map((product) => product.deviation),
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      // Newegg Top 5 Offending Products Chart
      const neweggCtx = document.getElementById("neweggChart").getContext("2d");
      new Chart(neweggCtx, {
        type: "bar",
        data: {
          labels: neweggTop5.map((product) => product.name),
          datasets: [
            {
              label: "Price Deviation ($CAD)",
              data: neweggTop5.map((product) => product.deviation),
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [dashboardData]);

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
          {loading && <p>Loading...</p>}
          {!loading && dashboardData && (
            <>
              <div className="dashboard-metrics">
                <div>
                  <p>Total Offenders: {dashboardData.totalOffenders}</p>
                </div>
                <div>
                  <p>Total Deviated Products (BestBuy): {dashboardData.totalDeviatedProductsBestBuy}</p>
                  <p>Total Deviated Products (Newegg): {dashboardData.totalDeviatedProductsNewegg}</p>
                </div>
                <div>
                  <h3>
                    BestBuy Compliance Rate:{" "}
                    {parseFloat(dashboardData.complianceRateBestBuy).toFixed(2)}%
                  </h3>
                  <h3>
                    Newegg Compliance Rate:{" "}
                    {parseFloat(dashboardData.complianceRateNewegg).toFixed(2)}%
                  </h3>
                </div>
                <div>
                  <h3>
                    Average Deviation BestBuy:{" "}
                    {parseFloat(dashboardData.averageDeviationBestBuy).toFixed(2)}%
                  </h3>
                  <h3>
                    Average Deviation Newegg:{" "}
                    {parseFloat(dashboardData.averageDeviationNewegg).toFixed(2)}%
                  </h3>
                </div>
                <canvas id="bestbuyChart" width="400" height="200"></canvas>
                <canvas id="neweggChart" width="400" height="200"></canvas>
              </div>
              <div className="offending-products-table">
                <h2>Top Offending Products</h2>
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
                    {dashboardData.bestbuyTop5.map((product, index) => (
                      <tr key={`bestbuy-${index}`}>
                        <td>BestBuy</td>
                        <td>{product.Dell_product}</td>
                        <td>{product.Dell_price}</td>
                        <td>{product.Bestbuy_price}</td>
                        <td>{parseFloat(product.Deviation).toFixed(2)}</td>
                      </tr>
                    ))}
                    {dashboardData.neweggTop5.map((product, index) => (
                      <tr key={`newegg-${index}`}>
                        <td>Newegg</td>
                        <td>{product.Dell_product}</td>
                        <td>{product.Dell_price}</td>
                        <td>{product.Newegg_price}</td>
                        <td>{parseFloat(product.Deviation).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
