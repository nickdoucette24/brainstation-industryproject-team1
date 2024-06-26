import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Chart from "chart.js/auto";
import shoppingCartIcon from "../../assets/icons/shopping-cart.svg";
import "./DashboardMetrics.scss";

// Base URL
const url = process.env.REACT_APP_BASE_URL;

const DashboardMetrics = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get(`${url}/dashboard/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.data) {
          navigate("/auth");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${url}/api/retailers`);
        console.log("Fetched data:", response.data); // Log fetched data for debugging
        setData(response.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchDashboardData();
  }, [userId, navigate]);

  // Function to get the status based on deviation
  const getStatus = (deviation) => {
    if (Math.abs(deviation) <= 5) {
      return "Compliant";
    } else if (Math.abs(deviation) > 5 && Math.abs(deviation) <= 15) {
      return "Needs Attention";
    } else if (Math.abs(deviation) > 15) {
      return "Non-Compliant";
    }
    return "Undetermined";
  };

  // Function to calculate compliance rate and average deviation
  const calculateMetrics = (products) => {
    if (!products || products.length === 0) {
      return {
        complianceRate: 0,
        averageDeviation: 0,
        totalDeviatedProducts: 0,
      };
    }

    const totalProducts = products.length;
    const compliantProducts = products.filter(
      (product) => getStatus(parseFloat(product.Deviation)) === "Compliant"
    ).length;
    const complianceRate = (compliantProducts / totalProducts) * 100;
    const averageDeviation =
      products.reduce((sum, product) => sum + parseFloat(product.Deviation || 0), 0) / totalProducts;

    return {
      complianceRate: complianceRate.toFixed(2),
      averageDeviation: averageDeviation.toFixed(2),
      totalDeviatedProducts: totalProducts - compliantProducts,
    };
  };

  useEffect(() => {
    if (data) {
      const bestbuyTop5 = data.bestbuy.topOffendingProducts.map((product) => ({
        name: product.Dell_product,
        deviation: Math.abs(parseFloat(product.Deviation)) || 0,
      }));
      const neweggTop5 = data.newegg.topOffendingProducts.map((product) => ({
        name: product.Dell_product,
        deviation: Math.abs(parseFloat(product.Deviation)) || 0,
      }));

      // Destroy existing charts before rendering new ones
      const destroyCharts = () => {
        const bestbuyChartCanvas = document.getElementById("bestbuyChart");
        const neweggChartCanvas = document.getElementById("neweggChart");

        if (bestbuyChartCanvas) {
          Chart.getChart(bestbuyChartCanvas)?.destroy();
        }

        if (neweggChartCanvas) {
          Chart.getChart(neweggChartCanvas)?.destroy();
        }
      };

      destroyCharts();

      // Create new charts
      const createCharts = () => {
        // BestBuy Top 5 Offending Products Chart
        const bestbuyCtx = document.getElementById("bestbuyChart")?.getContext("2d");
        if (bestbuyCtx) {
          new Chart(bestbuyCtx, {
            type: "bar",
            data: {
              labels: bestbuyTop5.map((product) => product.name),
              datasets: [
                {
                  label: "Price Deviation",
                  data: bestbuyTop5.map((product) => product.deviation),
                  backgroundColor: "rgba(252, 236, 93, 0.65)",
                  borderColor: "#FCEC5D",
                  borderWidth: 1,
                  borderRadius: 5,
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

        // Newegg Top 5 Offending Products Chart
        const neweggCtx = document.getElementById("neweggChart")?.getContext("2d");
        if (neweggCtx) {
          new Chart(neweggCtx, {
            type: "bar",
            data: {
              labels: neweggTop5.map((product) => product.name),
              datasets: [
                {
                  label: "Price Deviation",
                  data: neweggTop5.map((product) => product.deviation),
                  backgroundColor: "rgba(236, 157, 74, 0.65)",
                  borderColor: "#EC9D4A",
                  borderWidth: 1,
                  borderRadius: 5,
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
      };

      createCharts();
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  const bestbuyMetrics = calculateMetrics(data.bestbuy.allProducts);
  const neweggMetrics = calculateMetrics(data.newegg.allProducts);

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="dashboard__wrapper">
      <div className="dashboard__details">
        <div className="dashboard-widget">
          <div className="dashboard-widget__container">
            <div className="dashboard-widget__details">
              <h2 className="dashboard-widget__details--heading">Total Offenders</h2>
              <span className="dashboard-widget__details--count">2</span>
            </div>
            <div className="dashboard-widget__icon-container">
              <img
                className="dashboard-widget__cart-icon"
                src={shoppingCartIcon}
                alt="shopping cart icon for the total offenders widget"
              />
            </div>
          </div>

          <div className="dashboard-widget__heading">
            <div className="dashboard-heading__content">
              <h1 className="dashboard-heading__content--heading">Welcome back, Ali!</h1>
              <span className="dashboard-heading__content--date">{currentDate}</span>
            </div>
            <h2 className="dashboard-widget__heading--directions">
              Here are the <strong>top deviated products</strong> by <strong>retailer</strong>. 
              Please review the details below.
            </h2>
          </div>
        </div>
        
        <div className="chart-container">
            <div className="chart-container__bestbuy">
                <div className="chart-wrapper">
                    <canvas id="bestbuyChart" width="400" height="200"></canvas>
                    <p className="chart-label">Product Names</p>
                </div>
            </div>
            <div className="chart-container__newegg">
                <div className="chart-wrapper">
                    <canvas id="neweggChart" width="400" height="200"></canvas>
                    <p className="chart-label">Product Names</p>
                </div>
            </div>
        </div>
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
            <tr>
              <td>BestBuy</td>
              <td>{data.bestbuy.topOffendingProducts[0].Dell_product}</td>
              <td>{data.bestbuy.topOffendingProducts[0].Dell_price}</td>
              <td>{data.bestbuy.topOffendingProducts[0].Bestbuy_price}</td>
              <td>{parseFloat(data.bestbuy.topOffendingProducts[0].Deviation).toFixed(2)}</td>
            </tr>
            <tr>
              <td>Newegg</td>
              <td>{data.newegg.topOffendingProducts[0].Dell_product}</td>
              <td>{data.newegg.topOffendingProducts[0].Dell_price}</td>
              <td>{data.newegg.topOffendingProducts[0].Newegg_price}</td>
              <td>{parseFloat(data.newegg.topOffendingProducts[0].Deviation).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="dashboard__metrics">
        <div>
          <p>Total Deviated Products: {data.totalOffenders}</p>
        </div>
        <div>
          <h3>BestBuy Compliance Rate: {bestbuyMetrics.complianceRate}%</h3>
          <h3>Newegg Compliance Rate: {neweggMetrics.complianceRate}%</h3>
        </div>
        <div>
          <h3>Average Deviation BestBuy: {bestbuyMetrics.averageDeviation}%</h3>
          <h3>Average Deviation Newegg: {neweggMetrics.averageDeviation}%</h3>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
