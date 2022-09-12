import { Box, BoxProps } from '@chakra-ui/react';

export const HeaderSpacer = ({ ...props }: BoxProps) => {
  return <Box w='full' h='headerHeight' {...props}></Box>;
};
