import { RegisterUserDTO } from 'generated-api';
import { ModalInfo } from '../../../shared/components/elements';
import { FieldTableBody } from '../../../shared/components/table';
import { ModalTable } from '../../../shared/components/table/FieldTable';

interface AccountRegisterSuccessProps {
  registerDTO: RegisterUserDTO | undefined;
  onClose: () => void;
  onConfirm: () => void;
}

export const AccountRegisterSuccess = ({
  registerDTO: register,
  onClose,
  onConfirm,
}: AccountRegisterSuccessProps) => {
  return (
    <>
      <ModalInfo
        title='Account has been added'
        onClose={onClose}
        onConfirm={onConfirm}
      >
        <ModalTable>
          {register && (
            <FieldTableBody
              data={[
                {
                  label: 'Email',
                  value: register?.email,
                  type: 'text',
                },
                {
                  label: 'Name',
                  value: register?.name,
                  type: 'text',
                },
                {
                  label: 'Roles',
                  value: register?.roles.join(', '),
                  type: 'textarea',
                },
                {
                  label: 'Password',
                  value: register?.password,
                  type: 'password',
                },
              ]}
            />
          )}
        </ModalTable>
      </ModalInfo>
    </>
  );
};
