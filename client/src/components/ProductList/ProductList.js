import React, { useEffect, useState, useCallback } from "react";
import boxIcon from "../../assets/icons/box-icon.svg";
import axios from "axios";
import "./ProductList.scss";

// Base Url
const url = process.env.REACT_APP_BASE_URL;

const ProductList = () => {
  // State to store product data and total offenders
  const [products, setProducts] = useState([]);
  const [totalOffenders, setTotalOffenders] = useState(0);

  // Function to combine data from Dell, BestBuy, and Newegg
  const combineData = useCallback((dell, bestbuy, newegg) => {
    let offendersCount = 0;
    const combined = dell.map((dellItem) => {
      const bestbuyItem =
        bestbuy.find((item) => item.Dell_product === dellItem.Dell_product) ||
        {};
      const neweggItem =
        newegg.find((item) => item.Dell_product === dellItem.Dell_product) ||
        {};

      if (
        parseFloat(bestbuyItem.Deviation) < 0 ||
        parseFloat(neweggItem.Deviation) < 0
      ) {
        offendersCount++;
      }

      const getStatus = (status) => {
        switch (status) {
          case 'Green':
            return 'Compliant';
          case 'Yellow':
            return 'Needs Attention';
          case 'Red':
            return 'Non-Compliant';
          default:
            return 'Undetermined';
        }
      };

      return {
        id: generateUUID(),
        dellProductName: dellItem.Dell_product,
        msrp: dellItem.Dell_price,
        bestbuyPrice: bestbuyItem.Bestbuy_price || "Not Available",
        bestbuyDeviation: bestbuyItem.Deviation
          ? parseFloat(bestbuyItem.Deviation).toFixed(2)
          : "N/A",
        bestbuyCompliance: getStatus(bestbuyItem.Status),
        neweggPrice: neweggItem.Newegg_price || "Not Available",
        neweggDeviation: neweggItem.Deviation
          ? parseFloat(neweggItem.Deviation).toFixed(2)
          : "N/A",
        neweggCompliance: getStatus(neweggItem.Status),
      };
    });
    setTotalOffenders(offendersCount);
    return combined;
  }, []);

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Fetch product data from APIs and combine them
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const dellData = await axios.get(`${url}/api/data/dell`);
        const bestbuyData = await axios.get(
          `${url}/api/data/compare/dell-bestbuy`
        );
        const neweggData = await axios.get(
          `${url}/api/data/compare/dell-newegg`
        );

        const combinedData = combineData(
          dellData.data,
          bestbuyData.data,
          neweggData.data
        );
        setProducts(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProducts();
  }, [combineData, url]);

  // Generate a unique ID for each product
  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  return (
    <div className="product-list__wrapper">
      <div className="product-list__details">
        <div className="offenders-widget">
          <div className="offenders-widget__details">
            <h2 className="offenders-widget__details--heading">
              Total Offending Products
            </h2>
            <span className="offenders-widget__details--count">
              {totalOffenders}
            </span>
          </div>
          <img
            className="offenders-widget__icon"
            src={boxIcon}
            alt="cube icon for the total offending products widget"
          />
        </div>
        <div className="product-list__heading">
          <div className="heading__content">
            <h1 className="heading__content--heading">
              Product Pricing Compliance
            </h1>
            <span className="heading__content--date">{currentDate}</span>
          </div>
          <h2 className="product-list__heading--directions">
            Please review the <strong>compliance status</strong> and{" "}
            <strong>price deviations</strong> for each product below.
          </h2>
        </div>
      </div>
      <div className="product-list__table"></div>
      <div className="export-button"></div>
    </div>

    //   <p>Total Offending Products: {totalOffenders}</p>
    //   <table>
    //     <thead>
    //       <tr>
    //         <th>ID</th>
    //         <th>Dell Product Name</th>
    //         <th>MSRP</th>
    //         <th>BestBuy Price</th>
    //         <th>BestBuy Deviation</th>
    //         <th>BestBuy Compliance</th>
    //         <th>Newegg Price</th>
    //         <th>Newegg Deviation</th>
    //         <th>Newegg Compliance</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {products.map((product) => (
    //         <tr key={product.id}>
    //           <td>{product.id}</td>
    //           <td>{product.dellProductName}</td>
    //           <td>{product.msrp}</td>
    //           <td>{product.bestbuyPrice}</td>
    //           <td>{product.bestbuyDeviation}</td>
    //           <td>{product.bestbuyCompliance}</td>
    //           <td>{product.neweggPrice}</td>
    //           <td>{product.neweggDeviation}</td>
    //           <td>{product.neweggCompliance}</td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
  );
};

export default ProductList;
