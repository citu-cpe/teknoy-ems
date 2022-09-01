import {
  Box,
  Button,
  Checkbox as ChakraCheckbox,
  Flex,
  FormLabel,
  Spacer,
} from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { RegisterUserDTO, RegisterUserDTORolesEnum } from 'generated-api';
import { useEffect } from 'react';
import * as Yup from 'yup';
import { FormikResetEffect, Input } from '../../../shared/components/form';
import { useToast } from '../../../shared/hooks';
import { email, name } from '../../../shared/schemas';
import { useRegister } from '../hooks/useRegister';

interface AccountRegisterFormProps {
  onComplete: (registerDTO: RegisterUserDTO) => void;
}

export const AccountRegisterForm = ({
  onComplete,
}: AccountRegisterFormProps) => {
  const mutation = useRegister();
  const toast = useToast();

  const onSubmit = (registerDTO: RegisterUserDTO) => {
    mutation.mutate(registerDTO);
  };

  const initialValues = {
    email: '',
    name: '',
    roles: [],
  };

  const validationSchema = Yup.object({
    email,
    name,
    roles: Yup.array()
      .test(
        'empty-check',
        'Must include at least one role',
        (roles) => roles?.length !== 0
      )
      .required('Required'),
  });

  useEffect(() => {
    if (mutation.isSuccess) {
      toast({ title: 'Registered account successfully' });
      onComplete(mutation.data.data);
    }
  }, [mutation, onComplete, toast]);

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
            <Field name='email' type='email'>
              {(fieldProps: FieldProps<string, RegisterUserDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  name='email'
                  label='Email'
                  type='email'
                  id='email'
                  placeholder='juan.delacruz@univ.edu'
                />
              )}
            </Field>
            <Field name='name' type='name'>
              {(fieldProps: FieldProps<string, RegisterUserDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  name='name'
                  label='Name'
                  type='name'
                  id='name'
                  placeholder='Juan Dela Cruz'
                  autoCapitalize='on'
                />
              )}
            </Field>
            <Flex role='group' direction='column'>
              <FormLabel fontWeight='semibold'>Roles</FormLabel>
              <Flex gap={3}>
                <Field
                  name='roles'
                  type='checkbox'
                  value={RegisterUserDTORolesEnum.Admin}
                >
                  {(fieldProps: FieldProps<string, RegisterUserDTO>) => (
                    <Input
                      as={ChakraCheckbox}
                      fieldProps={fieldProps}
                      name='roles'
                      type='checkbox'
                      id='admin-role'
                    >
                      {fieldProps.field.value}
                    </Input>
                  )}
                </Field>
                <Field
                  name='roles'
                  type='checkbox'
                  value={RegisterUserDTORolesEnum.Staff}
                >
                  {(fieldProps: FieldProps<string, RegisterUserDTO>) => (
                    <Input
                      as={ChakraCheckbox}
                      fieldProps={fieldProps}
                      name='roles'
                      type='checkbox'
                      id='staff-role'
                    >
                      {fieldProps.field.value}
                    </Input>
                  )}
                </Field>
                <Field
                  name='roles'
                  type='checkbox'
                  value={RegisterUserDTORolesEnum.Organizer}
                >
                  {(fieldProps: FieldProps<string, RegisterUserDTO>) => (
                    <Input
                      as={ChakraCheckbox}
                      fieldProps={fieldProps}
                      name='roles'
                      type='checkbox'
                      id='organizer-role'
                    >
                      {fieldProps.field.value}
                    </Input>
                  )}
                </Field>
              </Flex>
            </Flex>
          </Box>
          <Flex w='full' h='full'>
            <Button type='reset'>Clear Inputs</Button>
            <Spacer />
            <Button
              variant='solid'
              data-cy='register-submit-btn'
              formNoValidate
              type='submit'
              isLoading={mutation.isLoading}
              loadingText='Registering...'
            >
              Register Account
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
