import {
  Checkbox as ChakraCheckbox,
  CheckboxProps as ChakraCheckboxProps,
  FormControl,
} from '@chakra-ui/react';
import type { FieldProps } from 'formik';
import React from 'react';
import { ErrorTooltip } from './ErrorTooltip';

interface CheckboxProps {
  fieldProps: FieldProps;
}

export const Checkbox = ({
  fieldProps: { field, form },
  children,
  ...props
}: CheckboxProps & React.PropsWithChildren & ChakraCheckboxProps) => (
  <FormControl
    isInvalid={!!form.errors[props.name!] && !!form.touched[props.name!]}
    isRequired={props?.isRequired}
  >
    <ChakraCheckbox
      type='checkbox'
      isChecked={field.checked}
      my={1}
      {...field}
      {...props}
    >
      <ErrorTooltip
        error={form.errors[props.name!]?.toString()}
        isInvalid={!!form.errors[props.name!] && !!form.touched[props.name!]}
        placement='right'
      >
        {children}
      </ErrorTooltip>
    </ChakraCheckbox>
  </FormControl>
);
