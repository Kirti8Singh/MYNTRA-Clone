const Footer = () => {
  return (
    <footer>
      <div className='footer_container'>
        <div className='footer_column'>
          <h3>ONLINE SHOPPING</h3>
          <a href='#'>Cleansers</a>
          <a href='#'>Toners & Serums</a>
          <a href='#'>Sunscreens</a>
          <a href='#'>Moisturizers</a>
          <a href='#'>Gift Cards</a>
        </div>

        <div className='footer_column'>
          <h3>CUSTOMER POLICIES</h3>
          <a href='#'>Contact Us</a>
          <a href='#'>FAQ</a>
          <a href='#'>T&C</a>
          <a href='#'>Terms Of Use</a>
          <a href='#'>Track Orders</a>
          <a href='#'>Shipping & Delivery</a>
        </div>

        <div className='footer_column'>
          <h3>EXPERIENCE SKINCARE APP ON MOBILE</h3>
          <div className='d-flex gap-2 mt-2'>
            <span className='badge bg-dark p-2 cursor-pointer'>
              Google Play
            </span>
            <span className='badge bg-dark p-2 cursor-pointer'>App Store</span>
          </div>
        </div>
      </div>
      <hr />
      <div className='copyright'>
        © 2026 www.skincareessentials.com. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
