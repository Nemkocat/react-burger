import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from '@services/hooks';
import { userSlice } from '@services/user/userSlice';

type TProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({
  children,
}: TProtectedRouteProps): React.JSX.Element => {
  const isAuthenticated = useAppSelector(userSlice.selectors.selectIsAuthenticated);
  const isAuthChecked = useAppSelector(userSlice.selectors.selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
