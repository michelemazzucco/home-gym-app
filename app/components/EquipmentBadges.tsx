export const EquipmentBadges = ({ equipment }: { equipment: string[] }) => {
  if (equipment.length === 0) return null

  return (
    <ul className="flex flex-wrap gap-3">
      {equipment.map((item, index) => (
        <li
          key={item}
          style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
          className="flex min-h-8 max-w-full animate-pop items-center rounded-2xl bg-chip px-4 py-1 text-base leading-[1.4em] [overflow-wrap:anywhere] text-ink capitalize shadow-chip motion-reduce:animate-none"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}
