import { ReportGetDTO } from 'generated-api';
import { useContext } from 'react';
import { useMutation } from 'react-query';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const useReports = () => {
  const api = useContext(ApiContext);

  const getReport = useMutation((reportGetDTO: ReportGetDTO) =>
    api.getReport(reportGetDTO, { responseType: 'blob' })
  );

  return {
    getReport,
  };
};
