import { ReactNode, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useBoundStore } from "@/shared/stores";
import { getProfile } from "@/shared/services/auth.service";
import { Spin } from "antd";

type Props = {
  children?: ReactNode;
};

const PrivateRoute = ({ children }: Props) => {
  const location = useLocation();
  const user = useBoundStore((state) => state.user);
  const updateProfile = useBoundStore((state) => state.userProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileResponse = await getProfile();
        const profileData = profileResponse?.data?.data || {};
        if (profileData) {
          updateProfile(profileData);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [updateProfile]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate state={{ from: location }} to="/login" replace />;
  }

  if (children) {
    return <>{children}</>;
  }
  
  return <Outlet />;
};

export default PrivateRoute;
