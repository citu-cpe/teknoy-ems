import { StyleFunctionProps } from '@chakra-ui/theme-tools';

export const components = {
  Button: {
    variants: {
      solid: (props: StyleFunctionProps) => ({
        rounded: 'full',
        paddingX: 5,
      }),
      outline: (props: StyleFunctionProps) => ({
        rounded: 'full',
        paddingX: 5,
      }),
      ghost: (props: StyleFunctionProps) => ({
        rounded: 'full',
        paddingX: 5,
      }),
    },
  },
};
