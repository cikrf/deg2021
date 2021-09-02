import React from 'react'
import clsx from 'clsx'
import styles from './Button.module.scss'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  secondary?: boolean,
}

export const Button: React.FC<ButtonProps> = (props) => {
  const { className, secondary, ...buttonProps } = props
  return <button className={clsx(styles.container, secondary && styles.secondary, className)} {...buttonProps} />
}
