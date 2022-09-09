import { Button, Flex, Spacer } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { OrganizerDTO, OrganizerDTOTypeEnum } from 'generated-api';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { FormLayout, Input, Select } from '../../../shared/components/form';
import { useToast } from '../../../shared/hooks';
import { useOrganizers } from '../hooks';

interface OrganizerAddFormProps {
  onComplete: (organizer: OrganizerDTO) => void;
}

export const OrganizerAddForm = ({ onComplete }: OrganizerAddFormProps) => {
  const { addOrganizer } = useOrganizers();
  const toast = useToast();

  const onSubmit = (organizer: OrganizerDTO) => {
    addOrganizer.mutate(organizer);
  };

  const initialValues = {
    name: '',
    type: OrganizerDTOTypeEnum.Department,
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(1).max(40).required('Required'),
    type: Yup.string().min(1).max(40).required('Required'),
  });

  useEffect(() => {
    if (addOrganizer.isSuccess) {
      toast({ title: 'Added organizer successfully' });
      onComplete(addOrganizer.data.data);
    }
  }, [addOrganizer, onComplete, toast]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form noValidate>
          <FormLayout>
            <Field name='name' type='name' isRequired>
              {(fieldProps: FieldProps<string, OrganizerDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  name='name'
                  label='Name'
                  type='name'
                  id='name'
                  placeholder='College of Engineering and Architecture'
                  isRequired
                  data-cy='name-input'
                />
              )}
            </Field>
            <Field name='type' type='text' isRequired>
              {(fieldProps: FieldProps<string, OrganizerDTO>) => (
                <Select
                  fieldProps={fieldProps}
                  name='type'
                  label='Type'
                  id='type'
                  isRequired
                  data-cy='type-select'
                >
                  <option value={OrganizerDTOTypeEnum.Department}>
                    {OrganizerDTOTypeEnum.Department.toString()}
                  </option>
                  <option value={OrganizerDTOTypeEnum.Organization}>
                    {OrganizerDTOTypeEnum.Organization.toString()}
                  </option>
                  <option value={OrganizerDTOTypeEnum.Others}>
                    {OrganizerDTOTypeEnum.Others.toString()}
                  </option>
                </Select>
              )}
            </Field>
          </FormLayout>
          <Flex w='full' h='full'>
            <Button type='reset'>Reset Inputs</Button>
            <Spacer />
            <Button
              variant='solid'
              data-cy='add-submit-btn'
              formNoValidate
              type='submit'
              isLoading={addOrganizer.isLoading}
              loadingText='Adding...'
            >
              Add Organizer
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
