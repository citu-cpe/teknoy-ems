import React from 'react';
import type { FieldProps } from 'formik';
import {
  CheckboxProps as ChakraCheckBoxProps,
  useCheckbox,
  Flex,
  chakra,
  Text,
  Box,
} from '@chakra-ui/react';

interface CheckboxProps {
  fieldProps: FieldProps;
  label?: string;
}

export const Checkbox = (
  props: CheckboxProps & ChakraCheckBoxProps & FieldProps
) => {
  const { state, getCheckboxProps, getInputProps, getLabelProps, htmlProps } =
    useCheckbox(props);

  return (
    <chakra.label
      display='flex'
      flexDirection='row'
      alignItems='center'
      gridColumnGap={2}
      bg='green.50'
      border='1px solid'
      borderColor='green.500'
      rounded='lg'
      px={3}
      py={1}
      cursor='pointer'
      {...htmlProps}
    >
      <input {...getInputProps()} hidden />
      <Flex
        alignItems='center'
        justifyContent='center'
        border='2px solid'
        borderColor='green.500'
        w={4}
        h={4}
        {...getCheckboxProps()}
      >
        {state.isChecked && <Box w={2} h={2} bg='green.500' />}
      </Flex>
      <Text color='gray.700' {...getLabelProps()}>
        Click me for {props.value}
      </Text>
    </chakra.label>
  );
};
