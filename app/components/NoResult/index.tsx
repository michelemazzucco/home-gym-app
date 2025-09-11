'use client'

import { Logo } from '../Logo'
import { Button } from '../Button'
import { useRouter } from 'next/navigation'
import styles from './index.module.css'

export const NoResult = () => {
  const router = useRouter()

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <Logo />
      </header>

      <main className={`app-main ${styles.wrapper}`}>
        <div className={styles.innerWrapper}>
          <div className={styles.emoji}>💫</div>
          <div className={styles.textWrapper}>
            <h3 className={styles.title}>No Results</h3>
            <p className={styles.subtitle}>Upload an image to get started</p>
          </div>
          <Button variant="secondary" onClick={() => router.push('/')}>
            Take me there!
          </Button>
        </div>
      </main>
    </div>
  )
}
