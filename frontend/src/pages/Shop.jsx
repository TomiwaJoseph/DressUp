// import React from 'react'
import { NavLink } from "react-router-dom";
import Features from "../components/Features";
import MultiRangeSlider from "../components/MultiRangeSlider";
import "./shop.css";
// import "../App.css";
import { data } from "../data";
import { useEffect, useState } from "react";
import CategoryPlusPagination from "../components/CategoryPlusPagination";
import Navbar from "../components/Navbar";

const Shop = () => {
  const [showCategories, setShowCategories] = useState(false);
  const [filterAndSort, setFilterAndSort] = useState(false);
  const [sliderMinValue, setSliderMinValue] = useState(0);
  const [sliderMaxValue, setSliderMaxValue] = useState(0);
  const [categoryTitle, setCategoryTitle] = useState("All Dresses");
  const [currentCategoryData, setCurrentCategoryData] = useState(data);
  // console.log(currentCategoryData)
  const changeCategory = (category) => {
    setShowCategories(false);
    setCategoryTitle(category);
  };
  const handleSliderChange = (min, max) => {
    setSliderMinValue(min);
    setSliderMaxValue(max);
  };

  useEffect(() => {
    if (showCategories || filterAndSort) {
      document.body.style["overflow"] = "hidden";
    } else {
      document.body.style["overflow"] = "auto";
    }
  }, [showCategories, filterAndSort]);

  return (
    <>
      <div
        className={
          showCategories ? "dress__categories active" : "dress__categories"
        }
      >
        <h2>Categories</h2>
        <hr className="filter_demarcator" />
        <div className="categories__container">
          <button onClick={() => changeCategory("new dresses")} className="btn">
            New Dresses
          </button>
          <button onClick={() => changeCategory("top rated")} className="btn">
            Top Rated
          </button>
          <button onClick={() => changeCategory("dressType")} className="btn">
            Back In Stock Dresses
          </button>
          <button
            onClick={() => changeCategory("casual dresses")}
            className="btn"
          >
            Casual Dresses
          </button>
          <button
            onClick={() => changeCategory("denim dresses")}
            className="btn"
          >
            Denim Dresses
          </button>
          <button onClick={() => changeCategory("dressType")} className="btn">
            Jumpsuits
          </button>
          <button onClick={() => changeCategory("dressType")} className="btn">
            Maxi Dresses
          </button>
          <button onClick={() => changeCategory("dressType")} className="btn">
            Midi Dresses
          </button>
          <button onClick={() => changeCategory("dressType")} className="btn">
            Mini Dresses
          </button>
          <button onClick={() => changeCategory("dressType")} className="btn">
            Party Dresses
          </button>
          <button onClick={() => changeCategory("dressType")} className="btn">
            Printed Dresses
          </button>
          <button onClick={() => changeCategory("dressType")} className="btn">
            Sets
          </button>
          <button onClick={() => changeCategory("dressType")} className="btn">
            White Dresses
          </button>
          <button onClick={() => changeCategory("dressType")} className="btn">
            Sale Dresses
          </button>
        </div>
      </div>
      <div className={filterAndSort ? "filter__sort active" : "filter__sort"}>
        <h2>Filter Dresses</h2>
        <hr className="filter_demarcator" />
        {/* <hr className="demarcator" /> */}
        <h3>Price</h3>
        {/* <hr className="demarcator" /> */}
        <div className="slider__div">
          <MultiRangeSlider
            min={0}
            max={1000}
            onChange={({ min, max }) => handleSliderChange(min, max)}
          />
        </div>
        <hr className="demarcator" />
        <h3>Category</h3>
        {/* <hr className="demarcator" /> */}
        <form>
          <div className="categories__container">
            <div id="filter_checkboxes" className="my-2 mr-2">
              <input
                type="checkbox"
                name="category"
                id="Top Rated"
                value="Top Rated"
              />
              <label htmlFor="Top Rated">Top Rated</label>
            </div>
            <div id="filter_checkboxes" className="my-2 mr-2">
              <input
                type="checkbox"
                name="category"
                id="New Dresses"
                value="New Dresses"
              />
              <label htmlFor="New Dresses">New Dresses</label>
            </div>
          </div>
        </form>
        <hr className="demarcator" />
        <button className="btn">Filter Now</button>
      </div>
      <div className="container">
        <h2 className="title__caption">Shop</h2>
        <hr />
        <div className="row shop__cta">
          <div className="col-6">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="btn"
            >
              Shop By Category
            </button>
          </div>
          <div className="col-6">
            <button
              onClick={() => setFilterAndSort(!filterAndSort)}
              className="btn"
            >
              Filter + Sort
            </button>
          </div>
        </div>
        <hr />
        <h3 className="category__title">{categoryTitle}</h3>
        <hr />
        {/* <div className="row">
          {currentCategoryData.map((item) => (
            <div key={item.product_name} className="col-lg-3 col-md-4 col-sm-6">
              <div>
                <div className="image__wrapper">
                  <img
                    src={item.productImage}
                    className="img-fluid"
                    alt={item.product_name}
                  />
                  <div className="dress__cta">
                    <NavLink to="/" className="btn">
                      View Dress
                    </NavLink>
                    <div className="utilities">
                      <i className="fas fa-shopping-bag"></i>
                      <i className="fas fa-heart"></i>
                    </div>
                  </div>
                </div>
                <div className="dress__info">
                  <p>{item.product_name}</p>
                  <h6>{item.product_price}</h6>
                </div>
              </div>
            </div>
          ))}
        </div> */}
        <CategoryPlusPagination categoryData={currentCategoryData} />
        <Features />
      </div>
    </>
  );
};

export default Shop;
