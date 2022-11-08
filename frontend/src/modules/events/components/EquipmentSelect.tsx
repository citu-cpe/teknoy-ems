import { Field, FieldProps } from 'formik';
import {
  EquipmentDTO,
  EventCreateDTO,
  SortedEquipmentsDTO,
} from 'generated-api';
import { useEffect, useRef } from 'react';
import { MultiValue, Props } from 'react-select';
import {
  CustomSelectAsyncProps,
  SelectAsync,
} from '../../../shared/components/form/';
import { isOption } from '../../../shared/helpers/';
import { Option } from '../../../shared/types';
import { useGetSortedEquipments } from '../hooks/';
import { formLabelProps, groupBadgeStyles, groupStyles } from '../styles';
import { AsyncProps } from 'react-select/async';

export interface EquipmentOption extends Option {
  status: string;
}

export interface EquipmentGroupedOption {
  label: string;
  options: EquipmentOption[];
}

export interface EquipmentSelectProps {
  defaultValue?: EquipmentDTO[];
  selectAsyncProps?: Props;
}

export const EquipmentSelect = ({
  defaultValue,
  selectAsyncProps,
}: EquipmentSelectProps) => {
  const equipmentDefaultOptions = useRef<EquipmentGroupedOption[]>([]);

  const { schedule, getSortedEquipments } = useGetSortedEquipments();

  useEffect(() => {
    getSortedEquipments.mutate(schedule, {
      onSuccess: (res) => {
        setDefaultOptions(res.data);
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule.startTime, schedule.endTime]);

  const setDefaultOptions = (sortedEquipments: SortedEquipmentsDTO) => {
    equipmentDefaultOptions.current = [];
    const availableEquipmentsGroup = {
      label: 'Available',
      options: sortedEquipments.availableEquipments.map((eq) => ({
        value: eq.id,
        label: eq.name,
        status: 'Available',
      })),
    };

    // equipments that are conflict in schedule
    const unavailableEquipmentsGroup = {
      label: 'Conflict',
      options: sortedEquipments.unavailableEquipments.map((eq) => ({
        value: eq.id,
        label: eq.name,
        status: 'Conflict',
      })),
    };

    if (availableEquipmentsGroup.options.length > 0) {
      equipmentDefaultOptions.current.push(availableEquipmentsGroup);
    }

    if (unavailableEquipmentsGroup.options.length > 0) {
      equipmentDefaultOptions.current.push(unavailableEquipmentsGroup);
    }
  };

  const getDefaultValues = (): EquipmentOption[] => {
    if (defaultValue) {
      const equipmentOptions = defaultValue.map(
        (eq) =>
          ({
            value: eq.id,
            label: eq.name,
          } as EquipmentOption)
      );

      return equipmentOptions;
    }

    return [];
  };

  const filterOptions = (inputValue: string) => {
    let filterResults: EquipmentOption[] = [];
    const availableDefaultOptionsGroup = equipmentDefaultOptions.current[0];
    const unavailableDefaultOptionsGroup = equipmentDefaultOptions.current[1];

    if (availableDefaultOptionsGroup) {
      const availableOptionsGroup = availableDefaultOptionsGroup.options.filter(
        (opt) => opt.label.toLowerCase().includes(inputValue.toLowerCase())
      );

      if (availableOptionsGroup.length > 0) {
        filterResults.push(...availableOptionsGroup);
      }
    }

    if (unavailableDefaultOptionsGroup) {
      const unavailableOptionsGroup =
        unavailableDefaultOptionsGroup.options.filter((opt) =>
          opt.label.toLowerCase().includes(inputValue.toLowerCase())
        );

      if (unavailableOptionsGroup.length > 0) {
        filterResults.push(...unavailableOptionsGroup);
      }
    }

    return filterResults;
  };

  /**
   * Options that allow for async/promise fetching
   * (but currently, just a simple filtering because we fetch our data on first render)
   */
  const promiseOptions = (inputValue: string) =>
    new Promise<EquipmentOption[]>((resolve) => {
      resolve(filterOptions(inputValue));
    });

  const handleChange = (
    newValue: MultiValue<string | EquipmentOption>,
    fieldProps: FieldProps
  ) => {
    if (newValue === null || undefined) {
      // replace `null` and `undefined` with empty string for Yup validation
      fieldProps.form.setFieldValue(fieldProps.field.name, '');
      return;
    }

    const formattedNewValues = newValue.map((item: EquipmentOption | string) =>
      !!item && isOption(item) ? item.value : item
    );

    fieldProps.form.setFieldValue(fieldProps.field.name, formattedNewValues);
  };

  const getFieldValue = (fieldProps: FieldProps) => {
    const availableOptionsGroup = equipmentDefaultOptions.current[0].options;

    return availableOptionsGroup
      ? availableOptionsGroup.find(
          (option) => option.value === fieldProps.field.value
        )
      : '';
  };

  const formatGroupLabel = (data: EquipmentGroupedOption) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

  const isOptionDisabled = (option: string | EquipmentOption) => {
    return (option as EquipmentOption).status !== null
      ? (option as EquipmentOption).status === 'Conflict'
      : false;
  };

  return (
    <>
      {equipmentDefaultOptions.current[0]?.options.length > 0 && (
        <Field name='equipmentIds' id='equipmentIds' data-cy='equipment-select'>
          {(fieldProps: FieldProps<string, EventCreateDTO>) => (
            <SelectAsync
              name='equipmentIds'
              label='Equipment'
              id='equipmentIds'
              placeholder='No equipment...'
              data-cy='equipment-select'
              formLabelProps={formLabelProps}
              fieldProps={fieldProps}
              cacheOptions
              defaultValue={getDefaultValues()}
              isMulti
              isClearable
              closeMenuOnSelect={false}
              defaultOptions={equipmentDefaultOptions.current}
              loadOptions={promiseOptions}
              isLoading={getSortedEquipments.isLoading}
              onChange={(newValue: MultiValue<string | EquipmentOption>) =>
                handleChange(newValue, fieldProps)
              }
              value={getFieldValue(fieldProps)}
              formatGroupLabel={formatGroupLabel}
              isOptionDisabled={isOptionDisabled}
              isDisabled={selectAsyncProps?.isDisabled}
              helperText={
                selectAsyncProps?.isDisabled ? 'For Technical Staff only' : ''
              }
            />
          )}
        </Field>
      )}
    </>
  );
};
