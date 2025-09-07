import styles from './index.module.css'

export const Label = ({ children, htmlFor }: { children: React.ReactNode, htmlFor?: string }) => {
  return <label
  className={styles.label}
  htmlFor={htmlFor}>
    {children}
    </label>
}