import * as PasswordToggleField from '@radix-ui/react-password-toggle-field'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid'

import styles from './index.module.css'

export const KeyField = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <PasswordToggleField.Root>
    <div className={styles.Root}>
      <PasswordToggleField.Input className={styles.Input} />
      <PasswordToggleField.Toggle className={styles.Toggle}>
        <PasswordToggleField.Icon
          visible={<EyeIcon fill="#FFF" width={16} height={16} />}
          hidden={<EyeSlashIcon fill="#FFF" width={16} height={16} />}
        />
      </PasswordToggleField.Toggle>
    </div>
  </PasswordToggleField.Root>
)
