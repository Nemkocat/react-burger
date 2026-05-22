import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  clearSelectedIngredient,
  ingredientModalSlice,
} from '@services/ingredient-modal/ingredientModalSlice';
import { ingredientsSlice } from '@services/ingredients/ingredientsSlice';
import { fetchIngredients } from '@services/ingredients/ingredientsThunk';
import { resetOrder } from '@services/order/orderSlice';

import styles from './app.module.css';

type TModalType = 'ingredient' | 'order' | null;

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(ingredientsSlice.selectors.selectIngredientsLoading);
  const ingredientsError = useAppSelector(
    ingredientsSlice.selectors.selectIngredientsError
  );
  const selectedIngredient = useAppSelector(
    ingredientModalSlice.selectors.selectSelectedIngredient
  );
  const [modalType, setModalType] = useState<TModalType>(null);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    if (selectedIngredient) {
      setModalType('ingredient');
    }
  }, [selectedIngredient]);

  const handleCloseModal = useCallback((): void => {
    setModalType(null);
    dispatch(clearSelectedIngredient());
    dispatch(resetOrder());
  }, [dispatch]);

  const handleOrderSuccess = useCallback((): void => {
    setModalType('order');
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  if (ingredientsError) {
    return (
      <div className={styles.app}>
        <p className="text text_type_main-large p-5">
          Не удалось загрузить ингредиенты: {ingredientsError}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor onOrderSuccess={handleOrderSuccess} />
      </main>
      {modalType === 'ingredient' && selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
      {modalType === 'order' && (
        <Modal title="" onClose={handleCloseModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;
