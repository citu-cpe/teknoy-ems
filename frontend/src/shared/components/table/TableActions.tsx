import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
} from '@chakra-ui/react';
import { BiDotsVerticalRounded, BiEdit, BiTrash } from 'react-icons/bi';

interface AccountActionsProps<T> {
  data: T;
  onDelete: (userDTO: T) => void;
  onEdit: (userDTO: T) => void;
}

export const TableActions = <T extends unknown>({
  data: user,
  onDelete,
  onEdit,
}: AccountActionsProps<T>) => {
  return (
    <Menu strategy='absolute' placement='bottom-end'>
      <MenuButton
        as={IconButton}
        aria-label='Open notifications'
        color='current'
        rounded='full'
        icon={<Icon boxSize='1.5rem' as={BiDotsVerticalRounded} />}
      ></MenuButton>
      <Portal>
        <MenuList minW={40} w={20}>
          <MenuItem
            icon={<Icon as={BiEdit} boxSize={4} />}
            onClick={() => onEdit(user)}
          >
            Edit
          </MenuItem>
          <MenuItem
            icon={<Icon as={BiTrash} boxSize={4} />}
            onClick={() => onDelete(user)}
            bg='errorBg'
            color='errorColor'
            borderColor='errorBorder'
          >
            Delete
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};
