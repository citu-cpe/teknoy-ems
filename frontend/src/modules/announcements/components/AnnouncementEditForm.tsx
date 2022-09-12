import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Spacer,
  Textarea,
} from '@chakra-ui/react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { AnnouncementDTO, AnnouncementDTOViewAccessEnum } from 'generated-api';
import { useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import {
  Checkbox,
  FormikResetEffect,
  FormLayout,
  Input,
  Select,
} from '../../../shared/components/form';
import { FormikResetButton } from '../../../shared/components/form/FormikResetButton';
import { valuesAreEqual } from '../../../shared/helpers';
import { useToast } from '../../../shared/hooks';
import { useAnnouncements } from '../hooks';

interface AnnouncementAddFormProps {
  initialAnnouncement: AnnouncementDTO;
  onComplete: (announcementDTO: AnnouncementDTO) => void;
}

export const AnnouncementEditForm = ({
  initialAnnouncement,
  onComplete,
}: AnnouncementAddFormProps) => {
  const { editAnnouncement } = useAnnouncements();
  const toast = useToast();

  const onSubmit = (announcementDTO: AnnouncementDTO) => {
    if (valuesAreEqual(initialAnnouncement, announcementDTO)) {
      if (onComplete) {
        onComplete(announcementDTO);
      }

      toast({ title: 'No announcement changes', status: 'info' });
      return;
    }

    editAnnouncement.mutate(announcementDTO);
  };

  const initialValues = {
    id: initialAnnouncement.id,
    title: initialAnnouncement.title,
    subtitle: initialAnnouncement.subtitle,
    content: initialAnnouncement.content,
    tags: initialAnnouncement.tags,
    viewAccess: initialAnnouncement.viewAccess,
  };

  const validationSchema = Yup.object({
    title: Yup.string().min(1).max(40).required('Required'),
    subtitle: Yup.string().min(1).max(40),
    content: Yup.string().min(1).max(500).required('Required'),
    tags: Yup.array()
      .min(1, 'Must include at least one tag')
      .required('Required'),
    viewAccess: Yup.string().required('Required'),
  });

  /**
   * To properly handle resetting of viewAccess enum
   */
  const handleReset = useCallback(() => {
    const selector = window.document.getElementById(
      'viewAccess'
    ) as HTMLSelectElement | null;
    if (selector) {
      selector.value = initialAnnouncement.viewAccess;
    }
  }, [initialAnnouncement]);

  useEffect(() => {
    if (editAnnouncement.isSuccess) {
      toast({ title: 'Edited announcement successfully' });
      onComplete(editAnnouncement.data.data);
    }

    // needs to reset on first render to properly display value of a AnnouncementDTOViewAccessEnum
    handleReset();
  }, [editAnnouncement, onComplete, toast, handleReset]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form noValidate>
          <FormikResetEffect
            dependencies={[editAnnouncement]}
            condition={editAnnouncement.isError}
            onReset={handleReset}
          />
          <FormLayout>
            <Field name='title' type='text' isRequired>
              {(fieldProps: FieldProps<string, AnnouncementDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  name='title'
                  label='Title'
                  type='text'
                  id='title'
                  placeholder='Under Renovation: Activity Center '
                  isRequired
                  data-cy='title-input'
                />
              )}
            </Field>
            <Field name='subtitle' type='text'>
              {(fieldProps: FieldProps<string, AnnouncementDTO>) => (
                <Input
                  fieldProps={fieldProps}
                  name='subtitle'
                  label='Subtitle'
                  type='text'
                  id='subtitle'
                  placeholder='from College Library'
                  data-cy='subtitle-input'
                />
              )}
            </Field>
            <Field name='content' type='text' isRequired>
              {(fieldProps: FieldProps<string, AnnouncementDTO>) => (
                <Input
                  as={Textarea}
                  fieldProps={fieldProps}
                  name='content'
                  label='Content'
                  type='text'
                  id='content'
                  placeholder='New Virtual Reality (VR) technologies will be integrated in preparation to the facility as our...'
                  isRequired
                  data-cy='content-input'
                />
              )}
            </Field>
            <Flex as={FormControl} isRequired role='group' direction='column'>
              <FormLabel fontWeight='semibold'>Tags</FormLabel>
              <Flex direction='column' gap={0}>
                <Field
                  name='tags'
                  type='checkbox'
                  value='Information'
                  isRequired
                >
                  {(fieldProps: FieldProps<string, AnnouncementDTO>) => (
                    <Checkbox
                      fieldProps={fieldProps}
                      name='tags'
                      checked={fieldProps.field.checked}
                      id='information-tag'
                      data-cy='information-checkbox'
                      isRequired
                    >
                      {fieldProps.field.value}
                    </Checkbox>
                  )}
                </Field>
                <Field name='tags' type='checkbox' value='Memo' isRequired>
                  {(fieldProps: FieldProps<string, AnnouncementDTO>) => (
                    <Checkbox
                      fieldProps={fieldProps}
                      name='tags'
                      checked={fieldProps.field.checked}
                      id='memo-tag'
                      data-cy='memo-checkbox'
                      isRequired
                    >
                      {fieldProps.field.value}
                    </Checkbox>
                  )}
                </Field>
                <Field name='tags' type='checkbox' value='TopsAgain' isRequired>
                  {(fieldProps: FieldProps<string, AnnouncementDTO>) => (
                    <Checkbox
                      fieldProps={fieldProps}
                      name='tags'
                      checked={fieldProps.field.checked}
                      id='topsagain-role'
                      data-cy='topsagain-checkbox'
                      isRequired
                    >
                      {fieldProps.field.value}
                    </Checkbox>
                  )}
                </Field>
              </Flex>
            </Flex>
            <Field name='type' type='text' isRequired>
              {(fieldProps: FieldProps<string, AnnouncementDTO>) => (
                <Select
                  fieldProps={fieldProps}
                  name='viewAccess'
                  label='View Access'
                  id='viewAccess'
                  isRequired
                  data-cy='viewAccess-select'
                >
                  <option value={AnnouncementDTOViewAccessEnum.Public}>
                    {AnnouncementDTOViewAccessEnum.Public}
                  </option>
                  <option value={AnnouncementDTOViewAccessEnum.Private}>
                    {AnnouncementDTOViewAccessEnum.Private}
                  </option>
                </Select>
              )}
            </Field>
          </FormLayout>
          <Flex w='full' h='full'>
            <FormikResetButton onClick={handleReset} />
            <Spacer />
            <Button
              variant='solid'
              data-cy='add-submit-btn'
              formNoValidate
              type='submit'
              isLoading={editAnnouncement.isLoading}
              loadingText='Adding...'
            >
              Add Announcement
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
