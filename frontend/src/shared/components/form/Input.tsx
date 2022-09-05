import React from 'react';
import type { FieldProps } from 'formik';
import {
  FormControl,
  FormLabel,
  Input as ChakraInput,
  FormErrorMessage,
  InputProps as ChakraInputProps,
  Tooltip,
} from '@chakra-ui/react';

interface InputProps {
  label?: string;
  tooltipLabel?: string;
  fieldProps: FieldProps;
}

export const Input = ({
  fieldProps: { field, form },
  label,
  tooltipLabel,
  children,
  ...props
}: InputProps & React.PropsWithChildren & ChakraInputProps) => (
  <FormControl
    isInvalid={!!form.errors[props.name!] && !!form.touched[props.name!]}
    mb='4'
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
      <ChakraInput {...field} {...props}>
        {children}
      </ChakraInput>
    </Tooltip>
    <FormErrorMessage>{form.errors[props.name!]?.toString()}</FormErrorMessage>
  </FormControl>
);
