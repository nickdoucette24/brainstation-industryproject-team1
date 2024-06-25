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
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            <td>{product.Status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderCards = (data) => (
    <div className="cards">
      <div className="card">
        <h3>Total Deviated Products</h3>
        <p>{data.totalProducts}</p>
      </div>
      <div className="card">
        <h3>Average Price Deviation</h3>
        <p>{parseFloat(data.averageDeviation).toFixed(2)}%</p>
      </div>
      <div className="card">
        <h3>Compliance Rate</h3>
        <p>{parseFloat(data.complianceRate).toFixed(2)}%</p>
      </div>
      <div className="card">
        <h3>Top Offending Products</h3>
        <p>{data.topOffendingProducts.length}</p>
      </div>
      <button className="export-button">Export</button>
    </div>
  );

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
              {renderCards(data.bestbuy)}
            </div>
          </div>
          <div className="retailer-section">
            <h2>Newegg</h2>
            <div className="retailer-content">
              {renderTable(data.newegg.topOffendingProducts, "Newegg")}
              {renderCards(data.newegg)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RetailerPage;