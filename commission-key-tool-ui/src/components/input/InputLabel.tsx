import React from 'react'
import styles from './Input.module.scss'

type InputLabelProps = React.HTMLAttributes<HTMLLabelElement> & {
  label: string,
}

export const InputLabel: React.FC<InputLabelProps> = (props) => {
  const { children, label, ...labelProps } = props
  return (
    <label {...labelProps}>
      <div className={styles.label}>{label}</div>
      {children}
    </label>
  )
}
