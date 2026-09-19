import { useDispatch, useSelector } from "react-redux";
import { bagActions } from "../store/bagSlice";
import { toastActions } from "../store/toastSlice";
import { wishlistActions } from "../store/wishlistSlice";

const HomeItem = ({ item }) => {
  const dispatch = useDispatch();

  const isWishlisted = useSelector((store) =>
    store.wishlist.items.some((wishlistItem) => wishlistItem.id === item.id)
  );

  const bagItems = useSelector((store) => store.bag);

  // Checks if this specific product already exists inside the global cart array
  const elementFound = bagItems.indexOf(item.id) >= 0;

  const handleAddToBag = () => {
    dispatch(bagActions.addToBag(item.id));
    dispatch(toastActions.showToast(`${item.item_name} added to bag`));
  };

  const handleRemoveFromBag = () => {
    dispatch(bagActions.removeFromBag(item.id));
    dispatch(toastActions.showToast(`${item.item_name} removed from bag`));
  };

  return (
    <div className='item-container'>
      <img className='item-image' src={item.image} alt={item.item_name} />
      <button
        type='button'
        className={`wishlist-button ${
          isWishlisted ? "wishlist-button-active" : ""
        }`}
        onClick={() => dispatch(wishlistActions.toggleWishlist(item))}
        aria-label={
          isWishlisted
            ? `Remove ${item.item_name} from wishlist`
            : `Add ${item.item_name} to wishlist`
        }
        aria-pressed={isWishlisted}
      >
        <span className='material-symbols-outlined' aria-hidden='true'>
          {isWishlisted ? "favorite" : "favorite_border"}
        </span>
      </button>
      <div className='rating'>
        {item.rating.stars} ⭐ | {item.rating.count} reviews
      </div>
      <div className='company-name'>{item.company}</div>
      <div className='item-name'>{item.item_name}</div>
      <div className='price'>
        <span className='current-price'>Rs {item.current_price}</span>
        <span className='original-price'>Rs {item.original_price}</span>
        <span className='discount'>({item.discount_percentage}% OFF)</span>
      </div>

      {elementFound ? (
        <button
          type='button'
          className='btn btn-add-bag'
          style={{
            backgroundColor: "#b91c1c",
            color: "#ffffff",
            border: "none",
          }}
          onClick={handleRemoveFromBag}
        >
          <span className='material-symbols-outlined'>delete</span>
          Remove from Bag
        </button>
      ) : (
        <button
          type='button'
          className='btn btn-add-bag'
          style={{
            backgroundColor: "#15803d",
            color: "#ffffff",
            border: "none",
          }}
          onClick={handleAddToBag}
        >
          <span className='material-symbols-outlined'>add_shopping_cart</span>
          Add to Bag
        </button>
      )}
    </div>
  );
};

export default HomeItem;
