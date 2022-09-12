import { Button, ButtonProps } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { useState, useEffect } from 'react';

export const FormikResetButton = ({
  children = 'Reset Inputs',
  ...props
}: ButtonProps) => {
  const { initialValues, values } = useFormikContext();
  const [isFormModified, setIsFormModified] = useState(false);

  useEffect(() => {
    const isChanged = (): boolean => {
      return JSON.stringify(initialValues) !== JSON.stringify(values);
    };

    // Adapted from:
    // https://stackoverflow.com/questions/73395387/javascript-comparing-if-2-objects-are-the-same
    function handleChange() {
      setIsFormModified(isChanged());
    }

    handleChange();
  }, [initialValues, values]);

  return (
    <Button
      type='reset'
      disabled={!isFormModified}
      _disabled={{ cursor: 'auto', opacity: 0.8 }}
      {...props}
    >
      {children}
    </Button>
  );
};
