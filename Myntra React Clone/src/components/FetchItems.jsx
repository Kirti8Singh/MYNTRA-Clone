import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStatusActions } from "../store/fetchStatusSlice";
import { itemsActions } from "../store/itemsSlice";

const FetchItems = () => {
  const fetchStatus = useSelector((store) => store.fetchStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    // If data has already been fetched successfully, don't request it again
    if (fetchStatus.fetchDone) return;

    const controller = new AbortController();
    const signal = controller.signal;

    // Trigger loading spinner flags
    dispatch(fetchStatusActions.markFetchingStarted());

    fetch("http://localhost:8080/items", { signal })
      .then((res) => res.json())
      .then(({ items }) => {
        // Express backend returns an object containing an array under { items: [...] }
        dispatch(fetchStatusActions.markFetchDone());
        dispatch(fetchStatusActions.markFetchingFinished());
        dispatch(itemsActions.addInitialItems(items));
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("Fetch aborted gracefully.");
        } else {
          console.error("Failed to sync items from backend server:", error);
          dispatch(fetchStatusActions.markFetchingFinished());
        }
      });

    return () => {
      // Aborts the network request cleanly if the component unmounts mid-transit
      controller.abort();
    };
  }, [fetchStatus.fetchDone, dispatch]);

  return null;
};

export default FetchItems;
