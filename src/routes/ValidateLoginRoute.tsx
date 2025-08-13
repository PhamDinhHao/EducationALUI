import { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useBoundStore } from "@/shared/stores";
import { PagePath } from "@/shared/core/enum/page.enum";
type Props = {
  children?: ReactNode;
};

const ValidateLoginRoute = ({ children }: Props) => {
  const location = useLocation();
  const user = useBoundStore((state) => state.user);

  // Nếu đã có user data thì chuyển về trang chủ
  if (user) {
    return <Navigate state={{ from: location }} to={PagePath.HOME} replace />;
  }

  if (children) {
    return <>{children}</>;
  }
  
  return <Outlet />;
};

export default ValidateLoginRoute;
