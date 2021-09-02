import React from 'react'
import styles from './Layout.module.scss'
import { useHistory } from 'react-router-dom'

export const Layout: React.FC = (props) => {
  const { children } = props
  const history = useHistory()

  return (
    <div className={styles.content}>
      <header className={styles.headerContainer}>
        <div className={styles.header}>
          <div className={styles.title} onClick={() => history.replace('/')}>
            Работа с ключами
          </div>
          <div className={styles.subtitle}>
            Утилита генерации и разделения ключей
          </div>
        </div>
      </header>
      <main className={styles.body}>
        {children}
      </main>
    </div>
  )
}
