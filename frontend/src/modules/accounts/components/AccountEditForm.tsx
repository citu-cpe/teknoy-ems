import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormLabelProps,
  Spacer,
} from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { RegisterUserDTORolesEnum, UserDTO } from 'generated-api';
import { useRouter } from 'next/router';
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
import { nameValidator } from '../../../shared/schemas';
import { useResetPasswords } from '../../reset-password/';
import { useEdit } from '../hooks/useEdit';

interface AccountEditFormProps {
  initialUser: UserDTO;
  onComplete?: (userDTO: UserDTO) => void;
}

const formLabelProps: FormLabelProps = {
  minW: 32,
};

export const AccountEditForm = ({
  initialUser,
  onComplete,
}: AccountEditFormProps) => {
  const router = useRouter();
  const toast = useToast();
  const mutation = useEdit();
  const { sendResetPasswordLink } = useResetPasswords();

  const initialValues = {
    ...initialUser,
  };

  const validationSchema = Yup.object({
    name: nameValidator,
    roles: Yup.array()
      .min(1, 'Must include at least one role')
      .required('Required'),
  });

  const onSubmit = (userDTO: UserDTO) => {
    if (
      initialUser.name === userDTO.name &&
      initialUser.roles === userDTO.roles
    ) {
      if (onComplete) {
        onComplete(userDTO);
      }

      toast({ title: 'No account changes', status: 'info' });
      return;
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

  const handleResetPassword = () => {
    sendResetPasswordLink.mutate(
      { email: initialUser.email },
      {
        onSuccess: () => {
          toast({
            title: 'Reset Password Request',
            description: `Reset link sent to ${initialUser.email}`,
            duration: 9000,
          });
        },
      }
    );
  };

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
            <Field name='email' type='email' isReadOnly>
              {(fieldProps: FieldProps<string, UserDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  formLabelProps={formLabelProps}
                  name='email'
                  label='Email'
                  type='email'
                  id='email'
                  isReadOnly
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
                {...formLabelProps}
              >
                Roles
              </FormLabel>
              <Flex direction='column'>
                <Field
                  name='roles'
                  type='checkbox'
                  value={RegisterUserDTORolesEnum.Admin}
                  isChecked
                >
                  {(fieldProps: FieldProps<string, UserDTO>) => (
                    <Checkbox
                      fieldProps={fieldProps}
                      name='roles'
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
                  {(fieldProps: FieldProps<string, UserDTO>) => (
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
                  data-cy='organizer-checkbox'
                >
                  {(fieldProps: FieldProps<string, UserDTO>) => (
                    <Checkbox
                      fieldProps={fieldProps}
                      name='roles'
                      id='organizer-role'
                    >
                      {fieldProps.field.value}
                    </Checkbox>
                  )}
                </Field>
              </Flex>
            </Flex>
            <Field name='name' type='name' isRequired>
              {(fieldProps: FieldProps<string, UserDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  formLabelProps={formLabelProps}
                  name='name'
                  label='Name'
                  type='name'
                  id='name'
                  isRequired
                  data-cy='name-input'
                />
              )}
            </Field>
            <Flex alignItems='center'>
              <FormLabel
                htmlFor='newPassword'
                fontWeight='semibold'
                m={0}
                p={0}
                pr={8}
                textAlign='right'
                {...formLabelProps}
              >
                Password
              </FormLabel>
              <Button
                minW={40}
                maxW={40}
                ml={-4}
                isLoading={sendResetPasswordLink.isLoading}
                loadingText='Sending reset link...'
                onClick={handleResetPassword}
              >
                Reset Password
              </Button>
            </Flex>
          </FormLayout>
          <Flex w='full' h='full'>
            <FormikResetButton />
            <Spacer />
            <Button
              variant='solid'
              data-cy='edit-submit-btn'
              formNoValidate
              type='submit'
              isLoading={mutation.isLoading}
              loadingText='Editing...'
            >
              Edit Profile
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
