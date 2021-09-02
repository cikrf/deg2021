import React from 'react'
import clsx from 'clsx'
import styles from './Card.module.scss'

type CardContainerProps = {
  className?: string,
}

export const CardContainer: React.FC<CardContainerProps> = (props) => {
  const { className, children } = props
  return (
    <div className={clsx(styles.container, className)}>
      {children}
    </div>
  )
}
