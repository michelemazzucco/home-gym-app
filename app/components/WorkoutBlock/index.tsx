import { WorkoutBlock as WorkoutBlockType } from '../../context/AppContext'
import styles from './index.module.css'

export const WorkoutBlock = ({ block }: { block: WorkoutBlockType }) => {
  return (
    <div className={styles.workoutBlock}>
      <h3 className={styles.workoutBlockTitle}>{block.title}</h3>
      {block.sessions.map((session) => (
        <div key={session.title}>
          <h4 className={styles.sessionTitle}>{session.title}</h4>
          {session.exercizes.map((exercize) => (
            <div key={exercize.name} className={styles.exercize}>
              <div className={styles.exercizeName}>{exercize.name}</div>
              <div className={styles.exercizeDetails}>
                {exercize.sets} sets,&nbsp;
                {exercize.reps} reps
                {exercize.rest === '0' ? '' : `, ${exercize.rest} rest`}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
