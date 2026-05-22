import { useRef } from 'react';
import { useDrop } from 'react-dnd';

import {
  addIngredient,
  constructorSlice,
} from '@services/burger-constructor/constructorSlice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { INGREDIENT_DRAG_TYPE } from '@utils/dnd';

import { BurgerConstructorFilling } from './burger-constructor-filling';
import { BurgerConstructorPlaceholder } from './burger-constructor-placeholder';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

export const BurgerConstructorFillingsZone = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const fillings = useAppSelector(constructorSlice.selectors.selectConstructorFillings);
  const ref = useRef<HTMLLIElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: INGREDIENT_DRAG_TYPE,
    drop: (item: { ingredient: TIngredient }) => {
      if (item.ingredient.type !== 'bun') {
        dispatch(addIngredient(item.ingredient));
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(ref);

  return (
    <li
      ref={ref}
      className={`${styles.fillings} custom-scroll ${isOver ? styles.drop_active : ''}`}
    >
      <ul className={styles.fillings_list}>
        {fillings.length === 0 ? (
          <li className={styles.element}>
            <BurgerConstructorPlaceholder text="Перетащите начинку сюда" />
          </li>
        ) : (
          fillings.map((ingredient, index) => (
            <BurgerConstructorFilling
              key={ingredient.uniqueId}
              ingredient={ingredient}
              index={index}
            />
          ))
        )}
      </ul>
    </li>
  );
};
