import { useSelector } from "react-redux";
import HomeItem from "../components/HomeItem";

const Wishlist = () => {
  const wishlistItems = useSelector(
    (store) => store.wishlist.items
  );

  return (
    <main className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>

        <span>
          {wishlistItems.length} item
          {wishlistItems.length !== 1 ? "s" : ""}
        </span>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="items-container">
          {wishlistItems.map((item) => (
            <HomeItem
              key={item.id}
              item={item}
            />
          ))}
        </div>
      ) : (
        <div
          className="empty-wishlist"
          role="status"
        >
          <span
            className="material-symbols-outlined"
            aria-hidden="true"
          >
            favorite_border
          </span>

          <h2>Your wishlist is empty</h2>

          <p>
            Save products you love and find them here later.
          </p>
        </div>
      )}
    </main>
  );
};

export default Wishlist;