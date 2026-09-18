import { useDispatch, useSelector } from "react-redux";
import { sortActions } from "../store/sortSlice";

const ProductSort = () => {
  const dispatch = useDispatch();
  const sortBy = useSelector((store) => store.sort.sortBy);

  const handleSortChange = (event) => {
    dispatch(sortActions.setSortBy(event.target.value));
  };

  return (
    <div className="sort_container">
      <label htmlFor="sort-products">Sort By:</label>

      <select
        id="sort-products"
        name="sort-products"
        value={sortBy}
        onChange={handleSortChange}
        className="sort_select"
      >
        <option value="recommended">Recommended</option>
        <option value="priceLowToHigh">Price: Low to High</option>
        <option value="priceHighToLow">Price: High to Low</option>
        <option value="ratingHighToLow">Rating: High to Low</option>
        <option value="discountHighToLow">Discount: High to Low</option>
      </select>
    </div>
  );
};

export default ProductSort;