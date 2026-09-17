export const EquipmentBadges = ({ equipment }: { equipment: string[] }) => {
  if (equipment.length === 0) return null

  return (
    <ul className="flex flex-wrap gap-3">
      {equipment.map((item, index) => (
        <li
          key={item}
          style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
          className="flex h-8 animate-pop items-center rounded-full bg-[#eff0f4] px-4 text-base leading-[1.4em] text-ink capitalize shadow-[0_12px_8px_rgba(0,0,0,0.4),inset_0_1px_1px_#fff] motion-reduce:animate-none"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}
