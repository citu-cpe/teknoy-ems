import { Button, Flex, Spacer } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { VenueDTO } from 'generated-api';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { FormLayout, Input, Textarea } from '../../../shared/components/form';
import { FormikResetButton } from '../../../shared/components/form/FormikResetButton';
import { useToast } from '../../../shared/hooks';
import { useVenues } from '../hooks';

interface VenueAddFormProps {
  onComplete: (venueDTO: VenueDTO) => void;
}

export const VenueAddForm = ({ onComplete }: VenueAddFormProps) => {
  const { addVenue } = useVenues();
  const toast = useToast();

  const onSubmit = (venueDTO: VenueDTO) => {
    addVenue.mutate(venueDTO);
  };

  const initialValues = {
    name: '',
    notes: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(1).max(40).required('Required'),
    notes: Yup.string().min(1).max(250),
  });

  useEffect(() => {
    if (addVenue.isSuccess) {
      toast({ title: 'Added venue successfully' });
      onComplete(addVenue.data.data);
    }
  }, [addVenue, onComplete, toast]);

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
              {(fieldProps: FieldProps<string, VenueDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  name='name'
                  label='Name'
                  type='text'
                  id='name'
                  placeholder='Case Room'
                  isRequired
                  data-cy='name-input'
                />
              )}
            </Field>
            <Field name='notes' type='text'>
              {(fieldProps: FieldProps<string, VenueDTO>) => (
                <Textarea
                  fieldProps={fieldProps}
                  name='notes'
                  label='Notes'
                  id='notes'
                  placeholder='Always NO food and drinks allowed'
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
              isLoading={addVenue.isLoading}
              loadingText='Adding...'
            >
              Add Venue
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
