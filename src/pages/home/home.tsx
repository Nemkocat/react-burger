import { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { useAppDispatch } from '@services/hooks';
import { resetOrder } from '@services/order/orderSlice';

import styles from './home.module.css';

export const Home = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleCloseOrderModal = useCallback((): void => {
    setIsOrderModalOpen(false);
    dispatch(resetOrder());
  }, [dispatch]);

  const handleOrderSuccess = useCallback((): void => {
    setIsOrderModalOpen(true);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor onOrderSuccess={handleOrderSuccess} />
      </main>
      {isOrderModalOpen && (
        <Modal title="" onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </DndProvider>
  );
};
