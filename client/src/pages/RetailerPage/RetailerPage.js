import React, { useEffect, useState } from "react";
import axios from "axios";
import SideNavigation from "../../components/SideNavigation/SideNavigation";
import Header from "../../components/Header/Header";
import "./RetailerPage.scss";

// Base Url
const url = process.env.REACT_APP_BASE_URL;

const RetailerPage = () => {
  const [retailerData, setRetailerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRetailerData = async () => {
      try {
        const response = await axios.get(`${url}/api/retailers`);
        console.log("Fetched retailer data:", response.data);
        setRetailerData(response.data);
      } catch (error) {
        console.error("Error fetching retailer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRetailerData();
  }, []);

  const renderTable = (data, retailer) => (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Dell Product Name</th>
          <th>MSRP</th>
          <th>{retailer} Price</th>
          <th>Deviation</th>
          <th>Compliance</th>
        </tr>
      </thead>
      <tbody>
        {data && data.map((item, index) => (
          <tr key={`${retailer}-${index}`}>
            <td>{index + 1}</td>
            <td>{item.Dell_product}</td>
            <td>{item.Dell_price}</td>
            <td>{item[`${retailer.toLowerCase()}_price`]}</td>
            <td>{parseFloat(item.Deviation).toFixed(2)}</td>
            <td>{item.Status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderCards = (data) => (
    <div className="cards">
      <div className="card">
        <h3>Total Products</h3>
        <p>{data.totalProducts}</p>
      </div>
      <div className="card">
        <h3>Average Price Deviation</h3>
        <p>{Number(data.averageDeviation).toFixed(2)}%</p>
      </div>
      <div className="card">
        <h3>Compliance Rate</h3>
        <p>{Number(data.complianceRate).toFixed(2)}%</p>
      </div>
      <div className="card">
        <h3>Top Offending Products</h3>
        <p>{data.topOffendingProducts.length}</p>
      </div>
      <button className="export-button">Export Data</button>
    </div>
  );

  if (loading) {
    return <p>Loading...</p>;
  }

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
          <h1>Retailer Overview</h1>
          {retailerData && (
            <>
              <h2>Total Offenders: {retailerData.totalOffenders}</h2>

              <div className="retailer-section">
                <h2>BestBuy</h2>
                <div className="section-content">
                  <div className="table-container">
                    {retailerData.bestbuy.topOffendingProducts && renderTable(retailerData.bestbuy.topOffendingProducts, "BestBuy")}
                  </div>
                  <div className="cards-container">
                    {retailerData.bestbuy && renderCards(retailerData.bestbuy)}
                  </div>
                </div>
              </div>

              <div className="retailer-section">
                <h2>Newegg</h2>
                <div className="section-content">
                  <div className="table-container">
                    {retailerData.newegg.topOffendingProducts && renderTable(retailerData.newegg.topOffendingProducts, "Newegg")}
                  </div>
                  <div className="cards-container">
                    {retailerData.newegg && renderCards(retailerData.newegg)}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default RetailerPage;