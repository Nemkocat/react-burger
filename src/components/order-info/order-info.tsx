import { CurrencyIcon, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';

import { feedOrdersSlice } from '@services/feed-orders/feedOrdersSlice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { ingredientsSlice } from '@services/ingredients/ingredientsSlice';
import {
  clearCurrentOrder,
  fetchOrderByNumber,
  profileOrdersSlice,
} from '@services/profile-orders/profileOrdersSlice';
import {
  formatOrderDate,
  getCountedIngredients,
  getOrderName,
  getOrderPrice,
  getOrderStatusText,
} from '@utils/orders';

import type { TOrder } from '@utils/types';

import styles from './order-info.module.css';

type TOrderInfoProps = {
  orderNumber: string;
  isModal?: boolean;
};

const findOrder = (
  orderNumber: string,
  feedOrders: TOrder[],
  profileOrders: TOrder[],
  currentOrder: TOrder | null
): TOrder | null => {
  const number = Number(orderNumber);

  return (
    feedOrders.find((order) => order.number === number) ??
    profileOrders.find((order) => order.number === number) ??
    (currentOrder?.number === number ? currentOrder : null)
  );
};

export const OrderInfo = ({
  orderNumber,
  isModal = false,
}: TOrderInfoProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(ingredientsSlice.selectors.selectIngredients);
  const feedOrders = useAppSelector(feedOrdersSlice.selectors.selectFeedOrders);
  const profileOrders = useAppSelector(profileOrdersSlice.selectors.selectProfileOrders);
  const currentOrder = useAppSelector(profileOrdersSlice.selectors.selectCurrentOrder);
  const currentOrderError = useAppSelector(
    profileOrdersSlice.selectors.selectCurrentOrderError
  );

  const order = useMemo(
    () => findOrder(orderNumber, feedOrders, profileOrders, currentOrder),
    [orderNumber, feedOrders, profileOrders, currentOrder]
  );

  useEffect(() => {
    if (!order) {
      void dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, order, orderNumber]);

  useEffect(() => {
    return (): void => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch]);

  if (!order) {
    if (currentOrderError) {
      return <p className="text text_type_main-default">{currentOrderError}</p>;
    }

    return <Preloader />;
  }

  const countedIngredients = getCountedIngredients(order, ingredients);
  const price = getOrderPrice(order, ingredients);
  const name = getOrderName(order, ingredients);
  const statusText = getOrderStatusText(order.status);

  return (
    <div className={`${styles.root} ${isModal ? styles.root_modal : styles.root_page}`}>
      {!isModal && (
        <p className={`${styles.number} text text_type_digits-default mb-10`}>
          #{order.number}
        </p>
      )}
      <h2 className={`${styles.name} text text_type_main-medium`}>{name}</h2>
      <p
        className={`${styles.status} text text_type_main-default mt-3 ${
          order.status === 'done' ? styles.status_done : ''
        }`}
      >
        {statusText}
      </p>
      <h3 className="text text_type_main-medium mt-15 mb-6">Состав:</h3>
      <ul className={`${styles.list} custom-scroll`}>
        {countedIngredients.map(({ ingredient, count }) => (
          <li key={ingredient._id} className={styles.item}>
            <div className={styles.ingredient}>
              <img
                className={styles.ingredientImage}
                src={ingredient.image_mobile}
                alt={ingredient.name}
              />
            </div>
            <p className={`${styles.ingredientName} text text_type_main-default`}>
              {ingredient.name}
            </p>
            <div className={styles.price}>
              <span className="text text_type_digits-default">
                {count} x {ingredient.price}
              </span>
              <CurrencyIcon type="primary" />
            </div>
          </li>
        ))}
      </ul>
      <div className={`${styles.footer} mt-10`}>
        <p className="text text_type_main-default text_color_inactive">
          {formatOrderDate(order.createdAt)}
        </p>
        <div className={styles.price}>
          <span className="text text_type_digits-default">{price}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};
