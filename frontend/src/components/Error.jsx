// import React from 'react'
import errorImg from "../images/error.png";

const Error = () => {
  return (
    <div className="error__div">
      <div className="error_image_wrapper">
        <img src={errorImg} alt="server-error" className="img-fluid" />
      </div>
      <h1>An error occurred...</h1>
      <p>Check your internet connection and try again.</p>
    </div>
  );
};

export default Error;
