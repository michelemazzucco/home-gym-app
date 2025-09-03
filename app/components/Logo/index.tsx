import styles from './index.module.css'

export const Logo = () => {
  return (
    <div className={styles.LogoWrapper}>
      <DecorationLeft />
      <h1 className={styles.Logo}>HOMEGYM</h1>
      <DecorationRight />
    </div>
  )
}

const DecorationLeft = () => {
  return (
    <svg width="42" height="9" viewBox="0 0 42 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="-4.37114e-08" y1="0.5" x2="42" y2="0.499996" stroke="#757291" />
      <line x1="12" y1="8.5" x2="38" y2="8.5" stroke="#757291" />
    </svg>
  )
}

const DecorationRight = () => {
  return (
    <svg width="42" height="9" viewBox="0 0 42 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line y1="-0.5" x2="42" y2="-0.5" transform="matrix(-1 -8.74228e-08 -8.74228e-08 1 42 1)" stroke="#757291" />
      <line y1="-0.5" x2="26" y2="-0.5" transform="matrix(-1 -8.74228e-08 -8.74228e-08 1 30 9)" stroke="#757291" />
    </svg>
  )
}