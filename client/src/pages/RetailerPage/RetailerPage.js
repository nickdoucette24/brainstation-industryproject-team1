import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./RetailerPage.scss";

const RetailerPage = () => {
  const { retailerId } = useParams();
  const [retailer, setRetailer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRetailer = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/retailers/${retailerId}`);
      setRetailer(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching retailer:', err);
      setLoading(false);
    }
  }, [retailerId]);

  useEffect(() => {
    fetchRetailer();
  }, [fetchRetailer]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!retailer) {
    return <div>Error loading retailer data.</div>;
  }

  return (
    <div className="retailer-container">
      <h1>Retailer: {retailer.name}</h1>
      <div className="retailer-details">
        <p>Total Products Monitored: {retailer.totalProducts}</p>
        <p>Compliance Rate: {retailer.complianceRate}%</p>
        <p>Average Deviation: ${retailer.averageDeviation}</p>
        <h2>Top Offending Products</h2>
        {retailer.topOffendingProducts.map(product => (
          <div key={product.id} className="product-item">
            <p>{product.product_name} - ${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RetailerPage;