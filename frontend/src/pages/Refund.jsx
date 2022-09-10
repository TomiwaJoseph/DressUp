import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { requestRefund } from "../redux/actions/fetchers";
import "./refund.css";

const Refund = () => {
  const storeContext = useSelector((state) => state.dress);
  const { isAuthenticated } = storeContext;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const handleRefundSubmit = (e) => {
    e.preventDefault();
    // setSendButtonClicked(true);
    const data = new FormData(e.target);
    let ref_code = data.get("refCode");
    let reason = data.get("message");
    requestRefund([ref_code, reason]);
    e.target.reset();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return navigate("/login", { state: { previousPath: pathname } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div className="container mt-5 refund">
      <h2 className="title__caption">Request Refund</h2>
      <hr className="underline" />
      <div className="row">
        <div className="col-md-5 mr-auto ml-auto">
          <div className="refund__container">
            <form className="refund-form" onSubmit={handleRefundSubmit}>
              <div>
                <label htmlFor="refCode">Ref Code</label>
                <input
                  className="form-control"
                  name="refCode"
                  required
                  type="text"
                />
              </div>
              <div>
                <label htmlFor="message">Reason for request</label>
                <textarea
                  className="form-control"
                  name="message"
                  id="message"
                  rows="7"
                  required
                  placeholder="Your message..."
                ></textarea>
              </div>
              <button type="submit" className="btn">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Refund;
