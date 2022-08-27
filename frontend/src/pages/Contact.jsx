// import React from "react";
import "./contact.css";
import contactImg from "../images/contact-us2.png";
import Newsletter from "../components/Newsletter";

const Contact = () => {
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
        </div>
        <hr />
      </div>
      <Newsletter />
    </>
  );
};

export default Contact;
