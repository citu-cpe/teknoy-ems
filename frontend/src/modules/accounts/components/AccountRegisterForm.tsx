import { Button, Flex, FormControl, FormLabel, Spacer } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { RegisterUserDTO, RegisterUserDTORolesEnum } from 'generated-api';
import { useEffect } from 'react';
import * as Yup from 'yup';
import {
  Checkbox,
  FormikResetEffect,
  FormLayout,
  Input,
} from '../../../shared/components/form';
import { FormikResetButton } from '../../../shared/components/form/FormikResetButton';
import { useToast } from '../../../shared/hooks';
import { emailValidator, nameValidator } from '../../../shared/schemas';
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
    email: emailValidator,
    name: nameValidator,
    roles: Yup.array()
      .min(1, 'Must include at least one role')
      .required('Required'),
  });

  useEffect(() => {
    if (mutation.isSuccess) {
      toast({ title: 'Registered account successfully' });
      onComplete(mutation.data.data);
    }
  }, [mutation, onComplete, toast]);

  /**
   * basic resetForm() function from `Formik` library
   * does not reset the values of all Field members of a Field group,
   * so we need to extend the reset functionality
   */
  const handleReset = () => {
    const checkboxIds = ['admin-role', 'staff-role', 'organizer-role'];

    checkboxIds.map((id) => {
      const checkbox = window.document.getElementById(
        `${id}`
      ) as HTMLInputElement | null;

      if (checkbox?.checked) {
        checkbox.click();
      }
    });
  };

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
            onReset={handleReset}
          />
          <FormLayout>
            <Field name='email' type='email'>
              {(fieldProps: FieldProps<string, RegisterUserDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  name='email'
                  label='Email'
                  type='email'
                  id='email'
                  placeholder='juan.delacruz@univ.edu'
                  isRequired
                  data-cy='email-input'
                />
              )}
            </Field>
            <Field name='name' type='name' isRequired>
              {(fieldProps: FieldProps<string, RegisterUserDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  name='name'
                  label='Name'
                  type='name'
                  id='name'
                  placeholder='Juan Dela Cruz'
                  isRequired
                  data-cy='name-input'
                />
              )}
            </Field>
            <Flex as={FormControl} isRequired role='group'>
              <FormLabel
                fontWeight='semibold'
                minW={28}
                m={0}
                p={0}
                pr={5}
                textAlign='right'
              >
                Roles
              </FormLabel>
              <Flex direction='column' gap={0}>
                <Field
                  name='roles'
                  type='checkbox'
                  value={RegisterUserDTORolesEnum.Admin}
                >
                  {(fieldProps: FieldProps<string, RegisterUserDTO>) => (
                    <Checkbox
                      fieldProps={fieldProps}
                      name='roles'
                      checked={fieldProps.field.checked}
                      id='admin-role'
                      data-cy='admin-checkbox'
                    >
                      {fieldProps.field.value}
                    </Checkbox>
                  )}
                </Field>
                <Field
                  name='roles'
                  type='checkbox'
                  value={RegisterUserDTORolesEnum.Staff}
                >
                  {(fieldProps: FieldProps<string, RegisterUserDTO>) => (
                    <Checkbox
                      fieldProps={fieldProps}
                      name='roles'
                      id='staff-role'
                      data-cy='staff-checkbox'
                    >
                      {fieldProps.field.value}
                    </Checkbox>
                  )}
                </Field>
                <Field
                  name='roles'
                  type='checkbox'
                  value={RegisterUserDTORolesEnum.Organizer}
                >
                  {(fieldProps: FieldProps<string, RegisterUserDTO>) => (
                    <Checkbox
                      fieldProps={fieldProps}
                      name='roles'
                      checked={fieldProps.field.checked}
                      id='organizer-role'
                      data-cy='organizer-checkbox'
                    >
                      {fieldProps.field.value}
                    </Checkbox>
                  )}
                </Field>
              </Flex>
            </Flex>
          </FormLayout>
          <Flex w='full' h='full'>
            <FormikResetButton onClick={handleReset} />
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
