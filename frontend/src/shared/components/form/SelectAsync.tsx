import {
  Flex,
  FormControl,
  FormControlProps,
  FormHelperText,
  FormLabel,
  FormLabelProps,
  useToken,
} from '@chakra-ui/react';
import { FieldProps } from 'formik';
import { useEffect, useState } from 'react';
import { GroupBase, StylesConfig, Theme } from 'react-select';
import ReactSelectAsync, { AsyncProps } from 'react-select/async';
import { ErrorTooltip } from './ErrorTooltip';

export interface CustomSelectAsyncProps {
  label?: string;
  tooltipLabel?: string;
  fieldProps: FieldProps;
  formLabelProps?: FormLabelProps;
  formControlProps?: FormControlProps;
}

declare module 'react-select/dist/declarations/src/Select' {
  export interface Props<
    Option,
    IsMulti extends boolean,
    Group extends GroupBase<Option>
  > {
    label?: string;
    helperText?: string;
    tooltipLabel?: string;
    fieldProps?: FieldProps;
    formLabelProps?: FormLabelProps;
    formControlProps?: FormControlProps;
  }
}

export const SelectAsync = <
  OptionType,
  IsMulti extends boolean = true,
  GroupType extends GroupBase<OptionType> = GroupBase<OptionType>
>({
  fieldProps,
  label,
  helperText,
  tooltipLabel,
  formLabelProps,
  formControlProps,
  ...props
}: AsyncProps<OptionType, IsMulti, GroupType> & CustomSelectAsyncProps) => {
  const [
    selectedColor,
    hoverColor,
    foreground,
    neutral2,
    current,
    errorColor,
    errorBg,
    brand100,
    brand200,
    brand400,
    brand500,
    gray50,
    gray100,
    gray200,
    gray300,
    gray400,
    gray500,
    gray600,
    gray700,
    gray800,
    gray900,
  ] = useToken('colors', [
    'activeColor',
    'activeBg',
    'foreground',
    'neutral2',
    'current',
    'errorColor',
    'errorBg',
    'brand.100',
    'brand.200',
    'brand.400',
    'brand.500',
    'gray.50',
    'gray.100',
    'gray.200',
    'gray.300',
    'gray.400',
    'gray.500',
    'gray.600',
    'gray.700',
    'gray.800',
    'gray.900',
  ]);

  const [borderRadius] = useToken('radii', ['md']);

  const customStyles: StylesConfig<OptionType, IsMulti, GroupType> = {
    control: (base) => ({
      ...base,
      borderRadius,
    }),
    input: (base) => ({
      ...base,
      color: current,
    }),
    container: (base) => ({
      ...base,
      width: '100%',
      backgroundColor: neutral2,
      borderRadius,
    }),
    valueContainer: (base) => ({
      ...base,
      backgroundColor: neutral2,
      borderTopLeftRadius: borderRadius,
      borderBottomLeftRadius: borderRadius,
      transition: 'all linear 150ms',
      paddingLeft: '1rem',
    }),
    indicatorsContainer: (base) => ({
      ...base,
      backgroundColor: neutral2,
      borderTopRightRadius: borderRadius,
      borderBottomRightRadius: borderRadius,
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: neutral2,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: current,
    }),
    clearIndicator: (base) => ({
      ...base,
      color: current,
    }),
    loadingIndicator: (base) => ({
      ...base,
      color: current,
    }),
    placeholder: (base) => ({
      ...base,
      color: gray500,
    }),
    singleValue: (base) => ({
      ...base,
      color: current,
    }),
    multiValue: (base) => {
      return {
        ...base,
        backgroundColor: hoverColor,
      };
    },
    multiValueLabel: (base) => ({
      ...base,
      color: current,
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: errorColor,
    }),
    menu: (base) => ({ ...base, zIndex: 9999 }),
    option: (base, { isDisabled, isFocused, isSelected }) => {
      return {
        ...base,
        opacity: isDisabled ? 0.5 : 1,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? selectedColor
          : isFocused
          ? hoverColor
          : undefined,
      };
    },
  };

  const customTheme = (theme: Theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: brand500,
      primary75: brand400,
      primary50: brand200,
      primary25: brand100,
      danger: errorBg,
      dangerLight: errorColor,
      neutral0: foreground,
      neutral5: gray50,
      neutral10: gray100,
      neutral20: gray200,
      neutral30: gray300,
      neutral40: gray400,
      neutral50: gray500,
      neutral60: gray600,
      neutral70: gray700,
      neutral80: gray800,
      neutral90: gray900,
    },
  });

  const [status, setStatus] = useState({});

  useEffect(() => {
    const isInvalid =
      !!fieldProps?.form.errors[fieldProps?.field.name!] &&
      !!fieldProps?.form.touched[fieldProps?.field.name!];

    if (isInvalid) {
      setStatus({
        border: '2px',
        borderColor: 'errorColor',
        borderRadius,
      });
    } else {
      setStatus({});
    }
  }, [borderRadius, fieldProps?.field.name, fieldProps?.form]);

  return (
    <>
      <FormControl
        isInvalid={
          !!fieldProps?.form.errors[fieldProps?.field.name!] &&
          !!fieldProps?.form.touched[fieldProps?.field.name!]
        }
        isRequired={formControlProps?.isRequired}
      >
        <Flex justifyContent='center' alignItems='center'>
          {!!label && (
            <FormLabel
              htmlFor={formControlProps?.id}
              fontWeight='semibold'
              minW={28}
              m={0}
              p={0}
              pr={5}
              textAlign='right'
              {...formLabelProps}
            >
              {label}
            </FormLabel>
          )}

          <ErrorTooltip
            error={fieldProps?.form.errors[fieldProps?.field.name!]?.toString()}
            isInvalid={
              !!fieldProps?.form.errors[fieldProps?.field.name!] &&
              !!fieldProps?.form.touched[fieldProps?.field.name!]
            }
          >
            <Flex
              w='full'
              justifyContent='stretch'
              alignItems='stretch'
              sx={status}
            >
              <ReactSelectAsync
                isSearchable
                className='react-select'
                name={fieldProps?.field.name}
                onBlur={fieldProps?.field.onBlur}
                styles={customStyles}
                theme={customTheme}
                {...props}
              />
            </Flex>
          </ErrorTooltip>
        </Flex>
        <FormHelperText pl={formLabelProps?.minW} textAlign='left'>
          {helperText}
        </FormHelperText>
      </FormControl>
    </>
  );
};
