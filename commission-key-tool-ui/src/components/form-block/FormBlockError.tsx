import React from 'react'
import styles from './FormBlock.module.scss'
import clsx from 'clsx'

export const FormBlockError: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  return <div className={clsx(props.className, styles.error)} {...props} />
}
