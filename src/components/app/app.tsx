import { GuestRoute } from '@hocs/guest-route/guest-route';
import { ProtectedRoute } from '@hocs/protected-route/protected-route';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect } from 'react';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  type Location,
} from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { FeedPage } from '@pages/feed/feed-page';
import { ForgotPasswordPage } from '@pages/forgot-password/forgot-password-page';
import { Home } from '@pages/home/home';
import { IngredientPage } from '@pages/ingredient-page/ingredient-page';
import { LoginPage } from '@pages/login/login-page';
import { NotFoundPage } from '@pages/not-found/not-found-page';
import { ProfileOrdersPage } from '@pages/profile-orders/profile-orders-page';
import { ProfileForm } from '@pages/profile/profile-form';
import { ProfilePage } from '@pages/profile/profile-page';
import { RegisterPage } from '@pages/register/register-page';
import { ResetPasswordPage } from '@pages/reset-password/reset-password-page';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { ingredientsSlice } from '@services/ingredients/ingredientsSlice';
import { fetchIngredients } from '@services/ingredients/ingredientsThunk';
import { checkUserAuth } from '@services/user/userThunk';
import { INGREDIENT_MODAL_FLAG } from '@utils/constants';

import styles from './app.module.css';

const IngredientModal = (): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const ingredients = useAppSelector(ingredientsSlice.selectors.selectIngredients);
  const ingredient = ingredients.find((item) => item._id === id);

  const handleClose = useCallback((): void => {
    sessionStorage.removeItem(INGREDIENT_MODAL_FLAG);
    const background = (location.state as { background?: Location })?.background;

    if (background) {
      void navigate(background.pathname + background.search, { replace: true });
    } else {
      void navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  if (!ingredient) {
    return null;
  }

  return (
    <Modal title="Детали ингредиента" onClose={handleClose}>
      <IngredientDetails ingredient={ingredient} />
    </Modal>
  );
};

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const stateBackground = (location.state as { background?: Location })?.background;

  const isModalIngredientRoute =
    location.pathname.startsWith('/ingredients/') &&
    (Boolean(stateBackground) ||
      sessionStorage.getItem(INGREDIENT_MODAL_FLAG) === 'true');

  const pageLocation: Location = isModalIngredientRoute
    ? (stateBackground ?? { ...location, pathname: '/', search: '', hash: '' })
    : location;

  const isLoading = useAppSelector(ingredientsSlice.selectors.selectIngredientsLoading);
  const ingredientsError = useAppSelector(
    ingredientsSlice.selectors.selectIngredientsError
  );

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (ingredientsError) {
    return (
      <div className={styles.app}>
        <p className="text text_type_main-large p-5">
          Не удалось загрузить ингредиенты: {ingredientsError}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={pageLocation}>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPasswordPage />
            </GuestRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <GuestRoute>
              <ResetPasswordPage />
            </GuestRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileForm />} />
          <Route path="orders" element={<ProfileOrdersPage />} />
        </Route>
        <Route path="/ingredients/:id" element={<IngredientPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {isModalIngredientRoute && (
        <Routes>
          <Route path="/ingredients/:id" element={<IngredientModal />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
