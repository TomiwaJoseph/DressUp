// import React from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import "./singleproduct.css";
import { data } from "../data";
import { useEffect, useState } from "react";
import Newsletter from "../components/Newsletter";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import img1 from "../images/all-about-you-slip2.jpg";
import img2 from "../images/charlie-tee-dress5.jpg";
import card from "../images/cards.png";
import Features from "../components/Features";

import the1 from "../images/all-about-you-slip2.jpg";
import the2 from "../images/all-about-you-slip4.jpg";
import the3 from "../images/at-leisure-midi-dress2.jpg";
import the4 from "../images/austyn-one-piece0.jpg";
import the5 from "../images/baobab-isla-maxi-set0.jpg";
import the6 from "../images/bec-&-bridge-stella-mini-dress3.jpg";
import the7 from "../images/charlie-tee-dress5.jpg";

const SingleProduct = () => {
  const carouselOptions = {
    margin: 30,
    responsiveClass: true,
    // autoplay: true,
    autoplayTimeout: 3000,
    loop: true,
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
      1440: {
        items: 5,
      },
    },
  };
  const { slug } = useParams();
  const dress = data.find((dress) => dress.productSlug === slug);
  const [openAccordion, setOpenAccordion] = useState(false);
  const [dressQuantity, setDressQuantity] = useState(1);

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
  const handleAddToCartClick = () => {
    console.log("handle add to cart here");
  };

  if (!dress) {
    return (
      <div className="error__div">
        <h1>An Error Occurred</h1>
        <Link className="single__page-error" to="/shop">
          Go Back To Shop
        </Link>
      </div>
    );
  }

  const { product_name, product_price, productImage } = dress;
  return (
    <>
      <div className="single__dress container mt-5">
        <div className="row">
          <div className="col-md-4 ml-auto">
            <OwlCarousel
              className="owl-theme single__dress_carousel"
              items={1}
              // autoplay={true}
              loop
              // autoheight={false}
              animateOut="fadeOut"
              // dots={true}
            >
              <div>
                <div className="dress__main_image">
                  <img
                    // className="img-fluid"
                    src={productImage}
                    alt={product_name}
                  />
                </div>
              </div>
              <div>
                <div className="dress__main_image">
                  <img
                    // className="img-fluid"
                    src={img1}
                    alt={product_name}
                  />
                </div>
              </div>
              <div>
                <div className="dress__main_image">
                  <img
                    // className="img-fluid"
                    src={img2}
                    alt={product_name}
                  />
                </div>
              </div>
            </OwlCarousel>
          </div>
          <div className="col-md-5 dress__details mr-auto">
            <h3>{product_name}</h3>
            <span className="product__price">{product_price}</span>
            <div className="category__title">New Dresses</div>
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
              <button onClick={() => handleAddToCartClick()} className="btn">
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
        <OwlCarousel className="most__hot__carousel" {...carouselOptions}>
          <div>
            <div className="image__wrapper">
              <img src={the1} alt="" />
              <div className="dress__cta">
                <NavLink to="/" className="btn">
                  View Dress
                </NavLink>
                <div className="utilities">
                  <i className="fas fa-shopping-bag"></i>
                  <i className="fas fa-heart"></i>
                </div>
              </div>
            </div>
            <div className="dress__info">
              <p>Bec & Bridge Stella Mini Dress</p>
              <h6>$180.00</h6>
            </div>
          </div>
          <div>
            <img src={the2} alt="" />
            <div className="dress__info">
              <p>Sau Lee Juliana Jumpsuit</p>
              <h6>$845.00</h6>
            </div>
          </div>
          <div>
            <img src={the3} alt="" />
          </div>
          <div>
            <img src={the4} alt="" />
          </div>
          <div>
            <img src={the5} alt="" />
          </div>
          <div>
            <img src={the6} alt="" />
          </div>
          <div>
            <img src={the7} alt="" />
          </div>
        </OwlCarousel>
      </div>
      <Features />
      <Newsletter />
    </>
  );
};

export default SingleProduct;
