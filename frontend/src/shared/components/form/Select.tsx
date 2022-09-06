import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
  Tooltip,
} from '@chakra-ui/react';
import type { FieldProps } from 'formik';
import React from 'react';

interface SelectProps {
  label?: string;
  tooltipLabel?: string;
  fieldProps: FieldProps;
}

export const Select = ({
  fieldProps: { field, form },
  label,
  tooltipLabel,
  children,
  ...props
}: SelectProps & React.PropsWithChildren & ChakraSelectProps) => (
  <FormControl
    isInvalid={!!form.errors[props.name!] && !!form.touched[props.name!]}
    isRequired={props?.isRequired}
  >
    {!!label && (
      <FormLabel htmlFor={props.id} mb='2' fontWeight='semibold'>
        {label}
      </FormLabel>
    )}
    <Tooltip
      display={props.isReadOnly ? 'block' : 'none'}
      label={tooltipLabel || `Editing ${props.name} is restricted`}
      placement='bottom-end'
      hasArrow
    >
      <ChakraSelect {...field} {...props}>
        {children}
      </ChakraSelect>
    </Tooltip>
    <FormErrorMessage>{form.errors[props.name!]?.toString()}</FormErrorMessage>
  </FormControl>
);
