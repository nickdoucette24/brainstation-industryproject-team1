import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './ProductList.scss';

// Base Url
const url = process.env.REACT_APP_BASE_URL;

const ProductList = () => {
  // State to store product data and total offenders
  const [products, setProducts] = useState([]);
  const [totalOffenders, setTotalOffenders] = useState(0);

  // Function to combine data from Dell, BestBuy, and Newegg
  const combineData = useCallback((dell, bestbuy, newegg) => {
    let offendersCount = 0;
    const combined = dell.map(dellItem => {
      const bestbuyItem = bestbuy.find(item => item.Dell_product === dellItem.Dell_product) || {};
      const neweggItem = newegg.find(item => item.Dell_product === dellItem.Dell_product) || {};

      if (parseFloat(bestbuyItem.Deviation) < 0 || parseFloat(neweggItem.Deviation) < 0) {
        offendersCount++;
      }

      return {
        id: generateUUID(),
        dellProductName: dellItem.Dell_product,
        msrp: dellItem.Dell_price,
        bestbuyPrice: bestbuyItem.Bestbuy_price || 'Not Available',
        bestbuyDeviation: bestbuyItem.Deviation ? parseFloat(bestbuyItem.Deviation).toFixed(2) : 'N/A',
        bestbuyCompliance: bestbuyItem.Status || 'N/A',
        neweggPrice: neweggItem.Newegg_price || 'Not Available',
        neweggDeviation: neweggItem.Deviation ? parseFloat(neweggItem.Deviation).toFixed(2) : 'N/A',
        neweggCompliance: neweggItem.Status || 'N/A'
      };
    });
    setTotalOffenders(offendersCount);
    return combined;
  }, []);

  // Fetch product data from APIs and combine them
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const dellData = await axios.get(`${url}/api/data/dell`);
        const bestbuyData = await axios.get(`${url}/api/data/compare/dell-bestbuy`);
        const neweggData = await axios.get(`${url}/api/data/compare/dell-newegg`);

        const combinedData = combineData(dellData.data, bestbuyData.data, neweggData.data);
        setProducts(combinedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProducts();
  }, [combineData, url]);

  // Generate a unique ID for each product
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });
  };

  return (
    <div className="container-pl">
      <h1 className="title-pl">Dell Products</h1>
      <p>Total Offending Products: {totalOffenders}</p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dell Product Name</th>
            <th>MSRP</th>
            <th>BestBuy Price</th>
            <th>BestBuy Deviation</th>
            <th>BestBuy Compliance</th>
            <th>Newegg Price</th>
            <th>Newegg Deviation</th>
            <th>Newegg Compliance</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.dellProductName}</td>
              <td>{product.msrp}</td>
              <td>{product.bestbuyPrice}</td>
              <td>{product.bestbuyDeviation}</td>
              <td>{product.bestbuyCompliance}</td>
              <td>{product.neweggPrice}</td>
              <td>{product.neweggDeviation}</td>
              <td>{product.neweggCompliance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;