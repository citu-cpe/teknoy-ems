import {
  Button,
  Flex,
  FormLabel,
  IconButton,
  InputGroup,
  InputRightElement,
  Spacer,
} from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { ChangePasswordDTO, UserDTO } from 'generated-api';
import { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import * as Yup from 'yup';
import { FormLayout, Input } from '../../../shared/components/form';
import {
  confirmPasswordValidator,
  passwordValidator,
} from '../../../shared/schemas';
import { useChangePassword } from '../hooks';

interface ChangePasswordForm {
  onComplete?: (userDTO: UserDTO) => void;
}

export const ChangePasswordForm = ({ onComplete }: ChangePasswordForm) => {
  const mutation = useChangePassword();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfimPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (passwordDTO: ChangePasswordDTO) => {
    mutation.mutate(passwordDTO);
  };

  const initialValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    newPassword: passwordValidator,
    confirmPassword: confirmPasswordValidator('newPassword'),
  });

  useEffect(() => {
    if (onComplete && mutation.isSuccess) {
      onComplete(mutation.data.data);
    }
  }, [mutation, onComplete]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form noValidate>
          <FormLayout gap={3}>
            <Flex direction='column'>
              <FormLabel>Current Password</FormLabel>
              <Field name='currentPassword' type='password'>
                {(fieldProps: FieldProps<string, ChangePasswordDTO>) => (
                  <InputGroup>
                    {fieldProps.field.value?.length > 0 ? (
                      <InputRightElement
                        alignItems='center'
                        justifyContent='center'
                        h={10}
                        px='4'
                      >
                        <IconButton
                          aria-label='Show password'
                          size='sm'
                          variant='ghost'
                          icon={
                            showCurrentPassword ? <FaEye /> : <FaEyeSlash />
                          }
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        />
                      </InputRightElement>
                    ) : null}
                    <Input
                      fieldProps={fieldProps}
                      name='currentPassword'
                      type={showCurrentPassword ? 'text' : 'password'}
                      id='currentPassword'
                      data-cy='current-password-input'
                    />
                  </InputGroup>
                )}
              </Field>
            </Flex>
            <Flex direction='column'>
              <FormLabel>New Password</FormLabel>
              <Field name='newPassword' type='password'>
                {(fieldProps: FieldProps<string, ChangePasswordDTO>) => (
                  <InputGroup>
                    {fieldProps.field.value?.length > 0 ? (
                      <InputRightElement
                        alignItems='center'
                        justifyContent='center'
                        h={10}
                        px='4'
                      >
                        <IconButton
                          aria-label='Show password'
                          size='sm'
                          variant='ghost'
                          icon={showNewPassword ? <FaEye /> : <FaEyeSlash />}
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        />
                      </InputRightElement>
                    ) : null}
                    <Input
                      fieldProps={fieldProps}
                      name='newPassword'
                      type={showNewPassword ? 'text' : 'password'}
                      id='newPassword'
                      data-cy='new-password-input'
                    />
                  </InputGroup>
                )}
              </Field>
            </Flex>
            <Flex direction='column'>
              <FormLabel>Confirm New Password</FormLabel>
              <Field name='confirmPassword' type='confirmPassword'>
                {(fieldProps: FieldProps<string, ChangePasswordDTO>) => (
                  <InputGroup>
                    {fieldProps.field.value?.length > 0 ? (
                      <InputRightElement
                        alignItems='center'
                        justifyContent='center'
                        h={10}
                        px='4'
                      >
                        <IconButton
                          aria-label='Show confirm password'
                          size='sm'
                          variant='ghost'
                          icon={showConfimPassword ? <FaEye /> : <FaEyeSlash />}
                          onClick={() =>
                            setShowConfirmPassword(!showConfimPassword)
                          }
                        />
                      </InputRightElement>
                    ) : null}

                    <Input
                      fieldProps={fieldProps}
                      name='confirmPassword'
                      type={showConfimPassword ? 'text' : 'password'}
                      id='confirmPassword'
                      data-cy='confirm-password-input'
                    />
                  </InputGroup>
                )}
              </Field>
            </Flex>
          </FormLayout>
          <Flex w='full' h='full'>
            <Button type='reset'>Reset Inputs</Button>
            <Spacer />
            <Button
              variant='solid'
              data-cy='change-password-submit-btn'
              formNoValidate
              type='submit'
              isLoading={mutation.isLoading}
              loadingText='Submtting...'
            >
              Change Password
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
