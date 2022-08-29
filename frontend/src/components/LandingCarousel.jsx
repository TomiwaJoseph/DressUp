import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "./landingcarousel.css";
import img1 from "../images/pexels-andrea-piacquadio-972995.jpg";
import img2 from "../images/2.jpg";
import img3 from "../images/4.jpg";
import { NavLink } from "react-router-dom";

const LandingCarousel = () => {
  return (
    <div>
      <OwlCarousel
        className="owl-theme landing__carousel"
        items={1}
        autoplay={true}
        loop
        animateOut="fadeOut"
        lazyLoad={false}
        // dots={true}
      >
        <div>
          <div className="image__container">
            <img src={img1} alt="" />
          </div>
          <div className="carousel__captions">
            <h5 className="animate__animated animate__bounceInDown">
              Best Offer
            </h5>
            <h1 className="animate__animated animate__slideInUp">Top Rated</h1>
            <NavLink to="/" className="btn animate__animated animate__flipInY">
              View Category
            </NavLink>
          </div>
        </div>
        <div>
          <div className="image__container">
            <img src={img2} alt="" />
          </div>
          <div className="carousel__captions">
            <h5>Flash Deals</h5>
            <h1>New Dresses</h1>
            <NavLink to="/" className="btn">
              View Category
            </NavLink>
          </div>
        </div>
        <div>
          <div className="image__container">
            <img src={img3} alt="" />
          </div>
          <div className="carousel__captions">
            <h5>New Arrivals</h5>
            <h1>Mini Dresses</h1>
            <NavLink to="/" className="btn">
              View Category
            </NavLink>
          </div>
        </div>
      </OwlCarousel>
    </div>
  );
};

export default LandingCarousel;
