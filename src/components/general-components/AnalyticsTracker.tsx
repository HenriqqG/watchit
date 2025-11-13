import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const GA_MEASUREMENT_ID = "G-R3FQQPTKWG";

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location.pathname, location.search]);

  return <Outlet />;
};

export default AnalyticsTracker;