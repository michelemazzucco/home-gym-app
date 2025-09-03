import React from 'react'
import { NumberField as ReactNumberField } from '@base-ui-components/react/number-field'
import styles from './index.module.css'

export function NumberField({
  id,
  defaultValue,
  onChange,
}: {
  id: string
  defaultValue: number
  onChange: (value: number) => void
}) {
  return (
    <ReactNumberField.Root id={id} defaultValue={defaultValue} className={styles.Field}>
      <ReactNumberField.ScrubArea className={styles.ScrubArea}>
        <ReactNumberField.ScrubAreaCursor className={styles.ScrubAreaCursor}>
          <CursorGrowIcon />
        </ReactNumberField.ScrubAreaCursor>
      </ReactNumberField.ScrubArea>

      <ReactNumberField.Group className={styles.Group}>
        <ReactNumberField.Decrement className={styles.Decrement}>
          <MinusIcon />
        </ReactNumberField.Decrement>
        <ReactNumberField.Input className={styles.Input} />
        <ReactNumberField.Increment className={styles.Increment}>
          <PlusIcon />
        </ReactNumberField.Increment>
      </ReactNumberField.Group>
    </ReactNumberField.Root>
  )
}

function CursorGrowIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="26"
      height="14"
      viewBox="0 0 24 14"
      fill="black"
      stroke="white"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z" />
    </svg>
  )
}

function PlusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentcolor"
      strokeWidth="1.6"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 5H5M10 5H5M5 5V0M5 5V10" />
    </svg>
  )
}

function MinusIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      stroke="currentcolor"
      strokeWidth="1.6"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 5H10" />
    </svg>
  )
}
