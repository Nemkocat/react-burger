import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Navigate } from 'react-router-dom';

import { useAppSelector } from '@services/hooks';
import { userSlice } from '@services/user/userSlice';

type TGuestRouteProps = {
  children: React.ReactNode;
};

export const GuestRoute = ({ children }: TGuestRouteProps): React.JSX.Element => {
  const isAuthenticated = useAppSelector(userSlice.selectors.selectIsAuthenticated);
  const isAuthChecked = useAppSelector(userSlice.selectors.selectIsAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
