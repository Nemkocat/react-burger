import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import { useAppSelector } from '@services/hooks';
import { orderSlice } from '@services/order/orderSlice';

import styles from './order-details.module.css';

export const OrderDetails = (): React.JSX.Element | null => {
  const orderNumber = useAppSelector(orderSlice.selectors.selectOrderNumber);
  const orderName = useAppSelector(orderSlice.selectors.selectOrderName);

  if (orderNumber === null) {
    return null;
  }

  return (
    <section className={`${styles.content} pt-10 pb-10`}>
      <p className={`${styles.title} text text_type_digits-large mb-2`}>
        {String(orderNumber).padStart(6, '0')}
      </p>
      <p className="text text_type_main-default text_color_inactive mb-15">
        Ваш заказ начали готовить
      </p>
      <CheckMarkIcon type="success" className={styles.icon} />
      <p className="text text_type_main-medium mb-3 mt-8">{orderName}</p>
      <p className="text text_type_main-default text_color_inactive">
        Дождитесь его на орбитальной станции
      </p>
    </section>
  );
};
