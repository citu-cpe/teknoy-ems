import { Flex, Spacer, Button } from '@chakra-ui/react';

export interface ModalActionsProps {
  closeLabel?: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ModalActions = ({
  closeLabel = 'Close',
  confirmLabel = 'Okay',
  onClose,
  onConfirm,
}: ModalActionsProps) => {
  return (
    <Flex>
      <Spacer />
      <Button minW={10} onClick={onClose} data-cy='close-btn'>
        {closeLabel}
      </Button>
      <Button minW={10} variant='solid' onClick={onConfirm} ml={2}>
        {confirmLabel}
      </Button>
    </Flex>
  );
};
