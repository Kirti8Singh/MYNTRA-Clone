import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./routes/App.jsx";
import Home from "./routes/Home.jsx";
import Bag from "./routes/Bag.jsx";
import myntraStore from "./store/index.js";
import "./index.css";
import Wishlist from "./routes/Wishlist.jsx";
import ProductDetails from "./routes/ProductDetails.jsx";
import Profile from "./routes/Profile";

// Setting up the client-side routes for the Skincare platform
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/bag", element: <Bag /> },
      { path: "/wishlist", element: <Wishlist /> },
      { path: "/product/:id", element: <ProductDetails /> },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={myntraStore}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
