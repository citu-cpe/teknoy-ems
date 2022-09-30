import {
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  FormLabelProps,
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
  Tooltip,
} from '@chakra-ui/react';
import type { FieldProps } from 'formik';
import React from 'react';
import { ErrorTooltip } from './ErrorTooltip';

interface SelectProps {
  label?: string;
  helperText?: string;
  tooltipLabel?: string;
  fieldProps: FieldProps;
  formLabelProps?: FormLabelProps;
}

export const Select = ({
  fieldProps: { field, form },
  label,
  helperText,
  tooltipLabel,
  formLabelProps,
  children,
  ...props
}: SelectProps & React.PropsWithChildren & ChakraSelectProps) => (
  <FormControl
    isInvalid={!!form.errors[props.name!] && !!form.touched[props.name!]}
    isRequired={props?.isRequired}
  >
    <Flex justifyContent='center' alignItems='center'>
      {!!label && (
        <FormLabel
          htmlFor={props.id}
          fontWeight='semibold'
          minW={20}
          m={0}
          p={0}
          pr={5}
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
          <ChakraSelect {...field} {...props}>
            {children}
          </ChakraSelect>
        </Tooltip>
      ) : (
        <ErrorTooltip
          error={form.errors[props.name!]?.toString()}
          isInvalid={!!form.errors[props.name!] && !!form.touched[props.name!]}
        >
          <ChakraSelect {...field} {...props}>
            {children}
          </ChakraSelect>
        </ErrorTooltip>
      )}
    </Flex>

    <FormHelperText pl={formLabelProps?.minW} textAlign='left'>
      {helperText}
    </FormHelperText>
  </FormControl>
);
