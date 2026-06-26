import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@services/hooks';
import { logoutUser } from '@services/user/userThunk';

import styles from './profile-page.module.css';

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    void dispatch(logoutUser())
      .unwrap()
      .then(() => {
        void navigate('/login', { replace: true });
      })
      .catch(() => undefined);
  };

  return (
    <div className={styles.profile}>
      <nav className={styles.menu}>
        <NavLink
          to="/profile"
          end
          className={({ isActive }) =>
            `${styles.link} text text_type_main-medium ${isActive ? styles.link_active : ''}`
          }
        >
          Профиль
        </NavLink>
        <NavLink
          to="/profile/orders"
          className={({ isActive }) =>
            `${styles.link} text text_type_main-medium ${isActive ? styles.link_active : ''}`
          }
        >
          История заказов
        </NavLink>
        <button
          type="button"
          className={`${styles.logout} text text_type_main-medium`}
          onClick={handleLogout}
        >
          Выход
        </button>
        <p className={`${styles.hint} text text_type_main-default text_color_inactive`}>
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </nav>
      <Outlet />
    </div>
  );
};
