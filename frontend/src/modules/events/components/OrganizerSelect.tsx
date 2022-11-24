import { FormLabelProps } from '@chakra-ui/react';
import { Field, FieldProps } from 'formik';
import { EventCreateDTO, OrganizerDTO } from 'generated-api';
import { useContext, useEffect, useRef } from 'react';
import { useMutation } from 'react-query';
import { ActionMeta, MultiValue } from 'react-select';
import { SelectAsync } from '../../../shared/components/form/SelectAsync';
import { filterOptions } from '../../../shared/helpers/filter-options';
import { isOption } from '../../../shared/helpers/is-option';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { Option } from '../../../shared/types';
import { formLabelProps, requiredControlProp } from '../styles';

interface OrganizerSelectProps {
  defaultValue?: OrganizerDTO;
  customLabelProps?: FormLabelProps;
}

export const OrganizerSelect = ({
  defaultValue: organizer,
  customLabelProps,
}: OrganizerSelectProps) => {
  const api = useContext(ApiContext);
  const organizerOptions = useRef<Option[]>([]);

  useEffect(() => {
    fetchOrganizers.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrganizers = useMutation(() => api.getAllOrganizers(), {
    onSuccess: (data) => {
      organizerOptions.current = data.data.map((d) => {
        return {
          value: d.id,
          label: d.name,
        } as Option;
      });
    },
  });

  /**
   * Options that allow for async/promise fetching
   * (but currently, just a simple filtering because we fetch our data on first render)
   */
  const promiseOptions = (inputValue: string) =>
    new Promise<Option[]>((resolve) => {
      resolve(filterOptions(inputValue, organizerOptions.current));
    });

  const handleChange = (
    newValue: MultiValue<string | Option>,
    actionMeta: ActionMeta<string | Option>,
    fieldProps: FieldProps
  ) => {
    if (newValue === null || undefined) {
      // replace `null` and `undefined` with empty string for Yup validation
      fieldProps.form.setFieldValue(fieldProps.field.name, '');
    }
    // check if newValue is an object
    if (!!newValue && isOption(newValue)) {
      fieldProps.form.setFieldValue(fieldProps.field.name, newValue.value);
    } else {
      // newValue is simply string
      fieldProps.form.setFieldValue(fieldProps.field.name, newValue);
    }
  };

  const getFieldValue = (fieldProps: FieldProps) => {
    return organizerOptions.current
      ? organizerOptions.current.find(
          (option) => option.value === fieldProps.field.value
        )
      : '';
  };

  const getDefaultValue = (): Option | null => {
    if (organizer) {
      return {
        value: organizer.id,
        label: organizer.name,
      } as Option;
    }

    return null;
  };

  return (
    <Field name='organizerId' id='organizerId' data-cy='organizer-select'>
      {(fieldProps: FieldProps<string, EventCreateDTO>) => (
        <SelectAsync
          name='organizerId'
          label='Organizer'
          id='organizerId'
          placeholder='Search...'
          data-cy='organizer-select'
          formControlProps={requiredControlProp}
          formLabelProps={customLabelProps || formLabelProps}
          isClearable
          fieldProps={fieldProps}
          cacheOptions
          defaultValue={getDefaultValue()}
          defaultOptions={organizerOptions.current}
          loadOptions={promiseOptions}
          isLoading={fetchOrganizers.isLoading}
          onChange={(
            newValue: MultiValue<string | Option>,
            actionMeta: ActionMeta<string | Option>
          ) => handleChange(newValue, actionMeta, fieldProps)}
          value={getFieldValue(fieldProps)}
        />
      )}
    </Field>
  );
};
