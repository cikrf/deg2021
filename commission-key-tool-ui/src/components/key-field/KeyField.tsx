import React from 'react'
import styles from './KeyField.module.scss'
import clsx from 'clsx'

type KeyFieldProps = {
  title: string,
  className?: string,
}

export const KeyField: React.FC<KeyFieldProps> = (props) => {
  const { title, className, children } = props
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.title}>{title}</div>
      <div className={styles.body}>
        {children}
      </div>
    </div>
  )
}
