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
  onDelete: (dataDTO: T) => void;
  onEdit: (dataDTO: T) => void;
}

export const TableActions = <T extends unknown>({
  data,
  onDelete,
  onEdit,
}: AccountActionsProps<T>) => {
  return (
    <Menu strategy='absolute' placement='bottom-end'>
      <MenuButton
        as={IconButton}
        aria-label='Open table actions'
        color='current'
        rounded='full'
        icon={<Icon boxSize='1.5rem' as={BiDotsVerticalRounded} />}
        data-cy='actions-btn'
      ></MenuButton>
      <Portal>
        <MenuList minW={40} w={20}>
          <MenuItem
            icon={<Icon as={BiEdit} boxSize={4} />}
            onClick={() => onEdit(data)}
            data-cy='actions-edit-btn'
          >
            Edit
          </MenuItem>
          <MenuItem
            icon={<Icon as={BiTrash} boxSize={4} />}
            onClick={() => onDelete(data)}
            color='errorColor'
            data-cy='actions-delete-btn'
          >
            Delete
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};
