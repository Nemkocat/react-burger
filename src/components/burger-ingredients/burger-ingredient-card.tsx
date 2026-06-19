import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { useLocation, useNavigate } from 'react-router-dom';

import { INGREDIENT_MODAL_FLAG } from '@utils/constants';
import { INGREDIENT_DRAG_TYPE } from '@utils/dnd';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientCardProps = {
  ingredient: TIngredient;
  count: number;
};

export const BurgerIngredientCard = ({
  ingredient,
  count,
}: TBurgerIngredientCardProps): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef<HTMLLIElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: INGREDIENT_DRAG_TYPE,
    item: { ingredient },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(ref);

  const handleClick = (): void => {
    sessionStorage.setItem(INGREDIENT_MODAL_FLAG, 'true');
    void navigate(`/ingredients/${ingredient._id}`, {
      state: { background: location },
    });
  };

  return (
    <li
      ref={ref}
      className={styles.item}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={handleClick}
    >
      {count > 0 && <Counter count={count} extraClass={styles.counter} />}
      <img className={styles.image} src={ingredient.image} alt={ingredient.name} />
      <div className={styles.price}>
        <span className="text text_type_digits-default mr-2">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <p className="text text_type_main-default mt-4">{ingredient.name}</p>
    </li>
  );
};
