import { useEffect } from 'react';

import { OrderCard } from '@components/order-card/order-card';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  profileOrdersConnect,
  profileOrdersDisconnect,
  profileOrdersSlice,
} from '@services/profile-orders/profileOrdersSlice';
import { WS_ORDERS_USER_URL } from '@utils/constants';

import styles from './profile-orders-page.module.css';

export const ProfileOrdersPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(profileOrdersSlice.selectors.selectProfileOrders);
  const error = useAppSelector(profileOrdersSlice.selectors.selectProfileOrdersError);

  useEffect(() => {
    dispatch(profileOrdersConnect(WS_ORDERS_USER_URL));

    return (): void => {
      dispatch(profileOrdersDisconnect());
    };
  }, [dispatch]);

  return (
    <section className={`${styles.section} custom-scroll`}>
      {error && (
        <p className="text text_type_main-default text_color_inactive mb-6">{error}</p>
      )}
      <ul className={styles.list}>
        {orders.map((order) => (
          <li key={order._id}>
            <OrderCard
              order={order}
              showStatus
              linkTo={`/profile/orders/${order.number}`}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
