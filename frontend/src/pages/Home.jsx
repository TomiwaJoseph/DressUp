import "./home.css";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import LandingCarousel from "../components/LandingCarousel";
import Preloader from "../components/Preloader";
import Features from "../components/Features";
import Error from "../components/Error";
import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  addToCart,
  addToWishlist,
  fetchHottestDresses,
} from "../redux/actions/fetchers";

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
  const navigate = useNavigate();
  const storeContext = useSelector((state) => state.dress);
  const {
    backendUrl,
    fetchingData,
    noInternet,
    hotDressesData,
    isAuthenticated,
  } = storeContext;

  const handleWishlistClick = (id) => {
    if (isAuthenticated) {
      addToWishlist(id);
    } else {
      navigate("/login", { state: { id: id, action: "wishlist" } });
    }
  };

  useEffect(() => {
    fetchHottestDresses();
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
          <hr className="text-center" />
          {hotDressesData && (
            <OwlCarousel className="most__hot__carousel" {...carouselOptions}>
              {hotDressesData.map((dress) => (
                <div key={dress.id}>
                  <div className="image__wrapper">
                    <img
                      src={`${backendUrl}${dress.main_image}`}
                      alt={dress.name}
                    />
                    <div id="slide">
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
                  <NavLink
                    to={`/shop/dress/${dress.slug}`}
                    className="single-dress-link"
                  >
                    <div className="dress__info">
                      <p>{dress.name}</p>
                      <h6>${dress.price}</h6>
                    </div>
                  </NavLink>
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
