import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import { ORDER_DETAILS } from '@utils/order-details-data';

import styles from './order-details.module.css';

export const OrderDetails = (): React.JSX.Element => (
  <section className={`${styles.content} pt-10 pb-10`}>
    <p className={`${styles.title} text text_type_digits-large mb-2`}>
      {String(ORDER_DETAILS.number).padStart(6, '0')}
    </p>
    <p className="text text_type_main-default text_color_inactive mb-15">
      {ORDER_DETAILS.identifierLabel}
    </p>
    <CheckMarkIcon type="success" className={styles.icon} />
    <p className="text text_type_main-medium mb-3 mt-8">{ORDER_DETAILS.title}</p>
    <p className="text text_type_main-default text_color_inactive">
      {ORDER_DETAILS.subtitle}
    </p>
  </section>
);
