import React, { useEffect, useState, useCallback } from "react";
import boxIcon from "../../assets/icons/box-icon.svg";
import axios from "axios";
import { saveAs } from "file-saver";
import { unparse } from "papaparse";
import "./ProductList.scss";

// Base Url
const url = process.env.REACT_APP_BASE_URL;

const ProductList = () => {

  // State to store product data and total offenders
  const [products, setProducts] = useState([]);
  const [totalOffenders, setTotalOffenders] = useState(0);

  // Function to generate a unique two-digit numerical ID starting from 01
  const generateShortUUID = useCallback(() => {
    let currentId = 1;
    return () => {
      const id = (currentId % 100).toString().padStart(2, '0');
      currentId++;
      return id;
    };
  }, []);

  // Function to get the status based on deviation
  const getStatus = (deviation) => {
    if (deviation >= 0) {
      return "Compliant";
    } else if (deviation < 0 && deviation >= -10) {
      return "Needs Attention";
    } else if (deviation < -10) {
      return "Non-Compliant";
    }
    return "Undetermined";
  };

  // Function to combine data from Dell, BestBuy, and Newegg
  const combineData = useCallback((dell, bestbuy, newegg) => {
    let offendersCount = 0;
    const generateId = generateShortUUID();
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

      return {
        id: generateId(),
        dellProductName: dellItem.Dell_product,
        msrp: dellItem.Dell_price,
        bestbuyPrice: bestbuyItem.Bestbuy_price || "Not Available",
        bestbuyDeviation: bestbuyItem.Deviation
          ? parseFloat(bestbuyItem.Deviation).toFixed(2)
          : "N/A",
        bestbuyCompliance: getStatus(parseFloat(bestbuyItem.Deviation)),
        neweggPrice: neweggItem.Newegg_price || "Not Available",
        neweggDeviation: neweggItem.Deviation
          ? parseFloat(neweggItem.Deviation).toFixed(2)
          : "N/A",
        neweggCompliance: getStatus(parseFloat(neweggItem.Deviation)),
      };
    });
    setTotalOffenders(offendersCount);
    console.log('Combined Data:', combined); // Add console log for debugging
    return combined.sort((a, b) => a.id - b.id);
  }, [generateShortUUID]);

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
  }, [combineData]);

  // Function to handle exporting the data as CSV
  const handleExport = () => {
    if (products.length === 0) {
      console.warn("No products to export.");
      return;
    }

    console.log('Exporting Data:', products); // Add console log for exporting data

    const fields = [
      "id",
      "dellProductName",
      "msrp",
      "bestbuyPrice",
      "bestbuyDeviation",
      "bestbuyCompliance",
      "neweggPrice",
      "neweggDeviation",
      "neweggCompliance",
    ];

    const csvData = unparse({
      fields,
      data: products.map(product => ({
        id: product.id,
        dellProductName: product.dellProductName,
        msrp: product.msrp,
        bestbuyPrice: product.bestbuyPrice,
        bestbuyDeviation: product.bestbuyDeviation,
        bestbuyCompliance: product.bestbuyCompliance,
        neweggPrice: product.neweggPrice,
        neweggDeviation: product.neweggDeviation,
        neweggCompliance: product.neweggCompliance,
      })),
    });

    console.log('CSV Data:', csvData); // Add console log for CSV data

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "product_pricing_compliance.csv");
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
      <div className="product-list__table">
        <table className="product-table">
          <thead className="product-table__head">
            <tr className="product-table__column">
              <th className="product-table__column--item product-column__id">
                ID
              </th>
              <th className="product-table__column--item product-column__name">
                Dell Product Name
              </th>
              <th className="product-table__column--item product-column__msrp">
                MSRP
              </th>
              <th className="product-table__column--item product-column__bbp">
                BestBuy Price
              </th>
              <th className="product-table__column--item product-column__bbd">
                Deviation
              </th>
              <th className="product-table__column--item product-column__bbc">
                Compliance
              </th>
              <th className="product-table__column--item product-column__nep">
                Newegg Price
              </th>
              <th className="product-table__column--item product-column__ned">
                Deviation
              </th>
              <th className="product-table__column--item product-column__nec">
                Compliance
              </th>
            </tr>
          </thead>
          <tbody className="product-table__body">
            {products.map((product) => (
              <tr className="product-table__row" key={product.id}>
                <td className="product-table__row--item">{product.id}</td>
                <td className="product-table__row--item">{product.dellProductName}</td>
                <td className="product-table__row--item">{product.msrp}</td>
                <td className="product-table__row--item">{product.bestbuyPrice}</td>
                <td className="product-table__row--item">{product.bestbuyDeviation}</td>
                <td className="product-table__row--item">{product.bestbuyCompliance}</td>
                <td className="product-table__row--item">{product.neweggPrice}</td>
                <td className="product-table__row--item">{product.neweggDeviation}</td>
                <td className="product-table__row--item">{product.neweggCompliance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="export-container">
        <button className="export-container__button" onClick={handleExport}>
          <span className="export-container__button--text">Export</span>
        </button>
      </div>
    </div>
  );
};

export default ProductList;