import { Button, Flex, Spacer } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { EquipmentDTO } from 'generated-api';
import { useEffect } from 'react';
import * as Yup from 'yup';
import {
  FormLayout,
  Input,
  Select,
  Textarea,
} from '../../../shared/components/form';
import { FormikResetButton } from '../../../shared/components/form/FormikResetButton';
import { useToast } from '../../../shared/hooks';
import { useEquipment } from '../hooks/useEquipment';

interface EquipmentAddFormProps {
  onComplete: (equipmentDTO: EquipmentDTO) => void;
}

export const EquipmentAddForm = ({ onComplete }: EquipmentAddFormProps) => {
  const { addEquipment } = useEquipment();
  const toast = useToast();

  const onSubmit = (equipmentDTO: EquipmentDTO) => {
    addEquipment.mutate(equipmentDTO);
  };

  const initialValues = {
    name: '',
    type: 'Camera',
    brand: '',
    serial: '',
    notes: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(1).max(40).required('Required'),
    type: Yup.string().min(1).max(40).required('Required'),
    notes: Yup.string().min(1).max(250).required('Required'),
  });

  useEffect(() => {
    if (addEquipment.isSuccess) {
      toast({ title: 'Added equipment successfully' });
      onComplete(addEquipment.data.data);
    }
  }, [addEquipment, onComplete, toast]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {() => (
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
                <Textarea
                  fieldProps={fieldProps}
                  name='notes'
                  label='Notes'
                  id='notes'
                  placeholder="Don't forget equipment bag"
                  isRequired
                  data-cy='notes-input'
                />
              )}
            </Field>
          </FormLayout>
          <Flex w='full' h='full'>
            <FormikResetButton />
            <Spacer />
            <Button
              variant='solid'
              data-cy='add-submit-btn'
              formNoValidate
              type='submit'
              isLoading={addEquipment.isLoading}
              loadingText='Adding...'
            >
              Add Equipment
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
