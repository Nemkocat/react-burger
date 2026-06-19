import { useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { useAppSelector } from '@services/hooks';
import { ingredientsSlice } from '@services/ingredients/ingredientsSlice';

export const IngredientPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useAppSelector(ingredientsSlice.selectors.selectIngredients);
  const ingredient = ingredients.find((item) => item._id === id);

  if (!ingredient) {
    return (
      <main className="mt-30">
        <p className="text text_type_main-default">Ингредиент не найден</p>
      </main>
    );
  }

  return (
    <main className="mt-30">
      <IngredientDetails ingredient={ingredient} />
    </main>
  );
};
