import {
  ContentHeader,
  ContentSection,
} from '../../../shared/components/content';
import { MainLayout } from '../../../shared/components/layout';
import { adminOnlyAuth } from '../../../shared/schemas';
import { ReportForm } from './ReportForm';

export const Reports = () => {
  return (
    <MainLayout title='Reports'>
      <ContentHeader title='Reports' />

      <ContentSection>
        <ReportForm />
      </ContentSection>
    </MainLayout>
  );
};

Reports.auth = adminOnlyAuth;
