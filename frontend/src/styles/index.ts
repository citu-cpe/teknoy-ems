import {
  extendTheme,
  withDefaultColorScheme,
  withDefaultVariant,
} from '@chakra-ui/react';
import { config } from './config';
import { fonts, semanticTokens } from './foundations';
import { styles } from './styles';

export const defaultTheme = extendTheme(
  { config },
  {
    styles,
    fonts,
    semanticTokens,
    colors: {
      brand: {
        '50': '#EFE8FD',
        '100': '#D3BEF9',
        '200': '#B894F5',
        '300': '#9C69F1',
        '400': '#803FED',
        '500': '#6415EA',
        '600': '#5011BB',
        '700': '#3C0D8C',
        '800': '#28095D',
        '900': '#14042F',
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
