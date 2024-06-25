import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import boxIcon from "../../assets/icons/box-icon.svg";
import axios from "axios";
import "./ProductList.scss";

// Base Url
const url = process.env.REACT_APP_BASE_URL;

const ProductList = () => {
  const { userId } = useParams();

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
          case "Green":
            return "Compliant";
          case "Yellow":
            return "Needs Attention";
          case "Red":
            return "Non-Compliant";
          default:
            return "Undetermined";
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

  // // Generate a unique short ID for each product
  // const generateShortUUID = () => {
  //   return Math.random().toString(36).substring(2, 8);
  // };

  // const handleExport = async () => {
  //   const zip = new JSZip();

  //   // Create CSV content
  //   const csvContent =
  //     "id,dellProductName,msrp,bestbuyPrice,bestbuyDeviation,bestbuyCompliance,neweggPrice,neweggDeviation,neweggCompliance\n" +
  //     products
  //       .map(
  //         (product) =>
  //           `${product.id},${product.dellProductName},${product.msrp},${product.bestbuyPrice},${product.bestbuyDeviation},${product.bestbuyCompliance},${product.neweggPrice},${product.neweggDeviation},${product.neweggCompliance}`
  //       )
  //       .join("\n");

  //   // Create JSON content
  //   const jsonContent = JSON.stringify(products, null, 2);

  //   // Add files to the zip
  //   zip.file("products.csv", csvContent);
  //   zip.file("products.json", jsonContent);

  //   // Generate the zip file
  //   const content = await zip.generateAsync({ type: "blob" });

  //   // Save the zip file
  //   saveAs(content, "products.zip");
  // };

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
                <td className="product-table__row--item">{product.msrp}</td>
                <td className="product-table__row--item">
                  {product.bestbuyPrice}
                </td>
                <td className="product-table__row--item">
                  {product.bestbuyDeviation}
                </td>
                <td className="product-table__row--item">
                  {product.bestbuyCompliance}
                </td>
                <td className="product-table__row--item">
                  {product.neweggPrice}
                </td>
                <td className="product-table__row--item">
                  {product.neweggDeviation}
                </td>
                <td className="product-table__row--item">
                  {product.neweggCompliance}
                </td>
                <td className="product-table__row--item">
                  {product.dellProductName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="export-container">
        <button className="export-container__button">
          <span className="export-container__button--text">Export</span>
        </button>
      </div>
    </div>
  );
};

export default ProductList;
