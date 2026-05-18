import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
  onOrderClick: () => void;
};

export const BurgerConstructor = ({
  ingredients,
  onOrderClick,
}: TBurgerConstructorProps): React.JSX.Element | null => {
  const bun = useMemo(
    () => ingredients.find((ingredient) => ingredient.type === 'bun'),
    [ingredients]
  );

  const fillings = useMemo(
    () => ingredients.filter((ingredient) => ingredient.type !== 'bun').slice(0, 5),
    [ingredients]
  );

  const totalPrice = useMemo(() => {
    if (!bun) {
      return 0;
    }

    return (
      bun.price * 2 + fillings.reduce((sum, ingredient) => sum + ingredient.price, 0)
    );
  }, [bun, fillings]);

  if (!bun) {
    return null;
  }

  return (
    <section className={styles.burger_constructor}>
      <ul className={styles.elements}>
        <li className={`${styles.element} pb-4`}>
          <ConstructorElement
            type="top"
            isLocked
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </li>
        <li className={`${styles.fillings} custom-scroll`}>
          <ul className={styles.fillings_list}>
            {fillings.map((ingredient) => (
              <li key={ingredient._id} className={`${styles.element} pl-6 pr-8`}>
                <DragIcon type="primary" />
                <ConstructorElement
                  text={ingredient.name}
                  price={ingredient.price}
                  thumbnail={ingredient.image}
                />
              </li>
            ))}
          </ul>
        </li>
        <li className={`${styles.element} pt-4`}>
          <ConstructorElement
            type="bottom"
            isLocked
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </li>
      </ul>
      <footer className={`${styles.footer} mt-10`}>
        <div className={styles.total}>
          <span className="text text_type_digits-medium mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button htmlType="button" type="primary" size="large" onClick={onOrderClick}>
          Оформить заказ
        </Button>
      </footer>
    </section>
  );
};
