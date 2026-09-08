import { EquipmentBadges } from './EquipmentBadges'

export const StepPlanSummary = ({ equipment }: { equipment: string[] }) => (
  <div className="space-y-8">
    <div className="space-y-3">
      <h2 className="font-display text-[28px] leading-[34px] font-normal text-chalk">
        Copy your workout, and start training!
      </h2>
      <p className="max-w-[46ch] text-base leading-[1.4] text-chalk">
        Here is your plan, built around the equipment you confirmed. Copy it, keep it somewhere
        handy, and work through it week by week.
      </p>
    </div>

    <EquipmentBadges equipment={equipment} />
  </div>
)
