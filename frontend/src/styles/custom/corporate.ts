import {
  extendTheme,
  withDefaultColorScheme,
  withDefaultVariant,
} from '@chakra-ui/react';
import { config } from '../config';
import { fonts, semanticTokens } from '../foundations';
import { styles } from '../styles';

export const corporate = extendTheme(
  { config },
  {
    styles,
    fonts,
    semanticTokens,
    colors: {
      brand: {
        '50': '#E5FFF4',
        '100': '#B8FFE0',
        '200': '#8AFFCC',
        '300': '#5CFFB8',
        '400': '#2EFFA4',
        '500': '#00FF90',
        '600': '#00CC73',
        '700': '#009956',
        '800': '#00663A',
        '900': '#00331D',
      },
    },
  },
  withDefaultColorScheme({
    colorScheme: 'brand',
  }),
  withDefaultVariant({
    variant: 'ghost',
    components: ['Button'],
  })
);
