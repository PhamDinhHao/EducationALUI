import { Navigate, useLocation } from "react-router-dom";
import { PagePath } from "@/shared/core/enum/page.enum";

const NavigateComponent = () => {
  const location = useLocation();

  if (location.pathname === '/') {
    return <Navigate to={PagePath.HOME} replace />;
  }

  return null;
};

export default NavigateComponent;
