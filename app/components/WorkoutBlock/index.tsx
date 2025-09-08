import { WorkoutBlock as WorkoutBlockType } from '../../context/AppContext'
import styles from './index.module.css'

export const WorkoutBlock = ({ block }: { block: WorkoutBlockType }) => {
  return (
    <div className={styles.workoutBlock}>
      <h2 className={styles.workoutBlockTitle}>{block.title}</h2>
      {block.sessions.map((session) => (
        <div key={session.title}>
          <h3 className={styles.sessionTitle}>{session.title}</h3>
          <ul className={styles.exercizes}>
            {session.exercizes.map((exercize) => (
              <li key={exercize.name} className={styles.exercize}>
                <strong className={styles.exercizeName}>{exercize.name}</strong>
                <div className={styles.exercizeDetails}>
                  {exercize.sets} sets,&nbsp;
                  {exercize.reps} reps
                  {exercize.rest === '0' ? '' : `, ${exercize.rest} rest`}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
