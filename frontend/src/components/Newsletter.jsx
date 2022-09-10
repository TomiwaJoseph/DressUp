import { addToNewsletter } from "../redux/actions/fetchers";
import "./newsletter.css";

const Newsletter = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    let email = data.get("email");
    let validate = validateEmail(email);
    if (validate) {
      addToNewsletter(email);
    } else {
      addToNewsletter("badEmail");
    }
  };
  const validateEmail = (email) => {
    if (
      !/^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9/-]+\.)+[A-Za-z]{2,4}$/i.test(email)
    ) {
      return false;
    }
    return true;
  };
  return (
    <div className="newsletter">
      <div className="container">
        <h2>Subscribe on DRESS UP now!</h2>
        <hr />
        <p>
          Receive email notification on latest designs and dresses as well as
          discount prices and promo codes.
        </p>
        <div className="col-md-8 offset-md-2">
          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
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
      </div>
    </div>
  );
};

export default Newsletter;
