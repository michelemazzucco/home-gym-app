import styles from './index.module.css'

export const KeyField = (props: React.ComponentProps<'input'>) => (
  <input className={styles.input} {...props} />
)
