import { useFormikContext } from 'formik';
import { useEffect } from 'react';

interface FormikResetEffectProps {
  condition: boolean;
  dependencies: unknown[];
  onReset?: () => void;
}

export const FormikResetEffect = ({
  condition,
  dependencies,
  onReset,
}: FormikResetEffectProps) => {
  const { resetForm } = useFormikContext();

  useEffect(() => {
    if (condition) {
      if (onReset) {
        onReset();
      }

      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetForm, condition, ...dependencies]);
  return null;
};
