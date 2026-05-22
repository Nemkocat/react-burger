import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useMemo, useRef, useState } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  onIngredientClick: (ingredient: TIngredient) => void;
};

type TIngredientSection = {
  title: string;
  type: TIngredient['type'];
  ref: React.RefObject<HTMLHeadingElement | null>;
};

export const BurgerIngredients = ({
  ingredients,
  onIngredientClick,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [currentTab, setCurrentTab] = useState('bun');
  const bunsRef = useRef<HTMLHeadingElement>(null);
  const mainsRef = useRef<HTMLHeadingElement>(null);
  const saucesRef = useRef<HTMLHeadingElement>(null);

  const sections: TIngredientSection[] = useMemo(
    () => [
      { title: 'Булки', type: 'bun', ref: bunsRef },
      { title: 'Начинки', type: 'main', ref: mainsRef },
      { title: 'Соусы', type: 'sauce', ref: saucesRef },
    ],
    []
  );

  const ingredientsByType = useMemo(
    () =>
      sections.reduce<Record<string, TIngredient[]>>((acc, section) => {
        acc[section.type] = ingredients.filter(
          (ingredient) => ingredient.type === section.type
        );
        return acc;
      }, {}),
    [ingredients, sections]
  );

  const handleTabClick = (tab: string): void => {
    setCurrentTab(tab);
    const section = sections.find((item) => item.type === tab);
    section?.ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab value="bun" active={currentTab === 'bun'} onClick={handleTabClick}>
            Булки
          </Tab>
          <Tab value="main" active={currentTab === 'main'} onClick={handleTabClick}>
            Начинки
          </Tab>
          <Tab value="sauce" active={currentTab === 'sauce'} onClick={handleTabClick}>
            Соусы
          </Tab>
        </ul>
      </nav>
      <div className={`${styles.list} custom-scroll`}>
        {sections.map((section) => (
          <article key={section.type}>
            <h2
              ref={section.ref}
              className="text text_type_main-medium mt-10 mb-6"
              id={section.type}
            >
              {section.title}
            </h2>
            <ul className={styles.items}>
              {ingredientsByType[section.type]?.map((ingredient) => (
                <li
                  key={ingredient._id}
                  className={styles.item}
                  onClick={() => onIngredientClick(ingredient)}
                >
                  <Counter count={0} extraClass={styles.counter} />
                  <img
                    className={styles.image}
                    src={ingredient.image}
                    alt={ingredient.name}
                  />
                  <div className={styles.price}>
                    <span className="text text_type_digits-default mr-2">
                      {ingredient.price}
                    </span>
                    <CurrencyIcon type="primary" />
                  </div>
                  <p className="text text_type_main-default mt-4">{ingredient.name}</p>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};
