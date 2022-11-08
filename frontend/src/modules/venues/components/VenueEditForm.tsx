import { Button, Flex, Spacer } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { VenueDTO } from 'generated-api';
import { useContext, useEffect } from 'react';
import * as Yup from 'yup';
import { FormLayout, Input } from '../../../shared/components/form';
import { FormikResetButton } from '../../../shared/components/form/FormikResetButton';
import { WebSocketEnum } from '../../../shared/enums/webSocketEnum';
import { useToast } from '../../../shared/hooks';
import { SocketContext } from '../../../shared/providers/SocketProvider';
import { useVenues } from '../hooks';

interface VenueAddFormProps {
  initialVenue: VenueDTO;
  onComplete: (venueDTO: VenueDTO) => void;
}

export const VenueEditForm = ({
  initialVenue,
  onComplete,
}: VenueAddFormProps) => {
  const { editVenue } = useVenues();
  const toast = useToast();
  const socket = useContext(SocketContext);
  const onSubmit = (venueDTO: VenueDTO) => {
    if (
      initialVenue.name === venueDTO.name &&
      initialVenue.notes === venueDTO.notes
    ) {
      if (onComplete) {
        onComplete(venueDTO);
      }

      toast({ title: 'No venue changes', status: 'info' });
      return;
    }

    editVenue.mutate(venueDTO);
  };

  const initialValues = {
    id: initialVenue.id,
    name: initialVenue.name,
    notes: initialVenue.notes,
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(1).max(40).required('Required'),
    notes: Yup.string().min(1).max(250),
  });

  useEffect(() => {
    if (editVenue.isSuccess) {
      toast({ title: 'Edited venue successfully' });
      onComplete(editVenue.data.data);
      socket?.emit(WebSocketEnum.UPDATE_TABLES, 'VENUE');
    }
  }, [editVenue, onComplete, toast]);

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
                  <Input
                    fieldProps={fieldProps}
                    name='notes'
                    label='Notes'
                    type='text'
                    id='notes'
                    placeholder='Always NO food and drinks allowed'
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
              isLoading={editVenue.isLoading}
              loadingText='Editing...'
            >
              Edit Venue
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
