import * as React from 'react'
import { Select as ReactSelect } from '@base-ui-components/react/select'
import styles from './index.module.css'
import { Label } from '../Label'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon } from '@heroicons/react/20/solid'

interface OptionProps {
  value: string
  label: string
}

interface SelectProps {
  options: OptionProps[]
  value?: string
  onChange?: (value: string) => void
  label?: string
}

export function Select({ options, onChange, label }: SelectProps) {
  return (
    <>
      {label && <Label htmlFor={label}>{label}</Label>}
      <ReactSelect.Root
        items={options}
        defaultValue={options[0].value}
        onValueChange={onChange}
        id={label}
      >
        <ReactSelect.Trigger className={styles.select}>
          <ReactSelect.Value />
          <ReactSelect.Icon className={styles.selectIcon}>
            <ChevronUpDownIcon fill="#FFF" width={16} height={16} />
          </ReactSelect.Icon>
        </ReactSelect.Trigger>
        <ReactSelect.Portal>
          <ReactSelect.Positioner className={styles.positioner} sideOffset={8}>
            <ReactSelect.ScrollUpArrow className={styles.ScrollArrow} />
            <ReactSelect.Popup className={styles.popup}>
              {options.map(({ label, value }) => (
                <ReactSelect.Item key={label} value={value} className={styles.item}>
                  <ReactSelect.ItemIndicator className={styles.itemIndicator}>
                    <CheckIcon fill="#FFF" width={20} height={20} />
                  </ReactSelect.ItemIndicator>
                  <ReactSelect.ItemText className={styles.itemText}>{label}</ReactSelect.ItemText>
                </ReactSelect.Item>
              ))}
            </ReactSelect.Popup>
            <ReactSelect.ScrollDownArrow className={styles.ScrollArrow} />
          </ReactSelect.Positioner>
        </ReactSelect.Portal>
      </ReactSelect.Root>
    </>
  )
}
