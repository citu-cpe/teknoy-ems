import {
  extendTheme,
  withDefaultColorScheme,
  withDefaultVariant,
} from '@chakra-ui/react';
import { config } from '../config';
import { fonts, semanticTokens } from '../foundations';
import { styles } from '../styles';
import { components } from '../components';

export const corporate = extendTheme(
  { config },
  {
    styles,
    fonts,
    components,
    semanticTokens,
    colors: {
      brand: {
        '50': '#FFF9E6',
        '100': '#FEEFB9',
        '200': '#FDE58C',
        '300': '#FCDB5E',
        '400': '#FCD131',
        '500': '#FBC704',
        '600': '#C9A003',
        '700': '#967803',
        '800': '#645002',
        '900': '#322801',
      },
      accent: {
        '50': '#F8EDEE',
        '100': '#EBCBCE',
        '200': '#DEAAAF',
        '300': '#D2898F',
        '400': '#C56870',
        '500': '#B84750',
        '600': '#933940',
        '700': '#6F2A30',
        '800': '#4A1C20',
        '900': '#250E10',
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
