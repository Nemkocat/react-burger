import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import {
  moveIngredient,
  removeIngredient,
} from '@services/burger-constructor/constructorSlice';
import { useAppDispatch } from '@services/hooks';
import { CONSTRUCTOR_ITEM_DRAG_TYPE } from '@utils/dnd';

import type { TConstructorIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TDragItem = {
  uniqueId: string;
  index: number;
};

type TBurgerConstructorFillingProps = {
  ingredient: TConstructorIngredient;
  index: number;
};

export const BurgerConstructorFilling = ({
  ingredient,
  index,
}: TBurgerConstructorFillingProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLLIElement>(null);

  const [{ handlerId }, drop] = useDrop<TDragItem, void, { handlerId: unknown }>({
    accept: CONSTRUCTOR_ITEM_DRAG_TYPE,
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) {
        return;
      }

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      dispatch(moveIngredient({ from: dragIndex, to: hoverIndex }));
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: CONSTRUCTOR_ITEM_DRAG_TYPE,
    item: (): TDragItem => ({
      uniqueId: ingredient.uniqueId,
      index,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const handleClose = (): void => {
    dispatch(removeIngredient(ingredient.uniqueId));
  };

  return (
    <li
      ref={ref}
      className={`${styles.element} pl-6 pr-8`}
      style={{ opacity: isDragging ? 0 : 1 }}
      data-handler-id={handlerId}
    >
      <DragIcon type="primary" />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={handleClose}
      />
    </li>
  );
};
