import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import { ORDER_DETAILS } from '@utils/order-details-data';

import styles from './order-details.module.css';

export const OrderDetails = (): React.JSX.Element => (
  <section className={`${styles.content} pt-10 pb-10`}>
    <CheckMarkIcon type="success" className={styles.icon} />
    <h2 className={`${styles.title} text text_type_digits-large mt-2 mb-8`}>
      {String(ORDER_DETAILS.number).padStart(6, '0')}
    </h2>
    <p className="text text_type_main-medium mb-3">{ORDER_DETAILS.name}</p>
    <p className="text text_type_main-default text_color_inactive mb-15">
      {ORDER_DETAILS.status}
    </p>
    <p className="text text_type_main-default">{ORDER_DETAILS.statusDetail}</p>
  </section>
);
