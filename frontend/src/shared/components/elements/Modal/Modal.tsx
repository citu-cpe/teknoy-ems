import {
  Flex,
  Modal as ChakraModal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps as ChakraModalProps,
} from '@chakra-ui/react';

interface ModalProps {
  iconTitle?: React.ReactNode;
  title?: string;
  children: React.PropsWithChildren;
  footer?: React.ReactNode;
}

export const Modal = ({
  iconTitle,
  title,
  children,
  footer,
  isOpen,
  onClose,
  ...props
}: ModalProps & ChakraModalProps) => {
  return (
    <ChakraModal
      motionPreset='slideInBottom'
      isOpen={isOpen}
      onClose={onClose}
      size='xl'
      {...props}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex alignItems='center' justifyContent='start' gap={4}>
            {iconTitle}
            {title}
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter>{footer}</ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};
