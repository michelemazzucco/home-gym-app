import styles from './index.module.css'

export const Loader = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.sparkles}>✨</div>
      <h3 className={styles.title}>Doing some magic for you...</h3>
      <p className={styles.subtitle}>But you see... true magic requires time!</p>
    </div>
  )
}
