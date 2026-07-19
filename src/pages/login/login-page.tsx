import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { AsteriskPasswordInput } from '@components/asterisk-password-input/asterisk-password-input';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { userSlice } from '@services/user/userSlice';
import { loginUser } from '@services/user/userThunk';

import formStyles from '../auth-form/auth-form.module.css';

export const LoginPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useAppSelector(userSlice.selectors.selectUserError);
  const isLoading = useAppSelector(userSlice.selectors.selectUserLoading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        void navigate(from, { replace: true });
      })
      .catch(() => undefined);
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
      <h1 className="text text_type_main-medium mb-6">Вход</h1>
      <EmailInput
        placeholder="E-mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        extraClass="mb-6"
      />
      <AsteriskPasswordInput
        placeholder="Пароль"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        extraClass="mb-6"
      />
      {error && (
        <p className={`${formStyles.error} text text_type_main-default mb-6`}>{error}</p>
      )}
      <Button
        htmlType="submit"
        type="primary"
        size="medium"
        extraClass="mb-20"
        disabled={isLoading}
      >
        Войти
      </Button>
      <div
        className={`${formStyles.links} ${formStyles.links_column} text text_type_main-default`}
      >
        <p>
          Вы — новый пользователь?{' '}
          <Link to="/register" className={formStyles.links}>
            Зарегистрироваться
          </Link>
        </p>
        <p>
          <Link to="/forgot-password" className={formStyles.links}>
            Восстановить пароль
          </Link>
        </p>
      </div>
    </form>
  );
};
