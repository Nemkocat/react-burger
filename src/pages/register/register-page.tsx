import { Button, EmailInput, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AsteriskPasswordInput } from '@components/asterisk-password-input/asterisk-password-input';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { userSlice } from '@services/user/userSlice';
import { registerUser } from '@services/user/userThunk';

import formStyles from '../auth-form/auth-form.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useAppSelector(userSlice.selectors.selectUserError);
  const isLoading = useAppSelector(userSlice.selectors.selectUserLoading);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void dispatch(registerUser({ email, password, name }))
      .unwrap()
      .then(() => {
        navigate('/', { replace: true });
      })
      .catch(() => undefined);
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
      <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
      <Input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={(event) => setName(event.target.value)}
        extraClass="mb-6"
      />
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
        Зарегистрироваться
      </Button>
      <div className={`${formStyles.links} text text_type_main-default`}>
        <p>
          Уже зарегистрированы?{' '}
          <Link to="/login" className={formStyles.links}>
            Войти
          </Link>
        </p>
      </div>
    </form>
  );
};
