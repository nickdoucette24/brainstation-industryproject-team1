import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./RetailerPage.scss";

// Base URL for API requests
const url = process.env.REACT_APP_BASE_URL;

const RetailerPage = () => {
  const [bestbuy, setBestbuy] = useState(null);
  const [newegg, setNewegg] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRetailers = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/api/retailers`);
      setBestbuy(response.data.bestbuy);
      setNewegg(response.data.newegg);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching retailers:', err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRetailers();
  }, [fetchRetailers]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="retailer-container">
      <h1>Retailers</h1>
      <div className="retailer-details">
        <h2>BestBuy</h2>
        <p>Total Products Monitored: {bestbuy.totalProducts}</p>
        <p>Compliance Rate: {bestbuy.complianceRate}%</p>
        <p>Average Deviation: ${bestbuy.averageDeviation}</p>
        <h3>Top Offending Products</h3>
        {bestbuy.topOffendingProducts.map((product, index) => (
          <div key={`bestbuy-${index}`} className="product-item">
            <p>{product.product_name} - ${product.price}</p>
          </div>
        ))}
      </div>
      <div className="retailer-details">
        <h2>Newegg</h2>
        <p>Total Products Monitored: {newegg.totalProducts}</p>
        <p>Compliance Rate: {newegg.complianceRate}%</p>
        <p>Average Deviation: ${newegg.averageDeviation}</p>
        <h3>Top Offending Products</h3>
        {newegg.topOffendingProducts.map((product, index) => (
          <div key={`newegg-${index}`} className="product-item">
            <p>{product.product_name} - ${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RetailerPage;