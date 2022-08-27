import "./home.css";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import LandingCarousel from "../components/LandingCarousel";
import Preloader from "../components/Preloader";
import Features from "../components/Features";
import Error from "../components/Error";
import { useContext, useEffect } from "react";
import dressContext from "../context/dress-context";
import { NavLink } from "react-router-dom";

const Home = () => {
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
  const {
    backendUrl,
    fetchingData,
    noInternet,
    hotDressesData,
    getHottestDresses,
  } = useContext(dressContext);

  useEffect(() => {
    getHottestDresses();
  }, []);

  if (fetchingData) {
    return <Preloader />;
  }

  if (noInternet) {
    return <Error />;
  }

  return (
    <>
      <LandingCarousel />
      <div className="container">
        <div className="hot__right__now text-center">
          <h2>Hottest Dresses</h2>
          <hr className="demarcation" />
          {hotDressesData && (
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
          )}
        </div>
      </div>
      <Features />
    </>
  );
};

export default Home;
