import { useFormikContext } from 'formik';
import { useEffect } from 'react';

interface FormikResetEffectProps {
  condition: boolean;
  dependencies: unknown[];
}

export const FormikResetEffect = ({
  condition,
  dependencies,
}: FormikResetEffectProps) => {
  const { resetForm } = useFormikContext();

  useEffect(() => {
    if (condition) {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetForm, condition, ...dependencies]);
  return null;
};
