import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { ChangePasswordDTO, LoginUserDTO } from 'generated-api';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import * as Yup from 'yup';
import { FormLayout } from '../../../shared/components/form';
import { Input } from '../../../shared/components/form/Input';
import { useLogin } from '../hooks/useLogin';

export const LoginForm = () => {
  const mutation = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const initialValues = { email: '', password: '' };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  const onSubmit = (loginDTO: LoginUserDTO) => {
    mutation.mutate(loginDTO);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form noValidate>
          <FormLayout>
            <Field name='email' type='email' isRequired>
              {(fieldProps: FieldProps<string, LoginUserDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  name='email'
                  label='Email'
                  type='email'
                  id='email'
                  isRequired
                  formLabelProps={{
                    minW: 32,
                  }}
                />
              )}
            </Field>

            <FormControl
              as={Flex}
              justifyContent='center'
              alignItems='center'
              isRequired
            >
              <FormLabel
                htmlFor='password'
                aria-labelledby='password'
                fontWeight='semibold'
                minW={32}
                m={0}
                p={0}
                pr={5}
                textAlign='right'
              >
                Password
              </FormLabel>
              <Field name='password' type='password' isRequired>
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
                      isRequired
                      data-cy='password-input'
                    />
                  </InputGroup>
                )}
              </Field>
            </FormControl>
          </FormLayout>
          <Box mb={2}>
            <Button
              variant='solid'
              formNoValidate
              data-cy='login-submit-btn'
              type='submit'
              isLoading={mutation.isLoading}
              loadingText='Logging in...'
              w='full'
            >
              Log In
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
