import { EquipmentBadge } from '../EquipmentBadge'
import { Label } from '../Label'
import styles from './index.module.css'

export const EquipmentList = ({ equipment }: { equipment: string[] }) => {
  return (
    <div className={styles.equipmentList}>
      <Label>Detected equipment</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {equipment.map((item) => (
          <EquipmentBadge name={item} key={item} />
        ))}
      </div>
    </div>
  )
}
