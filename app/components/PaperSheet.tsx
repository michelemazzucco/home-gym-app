import { describeExercize, type WorkoutBlock } from '../lib/workout'

export const PaperSheet = ({ plan }: { plan: WorkoutBlock[] }) => (
  <div className="paper-sheet animate-rise motion-reduce:animate-none">
    {plan.map((block, index) => (
      <Block key={block.title} block={block} index={index} />
    ))}
  </div>
)

/* The plan lands after a long wait, so the blocks arrive one after the other. */
const Block = ({ block, index }: { block: WorkoutBlock; index: number }) => (
  <section
    style={{ animationDelay: `${120 + Math.min(index, 5) * 70}ms` }}
    className="relative top-[0.225rem] mb-7 flex animate-rise flex-col gap-7 text-paper-ink motion-reduce:animate-none"
  >
    <h2 className="relative -top-[0.2rem] text-[26px] font-medium">{block.title}</h2>

    {block.sessions.map((session) => (
      <div key={session.title}>
        <h3 className="relative -top-[0.075rem] text-xl font-semibold">{session.title}</h3>
        <ul className="[list-style-type:'*'] pl-2">
          {session.exercizes.map((exercize) => (
            <li key={exercize.name} className="pl-2 marker:text-accent">
              <strong className="relative font-semibold">{exercize.name}</strong>
              <div className="text-paper-ink/60">{describeExercize(exercize)}</div>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </section>
)
