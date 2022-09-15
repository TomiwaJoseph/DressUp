import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CategoryPlusPagination from "../components/CategoryPlusPagination";
import Error from "../components/Error";
import Features from "../components/Features";
import Preloader from "../components/Preloader";
import { searchDressByName } from "../redux/actions/fetchers";
import "./search.css";

const Search = () => {
  const [doneLoading, setDoneLoading] = useState(false);
  const storeContext = useSelector((state) => state.dress);
  const {
    fetchingData,
    noInternet,
    searchResults,
    backendUrl,
    isAuthenticated,
  } = storeContext;
  const handleSubmitForm = (e) => {
    e.preventDefault();
    searchDressByName(e.target.name.value);
    setDoneLoading(true);
    e.target.reset();
  };
  const renderSearchData = () => {
    if (!searchResults.length && doneLoading) {
      return (
        <div className="col-12 text-center">
          <p className="no__dress">No dress match your search parameters</p>
        </div>
      );
    } else {
      return (
        <>
          <CategoryPlusPagination
            categoryData={searchResults}
            backendUrl={backendUrl}
            isAuthenticated={isAuthenticated}
          />
          <Features />
        </>
      );
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (fetchingData) {
    return <Preloader />;
  }

  if (noInternet) {
    return <Error />;
  }

  return (
    <div className="container">
      <h1 className="title__caption">Search</h1>
      <hr className="underline" />
      <form onSubmit={handleSubmitForm} className="search-form">
        <input
          autoFocus
          type="text"
          name="name"
          className="form-control"
          required
        />
      </form>
      {renderSearchData()}
    </div>
  );
};

export default Search;
