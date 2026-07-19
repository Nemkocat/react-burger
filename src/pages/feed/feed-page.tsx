import { useEffect } from 'react';

import { OrderCard } from '@components/order-card/order-card';
import { OrdersStatusBoard } from '@components/orders-status-board/orders-status-board';
import {
  feedOrdersConnect,
  feedOrdersDisconnect,
  feedOrdersSlice,
} from '@services/feed-orders/feedOrdersSlice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { WS_ORDERS_ALL_URL } from '@utils/constants';

import styles from './feed-page.module.css';

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(feedOrdersSlice.selectors.selectFeedOrders);
  const total = useAppSelector(feedOrdersSlice.selectors.selectFeedTotal);
  const totalToday = useAppSelector(feedOrdersSlice.selectors.selectFeedTotalToday);
  const error = useAppSelector(feedOrdersSlice.selectors.selectFeedOrdersError);

  useEffect(() => {
    dispatch(feedOrdersConnect(WS_ORDERS_ALL_URL));

    return (): void => {
      dispatch(feedOrdersDisconnect());
    };
  }, [dispatch]);

  return (
    <main className={styles.main}>
      <h1 className={`${styles.title} text text_type_main-large pt-10 pb-5`}>
        Лента заказов
      </h1>
      <div className={styles.content}>
        <section className={`${styles.listSection} custom-scroll`}>
          {error && (
            <p className="text text_type_main-default text_color_inactive">{error}</p>
          )}
          <ul className={styles.list}>
            {orders.map((order) => (
              <li key={order._id}>
                <OrderCard order={order} linkTo={`/feed/${order.number}`} />
              </li>
            ))}
          </ul>
        </section>
        <OrdersStatusBoard orders={orders} total={total} totalToday={totalToday} />
      </div>
    </main>
  );
};
