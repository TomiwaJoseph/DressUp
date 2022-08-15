// import React from 'react'
import "./about.css";
import aboutUs from "../images/71aa3855-971e-4faf-afae-b907e75e96c8.png";
import Features from "../components/Features";

const About = () => {
  return (
    <>
      <div className="container">
        <h2 className="title__caption">About Us</h2>
        {/* <hr className="underline" /> */}
        <div>
          <hr />
          <h2 className="about__h2">Our Background</h2>
          <hr />
        </div>
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="about__image__container">
              <img className="img-fluid" src={aboutUs} alt="about-us" />
            </div>
          </div>
          <div className="col-md-6 about__text">
            <h5>Who we are & What we do?</h5>
            <p>
              Dress Up is a portfolio of glocal consumer brands that was built
              using React as the frontend library and Django for the RESTApi.
              We're a passionate, creative, entreprenerial bunch who think
              outside the box and we are all about providing a unique shopping
              experience while inspiring and connecting with our customers.
            </p>
            <div className="social__icons">
              <i className="fab fa-github"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-instagram"></i>
            </div>
          </div>
        </div>
        <hr />
        <h2 className="about__h2">Things We Offer</h2>
      </div>
      <Features />
      <div className="container">
        <div>
          <h2 className="about__h2">Happy Partners</h2>
          <hr />
        </div>
        <div className="row happy__partners">
          <div className="col-md-2">
            <div className="partner">
              <i className="fab fa-amazon"></i>
              <p>Amazon</p>
            </div>
          </div>
          <div className="col-md-2">
            <div className="partner">
              <i className="fab fa-teamspeak"></i>
              <p>TeamSpeak</p>
            </div>
          </div>
          <div className="col-md-2">
            <div className="partner">
              <i className="fab fa-opencart"></i>
              <p>OpenCart</p>
            </div>
          </div>
          <div className="col-md-2">
            <div className="partner">
              <i className="fab fa-magento"></i>
              <p>Magento</p>
            </div>
          </div>
          <div className="col-md-2">
            <div className="partner">
              <i className="fab fa-ideal"></i>
              <p>Ideal</p>
            </div>
          </div>
          <div className="col-md-2">
            <div className="partner">
              <i className="fab fa-weibo"></i>
              <p>Weibo</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
