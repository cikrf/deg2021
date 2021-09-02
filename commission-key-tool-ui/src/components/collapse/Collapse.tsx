import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Collapse.module.scss'
import { IconArrowRight } from '../icons/IconArrowRight'
import clsx from 'clsx'

export type CollapseProps = {
  title: string,
  expanded: boolean,
  onExpandedChange: (isExpanded: boolean) => void,
}


export const Collapse: React.FC<CollapseProps> = (props) => {
  const { title, children, expanded, onExpandedChange } = props

  const [actualHeight, setActualHeight] = useState<number | 'auto'>(0)

  const contentRef = useRef<HTMLDivElement>(null)

  const handleClickHeader = useCallback(() => {
    onExpandedChange(!expanded)
  }, [expanded, onExpandedChange])

  useEffect(() => {
    const contentElement = contentRef.current
    if (!contentElement) {
      return
    }
    if (!expanded) {
      setActualHeight(contentElement.scrollHeight)
      requestAnimationFrame(() => setActualHeight(0))
    } else {
      setActualHeight(contentElement.scrollHeight)
      const handler = () => {
        setActualHeight('auto')
      }
      contentElement.addEventListener('transitionend', handler)
      return () => contentElement.removeEventListener('transitionend', handler)
    }
  }, [expanded])

  return (
    <div className={clsx(styles.container, expanded && styles.opened)}>
      <div className={styles.header} onClick={handleClickHeader}>
        <IconArrowRight className={styles.headerIcon} />
        <span className={styles.headerText}>{title}</span>
      </div>
      <div className={styles.body} ref={contentRef} style={{ height: actualHeight }}>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  )
}
