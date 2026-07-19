import { MAX_STATUS_COLUMNS, ORDERS_PER_STATUS_COLUMN } from '@utils/constants';
import { splitOrdersByColumns } from '@utils/orders';

import type { TOrder } from '@utils/types';

import styles from './orders-status-board.module.css';

type TOrdersStatusBoardProps = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export const OrdersStatusBoard = ({
  orders,
  total,
  totalToday,
}: TOrdersStatusBoardProps): React.JSX.Element => {
  const doneNumbers = orders
    .filter((order) => order.status === 'done')
    .map((order) => order.number);
  const pendingNumbers = orders
    .filter((order) => order.status === 'pending' || order.status === 'created')
    .map((order) => order.number);

  const doneColumns = splitOrdersByColumns(
    doneNumbers,
    ORDERS_PER_STATUS_COLUMN,
    MAX_STATUS_COLUMNS
  );
  const pendingColumns = splitOrdersByColumns(
    pendingNumbers,
    ORDERS_PER_STATUS_COLUMN,
    MAX_STATUS_COLUMNS
  );

  return (
    <section className={styles.board}>
      <div className={styles.statuses}>
        <div className={styles.statusBlock}>
          <h3 className="text text_type_main-medium mb-6">Готовы:</h3>
          <div className={styles.columns}>
            {doneColumns.map((column, columnIndex) => (
              <ul key={`done-${columnIndex}`} className={styles.list}>
                {column.map((number) => (
                  <li
                    key={number}
                    className={`${styles.doneNumber} text text_type_digits-default mb-2`}
                  >
                    {String(number).padStart(6, '0')}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div className={styles.statusBlock}>
          <h3 className="text text_type_main-medium mb-6">В работе:</h3>
          <div className={styles.columns}>
            {pendingColumns.map((column, columnIndex) => (
              <ul key={`pending-${columnIndex}`} className={styles.list}>
                {column.map((number) => (
                  <li key={number} className="text text_type_digits-default mb-2">
                    {String(number).padStart(6, '0')}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-15">
        <h3 className="text text_type_main-medium">Выполнено за все время:</h3>
        <p className={`${styles.total} text text_type_digits-large`}>{total}</p>
      </div>
      <div className="mt-15">
        <h3 className="text text_type_main-medium">Выполнено за сегодня:</h3>
        <p className={`${styles.total} text text_type_digits-large`}>{totalToday}</p>
      </div>
    </section>
  );
};
