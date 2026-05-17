import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import styles from './modal.module.css';

const modalRoot = document.getElementById('modals');

type TModalProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal = ({
  title,
  onClose,
  children,
}: TModalProps): React.JSX.Element | null => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return (): void => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <>
      <ModalOverlay onClick={onClose} />
      <div className={styles.modal}>
        <header className={styles.header}>
          {title ? <h3 className="text text_type_main-large">{title}</h3> : <span />}
          <CloseIcon type="primary" onClick={onClose} />
        </header>
        {children}
      </div>
    </>,
    modalRoot
  );
};
