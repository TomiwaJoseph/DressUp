// import React from "react";
import "./contact.css";
import contactImg from "../images/contact-us2.png";
import Newsletter from "../components/Newsletter";
import dressContext from "../context/dressup-context";
import { useContext } from "react";

const Contact = () => {
  const { isAuthenticated } = useContext(dressContext);
  console.log(isAuthenticated);
  return (
    <>
      <div className="container">
        <h2 className="title__caption">Contact Us</h2>
        <hr className="underline" />
        <div className="row contact__info">
          <div className="col-md-6">
            <div className="contact__image__container">
              <img
                className="img-fluid"
                src={contactImg}
                alt="contact-visual"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <h2 className="contact__h2">Send us a message</h2>
              <hr />
            </div>
            <form className="contact-form">
              <div className="row">
                <div className="col-12">
                  <input
                    type="text"
                    name="name"
                    required
                    className="form-control"
                    placeholder="Your Name"
                  />
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="email"
                    required
                    className="form-control"
                    placeholder="Your Email"
                  />
                </div>
                <div className="col-12">
                  <textarea
                    className="form-control"
                    name="message"
                    id="message"
                    // cols="30"
                    rows="7"
                    required
                    placeholder="Your Message"
                  ></textarea>
                </div>
                <div className="col-12">
                  <button type="submit" className="btn">
                    Send Message
                  </button>
                </div>
              </div>
            </form>
          </div>
          {/* <div className="col-md-6">
          <div>
            <h2 className="contact__h2">Get in touch</h2>
            <hr />
          </div>
          <div className="row">
            <div className="col-6">
              <div className="contact__card">
                <i className="fas fa-envelope"></i>
                <p>Email</p>
                <a href="mailto:tomiwajoseph88@gmail.com">dressup@gmail.com</a>
              </div>
            </div>
            <div className="col-6">
              <div className="contact__card">
                <i className="fab fa-whatsapp"></i>
                <p>Whatsapp</p>
                <a href="+234-8115812801">+234 811 5812 801</a>
              </div>
            </div>
          </div>
          <div className="social__icons">
            <i className="fab fa-github"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-instagram"></i>
          </div>
        </div> */}
        </div>
        <hr />
      </div>
      <Newsletter />
    </>
  );
};

export default Contact;
