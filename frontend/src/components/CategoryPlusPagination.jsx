import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./categorypluspagination.css";

const renderData = (data) => {
  return (
    <>
      {data.map((dress) => (
        <div key={dress.product_name} className="col-lg-3 col-md-4 col-sm-6">
          <div>
            <div className="image__wrapper">
              <img
                src={dress.productImage}
                className="img-fluid"
                alt={dress.product_name}
              />
              <div className="dress__cta">
                <NavLink
                  to={`/shop/dress/${dress.productSlug}`}
                  className="btn"
                >
                  View Dress
                </NavLink>
                <div className="utilities">
                  <i className="fas fa-shopping-bag"></i>
                  <i className="fas fa-heart"></i>
                </div>
              </div>
            </div>
            <div className="dress__info">
              <p>{dress.product_name}</p>
              <h6>{dress.product_price}</h6>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

const Pagination = ({ categoryData }) => {
  const dataToRender = categoryData;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const pageNumberLimit = 3;
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(3);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const pages = [];
  for (let i = 1; i <= Math.ceil(dataToRender.length / itemsPerPage); i++) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataToRender.slice(indexOfFirstItem, indexOfLastItem);

  const renderPageNumbers = pages.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <li
          id={number}
          key={number}
          onClick={handleClick}
          className={currentPage === number ? "active" : null}
        >
          {number}
        </li>
      );
    } else {
      return null;
    }
  });

  const handleNextBtn = () => {
    setCurrentPage(currentPage + 1);
    if (currentPage + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const handlePrevBtn = () => {
    setCurrentPage(currentPage - 1);
    if ((currentPage - 1) % pageNumberLimit === 0) {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row my-4">{renderData(currentItems)}</div>
        <hr />
        {pages.length > 1 ? (
          <ul className="pageNumbers">
            <li className="btn__cover__prev">
              <button
                onClick={handlePrevBtn}
                disabled={currentPage === pages[0] ? true : false}
              >
                Prev
              </button>
            </li>
            {/* {pageDecrementBtn} */}
            {renderPageNumbers}
            {/* {pageIncrementBtn} */}
            <li className="btn__cover__next">
              <button
                onClick={handleNextBtn}
                disabled={
                  currentPage === pages[pages.length - 1] ? true : false
                }
              >
                Next
              </button>
            </li>
          </ul>
        ) : null}
      </div>
    </>
  );
};

export default Pagination;
