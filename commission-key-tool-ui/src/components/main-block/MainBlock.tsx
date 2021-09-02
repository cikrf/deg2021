import React from 'react'
import { CardContainer } from '../card/Card'
import styles from './MainBlock.module.scss'
import clsx from 'clsx'

type MainBlockProps = {
  title: string | React.ReactNode,
  className?: string,
  bodyClassName?: string,
}

export const MainBlock: React.FC<MainBlockProps> = (props) => {
  const { title, children, className, bodyClassName } = props
  return (
    <CardContainer className={clsx(styles.container, className)}>
      <div className={styles.title}>
        {title}
      </div>
      <div className={clsx(styles.body, bodyClassName)}>
        {children}
      </div>
    </CardContainer>
  )
}
