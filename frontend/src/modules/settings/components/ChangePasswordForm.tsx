import {
  Box,
  Button,
  Flex,
  FormLabel,
  IconButton,
  InputGroup,
  InputRightElement,
  Spacer,
} from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { ChangePasswordDTO } from 'generated-api';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import * as Yup from 'yup';
import { Input } from '../../../shared/components/form';
import { confirmPassword, password } from '../../../shared/schemas';
import { useChangePassword } from '../hooks';

export const ChangePasswordForm = () => {
  const mutation = useChangePassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfimPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (passwordDTO: ChangePasswordDTO) => {
    mutation.mutate(passwordDTO);
  };

  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    password,
    confirmPassword,
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form noValidate>
          <Box mb='4'>
            <FormLabel>New Password</FormLabel>
            <Field name='password' type='password'>
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
                        icon={showPassword ? <FaEye /> : <FaEyeSlash />}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  ) : null}
                  <Input
                    fieldProps={fieldProps}
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                  />
                </InputGroup>
              )}
            </Field>

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
                  />
                </InputGroup>
              )}
            </Field>
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
