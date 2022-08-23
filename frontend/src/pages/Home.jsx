// import React from 'react'
import "./home.css";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";

import Preloader from "../components/Preloader";
import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import LandingCarousel from "../components/LandingCarousel";
import Features from "../components/Features";
import dressContext from "../context/dressup-context";
import Error from "../components/Error";

const Home = () => {
  const {
    backendUrl,
    getHottestDresses,
    hotDressesData,
    isFetchingData,
    isError,
    setIsError,
    // isAuthenticated,
  } = useContext(dressContext);

  const carouselOptions = {
    margin: 30,
    responsiveClass: true,
    autoplay: true,
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
    setIsError(false);
    getHottestDresses();
    // console.log(isAuthenticated);
  }, []);

  if (isFetchingData) {
    return <Preloader />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <LandingCarousel />

      <div className="container">
        <div className="hot__right__now text-center">
          <h2>Hottest Dresses</h2>
          <hr className="demarcation" />
          <OwlCarousel className="most__hot__carousel" {...carouselOptions}>
            {hotDressesData.map((dress) => (
              <div key={dress.id}>
                <div className="image__wrapper">
                  <img
                    src={`${backendUrl}${dress.main_image}`}
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
                <div className="dress__info">
                  <p>{dress.dress_name}</p>
                  <h6>${dress.dress_price}.00</h6>
                </div>
              </div>
            ))}
          </OwlCarousel>
        </div>
      </div>
      <Features />
      {/* <h2 className="animate__animated animate__bounce">Test Animation</h2> */}
    </>
  );
};

export default Home;
