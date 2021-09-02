import React from 'react'
import clsx from 'clsx'
import styles from './Input.module.scss'
import { IconError } from '../icons/IconError'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean,
  inputClassName?: string,
}

export const Input: React.FC<InputProps> = (props) => {
  const { className, error, ...inputProps } = props
  return (
    <div className={clsx(styles.container, className)}>
      <input {...inputProps} className={clsx(styles.input, error && styles.error)} />
      {error && (<IconError className={styles.errorIcon} />)}
    </div>
  )
}
