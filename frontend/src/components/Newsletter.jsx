// import React from 'react'
import "./newsletter.css";

const Newsletter = () => {
  return (
    <div className="newsletter">
      <div className="container">
        <h2>Subscribe on DRESSUP now!</h2>
        <hr />
        <p>
          Receive email notification on latest designs and dresses as well as
          discount prices and promo codes.
        </p>
        <div className="col-md-8 offset-md-2">
          <form className="newsletter-form">
            <div className="row">
              <div className="col-lg-7">
                <div className="form-group">
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="Email Address*"
                  />
                </div>
              </div>
              <div className="col-lg-5">
                <button className="btn" type="submit" id="newsletter_btn">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* <form className="newsletter-form">
          <div className="form-group">
            <input
              required
              type="email"
              name="email"
              placeholder="Email Address*"
            />
          </div>
          <button className="btn" type="submit" id="newsletter_btn">
            Submit
          </button>
        </form> */}
      </div>
    </div>
  );
};

export default Newsletter;
