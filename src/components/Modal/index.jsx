import React from 'react';
import cx from 'classnames';

import closeIcon from 'assets/svgs/close.svg';

import styles from './styles.module.scss';

const Modal = ({
  visible,
  title,
  onClose,
  children,
  submitDisabled,
  submitLabel,
  onSubmit,
  cancelDisabled,
  cancelLabel,
  onCancel,
}) => {
  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={cx(styles.container, visible ? styles.visible : null)}>
      <div className={styles.modal} onClick={handleClick}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          {onClose && (
            <div className={styles.closeButton} onClick={onClose}>
              <img src={closeIcon} />
            </div>
          )}
        </div>
        <div className={styles.body}>{children}</div>
        {(submitLabel || cancelLabel) && (
          <div className={styles.footer}>
            <div
              className={cx(
                styles.submitButton,
                submitDisabled && styles.disabled
              )}
              onClick={onSubmit}
            >
              {submitLabel}
            </div>
            <div
              className={cx(
                styles.cancelButton,
                cancelDisabled && styles.disabled
              )}
              onClick={onCancel}
            >
              {cancelLabel || 'Cancel'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
