import "./ProductList.scss";

function ProductList(props) {
    
    return(
        <>
            <div className="container-pl">
                <h1 className="title-pl">Dell Products</h1>

                {props.productList.map((product) => {

                    return (
                        <div className="product-list" /* key={unique_identifier / product.id} */ >
                            <img src={product.image} alt='product-list__image' className="product-list__image"/>
                            <div className="product-list__info">
                                <p className="product-list__info--name">{product.name}</p>
                                <p className="product-list__info--price">{product.price}</p>
                                <p className="product-list__info--location">{product.location}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default ProductList;