import { ContentHeader } from '../../../shared/components/content';
import { LinkButton } from '../../../shared/components/elements';
import { MainLayout } from '../../../shared/components/layout';

export const Accounts = () => {
  return (
    <MainLayout>
      <ContentHeader
        title='Accounts'
        actions={
          <LinkButton
            variant='solid'
            label='Register Account'
            route='/accounts/register'
          />
        }
      />
    </MainLayout>
  );
};
