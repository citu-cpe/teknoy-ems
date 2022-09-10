import { StyleFunctionProps } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

export const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      fontFamily: 'body',
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('gray.100', 'gray.800')(props),
      lineHeight: 'base',
      letterSpacing: 'wide',
    },
    '&::-webkit-scrollbar': {
      width: '0.8rem',
    },
    '&::-webkit-scrollbar-track': {
      width: '1rem',
      backgroundColor: 'scrollTrack',
      borderRadius: '24px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'scrollThumb',
      borderRadius: '1.5rem',
    },
  }),
};
