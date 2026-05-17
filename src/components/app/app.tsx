import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { getIngredients } from '@utils/api';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

type TModalType = 'ingredient' | 'order' | null;

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalType, setModalType] = useState<TModalType>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);

  useEffect(() => {
    getIngredients()
      .then((data) => {
        setIngredients(data);
      })
      .catch(() => {
        setIngredients([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleCloseModal = useCallback((): void => {
    setModalType(null);
    setSelectedIngredient(null);
  }, []);

  const handleIngredientClick = useCallback((ingredient: TIngredient): void => {
    setSelectedIngredient(ingredient);
    setModalType('ingredient');
  }, []);

  const handleOrderClick = useCallback((): void => {
    setModalType('order');
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients
          ingredients={ingredients}
          onIngredientClick={handleIngredientClick}
        />
        <BurgerConstructor ingredients={ingredients} onOrderClick={handleOrderClick} />
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
