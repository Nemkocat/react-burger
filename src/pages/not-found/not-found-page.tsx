import { Link } from 'react-router-dom';

export const NotFoundPage = (): React.JSX.Element => {
  return (
    <main className="mt-30">
      <h1 className="text text_type_main-large">404</h1>
      <p className="text text_type_main-default text_color_inactive mt-5 mb-10">
        Страница не найдена
      </p>
      <Link to="/" className="text text_type_main-default">
        Вернуться на главную
      </Link>
    </main>
  );
};
