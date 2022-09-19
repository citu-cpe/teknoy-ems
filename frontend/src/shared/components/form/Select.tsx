import {
  Flex,
  FormControl,
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
  tooltipLabel?: string;
  fieldProps: FieldProps;
  formLabelProps?: FormLabelProps;
}

export const Select = ({
  fieldProps: { field, form },
  label,
  tooltipLabel,
  formLabelProps,
  children,
  ...props
}: SelectProps & React.PropsWithChildren & ChakraSelectProps) => (
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
  </FormControl>
);
