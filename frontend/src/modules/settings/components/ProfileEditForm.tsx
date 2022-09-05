import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Spacer,
} from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { UserDTO } from 'generated-api';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { Input } from '../../../shared/components/form';
import { useToast } from '../../../shared/hooks';
import { nameValidator } from '../../../shared/schemas';
import { useEdit } from '../../accounts/hooks/useEdit';

interface AccountEditFormProps {
  initialUser: UserDTO;
  onComplete?: (userDTO: UserDTO) => void;
}

export const ProfileEditForm = ({
  initialUser,
  onComplete,
}: AccountEditFormProps) => {
  const router = useRouter();
  const toast = useToast();
  const mutation = useEdit();

  const initialValues = {
    ...initialUser,
  };

  const validationSchema = Yup.object({
    name: nameValidator,
  });

  const onSubmit = (userDTO: UserDTO) => {
    if (initialUser.name === userDTO.name) {
      toast({ title: 'No account changes', status: 'info' });
    }

    mutation.mutate(userDTO);
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      if (onComplete) {
        onComplete(mutation.data.data);
      }

      toast({ title: 'Edited account successfully' });
    }
  }, [mutation, onComplete, toast, router]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form noValidate>
          <Box mb='4'>
            <Field name='email' type='email' isReadOnly>
              {(fieldProps: FieldProps<string, UserDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  name='email'
                  label='Email'
                  type='email'
                  id='email'
                  isReadOnly
                />
              )}
            </Field>
            <Flex as={FormControl} role='group' direction='column'>
              <FormLabel fontWeight='semibold'>Roles</FormLabel>
              <Field name='roles' type='text' isReadOnly>
                {(fieldProps: FieldProps<string, UserDTO>) => (
                  <Input
                    fieldProps={fieldProps}
                    name='roles'
                    type='text'
                    isReadOnly
                  >
                    {/* {fieldProps.field.value} */}
                  </Input>
                )}
              </Field>
            </Flex>
            <Field name='name' type='name' isRequired>
              {(fieldProps: FieldProps<string, UserDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  name='name'
                  label='Name'
                  type='name'
                  id='name'
                  isRequired
                />
              )}
            </Field>
          </Box>
          <Flex w='full' h='full'>
            <Button type='reset'>Clear Inputs</Button>
            <Spacer />
            <Button
              variant='solid'
              data-cy='edit-submit-btn'
              formNoValidate
              type='submit'
              isLoading={mutation.isLoading}
              loadingText='Editing...'
            >
              Edit Account
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
