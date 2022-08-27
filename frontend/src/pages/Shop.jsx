import { useContext, useEffect, useState } from "react";
import CategoryPlusPagination from "../components/CategoryPlusPagination";
import MultiRangeSlider from "../components/MultiRangeSlider";
import dressContext from "../context/dress-context";
import Error from "../components/Error";
import Preloader from "../components/Preloader";
import Features from "../components/Features";
import "./shop.css";

const Shop = () => {
  const {
    getAllCategories,
    allCategoriesData,
    currentCategoryData,
    getCurrentCategory,
    highestDressPrice,
    getFilteredDresses,
    getHighestPrice,
    fetchingData,
    noInternet,
  } = useContext(dressContext);
  const [showCategories, setShowCategories] = useState(false);
  const [showFilterAndSort, setShowFilterAndSort] = useState(false);
  const [sliderMinValue, setSliderMinValue] = useState(0);
  const [sliderMaxValue, setSliderMaxValue] = useState(0);
  const [currentCategoryTitle, setCurrentCategoryTitle] =
    useState("All Dresses");
  const [currentCategorySlug, setCurrentCategorySlug] = useState("all-dresses");

  const handleSliderChange = (min, max) => {
    setSliderMinValue(min);
    setSliderMaxValue(max);
  };
  const handlefilterDresses = (e) => {
    e.preventDefault();
    let allCategories = ["All Dresses"];
    let checkboxChecked = [];
    const data = new FormData(e.target);
    {
      allCategoriesData.map((dress) => allCategories.push(dress.title));
    }
    allCategories.map(
      (dress) => data.get(dress) && checkboxChecked.push(dress)
    );

    getFilteredDresses(
      [sliderMinValue, sliderMaxValue].concat(checkboxChecked)
    );
    setShowFilterAndSort(false);
    setCurrentCategoryTitle("Filtered Dresses");
    e.target.reset();
  };

  useEffect(() => {
    if (showCategories || showFilterAndSort) {
      document.body.style["overflow"] = "hidden";
    } else {
      document.body.style["overflow"] = "auto";
    }
  }, [showCategories, showFilterAndSort]);

  useEffect(() => {
    getCurrentCategory(currentCategorySlug);
  }, [currentCategorySlug]);

  useEffect(() => {
    getHighestPrice();
    getAllCategories();
  }, []);

  if (fetchingData) {
    return <Preloader />;
  }

  if (noInternet) {
    return <Error />;
  }

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
          <button
            onClick={() => {
              setShowCategories(false);
              setCurrentCategoryTitle("All Dresses");
              setCurrentCategorySlug("all-dresses");
            }}
            className="btn"
          >
            All Dresses
          </button>
          {allCategoriesData.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setShowCategories(false);
                setCurrentCategoryTitle(category.title);
                setCurrentCategorySlug(category.slug);
              }}
              className="btn"
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>
      <div
        className={showFilterAndSort ? "filter__sort active" : "filter__sort"}
      >
        <h2>Filter Dresses</h2>
        <hr className="filter_demarcator" />
        <h3>Price</h3>
        <div className="slider__div">
          <MultiRangeSlider
            min={0}
            max={highestDressPrice}
            onChange={({ min, max }) => handleSliderChange(min, max)}
          />
        </div>
        <hr className="demarcator" />
        <h3>Category</h3>
        <form onSubmit={handlefilterDresses}>
          <div className="categories__container">
            <div id="filter_checkboxes" className="my-2 mr-2">
              <input
                type="checkbox"
                name="All Dresses"
                id="All Dresses"
                value="All Dresses"
                defaultChecked={true}
              />
              <label htmlFor="All Dresses">All Dresses</label>
            </div>
            {allCategoriesData.map((category) => (
              <div
                key={category.id}
                id="filter_checkboxes"
                className="my-2 mr-2"
              >
                <input
                  type="checkbox"
                  name={category.title}
                  id={category.title}
                  value={category.title}
                />
                <label htmlFor={category.title}>{category.title}</label>
              </div>
            ))}
          </div>
          <hr className="demarcator" />
          <button type="submit" className="btn">
            Filter Now
          </button>
        </form>
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
              onClick={() => setShowFilterAndSort(!showFilterAndSort)}
              className="btn"
            >
              Filter + Sort
            </button>
          </div>
        </div>
        <hr />
        <h3 className="category__title">{currentCategoryTitle}</h3>
        <hr />
      </div>
      <div className="container">
        <CategoryPlusPagination categoryData={currentCategoryData} />
        <Features />
      </div>
    </>
  );
};

export default Shop;
