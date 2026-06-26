import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { forgotPassword } from '@utils/api';
import { RESET_PASSWORD_FLAG } from '@utils/constants';

import formStyles from '../auth-form/auth-form.module.css';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    void forgotPassword(email)
      .then(() => {
        localStorage.setItem(RESET_PASSWORD_FLAG, 'true');
        void navigate('/reset-password', { replace: true });
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Ошибка восстановления пароля';
        setError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
      <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
      <EmailInput
        placeholder="Укажите e-mail"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
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
        Восстановить
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
