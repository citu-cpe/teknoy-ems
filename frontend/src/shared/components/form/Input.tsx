import {
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  FormLabelProps,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
  Tooltip,
} from '@chakra-ui/react';
import type { FieldProps } from 'formik';
import React from 'react';
import { ErrorTooltip } from './ErrorTooltip';

export interface InputProps {
  label?: string;
  helperText?: string;
  tooltipLabel?: string;
  fieldProps: FieldProps;
  formLabelProps?: FormLabelProps;
}

export const Input = ({
  fieldProps: { field, form },
  label,
  helperText,
  formLabelProps,
  tooltipLabel,
  children,
  ...props
}: InputProps & React.PropsWithChildren & ChakraInputProps) => (
  <FormControl
    isInvalid={!!form.errors[props.name!] && !!form.touched[props.name!]}
    isRequired={props?.isRequired}
  >
    <Flex justifyContent='center' alignItems='center'>
      {!!label && (
        <FormLabel
          htmlFor={props.id}
          fontWeight='semibold'
          minW={28}
          m={0}
          p={0}
          pr={!props?.isRequired ? 8 : 5}
          textAlign='right'
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
    </Flex>

    <FormHelperText pl={formLabelProps?.minW} textAlign='left'>
      {helperText}
    </FormHelperText>
  </FormControl>
);
