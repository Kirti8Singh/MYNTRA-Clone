import { useSelector } from "react-redux";
import HomeItem from "../components/HomeItem";

const Home = () => {
  const items = useSelector((store) => store.items);
  const searchQuery = useSelector((store) => store.search.query);

  const query = searchQuery.trim().toLowerCase();

  const filteredItems = items.filter((item) => {
    if (!query) {
      return true;
    }

    const productName = item.item_name?.toLowerCase() || "";
    const company = item.company?.toLowerCase() || "";

    return (
      productName.includes(query) ||
      company.includes(query)
    );
  });

  return (
    <main>
      {query && (
        <div
          className='search-results-info'
          aria-live='polite'
        >
          {filteredItems.length} product
          {filteredItems.length !== 1 ? "s" : ""} found
          {" "}for "{searchQuery}"
        </div>
      )}

      {filteredItems.length > 0 ? (
        <div className='items-container'>
          {filteredItems.map((item) => (
            <HomeItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div
          className='no-results'
          role='status'
        >
          <h2>No products found</h2>

          <p>
            Try searching for another product name or brand.
          </p>
        </div>
      )}
    </main>
  );
};

export default Home;