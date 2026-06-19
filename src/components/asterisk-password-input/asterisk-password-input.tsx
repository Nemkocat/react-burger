import { Input } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useState } from 'react';

type TAsteriskPasswordInputProps = {
  value: string;
  placeholder?: string;
  extraClass?: string;
  icon?: 'HideIcon' | 'ShowIcon' | 'EditIcon';
  disabled?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onIconClick?: () => void;
};

export const AsteriskPasswordInput = ({
  value,
  onChange,
  icon = 'ShowIcon',
  disabled = false,
  onIconClick,
  placeholder,
  extraClass,
}: TAsteriskPasswordInputProps): React.JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      if (disabled) {
        return;
      }

      const nextValue = event.target.value;

      if (isVisible) {
        onChange(event);
        return;
      }

      if (nextValue.length > value.length) {
        onChange({
          ...event,
          target: { ...event.target, value: value + nextValue.slice(-1) },
        } as React.ChangeEvent<HTMLInputElement>);
        return;
      }

      onChange({
        ...event,
        target: { ...event.target, value: value.slice(0, nextValue.length) },
      } as React.ChangeEvent<HTMLInputElement>);
    },
    [disabled, icon, isVisible, onChange, value]
  );

  const handleIconClick = useCallback((): void => {
    if (icon === 'EditIcon') {
      onIconClick?.();
      return;
    }

    setIsVisible((prev) => !prev);
  }, [icon, onIconClick]);

  const displayValue = disabled || isVisible ? value : '*'.repeat(value.length);

  const inputIcon =
    icon === 'EditIcon' ? 'EditIcon' : isVisible ? 'HideIcon' : 'ShowIcon';

  return (
    <Input
      type="text"
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      icon={inputIcon}
      disabled={disabled}
      onIconClick={handleIconClick}
      extraClass={extraClass}
    />
  );
};
