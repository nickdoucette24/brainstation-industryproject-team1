import "./App.scss";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import CsvToJsonConverter from './components/CsvToJsonConverter/CsvToJsonConverter';

// Base URL for API calls
const baseUrl = process.env.REACT_APP_BASE_URL;

// Axios instance with a base URL
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

function ProductList() {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/products'); // Use axios instance for API call
        setProductList(response.data); // Update state with fetched product list
      } catch (error) {
        console.error('Error fetching product list:', error); // Log error if request fails
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {productList.map(product => (
          <li key={product.id}>{product.name}</li> // Render each product name
        ))}
      </ul>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams(); // Get product ID from URL parameters
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`); // Fetch product details by ID
        setProduct(response.data); // Update state with fetched product details
      } catch (error) {
        console.error('Error fetching product details:', error); // Log error if request fails
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <div>
      {product ? (
        <>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
        </>
      ) : (
        <p>Loading...</p> // Show loading message while fetching data
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/convert" element={<CsvToJsonConverter baseURL={baseUrl} />} /> {/* Pass baseURL as prop */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;