import styles from './feed-page.module.css';

export const FeedPage = (): React.JSX.Element => {
  return (
    <main className={styles.content}>
      <h1 className="text text_type_main-large">Лента заказов</h1>
      <p className="text text_type_main-default text_color_inactive mt-5">
        Страница находится в разработке
      </p>
    </main>
  );
};
