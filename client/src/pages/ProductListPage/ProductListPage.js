import Header from "../../components/Header/Header";
import SideNavigation from "../../components/SideNavigation/SideNavigation";
import ProductList from "../../components/ProductList/ProductList";
import "./ProductListPage.scss";

const ProductListPage = () => {
  return (
    <div className="main-page">
      <div className="main-page__nav">
        <SideNavigation />
      </div>
      <main className="main-page__body">
        <div className="header-container">
          <Header />
        </div>
        <section className="product-list">
          <div className="product-list__container">
            <ProductList />
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductListPage;
