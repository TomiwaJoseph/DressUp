import "./features.css";

const Features = () => {
  return (
    <div className="container">
      <hr className="mb-4" />
      <div className="row">
        <div className="col-6 col-sm-6 col-md-3 col-lg-3">
          <div className="item text-center">
            <i className="fas fa-award"></i>
            <h3>Award-winning</h3>
            <p>designs</p>
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-3 col-lg-3">
          <div className="item text-center">
            <i className="fas fa-star"></i>
            <h3>Low price</h3>
            <p>guarantee</p>
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-3 col-lg-3">
          <div className="item text-center">
            <i className="fas fa-recycle"></i>
            <h3>Full refund</h3>
            <p>guarantee</p>
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-3 col-lg-3">
          <div className="item text-center">
            <i className="fas fa-phone-alt"></i>
            <h3>24/7 free</h3>
            <p>support</p>
          </div>
        </div>
      </div>
      <hr className="mb-4" />
    </div>
  );
};

export default Features;
