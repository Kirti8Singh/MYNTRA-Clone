import { useSelector } from "react-redux";
import HomeItem from "../components/HomeItem";
import ProductFilters from "../components/ProductFilters";
import ProductSort from "../components/ProductSort";

const Home = () => {
  const items = useSelector((store) => store.items);

  const searchQuery = useSelector((store) => store.search.query);

  const selectedCompanies = useSelector((store) => store.filter.companies);

  const priceRange = useSelector((store) => store.filter.priceRange);

  const rating = useSelector((store) => store.filter.rating);

  const sortBy = useSelector((store) => store.sort.sortBy);

  const companies = [
    ...new Set(items.map((item) => item.company).filter(Boolean)),
  ].sort();

  const query = searchQuery.trim().toLowerCase();

  const filteredItems = items.filter((item) => {
    // SEARCH
    if (query) {
      const productName = item.item_name?.toLowerCase() || "";

      const company = item.company?.toLowerCase() || "";

      const matchesSearch =
        productName.includes(query) || company.includes(query);

      if (!matchesSearch) {
        return false;
      }
    }

    // BRAND
    if (
      selectedCompanies.length > 0 &&
      !selectedCompanies.includes(item.company)
    ) {
      return false;
    }

    // PRICE
    const price = Number(item.current_price);

    if (priceRange === "under500" && price >= 500) {
      return false;
    }

    if (priceRange === "500to1500" && (price < 500 || price > 1500)) {
      return false;
    }

    if (priceRange === "1500to3000" && (price < 1500 || price > 3000)) {
      return false;
    }

    if (priceRange === "above3000" && price <= 3000) {
      return false;
    }

    // RATING
    const stars = Number(item.rating?.stars);

    if (rating === "4" && stars < 4) {
      return false;
    }

    if (rating === "4.5" && stars < 4.5) {
      return false;
    }

    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "priceLowToHigh") {
      return a.current_price - b.current_price;
    }

    if (sortBy === "priceHighToLow") {
      return b.current_price - a.current_price;
    }

    if (sortBy === "ratingHighToLow") {
      return b.rating.stars - a.rating.stars;
    }

    if (sortBy === "discountHighToLow") {
      return b.discount_percentage - a.discount_percentage;
    }

    return 0;
  });

  return (
    <main>
      <div className='filter_sort_container'>
        <ProductFilters companies={companies} />
        <ProductSort />
      </div>

      <div className='search-results-info' aria-live='polite'
      >
        {filteredItems.length} product
        {filteredItems.length !== 1 ? "s" : ""} found
      </div>

      {sortedItems.length > 0 ? (
        <div className='items-container'>
          {sortedItems.map((item) => (
            <HomeItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className='no-results' role='status'>
          <h2>No products found</h2>

          <p>Try changing or clearing your filters.</p>
        </div>
      )}
    </main>
  );
};

export default Home;
