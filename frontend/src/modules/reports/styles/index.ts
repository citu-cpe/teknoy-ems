import { FormLabelProps, FlexProps, FormControl } from '@chakra-ui/react';

export const formLabelProps: FormLabelProps = {
  fontWeight: 'semibold',
  minW: 44,
  m: 0,
  p: 0,
  textAlign: 'left',
};

export const formControlProps: FlexProps = {
  as: FormControl,
  direction: 'column',
  role: 'group',
};

export const filterGroupProps: FlexProps = {
  w: 'full',
  justifyContent: 'space-between',
  direction: { base: 'column', lg: 'row' },
  gap: { base: 6, sm: 10, md: 16 },
};
