import styles from './burger-constructor.module.css';

type TBurgerConstructorPlaceholderProps = {
  text: string;
  position?: 'top' | 'bottom';
};

export const BurgerConstructorPlaceholder = ({
  text,
  position,
}: TBurgerConstructorPlaceholderProps): React.JSX.Element => {
  const positionClass = position
    ? styles[`placeholder_${position}`]
    : styles.placeholder_filling;

  return (
    <div
      className={`${styles.placeholder} ${positionClass} text text_type_main-default text_color_inactive`}
    >
      {text}
    </div>
  );
};
