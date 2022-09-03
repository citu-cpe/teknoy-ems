import { useToast as useChakraToast, UseToastOptions } from '@chakra-ui/react';

export const DEFAULT_TOAST_OPTIONS: UseToastOptions = {
  isClosable: true,
  variant: 'subtle',
  position: 'bottom-right',
};

export const useToast = () => {
  const toast = useChakraToast(DEFAULT_TOAST_OPTIONS);

  return toast;
};
