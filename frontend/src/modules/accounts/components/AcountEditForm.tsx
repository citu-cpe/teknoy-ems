import { Box, Button, Flex, Spacer } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { UserDTO } from 'generated-api';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { FormikResetEffect, Input } from '../../../shared/components/form';
import { useToast } from '../../../shared/hooks';
import { nameValidator } from '../../../shared/schemas';
import { useEdit } from '../hooks/useEdit';

interface AccountEditFormProps {
  initialUser: UserDTO;
  onComplete?: (userDTO: UserDTO) => void;
}

export const AccountEditForm = ({
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
      router.push('/accounts');
    }

    mutation.mutate(userDTO);
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      if (onComplete) {
        onComplete(mutation.data.data);
      }

      toast({ title: 'Edited account successfully' });
      router.push('/accounts');
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
          <FormikResetEffect
            dependencies={[mutation]}
            condition={mutation.isError}
          />
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
            <Field name='roles' type='roles' isReadOnly>
              {(fieldProps: FieldProps<string, UserDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  name='roles'
                  label='Roles'
                  type='roles'
                  id='roles'
                  isReadOnly
                />
              )}
            </Field>
            <Field name='name' type='name' isReadOnly>
              {(fieldProps: FieldProps<string, UserDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  name='name'
                  label='Name'
                  type='name'
                  id='name'
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
