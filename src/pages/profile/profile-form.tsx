import { Button, EmailInput, Input } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { AsteriskPasswordInput } from '@components/asterisk-password-input/asterisk-password-input';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { userSlice } from '@services/user/userSlice';
import { updateUserProfile } from '@services/user/userThunk';

import styles from './profile-page.module.css';

const PASSWORD_MASK = '******';

export const ProfileForm = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(userSlice.selectors.selectUser);
  const error = useAppSelector(userSlice.selectors.selectUserError);
  const isLoading = useAppSelector(userSlice.selectors.selectUserLoading);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEdited, setIsEdited] = useState(false);
  const [isNameDisabled, setIsNameDisabled] = useState(true);
  const [isPasswordDisabled, setIsPasswordDisabled] = useState(true);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword('');
      setIsEdited(false);
      setIsNameDisabled(true);
      setIsPasswordDisabled(true);
    }
  }, [user]);

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setter(event.target.value);
      setIsEdited(true);
    };

  const handleCancel = (): void => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPassword('');
      setIsEdited(false);
      setIsNameDisabled(true);
      setIsPasswordDisabled(true);
      setFormKey((prev) => prev + 1);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    void dispatch(updateUserProfile({ name, email, password }))
      .unwrap()
      .then(() => {
        setPassword('');
        setIsEdited(false);
        setIsNameDisabled(true);
        setIsPasswordDisabled(true);
        setFormKey((prev) => prev + 1);
      })
      .catch(() => undefined);
  };

  const passwordValue = isPasswordDisabled && password === '' ? PASSWORD_MASK : password;

  return (
    <form key={formKey} className={styles.form} onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={handleChange(setName)}
        extraClass="mb-6"
        icon="EditIcon"
        disabled={isNameDisabled}
        onIconClick={() => setIsNameDisabled(false)}
      />
      <EmailInput
        placeholder="Логин"
        value={email}
        onChange={handleChange(setEmail)}
        extraClass="mb-6"
        isIcon={true}
      />
      <AsteriskPasswordInput
        placeholder="Пароль"
        value={passwordValue}
        onChange={handleChange(setPassword)}
        extraClass="mb-6"
        icon="EditIcon"
        disabled={isPasswordDisabled}
        onIconClick={() => {
          setIsPasswordDisabled(false);
          setPassword('');
        }}
      />
      {error && (
        <p className={`${styles.error} text text_type_main-default mb-6`}>{error}</p>
      )}
      {isEdited && (
        <div className={styles.buttons}>
          <Button
            htmlType="button"
            type="secondary"
            size="medium"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
            Сохранить
          </Button>
        </div>
      )}
    </form>
  );
};
