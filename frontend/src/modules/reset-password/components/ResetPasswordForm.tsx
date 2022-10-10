import {
  Button,
  Flex,
  FormLabel, IconButton,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import {
  ChangePasswordDTO,
  ResetPasswordDTO
} from 'generated-api';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import * as Yup from 'yup';
import { FormLayout } from '../../../shared/components/form';
import { Input } from '../../../shared/components/form/Input';
import {
  confirmPasswordValidator,
  passwordValidator
} from '../../../shared/schemas';
import { useResetPasswords } from '../hooks';

interface ResetPasswordFormProps {
  token: string;
  onComplete: (status: number) => void;
}

export const ResetPasswordForm = ({
  token,
  onComplete,
}: ResetPasswordFormProps) => {
  const initialValues = {
    token,
    newPassword: '',
    confirmPassword: '',
  };

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfimPassword, setShowConfirmPassword] = useState(false);

  const { resetPassword } = useResetPasswords();

  const validationSchema = Yup.object({
    newPassword: passwordValidator,
    confirmPassword: confirmPasswordValidator('newPassword'),
  });

  const onSubmit = (resetPasswordDTO: ResetPasswordDTO) => {
    resetPassword.mutate(resetPasswordDTO, {
      onSuccess: (res) => {
        onComplete(res.status);
      },
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
          <FormLayout mb={6}>
            <Flex justifyContent='center' alignItems='center'>
              <FormLabel
                htmlFor='newPassword'
                fontWeight='semibold'
                m={0}
                p={0}
                pr={5}
                textAlign='right'
                minW={56}
              >
                New Password
              </FormLabel>
              <Field name='newPassword' type='password' isRequired>
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
                      isRequired
                      data-cy='new-password-input'
                    />
                  </InputGroup>
                )}
              </Field>
            </Flex>
            <Flex justifyContent='center' alignItems='center'>
              <FormLabel
                htmlFor='confirmPassword'
                fontWeight='semibold'
                m={0}
                p={0}
                pr={5}
                minW={56}
                textAlign='right'
              >
                Confirm New Password
              </FormLabel>
              <Field name='confirmPassword' type='confirmPassword' isRequired>
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
                      isRequired
                      data-cy='confirm-password-input'
                    />
                  </InputGroup>
                )}
              </Field>
            </Flex>
          </FormLayout>
          <Flex justifyContent='flex-end'>
            <Button
              variant='solid'
              formNoValidate
              data-cy='login-submit-btn'
              type='submit'
              isLoading={resetPassword.isLoading}
              loadingText='Resetting in...'
              w='full'
            >
              Reset Password
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
