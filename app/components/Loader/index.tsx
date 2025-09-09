import styles from './index.module.css'
import { Logo } from '../Logo'

export const Loader = () => {
  return (
    <div className="app-wrapper">
      <header className="app-header">
        <Logo />
      </header>
      <main className={`app-main ${styles.loaderContainer}`}>
        <div className={styles.loader}>
          <div className={styles.sparkles}>✨</div>
          <div className={styles.loaderText}>
            <h3 className={styles.title}>Doing some magic for you...</h3>
            <p className={styles.subtitle}>But you see... true magic requires time!</p>
          </div>
        </div>
      </main>
    </div>
  )
}
