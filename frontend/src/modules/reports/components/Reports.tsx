import { Button } from '@chakra-ui/react';
import { ReportGetDTO } from 'generated-api';
import {
  ContentHeader,
  ContentSection,
} from '../../../shared/components/content';
import { MainLayout } from '../../../shared/components/layout';
import { ReportForm } from './ReportForm';

export const Reports = () => {
  const handleComplete = (reportGetDTO: string) => {};

  return (
    <MainLayout title='Reports'>
      <ContentHeader title='Reports' />

      <ContentSection>
        <ReportForm onComplete={handleComplete} />
      </ContentSection>
    </MainLayout>
  );
};
