import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  InputGroup,
  InputRightElement,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { ChangePasswordDTO, LoginUserDTO } from 'generated-api';
import NextLink from 'next/link';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import * as Yup from 'yup';
import { LinkText } from '../../../shared/components/elements';
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
          <FormLayout mb={10} gap={3}>
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
            <Flex
              pl={4}
              fontSize='sm'
              w='full'
              opacity={0.8}
              justifyContent='space-between'
              alignItems='center'
            >
              <Tooltip
                placement='bottom-start'
                label='Email MSDO Department at msdo@cit.edu'
                cursor='pointer'
                hasArrow
              >
                <Text
                  _hover={{
                    opacity: 1,
                    textDecoration: 'none',
                    color: 'brand.200',
                    cursor: 'pointer',
                  }}
                >
                  No account?
                </Text>
              </Tooltip>
              <LinkText label='Forgot Password?' route='/reset-password' />
            </Flex>
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
