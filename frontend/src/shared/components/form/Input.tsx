import React from 'react';
import type { FieldProps } from 'formik';
import {
  FormControl,
  FormLabel,
  Input as ChakraInput,
  FormErrorMessage,
  InputProps as ChakraInputProps,
} from '@chakra-ui/react';

interface InputProps {
  fieldProps: FieldProps;
  label?: string;
}

export const Input = ({
  fieldProps: { field, form },
  label,
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
    <ChakraInput {...field} {...props}>
      {children}
    </ChakraInput>
    <FormErrorMessage>{form.errors[props.name!]?.toString()}</FormErrorMessage>
  </FormControl>
);
