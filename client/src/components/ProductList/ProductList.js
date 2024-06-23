import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProductList.scss';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-pl">
      <h1 className="title-pl">Dell Products</h1>
      {products.map((product) => (
        <div className="product-list" key={product.id}>
          <img src={product.image} alt='product-list__image' className="product-list__image" />
          <div className="product-list__info">
            <p className="product-list__info--name">{product.product_name}</p>
            <p className="product-list__info--price">${product.price}</p>
            <p className="product-list__info--location">{product.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;