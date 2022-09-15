import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  addToCart,
  addToWishlist,
  fetchRelatedDress,
  fetchSingleDress,
} from "../redux/actions/fetchers";
import {
  removeSelectedProduct,
  setBadRequest,
  setRelatedDress,
} from "../redux/actions/dressActions";
import Preloader from "../components/Preloader";
import Error from "../components/Error";
import "./singleproduct.css";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import Newsletter from "../components/Newsletter";
import Features from "../components/Features";
import Accordion from "../components/Accordion";
import ErrorPage from "./ErrorPage";

const SingleProduct = () => {
  const storeContext = useSelector((state) => state.dress);
  const {
    singleDressData,
    backendUrl,
    badRequest,
    noInternet,
    relatedDressData,
    isAuthenticated,
  } = storeContext;
  const { name, id, price, category, all_dress_images } = singleDressData;
  const { dressSlug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dressQuantity, setDressQuantity] = useState(1);
  const carouselOptions = {
    margin: 30,
    responsiveClass: true,
    // autoplay: true,
    autoplayTimeout: 3000,
    // loop: true,
    // rewind: true,
    nav: true,
    dots: false,
    responsive: {
      0: {
        items: 1,
      },
      425: {
        items: 2,
      },
      475: {
        items: 2,
      },
      768: {
        items: 3,
      },
      1024: {
        items: 4,
      },
      // 1440: {
      //   items: 5,
      // },
    },
  };

  const handleWishlistClick = (id) => {
    if (isAuthenticated) {
      addToWishlist(id);
    } else {
      navigate("/login", { state: { id: id, action: "wishlist" } });
    }
  };

  const handleQuantityClick = (action) => {
    if (action === "minus" && dressQuantity !== 1) {
      setDressQuantity(dressQuantity - 1);
    } else if (action === "plus" && dressQuantity < 5) {
      setDressQuantity(dressQuantity + 1);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchSingleDress(dressSlug);
    fetchRelatedDress(dressSlug);
    return () => {
      dispatch(removeSelectedProduct());
      dispatch(setBadRequest(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dressSlug]);

  useEffect(() => {
    dispatch(setRelatedDress(relatedDressData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relatedDressData]);

  if (badRequest) {
    return <ErrorPage />;
  }
  if (noInternet) {
    return <Error />;
  }

  return (
    <>
      <div className="single__dress container mt-5">
        {Object.keys(singleDressData).length === 0 ? (
          <Preloader />
        ) : (
          <>
            <div className="row">
              <div className="col-md-6 col-lg-5 ml-auto">
                {all_dress_images && (
                  <OwlCarousel
                    className="owl-theme single__dress_carousel"
                    items={1}
                    loop
                    animateOut="fadeOut"
                  >
                    {all_dress_images.map((url, index) => (
                      <div key={index}>
                        <div className="dress__main_image">
                          <img src={`${backendUrl}${url}`} alt={name} />
                        </div>
                      </div>
                    ))}
                  </OwlCarousel>
                )}
              </div>
              <div className="col-md-5 dress__details mr-auto">
                <h3>{name}</h3>
                <span className="product__price">${price}</span>
                <div className="category__title">{category}</div>
                <hr />
                <div className="quantity__cart">
                  <div className="cart__increment">
                    <i
                      onClick={() => handleQuantityClick("minus")}
                      className="fas fa-minus"
                    ></i>
                    <p>{dressQuantity}</p>
                    <i
                      onClick={() => handleQuantityClick("plus")}
                      className="fas fa-plus"
                    ></i>
                  </div>
                  <button
                    onClick={() => addToCart(id, dressQuantity)}
                    className="btn"
                  >
                    Add to Cart
                  </button>
                </div>
                <Accordion />
                <div className="social__media-icons">
                  <i className="fab fa-twitter"></i>
                  <i className="fab fa-pinterest"></i>
                  <i className="fab fa-instagram"></i>
                  <i className="fab fa-dribbble"></i>
                  <i className="fab fa-facebook"></i>
                  <i className="fab fa-youtube"></i>
                </div>
              </div>
            </div>
            <hr />
            <h2 className="text-center">Related Dresses</h2>
          </>
        )}
        {relatedDressData && (
          <OwlCarousel className="most__hot__carousel" {...carouselOptions}>
            {relatedDressData.map((dress, index) => (
              <div key={index}>
                <div className="image__wrapper">
                  <img
                    src={`${backendUrl}${dress.main_image}`}
                    className="img-fluid"
                    alt={dress.name}
                  />
                  <div className="dress__cta">
                    <NavLink to={`/shop/dress/${dress.slug}`} className="btn">
                      View Dress
                    </NavLink>
                    <div className="utilities">
                      <i
                        onClick={() => addToCart(dress.id, 1)}
                        className="fas fa-shopping-bag"
                      ></i>
                      <i
                        onClick={() => handleWishlistClick(dress.id)}
                        className="fas fa-heart"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </OwlCarousel>
        )}
      </div>
      <Features />
      <div className="container">
        <Newsletter />
      </div>
    </>
  );
};

export default SingleProduct;
