import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  ModalProps as ChakraModalProps,
} from '@chakra-ui/react';

interface ModalProps {
  // modalProps: UseDisclosureProps;
  title?: string;
  children: React.PropsWithChildren;
  footer?: React.ReactNode;
}

export const Modal = ({
  title,
  children,
  footer,
  // modalProps: { isOpen, onClose },
  isOpen,
  onClose,
  ...props
}: ModalProps & ChakraModalProps) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <ChakraModal
      scrollBehavior='inside'
      motionPreset='slideInBottom'
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>
          {footer}
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};
