import * as PasswordToggleField from '@radix-ui/react-password-toggle-field'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid'

import styles from './index.module.css'

export const KeyField = ({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) => (
  <PasswordToggleField.Root>
    <div className={styles.Root}>
      <PasswordToggleField.Input
        className={styles.Input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <PasswordToggleField.Toggle className={styles.Toggle}>
        <PasswordToggleField.Icon
          visible={<EyeIcon fill="#FFF" width={16} height={16} />}
          hidden={<EyeSlashIcon fill="#FFF" width={16} height={16} />}
        />
      </PasswordToggleField.Toggle>
    </div>
  </PasswordToggleField.Root>
)
