import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import shoppingCartIcon from "../../assets/icons/shopping-cart.svg";
import boxFullIcon from "../../assets/icons/box-full-icon.svg";
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
        console.log("Fetched data:", response.data); // Log fetched data for debugging
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
    console.log("Calculating metrics for products:", products); // Log products for debugging
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
      products.reduce(
        (sum, product) => sum + Math.abs(parseFloat(product.Deviation) || 0),
        0
      ) / totalProducts;

    console.log("Total Products: ", totalProducts); // Log total products count
    console.log("Compliant Products: ", compliantProducts); // Log compliant products count
    console.log("Compliance Rate: ", complianceRate); // Log compliance rate
    console.log("Average Deviation: ", averageDeviation); // Log average deviation

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
    console.log("Data is not available yet."); // Log if data is not available
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
            <th>Deviation (%)</th>
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
              <td>{parseFloat(product.Deviation).toFixed(2)}%</td>
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

  console.log("BestBuy Metrics:", bestbuyMetrics); // Log BestBuy metrics
  console.log("Newegg Metrics:", neweggMetrics); // Log Newegg metrics

  return (
    <div className="retailer__wrapper">
      <div className="retailer__details">
        <div className="retailer-widget">
          <div className="retailer-widget__container">
            <div className="retailer-widget__details">
              <h2 className="retailer-widget__details--heading">Total Offenders</h2>
              <span className="retailer-widget__details--count">2</span>
            </div>
            <div className="retailer-widget__icon-container">
              <img
                className="retailer-widget__cart-icon"
                src={shoppingCartIcon}
                alt="shopping cart icon for the total offenders widget"
              />
            </div>
          </div>

          <div className="retailer-widget__heading">
            <div className="retailer-heading__content">
              <h1 className="retailer-heading__content--heading">Retailer Pricing Compliance</h1>
              <span className="retailer-heading__content--date">{currentDate}</span>
            </div>
            <h2 className="retailer-widget__heading--directions">
              Please review the <strong>compliance</strong> and <strong>deviation</strong> values for products sold by these <strong>retailers</strong>.
            </h2>
          </div>
        </div>

        <div className="retailer__bestbuy-container">
          <div className="chart-container__retailer-label">BestBuy</div>
          <div className="dashboard__tiles">
            <div className="dashboard__deviated-products">
              <div className="dashboard__deviated-products--container">
                <h2 className="dashboard__deviated-products--heading">Total Deviated Products</h2>
                <span className="dashboard__deviated-products--count">{bestbuyMetrics.totalDeviatedProducts}</span>
              </div>
              <div className="dashboard__deviated-products--img">
                <img className="dashboard__deviated-products--icon" src={boxFullIcon} alt="product box icon" />
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

        <div className="chart-container">
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
    </div>
  );
};

RetailerList.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default RetailerList;