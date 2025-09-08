import styles from './index.module.css'

export const EquipmentBadge = ({ name }: { name: string }) => {
  return <div className={styles.badge}>{name}</div>
}
