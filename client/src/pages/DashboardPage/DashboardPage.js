import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Chart from "chart.js/auto";
import SideNavigation from "../../components/SideNavigation/SideNavigation";
import Header from "../../components/Header/Header";
import "./DashboardPage.scss";

// Base URL
const url = process.env.REACT_APP_BASE_URL;

const DashboardPage = () => {
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
        deviation: parseFloat(product.Deviation) || 0,
      }));
      const neweggTop5 = data.newegg.topOffendingProducts.map((product) => ({
        name: product.Dell_product,
        deviation: parseFloat(product.Deviation) || 0,
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

  return (
    <div className="main-page">
      <div className="main-page__nav">
        <SideNavigation />
      </div>
      <main className="main-page__body">
        <div className="header-container">
          <Header userId={userId} />
        </div>
        <section className="dashboard">
          <div className="dashboard__container">
            <p>Total Deviated Products: {data.totalOffenders}</p>
            <p>Total Retailers: 2</p>
          </div>
          <div>
            <h3>BestBuy Compliance Rate: {bestbuyMetrics.complianceRate}%</h3>
            <h3>Newegg Compliance Rate: {neweggMetrics.complianceRate}%</h3>
          </div>
          <div>
            <h3>Average Deviation BestBuy: {bestbuyMetrics.averageDeviation}%</h3>
            <h3>Average Deviation Newegg: {neweggMetrics.averageDeviation}%</h3>
          </div>
          <canvas id="bestbuyChart" width="400" height="200"></canvas>
          <canvas id="neweggChart" width="400" height="200"></canvas>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;