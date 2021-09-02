import React from 'react'
import { CardContainer } from '../card/Card'
import styles from './FormBlock.module.scss'
import clsx from 'clsx'

type FormBlockProps = {
  title?: string | React.ReactNode,
  className?: string,
  bodyClassName?: string,
}

export const FormBlock: React.FC<FormBlockProps> = (props) => {
  const { title, children, className, bodyClassName } = props
  return (
    <CardContainer className={clsx(styles.container, className)}>
      {!!title && (
        <div className={styles.title}>
          {title}
        </div>
      )}
      <div className={clsx(styles.body, bodyClassName)}>
        {children}
      </div>
    </CardContainer>
  )
}
