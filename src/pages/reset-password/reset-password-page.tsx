import { Button } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { AsteriskPasswordInput } from '@components/asterisk-password-input/asterisk-password-input';
import { resetPassword } from '@utils/api';
import { RESET_PASSWORD_FLAG } from '@utils/constants';

import formStyles from '../auth-form/auth-form.module.css';

export const ResetPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAllowed = localStorage.getItem(RESET_PASSWORD_FLAG) === 'true';

  if (!isAllowed) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    void resetPassword({ password, token })
      .then(() => {
        localStorage.removeItem(RESET_PASSWORD_FLAG);
        navigate('/login', { replace: true });
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Ошибка сброса пароля';
        setError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
      <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
      <AsteriskPasswordInput
        placeholder="Введите новый пароль"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        extraClass="mb-6"
      />
      <AsteriskPasswordInput
        placeholder="Введите код из письма"
        value={token}
        onChange={(event) => setToken(event.target.value)}
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
        Сохранить
      </Button>
      <div className={`${formStyles.links} text text_type_main-default`}>
        <p>
          Вспомнили пароль?{' '}
          <Link to="/login" className={formStyles.links}>
            Войти
          </Link>
        </p>
      </div>
    </form>
  );
};
