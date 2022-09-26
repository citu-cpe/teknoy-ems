import { Field, FieldProps } from 'formik';
import { EquipmentDTO, EventCreateDTO } from 'generated-api';
import { useContext, useEffect, useRef } from 'react';
import { useMutation } from 'react-query';
import { MultiValue } from 'react-select';
import { SelectAsync } from '../../../shared/components/form/SelectAsync';
import { filterOptions } from '../../../shared/helpers/filter-options';
import { isOption } from '../../../shared/helpers/is-option';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { Option } from '../../../shared/types';
import { formLabelProps } from '../styles';

interface EquipmentSelectProps {
  defaultValue?: EquipmentDTO[];
}

export const EquipmentSelect = ({
  defaultValue: equipment,
}: EquipmentSelectProps) => {
  const api = useContext(ApiContext);
  const equipmentOptions = useRef<Option[]>([]);

  useEffect(() => {
    fetchEquipment.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEquipment = useMutation(() => api.getAllEquipments(), {
    onSuccess: (data) => {
      equipmentOptions.current = data.data.map((d) => {
        return {
          value: d.id,
          label: d.name,
        } as Option;
      });
    },
  });

  const getDefaultValues = (): Option[] => {
    if (equipment) {
      const equipmentOptions = equipment.map((eq) => {
        const option = {
          value: eq.id,
          label: eq.name,
        } as Option;

        return option;
      });

      return equipmentOptions;
    }

    return [];
  };

  /**
   * Options that allow for async/promise fetching
   * (but currently, just a simple filtering because we fetch our data on first render)
   */
  const promiseOptions = (inputValue: string) =>
    new Promise<Option[]>((resolve) => {
      resolve(filterOptions(inputValue, equipmentOptions.current));
    });

  const handleChange = (
    newValue: MultiValue<string | Option>,
    fieldProps: FieldProps
  ) => {
    if (newValue === null || undefined) {
      // replace `null` and `undefined` with empty string for Yup validation
      fieldProps.form.setFieldValue(fieldProps.field.name, '');
      return;
    }

    const formattedNewValues = newValue.map((item: Option | string) => {
      if (!!item && isOption(item)) {
        return item.value;
      }

      return item;
    });

    fieldProps.form.setFieldValue(fieldProps.field.name, formattedNewValues);
  };

  const getFieldValue = (fieldProps: FieldProps) => {
    return equipmentOptions.current
      ? equipmentOptions.current.find(
          (option) => option.value === fieldProps.field.value
        )
      : '';
  };

  return (
    <>
      {equipmentOptions.current.length > 0 && (
        <Field name='equipmentIds' id='equipmentIds' data-cy='equipment-select'>
          {(fieldProps: FieldProps<string, EventCreateDTO>) => (
            <SelectAsync
              name='equipmentIds'
              label='Equipment'
              id='equipmentIds'
              placeholder='Search...'
              data-cy='equipment-select'
              formLabelProps={formLabelProps}
              fieldProps={fieldProps}
              cacheOptions
              defaultValue={getDefaultValues()}
              isMulti
              isClearable
              closeMenuOnSelect={false}
              defaultOptions={equipmentOptions.current}
              loadOptions={promiseOptions}
              isLoading={fetchEquipment.isLoading}
              onChange={(newValue: MultiValue<string | Option>) =>
                handleChange(newValue, fieldProps)
              }
              value={getFieldValue(fieldProps)}
            />
          )}
        </Field>
      )}
    </>
  );
};
