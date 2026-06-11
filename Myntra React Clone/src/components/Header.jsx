import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Header = () => {
  // Pulling the item tracking array to dynamically compute bag item count
  const bag = useSelector((store) => store.bag);

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
        <span className='material-symbols-outlined search_icon'>search</span>
        <input
          className='search_input'
          placeholder='Search for skincare brands, serums, sunscreens...'
        />
      </div>

      <div className='action_bar'>
        <div className='action_container'>
          <span className='material-symbols-outlined'>person</span>
          <span className='action_name'>Profile</span>
        </div>

        <div className='action_container'>
          <span className='material-symbols-outlined'>favorite</span>
          <span className='action_name'>Wishlist</span>
        </div>

        <Link className='action_container' to='/bag'>
          <span className='material-symbols-outlined'>shopping_bag</span>
          <span className='action_name'>Bag</span>
          {bag.length > 0 && (
            <span className='bag-item-count'>{bag.length}</span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;
