import { Button, ButtonProps, Icon } from '@chakra-ui/react';
import { useField, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { MdCheck } from 'react-icons/md';
import { valuesAreEqual } from '../../../shared/helpers';

export interface SelectAllToggleProps {
  initialUnselect?: boolean;
  fieldName: string;
  onSelectValue: any;
  onDeselectValue: any;
  onToggle?: (isAllSelected: boolean) => void;
}

export const SelectAllToggle = ({
  initialUnselect = false,
  fieldName,
  onSelectValue,
  onDeselectValue,
  onToggle,
  ...props
}: SelectAllToggleProps & ButtonProps) => {
  const [isAllSelected, setIsSelectAll] = useState(initialUnselect);
  const { setFieldValue } = useFormikContext();
  const [field] = useField(fieldName);

  useEffect(() => {
    if (valuesAreEqual(field.value, onDeselectValue)) {
      setIsSelectAll(false);
    }
  }, [field, onDeselectValue]);

  const handleToggle = () => {
    const toggleState = !isAllSelected;

    setIsSelectAll(toggleState);

    if (toggleState) {
      setFieldValue(fieldName, onSelectValue);
    } else {
      setFieldValue(fieldName, onDeselectValue);
    }

    if (onToggle) {
      onToggle(toggleState);
    }
  };

  return (
    <Button
      leftIcon={<Icon as={MdCheck} />}
      size={'sm'}
      maxW='sm'
      justifyContent={'start'}
      textAlign={'left'}
      ml={-5}
      onClick={handleToggle}
      {...props}
    >
      {isAllSelected ? 'Unselect All' : 'Select All'}
    </Button>
  );
};
