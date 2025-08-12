import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      if (componentMounted) {
        const products = await response.clone().json();
        const productsWithExtra = products.map((p) => ({
          ...p,
          variants: ["Small", "Medium", "Large"],
          inStock: Math.random() > 0.4
        }));
        setData(productsWithExtra);
        setFilter(productsWithExtra);
        setLoading(false);
      }
      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  const Loading = () => (
    <>
      {[...Array(6)].map((_, i) => (
        <div className="col-md-4 col-sm-6 col-12 mb-4" key={i}>
          <Skeleton height={400} />
        </div>
      ))}
    </>
  );

  const filterProduct = (cat) => {
    if (cat === "all") {
      setFilter(data);
    } else {
      const updatedList = data.filter((item) => item.category === cat);
      setFilter(updatedList);
    }
  };

  const ShowProducts = () => (
    <>
      {/* Category Buttons */}
      <div className="buttons text-center py-4">
        {["all", "men's clothing", "women's clothing", "jewelery", "electronics"].map((cat) => (
          <button
            key={cat}
            className="btn btn-outline-primary btn-sm m-2 px-3 rounded-pill shadow-sm"
            style={{
              borderWidth: "2px",
              fontWeight: "500",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#0d6efd";
              e.target.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#0d6efd";
            }}
            onClick={() => filterProduct(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Product Cards */}
      {filter.map((product) => (
        <div key={product.id} className="col-md-4 col-sm-6 col-12 mb-4 d-flex">
          <div
            className="card border-0 shadow-sm rounded-4 text-center h-100 w-100"
            style={{
              transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
            }}
          >
            <img
              className="card-img-top p-3 rounded-4 bg-light"
              src={product.image}
              alt={product.title}
              height={250}
              style={{ objectFit: "contain" }}
            />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title fw-semibold text-dark">
                {product.title.length > 20
                  ? product.title.substring(0, 20) + "..."
                  : product.title}
              </h5>
              <p className="card-text text-muted small">
                {product.description.substring(0, 60)}...
              </p>
              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item fw-bold text-primary border-0">
                  ${product.price.toFixed(2)}
                </li>
              </ul>

              {/* Variant Dropdown */}
              {product.variants?.length > 0 && (
                <select className="form-select mb-3 rounded-pill" defaultValue="">
                  <option value="" disabled>
                    Select variant
                  </option>
                  {product.variants.map((variant, idx) => (
                    <option key={idx} value={variant}>
                      {variant}
                    </option>
                  ))}
                </select>
              )}

              {/* Buttons */}
              <div className="mt-auto">
                <Link
                  to={`/product/${product.id}`}
                  className="btn btn-outline-primary btn-sm m-1 px-3 rounded-pill shadow-sm"
                >
                  View Details
                </Link>
                {product.inStock ? (
                  <button
                    className="btn btn-primary btn-sm m-1 px-3 rounded-pill shadow-sm"
                    onClick={() => {
                      toast.success("Added to cart");
                      addProduct(product);
                    }}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary btn-sm m-1 px-3 rounded-pill shadow-sm"
                    disabled
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="container my-4 py-3">
      <div className="row">
        <div className="col-12 text-center mb-3">
          <h2 className="display-6 fw-bold text-primary">Latest Products</h2>
          <hr className="w-25 mx-auto border-primary" />
        </div>
      </div>
      <div className="row justify-content-center">
        {loading ? <Loading /> : <ShowProducts />}
      </div>
    </div>
  );
};

export default Products;
