import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toastActions } from "../store/toastSlice";

const AUTO_DISMISS_MS = 3000;

// A visible, screen-reader-announced notification. role="status" + aria-live
// give it a valid accessible live region automatically without any extra
// aria-live attribute needed alongside role.
const Toast = () => {
  const { message, visible } = useSelector((store) => store.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => dispatch(toastActions.hideToast()), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [visible, message, dispatch]);

  if (!visible) return null;

  return (
    <div className='toast' role='status' aria-live='polite'>
      {message}
    </div>
  );
};

export default Toast;