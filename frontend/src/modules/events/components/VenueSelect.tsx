import { Field, FieldProps } from 'formik';
import { EventCreateDTO, SortedVenuesDTO, VenueDTO } from 'generated-api';
import { useEffect, useRef } from 'react';
import { MultiValue } from 'react-select';
import { SelectAsync } from '../../../shared/components/form';
import { isOption } from '../../../shared/helpers';
import { Option } from '../../../shared/types';
import { useGetSortedVenues } from '../hooks';
import { formLabelProps, groupBadgeStyles, groupStyles } from '../styles';

export interface VenueOption extends Option {
  status: string;
}

export interface VenueGroupedOption {
  label: string;
  options: VenueOption[];
}

export interface VenueSelectProps {
  defaultValue?: VenueDTO[];
}

export const VenueSelect = ({ defaultValue }: VenueSelectProps) => {
  const venueDefaultOptions = useRef<VenueGroupedOption[]>([]);

  const { schedule, getSortedVenues } = useGetSortedVenues();

  useEffect(() => {
    getSortedVenues.mutate(schedule, {
      onSuccess: (res) => {
        setDefaultOptions(res.data);
      },
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule.startTime, schedule.endTime]);

  const setDefaultOptions = (sortedVenues: SortedVenuesDTO) => {
    const availableVenuesGroup = {
      label: 'Available',
      options: sortedVenues.availableVenues.map((eq) => ({
        value: eq.id,
        label: eq.name,
        status: 'Available',
      })),
    };

    // venues that are conflict in schedule
    const unavailableVenuesGroup = {
      label: 'Conflict',
      options: sortedVenues.unavailableVenues.map((eq) => ({
        value: eq.id,
        label: eq.name,
        status: 'Conflict',
      })),
    };

    if (availableVenuesGroup.options.length > 0) {
      venueDefaultOptions.current.push(availableVenuesGroup);
    }

    if (unavailableVenuesGroup.options.length > 0) {
      venueDefaultOptions.current.push(unavailableVenuesGroup);
    }
  };

  const getDefaultValues = (): VenueOption[] => {
    if (defaultValue) {
      const venueOptions = defaultValue.map(
        (eq) =>
          ({
            value: eq.id,
            label: eq.name,
          } as VenueOption)
      );

      return venueOptions;
    }

    return [];
  };

  const filterOptions = (inputValue: string, options: VenueGroupedOption[]) => {
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  /**
   * Options that allow for async/promise fetching
   * (but currently, just a simple filtering because we fetch our data on first render)
   */
  const promiseOptions = (inputValue: string) =>
    new Promise<VenueGroupedOption[]>((resolve) => {
      resolve(filterOptions(inputValue, venueDefaultOptions.current));
    });

  const handleChange = (
    newValue: MultiValue<string | VenueOption>,
    fieldProps: FieldProps
  ) => {
    if (newValue === null || undefined) {
      // replace `null` and `undefined` with empty string for Yup validation
      fieldProps.form.setFieldValue(fieldProps.field.name, '');
      return;
    }

    const formattedNewValues = newValue.map((item: VenueOption | string) =>
      !!item && isOption(item) ? item.value : item
    );

    fieldProps.form.setFieldValue(fieldProps.field.name, formattedNewValues);
  };

  const getFieldValue = (fieldProps: FieldProps) => {
    const availableOptionsGroup = venueDefaultOptions.current[0].options;

    return availableOptionsGroup
      ? availableOptionsGroup.find(
          (option) => option.value === fieldProps.field.value
        )
      : '';
  };

  const formatGroupLabel = (data: VenueGroupedOption) => (
    <div style={groupStyles}>
      <span>{data.label}</span>
      <span style={groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

  const isOptionDisabled = (option: string | VenueOption) => {
    return (option as VenueOption).status !== null
      ? (option as VenueOption).status === 'Conflict'
      : false;
  };

  return (
    <>
      {venueDefaultOptions.current[0]?.options.length > 0 && (
        <Field name='venueIds' id='venueIds' data-cy='venue-select'>
          {(fieldProps: FieldProps<string, EventCreateDTO>) => (
            <SelectAsync
              name='venueIds'
              label='Venue'
              id='venueIds'
              placeholder='Type to search...'
              data-cy='venue-select'
              formLabelProps={formLabelProps}
              fieldProps={fieldProps}
              cacheOptions
              defaultValue={getDefaultValues()}
              isMulti
              isClearable
              closeMenuOnSelect={false}
              defaultOptions={venueDefaultOptions.current}
              loadOptions={promiseOptions}
              isLoading={getSortedVenues.isLoading}
              onChange={(newValue: MultiValue<string | VenueOption>) =>
                handleChange(newValue, fieldProps)
              }
              value={getFieldValue(fieldProps)}
              formatGroupLabel={formatGroupLabel}
              isOptionDisabled={isOptionDisabled}
            />
          )}
        </Field>
      )}
    </>
  );
};
