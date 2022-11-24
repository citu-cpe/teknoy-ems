import { Button, Divider, Flex, Heading, Spacer } from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { MasterSettingsDTO } from 'generated-api';
import { useContext, useRef } from 'react';
import { useMutation } from 'react-query';
import {
  Checkbox,
  FormikResetButton,
  FormLayout,
} from '../../../shared/components/form';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export interface MasterSettingsProps {
  masterSettings: MasterSettingsDTO;
  onComplete?: (updatedSettings: MasterSettingsDTO) => void;
}

export const MasterSettings = ({
  masterSettings,
  onComplete,
}: MasterSettingsProps) => {
  const api = useContext(ApiContext);
  const savedSettings = useRef<MasterSettingsDTO>(masterSettings);

  const setMasterSettings = useMutation(
    (newSettings: MasterSettingsDTO) => api.setMasterSettings(newSettings),
    {
      onSuccess: () => {
        if (onComplete) {
          onComplete(savedSettings.current);
        }
      },
    }
  );

  const onSubmit = (updatedSettings: MasterSettingsDTO) => {
    savedSettings.current = updatedSettings;
    setMasterSettings.mutate(updatedSettings);
  };

  const initialValues: MasterSettingsDTO = {
    allowOrganizersCRUD: masterSettings?.allowOrganizersCRUD || false,
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {() => (
          <Form noValidate>
            <FormLayout>
              <Divider my={6} />
              <Heading size='md'>Master Settings</Heading>
              <Flex w='full' justifyContent='space-between'>
                <Field name='allowOrganizersCRUD' type='text'>
                  {(fieldProps: FieldProps<string, MasterSettingsDTO>) => (
                    <Checkbox
                      fieldProps={fieldProps}
                      name='allowOrganizersCRUD'
                      size='lg'
                      id='allowOrganizersCRUD'
                      placeholder='Case Room'
                      isRequired
                      data-cy='name-input'
                      defaultChecked={masterSettings.allowOrganizersCRUD}
                      spacing={4}
                    >
                      Enable Events Management features for Organizers
                    </Checkbox>
                  )}
                </Field>
              </Flex>
            </FormLayout>
            <Flex w='full' h='full'>
              <FormikResetButton>Reset to Defaults</FormikResetButton>
              <Spacer />
              <Button
                variant='solid'
                data-cy='add-submit-btn'
                formNoValidate
                type='submit'
                isLoading={setMasterSettings.isLoading}
                loadingText='Saving...'
              >
                Save Settings
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </>
  );
};
