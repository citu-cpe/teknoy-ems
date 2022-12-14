import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import React from 'react';

interface DialogProps {
  title: string;
  description: string;
  data?: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  onClose: () => void;
}

export const Dialog = ({
  title: headerText,
  description: bodyText,
  data,
  isOpen,
  onConfirm,
  onClose,
  onCancel,
}: DialogProps) => {
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }

    onClose();
  };

  return (
    <AlertDialog
      motionPreset='slideInBottom'
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>
          {headerText} {data}
        </AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>{bodyText}</AlertDialogBody>
        <AlertDialogFooter>
          <Button
            color='current'
            ref={cancelRef}
            onClick={handleCancel}
            data-cy='dialog-no-btn'
          >
            No
          </Button>
          <Button
            variant='solid'
            colorScheme='red'
            ml={3}
            onClick={handleConfirm}
            data-cy='dialog-yes-btn'
          >
            Yes
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
