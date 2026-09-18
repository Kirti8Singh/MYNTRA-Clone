import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterActions } from "../store/filterSlice";

const ProductFilters = ({ companies }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch();

  const selectedCompanies = useSelector(
    (store) => store.filter.companies
  );

  const priceRange = useSelector(
    (store) => store.filter.priceRange
  );

  const rating = useSelector(
    (store) => store.filter.rating
  );

  const handleCompanyChange = (company) => {
    dispatch(filterActions.toggleCompany(company));
  };

  const handlePriceChange = (event) => {
    dispatch(
      filterActions.setPriceRange(event.target.value)
    );
  };

  const handleRatingChange = (event) => {
    dispatch(
      filterActions.setRating(event.target.value)
    );
  };

  const handleClearFilters = () => {
    dispatch(filterActions.clearFilters());
  };

  return (
    <div className="filter-dropdown-container">
      <button
        type="button"
        className="filters-button"
        aria-expanded={isOpen}
        aria-controls="product-filters-panel"
        onClick={() => setIsOpen((previous) => !previous)}
      >
        <span
          className="material-symbols-outlined"
          aria-hidden="true"
        >
          filter_list
        </span>
  
        Filters
  
        <span
          className="material-symbols-outlined"
          aria-hidden="true"
        >
          {isOpen ? "expand_less" : "expand_more"}
        </span>
      </button>
  
      {isOpen && (
        <aside
          id="product-filters-panel"
          className="filters-panel"
          aria-label="Product filters"
        >
          <div className="filters-header">
            <h2>Filters</h2>
  
            <button
              type="button"
              className="clear-filters-button"
              onClick={handleClearFilters}
            >
              Clear All
            </button>
          </div>
  
          {/* Brand */}
          <fieldset className="filter-group">
            <legend>Brand</legend>
  
            {companies.map((company) => (
              <label
                key={company}
                className="filter-option"
              >
                <input
                  type="checkbox"
                  checked={selectedCompanies.includes(company)}
                  onChange={() =>
                    handleCompanyChange(company)
                  }
                />
  
                <span>{company}</span>
              </label>
            ))}
          </fieldset>
  
          {/* Price */}
          <fieldset className="filter-group">
            <legend>Price</legend>
  
            <label className="filter-option">
              <input
                type="radio"
                name="price-range"
                value="all"
                checked={priceRange === "all"}
                onChange={handlePriceChange}
              />
              <span>All Prices</span>
            </label>
  
            <label className="filter-option">
              <input
                type="radio"
                name="price-range"
                value="under500"
                checked={priceRange === "under500"}
                onChange={handlePriceChange}
              />
              <span>Under ₹500</span>
            </label>
  
            <label className="filter-option">
              <input
                type="radio"
                name="price-range"
                value="500to1500"
                checked={priceRange === "500to1500"}
                onChange={handlePriceChange}
              />
              <span>₹500 – ₹1,500</span>
            </label>
  
            <label className="filter-option">
              <input
                type="radio"
                name="price-range"
                value="1500to3000"
                checked={priceRange === "1500to3000"}
                onChange={handlePriceChange}
              />
              <span>₹1,500 – ₹3,000</span>
            </label>
  
            <label className="filter-option">
              <input
                type="radio"
                name="price-range"
                value="above3000"
                checked={priceRange === "above3000"}
                onChange={handlePriceChange}
              />
              <span>Above ₹3,000</span>
            </label>
          </fieldset>
  
          {/* Rating */}
          <fieldset className="filter-group">
            <legend>Rating</legend>
  
            <label className="filter-option">
              <input
                type="radio"
                name="rating"
                value="all"
                checked={rating === "all"}
                onChange={handleRatingChange}
              />
              <span>All Ratings</span>
            </label>
  
            <label className="filter-option">
              <input
                type="radio"
                name="rating"
                value="4"
                checked={rating === "4"}
                onChange={handleRatingChange}
              />
              <span>4★ and above</span>
            </label>
  
            <label className="filter-option">
              <input
                type="radio"
                name="rating"
                value="4.5"
                checked={rating === "4.5"}
                onChange={handleRatingChange}
              />
              <span>4.5★ and above</span>
            </label>
          </fieldset>
        </aside>
      )}
    </div>
  );
};

export default ProductFilters;