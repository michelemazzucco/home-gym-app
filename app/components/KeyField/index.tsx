import * as PasswordToggleField from '@radix-ui/react-password-toggle-field'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid'

export const KeyField = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <PasswordToggleField.Root>
    <PasswordToggleField.Input />
    <PasswordToggleField.Toggle>
      <PasswordToggleField.Icon visible={<EyeIcon />} hidden={<EyeSlashIcon />} />
    </PasswordToggleField.Toggle>
  </PasswordToggleField.Root>
)