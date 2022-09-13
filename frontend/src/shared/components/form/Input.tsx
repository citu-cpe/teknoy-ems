import {
  Flex,
  FormControl,
  FormLabel,
  FormLabelProps,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  Tooltip,
} from '@chakra-ui/react';
import type { FieldProps } from 'formik';
import React from 'react';
import { ErrorTooltip } from './ErrorTooltip';

interface InputProps {
  label?: string;
  tooltipLabel?: string;
  fieldProps: FieldProps;
  formLabelProps?: FormLabelProps;
}

export const Input = ({
  fieldProps: { field, form },
  label,
  formLabelProps,
  tooltipLabel,
  children,
  ...props
}: InputProps & React.PropsWithChildren & ChakraInputProps) => (
  <FormControl
    as={Flex}
    justifyContent='center'
    alignItems='center'
    isInvalid={!!form.errors[props.name!] && !!form.touched[props.name!]}
    isRequired={props?.isRequired}
  >
    {!!label && (
      <FormLabel
        htmlFor={props.id}
        fontWeight='semibold'
        minW={20}
        m={0}
        p={0}
        {...formLabelProps}
      >
        {label}
      </FormLabel>
    )}

    {props.isReadOnly ? (
      <Tooltip
        display={props.isReadOnly ? 'block' : 'none'}
        label={tooltipLabel || `Editing ${props.name} is restricted`}
        closeOnClick={false}
        placement='bottom-end'
        hasArrow
      >
        <ChakraInput {...field} {...props}>
          {children}
        </ChakraInput>
      </Tooltip>
    ) : (
      <ErrorTooltip
        error={form.errors[props.name!]?.toString()}
        isInvalid={!!form.errors[props.name!] && !!form.touched[props.name!]}
      >
        <ChakraInput {...field} {...props}>
          {children}
        </ChakraInput>
      </ErrorTooltip>
    )}
  </FormControl>
);
