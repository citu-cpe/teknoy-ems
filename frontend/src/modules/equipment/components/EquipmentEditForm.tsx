import { Button, Flex, Spacer } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { EquipmentDTO } from 'generated-api';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { FormLayout, Input, Select } from '../../../shared/components/form';
import { FormikResetButton } from '../../../shared/components/form/FormikResetButton';
import { useToast } from '../../../shared/hooks';
import { useEquipment } from '../hooks';

interface EquipmentAddFormProps {
  initialEquipment: EquipmentDTO;
  onComplete: (equipmentDTO: EquipmentDTO) => void;
}

export const EquipmentEditForm = ({
  initialEquipment,
  onComplete,
}: EquipmentAddFormProps) => {
  const { editEquipment } = useEquipment();
  const toast = useToast();

  const onSubmit = (equipmentDTO: EquipmentDTO) => {
    if (
      initialEquipment.name === equipmentDTO.name &&
      initialEquipment.type === equipmentDTO.type &&
      initialEquipment.brand === equipmentDTO.brand &&
      initialEquipment.serial === equipmentDTO.serial &&
      initialEquipment.notes === equipmentDTO.notes
    ) {
      if (onComplete) {
        onComplete(equipmentDTO);
      }

      toast({ title: 'No equipment changes', status: 'info' });
      return;
    }

    editEquipment.mutate(equipmentDTO);
  };

  const initialValues = {
    id: initialEquipment.id,
    name: initialEquipment.name,
    type: initialEquipment.type,
    brand: initialEquipment.brand,
    serial: initialEquipment.serial,
    notes: initialEquipment.notes,
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(1).max(80).required('Required'),
    type: Yup.string().min(1).max(80).required('Required'),
    notes: Yup.string().min(1).max(250).required('Required'),
  });

  useEffect(() => {
    if (editEquipment.isSuccess) {
      toast({ title: 'Edited equipment successfully' });
      onComplete(editEquipment.data.data);
    }
  }, [editEquipment, onComplete, toast]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form noValidate>
          <Form noValidate>
            <FormLayout>
              <Field name='name' type='text' isRequired>
                {(fieldProps: FieldProps<string, EquipmentDTO>) => (
                  <Input
                    fieldProps={fieldProps}
                    name='name'
                    label='Name'
                    type='text'
                    id='name'
                    placeholder='EPSON Large 3'
                    isRequired
                    data-cy='name-input'
                  />
                )}
              </Field>
              <Field name='type' type='text' isRequired>
                {(fieldProps: FieldProps<string, EquipmentDTO>) => (
                  <Select
                    fieldProps={fieldProps}
                    name='type'
                    label='Type'
                    id='type'
                    isRequired
                    data-cy='type-select'
                  >
                    <option value='Camera'>Camera</option>
                    <option value='Projector'>Projector</option>
                    <option value='Speaker'>Speaker</option>
                    <option value='Microphone'>Microphone</option>
                    <option value='Wire'>Wire</option>
                    <option value='Monitor'>Monitor</option>
                    <option value='Computer'>Computer</option>
                    <option value='Laptop'>Laptop</option>
                    <option value='Lights'>Lights</option>
                    <option value='Others'>Others</option>
                    <option value='EQUIPMENT SET'>EQUIPMENT SET</option>
                    <option value='Broken'>Broken</option>
                    <option value='Unallowed'>Unallowed</option>
                  </Select>
                )}
              </Field>
              <Field name='brand' type='text'>
                {(fieldProps: FieldProps<string, EquipmentDTO>) => (
                  <Input
                    fieldProps={fieldProps}
                    name='brand'
                    label='Brand'
                    type='text'
                    id='brand'
                    placeholder='EPSON'
                    data-cy='brand-input'
                  />
                )}
              </Field>
              <Field name='serial' type='text'>
                {(fieldProps: FieldProps<string, EquipmentDTO>) => (
                  <Input
                    fieldProps={fieldProps}
                    name='serial'
                    label='Serial'
                    type='serial'
                    id='serial'
                    placeholder='GIJ777GIM'
                    data-cy='serial-input'
                  />
                )}
              </Field>
              <Field name='notes' type='text' isRequired>
                {(fieldProps: FieldProps<string, EquipmentDTO>) => (
                  <Input
                    fieldProps={fieldProps}
                    name='notes'
                    label='Notes'
                    type='text'
                    id='notes'
                    placeholder="Don't forget equipment bag"
                    isRequired
                    data-cy='notes-input'
                  />
                )}
              </Field>
            </FormLayout>
          </Form>
          <Flex w='full' h='full'>
            <FormikResetButton />
            <Spacer />
            <Button
              variant='solid'
              data-cy='edit-submit-btn'
              formNoValidate
              type='submit'
              isLoading={editEquipment.isLoading}
              loadingText='Editing...'
            >
              Edit Equipment
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
