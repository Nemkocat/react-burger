import { Button, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

import { selectTotalPrice } from '@services/burger-constructor/constructorSelectors';
import {
  clearConstructor,
  constructorSlice,
} from '@services/burger-constructor/constructorSlice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { orderSlice } from '@services/order/orderSlice';
import { createOrder } from '@services/order/orderThunk';
import { userSlice } from '@services/user/userSlice';

import { BurgerConstructorBunSlot } from './burger-constructor-bun-slot';
import { BurgerConstructorFillingsZone } from './burger-constructor-fillings-zone';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  onOrderSuccess: () => void;
};

export const BurgerConstructor = ({
  onOrderSuccess,
}: TBurgerConstructorProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const bun = useAppSelector(constructorSlice.selectors.selectConstructorBun);
  const totalPrice = useAppSelector(selectTotalPrice);
  const isOrderLoading = useAppSelector(orderSlice.selectors.selectOrderLoading);
  const isAuthenticated = useAppSelector(userSlice.selectors.selectIsAuthenticated);

  const handleOrderClick = (): void => {
    if (!isAuthenticated) {
      void navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }

    void dispatch(createOrder())
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
        onOrderSuccess();
      })
      .catch(() => undefined);
  };

  return (
    <section className={styles.burger_constructor}>
      <ul className={styles.elements}>
        <BurgerConstructorBunSlot position="top" />
        <BurgerConstructorFillingsZone />
        <BurgerConstructorBunSlot position="bottom" />
      </ul>
      <footer className={`${styles.footer} mt-10`}>
        <div className={styles.total}>
          <span className="text text_type_digits-medium mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={handleOrderClick}
          disabled={!bun || isOrderLoading}
        >
          Оформить заказ
        </Button>
      </footer>
    </section>
  );
};
