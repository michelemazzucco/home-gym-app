import { describeExercize, type WorkoutBlock } from '../lib/workout'

export const PaperSheet = ({ plan }: { plan: WorkoutBlock[] }) => (
  <div className="paper-sheet">
    {plan.map((block) => (
      <Block key={block.title} block={block} />
    ))}
  </div>
)

const Block = ({ block }: { block: WorkoutBlock }) => (
  <section className="relative top-px mb-7 flex flex-col gap-7 text-paper-ink">
    <h2 className="relative -top-[0.175rem] text-2xl font-medium">{block.title}</h2>

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
