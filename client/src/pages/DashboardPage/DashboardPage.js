import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SideNavigation from "../../components/SideNavigation/SideNavigation";
import Header from "../../components/Header/Header";
import { Bar } from "react-chartjs-2";
import "./DashboardPage.scss";

// Base Url
const url = process.env.REACT_APP_BASE_URL;

const DashboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get(`${url}/dashboard/${id}`, {
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
  }, [id, navigate]);

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top 5 Offending Products',
      },
    },
  };

  const formatDeviation = (value) => {
    const numberValue = parseFloat(value);
    return isNaN(numberValue) ? 'N/A' : numberValue.toFixed(2);
  };

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
          {!loading && dashboardData.bestbuyTop5 && (
            <>
              <h2>BestBuy Top 5 Offending Products</h2>
              <Bar
                data={{
                  labels: dashboardData.bestbuyTop5.map(item => item.Dell_product),
                  datasets: [
                    {
                      label: 'Price Difference ($CAD)',
                      data: dashboardData.bestbuyTop5.map(item => item.Price_dif),
                      backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                  ],
                }}
                options={barOptions}
              />
              <h2>Newegg Top 5 Offending Products</h2>
              <Bar
                data={{
                  labels: dashboardData.neweggTop5.map(item => item.Dell_product),
                  datasets: [
                    {
                      label: 'Price Difference ($CAD)',
                      data: dashboardData.neweggTop5.map(item => item.Price_dif),
                      backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    },
                  ],
                }}
                options={barOptions}
              />
            </>
          )}
          {!loading && (
            <div className="stats-container">
              <h2>Compliance Rates</h2>
              <div className="stats-row">
                <div className="stat-box">
                  <h3>BestBuy</h3>
                  <p>Total Deviated Products: {dashboardData.totalDeviatedProductsBestBuy}</p>
                  <p>Average Deviation: {formatDeviation(dashboardData.averageDeviationBestBuy)}%</p>
                  <p>Compliance Rate: {formatDeviation(dashboardData.complianceRateBestBuy)}%</p>
                </div>
                <div className="stat-box">
                  <h3>Newegg</h3>
                  <p>Total Deviated Products: {dashboardData.totalDeviatedProductsNewegg}</p>
                  <p>Average Deviation: {formatDeviation(dashboardData.averageDeviationNewegg)}%</p>
                  <p>Compliance Rate: {formatDeviation(dashboardData.complianceRateNewegg)}%</p>
                </div>
              </div>
              <h2>Top Offending Products</h2>
              <table className="offenders-table">
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
                    <td>{dashboardData.bestbuyTop5[0]?.Dell_product}</td>
                    <td>{dashboardData.bestbuyTop5[0]?.Dell_price}</td>
                    <td>{dashboardData.bestbuyTop5[0]?.Bestbuy_price}</td>
                    <td>{formatDeviation(dashboardData.bestbuyTop5[0]?.Deviation)}%</td>
                  </tr>
                  <tr>
                    <td>Newegg</td>
                    <td>{dashboardData.neweggTop5[0]?.Dell_product}</td>
                    <td>{dashboardData.neweggTop5[0]?.Dell_price}</td>
                    <td>{dashboardData.neweggTop5[0]?.Newegg_price}</td>
                    <td>{formatDeviation(dashboardData.neweggTop5[0]?.Deviation)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;