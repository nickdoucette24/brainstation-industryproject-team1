import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header/Header";
import SideNavigation from "../../components/SideNavigation/SideNavigation";
import "./RetailerPage.scss";

// Base URL
const url = process.env.REACT_APP_BASE_URL;

const RetailerPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/api/retailers`);
        console.log("Fetched data:", response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    console.log("Calculating metrics for products:", products);
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

  const renderTable = (products, retailer) => (
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
        {products.map((product, index) => (
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

  const renderCards = (data, metrics) => (
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
      <div className="card">
        <h3>Top Offending Products</h3>
        <p>{data.topOffendingProducts.length}</p>
      </div>
      <button className="export-button">Export</button>
    </div>
  );

  if (!data) {
    console.log("Data is not available yet.");
    return null;
  }

  const bestbuyMetrics = calculateMetrics(data.bestbuy.allProducts);
  const neweggMetrics = calculateMetrics(data.newegg.allProducts);

  console.log("BestBuy Metrics:", bestbuyMetrics); // Log BestBuy metrics
  console.log("Newegg Metrics:", neweggMetrics); // Log Newegg metrics

  return (
    <div className="main-page">
      <div className="main-page__nav">
        <SideNavigation />
      </div>
      <main className="main-page__body">
        <div className="header-container">
          <Header />
        </div>
        <div className="retailer-container">
          <h1>Retailers</h1>
          <div className="retailer-section">
            <h2>BestBuy</h2>
            <div className="retailer-content">
              {renderTable(data.bestbuy.topOffendingProducts, "Bestbuy")}
              {renderCards(data.bestbuy, bestbuyMetrics)}
            </div>
          </div>
          <div className="retailer-section">
            <h2>Newegg</h2>
            <div className="retailer-content">
              {renderTable(data.newegg.topOffendingProducts, "Newegg")}
              {renderCards(data.newegg, neweggMetrics)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RetailerPage;