import { CurrencyIcon, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import {
  feedOrdersConnect,
  feedOrdersDisconnect,
  feedOrdersSlice,
} from '@services/feed-orders/feedOrdersSlice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { ingredientsSlice } from '@services/ingredients/ingredientsSlice';
import {
  clearCurrentOrder,
  fetchOrderByNumber,
  profileOrdersConnect,
  profileOrdersDisconnect,
  profileOrdersSlice,
} from '@services/profile-orders/profileOrdersSlice';
import { WS_ORDERS_ALL_URL, WS_ORDERS_USER_URL } from '@utils/constants';
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

const isMongoObjectId = (value: string): boolean => /^[a-f\d]{24}$/i.test(value);

const findOrder = (
  orderNumber: string,
  feedOrders: TOrder[],
  profileOrders: TOrder[],
  currentOrder: TOrder | null
): TOrder | null => {
  const matches = (order: TOrder): boolean =>
    order._id === orderNumber || String(order.number) === orderNumber;

  return (
    feedOrders.find(matches) ??
    profileOrders.find(matches) ??
    (currentOrder && matches(currentOrder) ? currentOrder : null)
  );
};

export const OrderInfo = ({
  orderNumber,
  isModal = false,
}: TOrderInfoProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const ingredients = useAppSelector(ingredientsSlice.selectors.selectIngredients);
  const feedOrders = useAppSelector(feedOrdersSlice.selectors.selectFeedOrders);
  const feedOrdersLoaded = useAppSelector(
    feedOrdersSlice.selectors.selectFeedOrdersLoaded
  );
  const profileOrders = useAppSelector(profileOrdersSlice.selectors.selectProfileOrders);
  const profileOrdersLoaded = useAppSelector(
    profileOrdersSlice.selectors.selectProfileOrdersLoaded
  );
  const currentOrder = useAppSelector(profileOrdersSlice.selectors.selectCurrentOrder);
  const currentOrderLoading = useAppSelector(
    profileOrdersSlice.selectors.selectCurrentOrderLoading
  );
  const currentOrderError = useAppSelector(
    profileOrdersSlice.selectors.selectCurrentOrderError
  );

  const isFeedRoute = location.pathname.startsWith('/feed');
  const isProfileRoute = location.pathname.startsWith('/profile/orders');

  const order = useMemo(
    () => findOrder(orderNumber, feedOrders, profileOrders, currentOrder),
    [orderNumber, feedOrders, profileOrders, currentOrder]
  );

  useEffect(() => {
    // На отдельной странице сокет родительского списка не открыт — подключаемся сами.
    // В модалке список уже держит соединение, повторно закрывать его нельзя.
    if (order || isModal) {
      return;
    }

    if (isFeedRoute) {
      dispatch(feedOrdersConnect(WS_ORDERS_ALL_URL));

      return (): void => {
        dispatch(feedOrdersDisconnect());
      };
    }

    if (isProfileRoute) {
      dispatch(profileOrdersConnect(WS_ORDERS_USER_URL));

      return (): void => {
        dispatch(profileOrdersDisconnect());
      };
    }
  }, [dispatch, order, isModal, isFeedRoute, isProfileRoute]);

  useEffect(() => {
    if (order) {
      return;
    }

    const socketLoaded = isFeedRoute
      ? feedOrdersLoaded
      : isProfileRoute
        ? profileOrdersLoaded
        : true;

    if (!socketLoaded) {
      return;
    }

    const orderFromSocket = findOrder(orderNumber, feedOrders, profileOrders, null);

    // GET /orders/:number на бэкенде отдаёт 500; по _id работает.
    // Числовой id берём только из сокета; REST — только для ObjectId.
    if (!orderFromSocket && isMongoObjectId(orderNumber)) {
      void dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [
    dispatch,
    order,
    orderNumber,
    isFeedRoute,
    isProfileRoute,
    feedOrdersLoaded,
    profileOrdersLoaded,
    feedOrders,
    profileOrders,
  ]);

  useEffect(() => {
    return (): void => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch]);

  if (!order) {
    if (currentOrderError) {
      return <p className="text text_type_main-default">{currentOrderError}</p>;
    }

    const waitingForSocket =
      (isFeedRoute && !feedOrdersLoaded) || (isProfileRoute && !profileOrdersLoaded);

    if (waitingForSocket || currentOrderLoading) {
      return <Preloader />;
    }

    return <p className="text text_type_main-default">Заказ не найден</p>;
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
