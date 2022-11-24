import { MasterSettingsDTO } from 'generated-api';
import { useContext, useEffect, useRef } from 'react';
import { useMutation } from 'react-query';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const useMasterSettings = () => {
  const api = useContext(ApiContext);

  const masterSettings = useRef<MasterSettingsDTO>();

  const getMasterSettings = useMutation(() => api.getMasterSettings(), {
    onSuccess: (res) => {
      masterSettings.current = res.data;
    },
  });

  useEffect(() => {
    getMasterSettings.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { masterSettings: masterSettings.current };
};
