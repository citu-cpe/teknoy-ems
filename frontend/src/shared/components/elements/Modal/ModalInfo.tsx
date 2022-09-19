import { ModalActions, ModalActionsProps } from './ModalActions';
import { ModalInfoHeader } from './ModalInfoHeader';

interface ModalInfoProps<T> {
  title?: React.PropsWithRef<React.ReactNode> | string;
  children?: React.PropsWithRef<React.ReactNode> | string;
}

export const ModalInfo = <T extends unknown>({
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel,
}: ModalActionsProps & ModalInfoProps<T>) => {
  return (
    <>
      {title && <ModalInfoHeader>{title}</ModalInfoHeader>}

      {children}

      <ModalActions
        onClose={onClose}
        onConfirm={onConfirm}
        confirmLabel={confirmLabel || 'Add Again'}
      />
    </>
  );
};
