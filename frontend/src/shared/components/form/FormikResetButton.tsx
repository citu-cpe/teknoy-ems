import { Button, ButtonProps } from '@chakra-ui/react';
import { useFormikContext } from 'formik';
import { useState, useEffect } from 'react';
import { valuesAreEqual } from '../../helpers';

/***
 * A custom reset button that dynamically enable/disables itself
 * during changes of form values within a Formik context
 */
export const FormikResetButton = ({
  children = 'Reset Inputs',
  ...props
}: ButtonProps) => {
  const { initialValues, values } = useFormikContext();
  const [isFormModified, setIsFormModified] = useState(false);

  useEffect(() => {
    function handleChange() {
      setIsFormModified(!valuesAreEqual(initialValues, values));
    }

    handleChange();
  }, [initialValues, values]);

  return (
    <Button
      type='reset'
      data-cy='reset-btn'
      disabled={!isFormModified}
      _disabled={{ cursor: 'auto', opacity: 0.8 }}
      {...props}
    >
      {children}
    </Button>
  );
};
