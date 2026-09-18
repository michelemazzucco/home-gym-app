import { EquipmentBadges } from './EquipmentBadges'

export const StepPlanSummary = ({ equipment }: { equipment: string[] }) => (
  <EquipmentBadges equipment={equipment} />
)
