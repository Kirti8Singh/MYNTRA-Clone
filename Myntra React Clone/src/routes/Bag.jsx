import { useSelector } from "react-redux";
import BagItem from "../components/BagItem";
import BagSummary from "../components/BagSummary";

const Bag = () => {
  const bagItems = useSelector((state) => state.bag);
  const items = useSelector((state) => state.items);

  // Cross-reference saved item IDs with complete store product catalogs
  const finalItems = items.filter((item) => {
    return bagItems.indexOf(item.id) >= 0;
  });

  return (
    <main>
      <div className='bag-page'>
        <div className='bag-items-container'>
          {finalItems.length === 0 ? (
            <div
              className='alert alert-secondary text-center w-100'
              role='alert'
            >
              Your skincare bag is empty. Explore our catalog to add products!
            </div>
          ) : (
            finalItems.map((item) => <BagItem key={item.id} item={item} />)
          )}
        </div>
        <BagSummary />
      </div>
    </main>
  );
};

export default Bag;
