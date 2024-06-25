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
  const [dashboardData, setDashboardData] = useState(null);
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

        if (response.data) {
          // setUser(response.data); // You might want to set user data if needed
        } else {
          navigate("/auth");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${url}/api/data/dashboard`);
        setDashboardData(response.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
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
  }, [dashboardData]);

  return (
    <div className="main-page">
      <div className="main-page__nav">
        <SideNavigation />
      </div>
      <main className="main-page__body">
        <div className="header-container">
          <Header userId={userId} />
        </div>
        <div className="dashboard-container">
          <h1>Dashboard</h1>
          {loading && <p>Loading...</p>}
          {!loading && dashboardData && (
            <>
              <div className="dashboard-metrics">
                <h2>Dashboard Metrics</h2>
                <div>
                  <p>Total Offenders: {dashboardData.totalOffenders}</p>
                </div>
                <div>
                  <h3>
                    BestBuy Compliance Rate:{" "}
                    {parseFloat(dashboardData.complianceRateBestBuy).toFixed(2)}
                    %
                  </h3>
                  <h3>
                    Newegg Compliance Rate:{" "}
                    {parseFloat(dashboardData.complianceRateNewegg).toFixed(2)}
                    %
                  </h3>
                </div>
                <div>
                  <h3>
                    Average Deviation BestBuy:{" "}
                    {parseFloat(
                      dashboardData.averageDeviationBestBuy
                    ).toFixed(2)}
                    %
                  </h3>
                  <h3>
                    Average Deviation Newegg:{" "}
                    {parseFloat(
                      dashboardData.averageDeviationNewegg
                    ).toFixed(2)}
                    %
                  </h3>
                </div>
                <canvas id="bestbuyChart" width="400" height="200"></canvas>
                <canvas id="neweggChart" width="400" height="200"></canvas>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;