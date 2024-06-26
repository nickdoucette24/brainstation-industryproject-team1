import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import shoppingCartIcon from "../../assets/icons/shopping-cart.svg";
import boxIcon from "../../assets/icons/box-icon.svg";
import chartIcon from "../../assets/icons/data-analysis-icon.svg";
import checkmarkIcon from "../../assets/icons/compliance-rate-icon.svg";
import "./RetailerList.scss";

// Base Url
const url = process.env.REACT_APP_BASE_URL;

const RetailerList = ({ userId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("UserId in RetailerPage:", userId); // Log userId for debugging

    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/api/retailers`);
        console.log("Fetched data:", response.data);  // Log fetched data for debugging
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

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
    console.log("Calculating metrics for products:", products);  // Log products for debugging
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
      products.reduce((sum, product) => sum + Math.abs(parseFloat(product.Deviation) || 0), 0) / totalProducts;

    console.log("Total Products: ", totalProducts);  // Log total products count
    console.log("Compliant Products: ", compliantProducts);  // Log compliant products count
    console.log("Compliance Rate: ", complianceRate);  // Log compliance rate
    console.log("Average Deviation: ", averageDeviation);  // Log average deviation

    return {
      complianceRate: complianceRate.toFixed(2),
      averageDeviation: averageDeviation.toFixed(2),
      totalDeviatedProducts: totalProducts - compliantProducts,
    };
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    console.log("Data is not available yet.");  // Log if data is not available
    return null;
  }

  const renderTable = (products, retailer) => {
    // Filter out non-compliant products and sort them based on deviation (absolute value)
    const nonCompliantProducts = products.filter(
      (product) => getStatus(parseFloat(product.Deviation)) === "Non-Compliant"
    );
    const topNonCompliantProducts = nonCompliantProducts
      .sort((a, b) => Math.abs(b.Deviation) - Math.abs(a.Deviation))
      .slice(0, 5); // Get top 5 non-compliant products

    return (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dell Product Name</th>
            <th>MSRP</th>
            <th>{`${retailer} Price`}</th>
            <th>Deviation</th>
            <th>Compliance</th>
          </tr>
        </thead>
        <tbody>
          {topNonCompliantProducts.map((product, index) => (
            <tr key={`${retailer}-${index}`}>
              <td>{index + 1}</td>
              <td>{product.Dell_product}</td>
              <td>{product.Dell_price}</td>
              <td>{product[`${retailer}_price`]}</td>
              <td>{parseFloat(product.Deviation).toFixed(2)}</td>
              <td>{getStatus(parseFloat(product.Deviation))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderCards = (metrics) => (
    <div className="cards">
      <div className="card">
        <h3>Total Deviated Products</h3>
        <p>{metrics.totalDeviatedProducts}</p>
      </div>
      <div className="card">
        <h3>Average Price Deviation</h3>
        <p>{metrics.averageDeviation}%</p>
      </div>
      <div className="card">
        <h3>Compliance Rate</h3>
        <p>{metrics.complianceRate}%</p>
      </div>
    </div>
  );

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const bestbuyMetrics = calculateMetrics(data.bestbuy.allProducts);
  const neweggMetrics = calculateMetrics(data.newegg.allProducts);

  console.log("BestBuy Metrics:", bestbuyMetrics);  // Log BestBuy metrics
  console.log("Newegg Metrics:", neweggMetrics);  // Log Newegg metrics

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
        
        <div className="chart-container"></div>
    
    <div className="retailer-container">
      <div className="retailer-section">
        <h2>BestBuy</h2>
        <div className="retailer-content">
          {renderTable(data.bestbuy.allProducts, "Bestbuy")}
          {renderCards(bestbuyMetrics)}
        </div>
      </div>
      <div className="retailer-section">
        <h2>Newegg</h2>
        <div className="retailer-content">
          {renderTable(data.newegg.allProducts, "Newegg")}
          {renderCards(neweggMetrics)}
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

RetailerList.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default RetailerList;