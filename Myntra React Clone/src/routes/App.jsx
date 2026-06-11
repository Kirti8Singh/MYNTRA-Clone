import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FetchItems from "../components/FetchItems";
import LoadingSpinner from "../components/LoadingSpinner";

function App() {
  const fetchStatus = useSelector((store) => store.fetchStatus);

  return (
    <>
      {/* Background data process to handshake with API server */}
      <FetchItems />
      <Header />

      {/* Renders loading spinner while waiting for backend, otherwise yields views */}
      {fetchStatus.currentlyFetching ? <LoadingSpinner /> : <Outlet />}

      <Footer />
    </>
  );
}

export default App;
