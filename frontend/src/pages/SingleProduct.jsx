// import React from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import "./singleproduct.css";
import { useContext, useEffect, useState } from "react";
import Newsletter from "../components/Newsletter";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import card from "../images/cards.png";
import Features from "../components/Features";
import dressContext from "../context/dressup-context";
import Preloader from "../components/Preloader";

const SingleProduct = () => {
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
  const { dressSlug } = useParams();
  const {
    isFetchingData,
    backendUrl,
    isError,
    getSingleDress,
    singleDressData,
    getRelatedDress,
    relatedDressData,
    addToCart,
  } = useContext(dressContext);
  const [openAccordion, setOpenAccordion] = useState(false);
  const [dressQuantity, setDressQuantity] = useState(1);
  const [dataToRender, setDataToRender] = useState({
    name: null,
    category: null,
    price: null,
    images: [],
  });

  const handleAccordionClick = (id) => {
    if (openAccordion === id) {
      return setOpenAccordion(null);
    }
    setOpenAccordion(id);
  };
  const handleQuantityClick = (action) => {
    if (action === "minus" && dressQuantity !== 1) {
      setDressQuantity(dressQuantity - 1);
    } else if (action === "plus" && dressQuantity < 5) {
      setDressQuantity(dressQuantity + 1);
    }
  };
  const { id, name, category, price, all_dress_images } = singleDressData;

  useEffect(() => {
    getSingleDress(dressSlug);
  }, [dressSlug]);

  useEffect(() => {
    setDataToRender({
      id: id,
      name: name,
      category: category,
      price: price,
      images: all_dress_images,
    });
    getRelatedDress(dressSlug);
  }, [singleDressData]);

  const handleAddToCartClick = (id, name, price, main_image) => {
    addToCart(id, name, price, dressQuantity, main_image);
  };

  if (isFetchingData) {
    return <Preloader />;
  }

  if (isError) {
    return (
      <div className="error__div">
        <h1>An error occurred...</h1>
        <p>Check your internet connection and try again.</p>
      </div>
    );
  }

  return (
    <>
      <div className="single__dress container mt-5">
        <div className="row">
          <div className="col-md-4 ml-auto">
            {dataToRender.images && (
              <OwlCarousel
                className="owl-theme single__dress_carousel"
                items={1}
                // autoplay={true}
                // loop
                animateOut="fadeOut"
              >
                {dataToRender.images.map((url, index) => (
                  <div key={index}>
                    <div className="dress__main_image">
                      <img
                        src={`${backendUrl}${url}`}
                        alt={dataToRender.name}
                      />
                    </div>
                  </div>
                ))}
              </OwlCarousel>
            )}
          </div>
          <div className="col-md-5 dress__details mr-auto">
            <h3>{dataToRender.name}</h3>
            <span className="product__price">${dataToRender.price}.00</span>
            <div className="category__title">{dataToRender.category}</div>
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
                onClick={() =>
                  handleAddToCartClick(
                    dataToRender.id,
                    dataToRender.name,
                    dataToRender.price,
                    dataToRender.images[0]
                  )
                }
                className="btn"
              >
                Add to Cart
              </button>
            </div>
            <div id="accordion" className="accordion-area">
              <div className="panel">
                <div
                  className="panel-header"
                  data-toggle="collapse"
                  data-target="#collapse1"
                  aria-expanded="false"
                  aria-controls="collapse1"
                  id="headingOne"
                  onClick={() => handleAccordionClick("headingOne")}
                >
                  <button className="panel-link active">information</button>
                  <i
                    className={
                      openAccordion === "headingOne"
                        ? "fas fa-angle-up"
                        : "fas fa-angle-down"
                    }
                  ></i>
                </div>
                <div
                  id="collapse1"
                  className="collapse"
                  aria-labelledby="headingOne"
                  data-parent="#accordion"
                >
                  <div className="panel-body">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Proin pharetra tempor so dales. Phasellus sagittis auctor
                      gravida. Integer bibendum sodales arcu id te mpus. Ut
                      consectetur lacus leo, non scelerisque nulla euismod nec.
                    </p>
                    <p>Approx length 66cm/26" (Based on a UK size 8 sample)</p>
                    <p>Mixed fibres</p>
                    <p>
                      The Model wears a UK size 8/ EU size 36/ US size 4 and her
                      height is 5'8"
                    </p>
                  </div>
                </div>
              </div>
              <div className="panel">
                <div
                  className="panel-header"
                  id="headingTwo"
                  data-toggle="collapse"
                  data-target="#collapse2"
                  aria-expanded="false"
                  aria-controls="collapse2"
                  onClick={() => handleAccordionClick("headingTwo")}
                >
                  <button className="panel-link">care details </button>
                  <i
                    className={
                      openAccordion === "headingTwo"
                        ? "fas fa-angle-up"
                        : "fas fa-angle-down"
                    }
                  ></i>
                </div>
                <div
                  id="collapse2"
                  className="collapse"
                  aria-labelledby="headingTwo"
                  data-parent="#accordion"
                >
                  <div className="panel-body">
                    <img src={card} alt="" />
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Proin pharetra tempor so dales. Phasellus sagittis auctor
                      gravida. Integer bibendum sodales arcu id te mpus. Ut
                      consectetur lacus leo, non scelerisque nulla euismod nec.
                    </p>
                  </div>
                </div>
              </div>
              <div className="panel">
                <div
                  className="panel-header"
                  id="headingThree"
                  data-toggle="collapse"
                  data-target="#collapse3"
                  aria-expanded="false"
                  aria-controls="collapse3"
                  onClick={() => handleAccordionClick("headingThree")}
                >
                  <button className="panel-link">shipping & Returns</button>
                  <i
                    className={
                      openAccordion === "headingThree"
                        ? "fas fa-angle-up"
                        : "fas fa-angle-down"
                    }
                  ></i>
                </div>
                <div
                  id="collapse3"
                  className="collapse"
                  aria-labelledby="headingThree"
                  data-parent="#accordion"
                >
                  <div className="panel-body">
                    <h4>7 Days Returns</h4>
                    <p>
                      Cash on Delivery Available
                      <br />
                      Home Delivery <span>3 - 4 days</span>
                    </p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Proin pharetra tempor so dales. Phasellus sagittis auctor
                      gravida. Integer bibendum sodales arcu id te mpus. Ut
                      consectetur lacus leo, non scelerisque nulla euismod nec.
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
        {relatedDressData && (
          <OwlCarousel className="most__hot__carousel" {...carouselOptions}>
            {relatedDressData.map((dress, index) => (
              <div key={index}>
                <div className="image__wrapper">
                  {/* <img src={the1} alt={dress.name} /> */}
                  <img
                    src={`${backendUrl}${dress.main_image}`}
                    // src={dress.productImage}
                    className="img-fluid"
                    alt={dress.name}
                  />
                  <div className="dress__cta">
                    <NavLink to={`/shop/dress/${dress.slug}`} className="btn">
                      View Dress
                    </NavLink>
                    <div className="utilities">
                      <i className="fas fa-shopping-bag"></i>
                      <i className="fas fa-heart"></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </OwlCarousel>
        )}
      </div>
      <Features />
      <Newsletter />
    </>
  );
};

export default SingleProduct;
