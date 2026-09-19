import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { wishlistActions } from "../store/wishlistSlice";
import { toastActions } from "../store/toastSlice";
import { bagActions } from "../store/bagSlice";

const ProductDetails = () => {
  const dispatch = useDispatch();

  const { id } = useParams();

  const items = useSelector((store) => store.items);

  const item = items.find((product) => product.id === id);

  const isWishlisted = useSelector((store) =>
    store.wishlist.items.some((wishlistItem) => wishlistItem.id === id)
  );

  const handleWishlist = () => {
    dispatch(wishlistActions.toggleWishlist(item));

    if (isWishlisted) {
      dispatch(
        toastActions.showToast(`${item.item_name} removed from wishlist`)
      );
    } else {
      dispatch(toastActions.showToast(`${item.item_name} added to wishlist`));
    }
  };

  const handleAddToBag = () => {
    dispatch(bagActions.addToBag(item.id));

    dispatch(toastActions.showToast(`${item.item_name} added to bag`));
  };

  if (!item) {
    return (
      <main className='product-details-page'>
        <div className='product-not-found'>
          <h1>Product not found</h1>
          <p>The product you are looking for does not exist.</p>

          <Link to='/' className='back-to-products-button'>
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className='product-details-page'>
      <div className='product-details-breadcrumb'>
        <Link to='/'>Home</Link>
        <span aria-hidden='true'>/</span>
        <span>{item.company}</span>
      </div>

      <div className='product-details-container'>
        {/* Product Image */}
        <div className='product-details-image-section'>
          <div className='product-details-image-wrapper'>
            <img
              className='product-details-image'
              src={`/${item.image}`}
              alt={item.item_name}
            />
          </div>
        </div>

        {/* Product Information */}
        <div className='product-details-info'>
          <p className='product-details-company'>{item.company}</p>

          <h1 className='product-details-title'>{item.item_name}</h1>

          <div className='product-details-rating'>
            <span className='rating-badge'>{item.rating.stars} ★</span>

            <span className='review-count'>
              {item.rating.count.toLocaleString()} reviews
            </span>
          </div>

          <div className='product-details-divider'></div>

          {/* Price */}
          <div className='product-details-price'>
            <span className='details-current-price'>
              Rs {item.current_price.toLocaleString()}
            </span>

            <span className='details-original-price'>
              Rs {item.original_price.toLocaleString()}
            </span>

            <span className='details-discount'>
              {item.discount_percentage}% OFF
            </span>
          </div>

          <p className='tax-info'>Inclusive of all taxes</p>

          <div className='product-details-divider'></div>

          {/* Delivery */}
          <section className='product-info-section'>
            <h2>Delivery & Returns</h2>

            <div className='detail-row'>
              <span className='material-symbols-outlined' aria-hidden='true'>
                local_shipping
              </span>

              <div>
                <strong>Delivery by {item.delivery_date}</strong>
                <p>Fast and reliable delivery</p>
              </div>
            </div>

            <div className='detail-row'>
              <span className='material-symbols-outlined' aria-hidden='true'>
                assignment_return
              </span>

              <div>
                <strong>{item.return_period}-day return</strong>
                <p>Easy returns within the return period</p>
              </div>
            </div>
          </section>

          <div className='product-details-divider'></div>

          {/* Action buttons */}
          <div className='product-action-buttons'>
            <button
              type='button'
              className='product-add-to-bag-button'
              onClick={handleAddToBag}
            >
              <span className='material-symbols-outlined' aria-hidden='true'>
                shopping_bag
              </span>
              Add to Bag
            </button>

            <button
              type='button'
              className={`product-wishlist-button ${
                isWishlisted ? "product-wishlist-button-active" : ""
              }`}
              onClick={handleWishlist}
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

              {isWishlisted ? "Wishlisted" : "Wishlist"}
            </button>
          </div>

          {/* Product information */}
          <section className='product-information-card'>
            <h2>Product Details</h2>

            <p>
              Shop the {item.company} {item.item_name}. Check the product
              information, pricing, delivery details and return policy before
              purchasing.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
