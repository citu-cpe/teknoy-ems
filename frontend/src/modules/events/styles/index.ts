import { FormControlProps, FormLabelProps } from '@chakra-ui/react';
import { CSSProperties } from 'react';

export const formLabelProps: FormLabelProps = {
  minW: 44,
};

export const requiredControlProp: FormControlProps = {
  isRequired: true,
};

export const groupStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const groupBadgeStyles: CSSProperties = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
};
