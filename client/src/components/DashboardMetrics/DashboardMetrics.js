import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Chart from "chart.js/auto";
import { saveAs } from "file-saver";
import { unparse } from "papaparse";
import boxIcon from "../../assets/icons/box-icon.svg";
import chartIcon from "../../assets/icons/data-analysis-icon.svg";
import checkmarkIcon from "../../assets/icons/compliance-rate-icon.svg";
import shoppingCartIcon from "../../assets/icons/shopping-cart.svg";
import "./DashboardMetrics.scss";

// Base URL
const url = process.env.REACT_APP_BASE_URL;

const DashboardMetrics = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const truncateName = (name, maxLength = 20) => {
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

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
    const totalDeviatedProducts = totalProducts - compliantProducts;

    return {
      complianceRate: complianceRate.toFixed(2),
      averageDeviation: averageDeviation.toFixed(2),
      totalDeviatedProducts: totalDeviatedProducts,
    };
  };

  const handleExport = () => {
    if (!data) {
      console.warn("No data to export.");
      return;
    }

    const bestbuyMetrics = calculateMetrics(data.bestbuy.allProducts);
    const neweggMetrics = calculateMetrics(data.newegg.allProducts);

    const fields = [
      "Retailer",
      "Dell Product Name",
      "MSRP",
      "Authorized Seller Price",
      "Authorized Seller Deviation",
      "Total Deviated Products",
      "Average Deviation",
      "Compliance Rate"
    ];

    const csvData = [
      ...data.bestbuy.topOffendingProducts.map(product => ({
        Retailer: "BestBuy",
        "Dell Product Name": product.Dell_product,
        MSRP: product.Dell_price,
        "Authorized Seller Price": product.Bestbuy_price,
        "Authorized Seller Deviation": parseFloat(product.Deviation).toFixed(2),
        "Total Deviated Products": bestbuyMetrics.totalDeviatedProducts,
        "Average Deviation": bestbuyMetrics.averageDeviation,
        "Compliance Rate": bestbuyMetrics.complianceRate
      })),
      ...data.newegg.topOffendingProducts.map(product => ({
        Retailer: "Newegg",
        "Dell Product Name": product.Dell_product,
        MSRP: product.Dell_price,
        "Authorized Seller Price": product.Newegg_price,
        "Authorized Seller Deviation": parseFloat(product.Deviation).toFixed(2),
        "Total Deviated Products": neweggMetrics.totalDeviatedProducts,
        "Average Deviation": neweggMetrics.averageDeviation,
        "Compliance Rate": neweggMetrics.complianceRate
      }))
    ];

    const csv = unparse(csvData, { fields });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "dell_product_pricing_compliance_generated_by_spectra.csv");
  };

  useEffect(() => {
    if (data) {
      const bestbuyTop5 = data.bestbuy.topOffendingProducts.map((product) => ({
        name: truncateName(product.Dell_product),
        deviation: Math.abs(parseFloat(product.Deviation)) || 0,
      }));
      const neweggTop5 = data.newegg.topOffendingProducts.map((product) => ({
        name: truncateName(product.Dell_product),
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
                  label: "Price Deviation $CAD",
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
                  label: "Price Deviation $CAD",
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
          <div className="dashboard__bestbuy-container">
            <div className="chart-container__bestbuy"> 
              <div className="chart-container__retailer-label">
                BestBuy
              </div>   
              <div className="chart-wrapper">
                <canvas id="bestbuyChart" width="400" height="200"></canvas>
                <p className="chart-label">Product Names</p>
              </div>
            </div>
            <div className="dashboard__tiles">
              <div className="dashboard__deviated-products">
                <div className="dashboard__deviated-products--container">
                  <h2 className="dashboard__deviated-products--heading">Total Deviated Products</h2> 
                  <span className="dashboard__deviated-products--count">{bestbuyMetrics.totalDeviatedProducts}</span>                        
                </div>
                <div className="dashboard__deviated-products--img">
                  <img className="dashboard__deviated-products--icon" src={boxIcon} alt="product box icon" />
                </div>
              </div>
              <div className="dashboard__average-deviation">
                <div className="dashboard__average-deviation--container">
                  <h2 className="dashboard__average-deviation--heading">Average Deviation</h2> 
                  <span className="dashboard__average-deviation--count">{bestbuyMetrics.averageDeviation}%</span>                        
                </div>
                <div className="dashboard__average-deviation--img">
                  <img className="dashboard__average-deviation--icon" src={chartIcon} alt="chart icon" />
                </div>
              </div>
              <div className="dashboard__compliance-rate">
                <div className="dashboard__compliance-rate--container">
                  <h2 className="dashboard__compliance-rate--heading">Compliance Rate</h2> 
                  <span className="dashboard__compliance-rate--count">{bestbuyMetrics.complianceRate}%</span>                        
                </div>
                <div className="dashboard__compliance-rate--img">
                  <img className="dashboard__compliance-rate--icon" src={checkmarkIcon} alt="checkmark icon" />
                </div>
              </div>
            </div>
          </div>
          <div className="dashboard__newegg-container">
            <div className="chart-container__newegg">
              <div className="chart-container__retailer-label">
                Newegg
              </div>
              <div className="chart-wrapper">
                <canvas id="neweggChart" width="400" height="200"></canvas>
                <p className="chart-label">Product Names</p>
              </div>
            </div>
            <div className="dashboard__tiles">
              <div className="dashboard__deviated-products">
                <div className="dashboard__deviated-products--container">
                  <h2 className="dashboard__deviated-products--heading">Total Deviated Products</h2> 
                  <span className="dashboard__deviated-products--count">{neweggMetrics.totalDeviatedProducts}</span>                        
                </div>
                <div className="dashboard__deviated-products--img">
                  <img className="dashboard__deviated-products--icon" src={boxIcon} alt="product box icon" />
                </div>
              </div>
              <div className="dashboard__average-deviation">
                <div className="dashboard__average-deviation--container">
                  <h2 className="dashboard__average-deviation--heading">Average Deviation</h2> 
                  <span className="dashboard__average-deviation--count">{neweggMetrics.averageDeviation}%</span>                        
                </div>
                <div className="dashboard__average-deviation--img">
                  <img className="dashboard__average-deviation--icon" src={chartIcon} alt="chart icon" />
                </div>
              </div>
              <div className="dashboard__compliance-rate">
                <div className="dashboard__compliance-rate--container">
                  <h2 className="dashboard__compliance-rate--heading">Compliance Rate</h2> 
                  <span className="dashboard__compliance-rate--count">{neweggMetrics.complianceRate}%</span>                        
                </div>
                <div className="dashboard__compliance-rate--img">
                  <img className="dashboard__compliance-rate--icon" src={checkmarkIcon} alt="checkmark icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard__table-container">
        <div className="dashboard-list__table">
          <table className="dashboard-table">
            <thead className="dashboard-table__head">
              <tr className="dashboard-table__column">
                <th className="dashboard-table__column--item dashboard-column__retailer">Retailer</th>
                <th className="dashboard-table__column--item dashboard-column__dell-name">Dell Product Name</th>
                <th className="dashboard-table__column--item dashboard-column__msrp">MSRP</th>
                <th className="dashboard-table__column--item dashboard-column__price">Authorized Seller Price</th>
                <th className="dashboard-table__column--item dashboard-column__deviation">Authorized Seller Deviation</th>
              </tr>
            </thead>
            <tbody className="dashboard-table__body">
              <tr className="dashboard-table__row">
                <td className="dashboard-table__row--item row-retailer">BestBuy</td>
                <td className="dashboard-table__row--item row-dell-name">{data.bestbuy.topOffendingProducts[0].Dell_product}</td>
                <td className="dashboard-table__row--item row-retailer-msrp">{data.bestbuy.topOffendingProducts[0].Dell_price}</td>
                <td className="dashboard-table__row--item row-retailer-price">{data.bestbuy.topOffendingProducts[0].Bestbuy_price}</td>
                <td className="dashboard-table__row--item row-retailer-deviation">{parseFloat(data.bestbuy.topOffendingProducts[0].Deviation).toFixed(2)}</td>
              </tr>
              <tr className="dashboard-table__row">
                <td className="dashboard-table__row--item row-retailer">Newegg</td>
                <td className="dashboard-table__row--item row-dell-name">{data.newegg.topOffendingProducts[0].Dell_product}</td>
                <td className="dashboard-table__row--item row-retailer-msrp">{data.newegg.topOffendingProducts[0].Dell_price}</td>
                <td className="dashboard-table__row--item row-retailer-price">{data.newegg.topOffendingProducts[0].Newegg_price}</td>
                <td className="dashboard-table__row--item row-retailer-deviation">{parseFloat(data.newegg.topOffendingProducts[0].Deviation).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="export-container">
        <button className="export-container__button" onClick={handleExport}>
          <span className="export-container__button--text">Export</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardMetrics;