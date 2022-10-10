import { Button, Flex } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { ResetPasswordLinkDTO } from 'generated-api';
import * as Yup from 'yup';
import { FormLayout } from '../../../shared/components/form';
import { Input } from '../../../shared/components/form/Input';
import { useResetPasswords } from '../hooks';

interface ResetPasswordLinkForm {
  onComplete: (email: string) => void;
}

export const ResetPasswordLinkForm = ({
  onComplete,
}: ResetPasswordLinkForm) => {
  const { sendResetPasswordLink } = useResetPasswords();

  const initialValues = { email: '' };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
  });

  const onSubmit = (resetPasswordLinkDTO: ResetPasswordLinkDTO) => {
    sendResetPasswordLink.mutate(resetPasswordLinkDTO, {
      onSuccess: () => {
        onComplete(resetPasswordLinkDTO.email);
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
            <Field name='email' type='email' isRequired>
              {(fieldProps: FieldProps<string, ResetPasswordLinkDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  formLabelProps={{
                    textAlign: 'left',
                  }}
                  name='email'
                  label='Email'
                  type='email'
                  id='email'
                  isRequired
                />
              )}
            </Field>
          </FormLayout>
          <Flex justifyContent='flex-end'>
            <Button
              variant='solid'
              formNoValidate
              data-cy='login-submit-btn'
              type='submit'
              isLoading={sendResetPasswordLink.isLoading}
              loadingText='Sending...'
              w='full'
            >
              Send Reset Link
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
