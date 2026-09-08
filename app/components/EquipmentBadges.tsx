export const EquipmentBadges = ({ equipment }: { equipment: string[] }) => {
  if (equipment.length === 0) return null

  return (
    <ul className="flex flex-wrap gap-2">
      {equipment.map((item) => (
        <li
          key={item}
          className="flex h-8 items-center rounded-full bg-[#eff0f4] px-4 text-base leading-[1.4em] text-ink capitalize shadow-[0_12px_8px_rgba(0,0,0,0.4),inset_0_1px_1px_#fff]"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}
