import type { TIngredient } from '@utils/types';

import styles from './ingredient-details.module.css';

type TIngredientDetailsProps = {
  ingredient: TIngredient;
};

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetailsProps): React.JSX.Element => {
  const nutrients = [
    { label: 'Калории, ккал', value: ingredient.calories },
    { label: 'Белки, г', value: ingredient.proteins },
    { label: 'Жиры, г', value: ingredient.fat },
    { label: 'Углеводы, г', value: ingredient.carbohydrates },
  ];

  return (
    <section className={`${styles.content} pt-10 pb-10`}>
      <img className={styles.image} src={ingredient.image_large} alt={ingredient.name} />
      <h3 className="text text_type_main-medium mt-2 mb-8">{ingredient.name}</h3>
      <ul
        className={`${styles.nutrients} text text_type_main-default text_color_inactive`}
      >
        {nutrients.map((item) => (
          <li key={item.label} className={styles.nutrient}>
            <p className="text text_type_main-default text_color_inactive mb-2">
              {item.label}
            </p>
            <p className="text text_type_digits-default text_color_inactive">
              {item.value}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};
