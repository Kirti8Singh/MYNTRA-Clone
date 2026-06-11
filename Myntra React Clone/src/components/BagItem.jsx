import { useDispatch } from "react-redux";
import { bagActions } from "../store/bagSlice";

const BagItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemoveItem = () => {
    dispatch(bagActions.removeFromBag(item.id));
  };

  return (
    <div className='bag-item-container'>
      <div className='item-left'>
        <img className='bag-item-img' src={item.image} alt={item.item_name} />
      </div>
      <div className='item-right'>
        <div
          className='company-name'
          style={{ marginLeft: "0px", marginTop: "0px" }}
        >
          {item.company}
        </div>
        <div className='item-name' style={{ marginLeft: "0px" }}>
          {item.item_name}
        </div>
        <div
          className='price'
          style={{ marginLeft: "0px", marginBottom: "5px" }}
        >
          <span className='current-price'>Rs {item.current_price}</span>
          <span className='original-price'>Rs {item.original_price}</span>
          <span className='discount'>({item.discount_percentage}% OFF)</span>
        </div>
        <div className='return-period'>
          <span className='return-period-days'>{item.return_period} days</span>{" "}
          return available
        </div>
        <div className='delivery-details'>
          Delivery by{" "}
          <span className='delivery-details-days'>{item.delivery_date}</span>
        </div>
      </div>

      <div className='remove-from-cart' onClick={handleRemoveItem}>
        <span className='material-symbols-outlined'>close</span>
      </div>
    </div>
  );
};

export default BagItem;
