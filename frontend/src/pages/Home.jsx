// import React from 'react'
import "./home.css";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
// import "owl.carousel/dist/assets/owl.theme.default.css";
import the1 from "../images/all-about-you-slip2.jpg";
import the2 from "../images/all-about-you-slip4.jpg";
import the3 from "../images/at-leisure-midi-dress2.jpg";
import the4 from "../images/austyn-one-piece0.jpg";
import the5 from "../images/baobab-isla-maxi-set0.jpg";
import the6 from "../images/bec-&-bridge-stella-mini-dress3.jpg";
import the7 from "../images/charlie-tee-dress5.jpg";
// import "./owl.css";

import Preloader from "../components/Preloader";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import LandingCarousel from "../components/LandingCarousel";
import Features from "../components/Features";

const Home = () => {
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
  useEffect(() => {
    // console.log(document.getElementsByClassName("owl-carousel")[0]);
    // document.getElementsByClassName("owl-carousel")[0].owlCarousel();
  });
  return (
    <>
      <LandingCarousel />

      <div className="container">
        <div className="hot__right__now text-center">
          <h2>Hottest Dresses</h2>
          <hr className="demarcation" />
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
      </div>
      <Features />
      {/* <h2 className="animate__animated animate__bounce">Test Animation</h2> */}
    </>
  );
};

export default Home;
