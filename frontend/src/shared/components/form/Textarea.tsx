import {
  Flex,
  FormControl,
  FormLabel,
  FormLabelProps,
  Textarea as ChakraTextarea,
  TextareaProps as ChakraTextareaProps,
  Tooltip,
} from '@chakra-ui/react';
import type { FieldProps } from 'formik';
import React from 'react';
import { ErrorTooltip } from './ErrorTooltip';

interface TextareaProps {
  label?: string;
  tooltipLabel?: string;
  fieldProps: FieldProps;
  formLabelProps?: FormLabelProps;
}

export const Textarea = ({
  fieldProps: { field, form },
  label,
  tooltipLabel,
  formLabelProps,
  children,
  ...props
}: TextareaProps & React.PropsWithChildren & ChakraTextareaProps) => (
  <FormControl
    as={Flex}
    justifyContent='center'
    alignItems='start'
    isInvalid={!!form.errors[props.name!] && !!form.touched[props.name!]}
    isRequired={props?.isRequired}
    overflow='hidden'
  >
    {!!label && (
      <FormLabel
        htmlFor={props.id}
        fontWeight='semibold'
        minW={20}
        m={0}
        p={0}
        mt={2}
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
        <ChakraTextarea {...field} {...props}>
          {children}
        </ChakraTextarea>
      </Tooltip>
    ) : (
      <ErrorTooltip
        error={form.errors[props.name!]?.toString()}
        isInvalid={!!form.errors[props.name!] && !!form.touched[props.name!]}
      >
        <ChakraTextarea {...field} {...props}>
          {children}
        </ChakraTextarea>
      </ErrorTooltip>
    )}
  </FormControl>
);
