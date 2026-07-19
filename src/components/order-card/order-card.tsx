import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

import { useAppSelector } from '@services/hooks';
import { ingredientsSlice } from '@services/ingredients/ingredientsSlice';
import { MAX_VISIBLE_INGREDIENTS, ORDER_MODAL_FLAG } from '@utils/constants';
import {
  formatOrderDate,
  getOrderName,
  getOrderPrice,
  getOrderStatusText,
} from '@utils/orders';

import type { TOrder } from '@utils/types';

import styles from './order-card.module.css';

type TOrderCardProps = {
  order: TOrder;
  showStatus?: boolean;
  linkTo: string;
};

export const OrderCard = ({
  order,
  showStatus = false,
  linkTo,
}: TOrderCardProps): React.JSX.Element => {
  const location = useLocation();
  const ingredients = useAppSelector(ingredientsSlice.selectors.selectIngredients);
  const orderIngredients = order.ingredients
    .map((id) => ingredients.find((item) => item._id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const visibleIngredients = orderIngredients.slice(0, MAX_VISIBLE_INGREDIENTS);
  const hiddenCount = orderIngredients.length - visibleIngredients.length;
  const price = getOrderPrice(order, ingredients);
  const name = getOrderName(order, ingredients);
  const statusText = getOrderStatusText(order.status);

  return (
    <Link
      to={linkTo}
      state={{ background: location }}
      className={styles.card}
      onClick={() => {
        sessionStorage.setItem(ORDER_MODAL_FLAG, 'true');
      }}
    >
      <div className={styles.header}>
        <p className="text text_type_digits-default">#{order.number}</p>
        <p className="text text_type_main-default text_color_inactive">
          {formatOrderDate(order.createdAt)}
        </p>
      </div>
      <h2 className={`${styles.name} text text_type_main-medium mt-6`}>{name}</h2>
      {showStatus && (
        <p
          className={`${styles.status} text text_type_main-default mt-2 ${
            order.status === 'done' ? styles.status_done : ''
          }`}
        >
          {statusText}
        </p>
      )}
      <div className={`${styles.footer} mt-6`}>
        <ul className={styles.ingredients}>
          {visibleIngredients.map((ingredient, index) => {
            const isLast = index === visibleIngredients.length - 1 && hiddenCount > 0;

            return (
              <li
                key={`${ingredient._id}-${index}`}
                className={styles.ingredient}
                style={{ zIndex: visibleIngredients.length - index }}
              >
                <img
                  className={styles.ingredientImage}
                  src={ingredient.image_mobile}
                  alt={ingredient.name}
                />
                {isLast && (
                  <span
                    className={`${styles.more} text text_type_main-default`}
                  >{`+${hiddenCount}`}</span>
                )}
              </li>
            );
          })}
        </ul>
        <div className={styles.price}>
          <span className="text text_type_digits-default mr-2">{price}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </Link>
  );
};
