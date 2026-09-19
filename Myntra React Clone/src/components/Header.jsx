import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { searchActions } from "../store/searchSlice";

const Header = () => {
  // Pulling the item tracking array to dynamically compute bag item count
  const bag = useSelector((store) => store.bag);
  const searchQuery = useSelector((store) => store.search.query);
  const wishlistItems = useSelector((store) => store.wishlist.items);

  const dispatch = useDispatch();

  const handleSearch = (event) => {
    dispatch(searchActions.setSearchQuery(event.target.value));
  };

  return (
    <header>
      <div className='logo_container'>
        <Link to='/'>
          <img
            className='myntra_home'
            src='/images/skincareLogo.png'
            alt='Skincare Essentials Home'
          />
        </Link>
      </div>

      <nav className='nav_bar'>
        <Link to='/'>Shop Catalog</Link>
        <a href='#'>AM Routine</a>
        <a href='#'>PM Routine</a>
        <a href='#'>
          New Arrivals <sup>New</sup>
        </a>
      </nav>

      <div className='search_bar'>
        <span
          className='material-symbols-outlined search_icon'
          aria-hidden='true'
        >
          search
        </span>

        <input
          id='product-search'
          name='product-search'
          type='search'
          className='search_input'
          placeholder='Search for products, brands and more'
          aria-label='Search products and brands'
          value={searchQuery}
          onChange={handleSearch}
          autoComplete='off'
        />
      </div>

      <div className='action_bar'>
        <Link
          to='/profile'
          className='action_container'
          aria-label='Open profile'
        >
          <span className='material-symbols-outlined' aria-hidden='true'>
            person
          </span>
          <span className='action_name'>Profile</span>
        </Link>

        <Link
          className='action_container'
          to='/wishlist'
          aria-label={`Wishlist, ${wishlistItems.length} ${
            wishlistItems.length === 1 ? "item" : "items"
          }`}
        >
          <span className='material-symbols-outlined' aria-hidden='true'>
            favorite
          </span>

          <span className='action_name'>
            Wishlist
            {wishlistItems.length > 0 && (
              <span className='wishlist-count'>{wishlistItems.length}</span>
            )}
          </span>
        </Link>

        <Link className='action_container' to='/bag'>
          <span className='material-symbols-outlined'>shopping_bag</span>
          <span className='action_name'>Bag</span>
          {bag.length > 0 && (
            <span className='bag-item-count' aria-live='polite'>
              {bag.length}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;
