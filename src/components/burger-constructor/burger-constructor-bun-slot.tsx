import { ConstructorElement } from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrop } from 'react-dnd';

import {
  addIngredient,
  constructorSlice,
} from '@services/burger-constructor/constructorSlice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { INGREDIENT_DRAG_TYPE } from '@utils/dnd';

import { BurgerConstructorPlaceholder } from './burger-constructor-placeholder';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorBunSlotProps = {
  position: 'top' | 'bottom';
};

export const BurgerConstructorBunSlot = ({
  position,
}: TBurgerConstructorBunSlotProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const bun = useAppSelector(constructorSlice.selectors.selectConstructorBun);
  const ref = useRef<HTMLLIElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: INGREDIENT_DRAG_TYPE,
    drop: (item: { ingredient: TIngredient }) => {
      if (item.ingredient.type === 'bun') {
        dispatch(addIngredient(item.ingredient));
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(ref);

  const positionLabel = position === 'top' ? 'верх' : 'низ';
  const paddingClass = position === 'top' ? 'pb-4' : 'pt-4';

  return (
    <li
      ref={ref}
      className={`${styles.element} ${paddingClass} ${isOver ? styles.drop_active : ''}`}
    >
      {bun ? (
        <ConstructorElement
          type={position}
          isLocked
          text={`${bun.name} (${positionLabel})`}
          price={bun.price}
          thumbnail={bun.image}
        />
      ) : (
        <BurgerConstructorPlaceholder
          text={`Перетащите булку сюда (${positionLabel})`}
          position={position}
        />
      )}
    </li>
  );
};
