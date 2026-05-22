import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useRef, useState } from 'react';

import { selectIngredientCounts } from '@services/burger-constructor/constructorSelectors';
import { useAppSelector } from '@services/hooks';
import { ingredientsSlice } from '@services/ingredients/ingredientsSlice';

import { BurgerIngredientCard } from './burger-ingredient-card';

import type { TIngredient, TIngredientType } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TIngredientSection = {
  title: string;
  type: TIngredientType;
  ref: React.RefObject<HTMLHeadingElement | null>;
};

export const BurgerIngredients = (): React.JSX.Element => {
  const ingredients = useAppSelector(ingredientsSlice.selectors.selectIngredients);
  const ingredientCounts = useAppSelector(selectIngredientCounts);
  const [currentTab, setCurrentTab] = useState<TIngredientType>('bun');
  const listRef = useRef<HTMLDivElement>(null);
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
      sections.reduce<Record<TIngredientType, TIngredient[]>>(
        (acc, section) => {
          acc[section.type] = ingredients.filter(
            (ingredient) => ingredient.type === section.type
          );
          return acc;
        },
        { bun: [], main: [], sauce: [] }
      ),
    [ingredients, sections]
  );

  useEffect(() => {
    const container = listRef.current;

    if (!container) {
      return;
    }

    const handleScroll = (): void => {
      const containerTop = container.getBoundingClientRect().top;

      let nearestSection = sections[0];
      let minDistance = Infinity;

      sections.forEach((section) => {
        const heading = section.ref.current;

        if (!heading) {
          return;
        }

        const distance = Math.abs(heading.getBoundingClientRect().top - containerTop);

        if (distance < minDistance) {
          minDistance = distance;
          nearestSection = section;
        }
      });

      setCurrentTab(nearestSection.type);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll();

    return (): void => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [sections]);

  const handleTabClick = (tab: string): void => {
    setCurrentTab(tab as TIngredientType);
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
      <div ref={listRef} className={`${styles.list} custom-scroll`}>
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
              {ingredientsByType[section.type].map((ingredient) => (
                <BurgerIngredientCard
                  key={ingredient._id}
                  ingredient={ingredient}
                  count={ingredientCounts[ingredient._id] ?? 0}
                />
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};
