import { EquipmentBadge } from '../EquipmentBadge'
import { Label } from '../Label'
import styles from './index.module.css'

export const EquipmentList = ({ equipment }: { equipment: string[] }) => {
  return (
    <div className={styles.equipmentList}>
      <Label>Detected equipment</Label>
      <div className={styles.badges}>
        {equipment.map((item) => (
          <EquipmentBadge name={item} key={item} />
        ))}
      </div>
    </div>
  )
}
