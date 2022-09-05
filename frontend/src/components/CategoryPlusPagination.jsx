import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Login from "../pages/Login";
import { addToCart, addToWishlist } from "../redux/actions/fetchers";
import "./categorypluspagination.css";

// const renderData = (data) => {
//   return (
//     <>
//       {data.map((dress) => (
//         <div key={dress.id} className="col-lg-3 col-md-4 col-sm-6">
//           <div>
//             <div className="image__wrapper">
//               <img
//                 src={`${backendbackendUrl}${dress.main_image}`}
//                 className="img-fluid"
//                 alt={dress.name}
//               />
//               <div className="dress__cta">
//                 <NavLink to={`/shop/dress/${dress.slug}`} className="btn">
//                   View Dress
//                 </NavLink>
//                 <div className="utilities">
//                   <i className="fas fa-shopping-bag"></i>
//                   <i className="fas fa-heart"></i>
//                 </div>
//               </div>
//             </div>
//             <div className="dress__info">
//               <p>{dress.name}</p>
//               <h6>${dress.price}.00</h6>
//             </div>
//           </div>
//         </div>
//       ))}
//     </>
//   );
// };

const CategoryPlusPagination = ({
  categoryData,
  backendUrl,
  isAuthenticated,
}) => {
  const navigate = useNavigate();
  const dataToRender = categoryData;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleWishlistClick = (id) => {
    if (isAuthenticated) {
      addToWishlist(id);
    } else {
      navigate("/login", { state: { id: id, action: "wishlist" } });
    }
  };

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

  // let pageIncrementBtn = null;
  // if (pages.length > maxPageNumberLimit) {
  //   pageIncrementBtn = <li onClick={handleNextBtn}> &hellip; </li>;
  // }

  // let pageDecrementBtn = null;
  // if (minPageNumberLimit >= 1) {
  //   pageDecrementBtn = <li onClick={handlePrevBtn}> &hellip; </li>;
  // }
  // console.log(currentItems);
  // console.log(dataToRender);

  return (
    <>
      <div className="container">
        <div className="row my-4">
          {currentItems &&
            currentItems.map((dress) => (
              <div key={dress.id} className="col-lg-3 col-md-4 col-sm-6">
                <div>
                  <div className="image__wrapper">
                    <img
                      src={`${backendUrl}${dress.main_image}`}
                      className="img-fluid"
                      alt={dress.name}
                    />
                    <div className="dress__cta">
                      <NavLink to={`/shop/dress/${dress.slug}`} className="btn">
                        View Dress
                      </NavLink>
                      <div className="utilities">
                        <i
                          onClick={() => addToCart(dress.id, 1)}
                          className="fas fa-shopping-bag"
                        ></i>
                        <i
                          onClick={() => handleWishlistClick(dress.id)}
                          className="fas fa-heart"
                        ></i>
                      </div>
                    </div>
                  </div>
                  <div className="dress__info">
                    <p>{dress.name}</p>
                    <h6>${dress.price}</h6>
                  </div>
                </div>
              </div>
            ))}
        </div>
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

export default CategoryPlusPagination;
