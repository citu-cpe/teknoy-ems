import { Button, Flex, Spacer } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { OrganizerDTO, OrganizerDTOTypeEnum } from 'generated-api';
import { useContext, useEffect } from 'react';
import * as Yup from 'yup';
import { FormLayout, Input, Select } from '../../../shared/components/form';
import { FormikResetButton } from '../../../shared/components/form/FormikResetButton';
import { WebSocketEnum } from '../../../shared/enums/webSocketEnum';
import { useToast } from '../../../shared/hooks';
import { SocketContext } from '../../../shared/providers/SocketProvider';
import { useOrganizers } from '../hooks';

interface OrganizerAddFormProps {
  initialOrganizer: OrganizerDTO;
  onComplete: (organizer: OrganizerDTO) => void;
}

export const OrganizerEditForm = ({
  initialOrganizer,
  onComplete,
}: OrganizerAddFormProps) => {
  const { editOrganizer } = useOrganizers();
  const toast = useToast();
  const socket = useContext(SocketContext);
  const onSubmit = (organizer: OrganizerDTO) => {
    if (
      initialOrganizer.name === organizer.name &&
      initialOrganizer.type === organizer.type
    ) {
      if (onComplete) {
        onComplete(organizer);
      }

      toast({ title: 'No organizer changes', status: 'info' });
      return;
    }

    editOrganizer.mutate(organizer);
  };

  const initialValues = {
    ...initialOrganizer,
  };

  const validationSchema = Yup.object({
    name: Yup.string().min(1).max(40).required('Required'),
    type: Yup.string().min(1).max(40).required('Required'),
  });

  useEffect(() => {
    if (editOrganizer.isSuccess) {
      toast({ title: 'Edited organizer successfully' });
      onComplete(editOrganizer.data.data);
      socket?.emit(WebSocketEnum.UPDATE_TABLES, 'ORGANIZER');
    }
  }, [editOrganizer, onComplete, toast]);

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
            <FormikResetButton />
            <Spacer />
            <Button
              variant='solid'
              data-cy='edit-submit-btn'
              formNoValidate
              type='submit'
              isLoading={editOrganizer.isLoading}
              loadingText='Editing...'
            >
              Edit Organizer
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
