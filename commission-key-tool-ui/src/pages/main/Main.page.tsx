import React, { useState } from 'react'
import { Layout } from '../../components/layout/Layout'
import styles from './Main.module.scss'
import { MainBlock } from '../../components/main-block/MainBlock'
import { Button } from '../../components/button/Button'
import { Collapse } from '../../components/collapse/Collapse'
import { ClearToken } from '../../components/clear-token/ClearToken'
import { ChangePassword } from '../../components/change-password/ChangePassword'
import { useHistory } from 'react-router-dom'

export const MainPage: React.FC = () => {
  const [expandedPanel, setExpandedPanel] = useState<null | string>(null)
  const history = useHistory()
  return (
    <Layout>
      <div className={styles.mainBlocks}>
        <MainBlock title={'Генерация ключа'} bodyClassName={styles.blocksContent}>
          <div className={styles.blocksText}>
            Для генерации ключа вам понадобятся <br />
            РуТокен и пароль
          </div>
          <Button onClick={() => history.replace('/generate')}>
            Начать генерацию
          </Button>
        </MainBlock>
        <MainBlock title={'Сборка ключа'} bodyClassName={styles.blocksContent}>
          <div className={styles.blocksText}>
            Для сборки ключа вам потребуются РуТокены <br />
            с частями разделенного приватного ключа <br />
            и пароли от них
          </div>
          <Button onClick={() => history.replace('/restore')}>
            Начать сборку
          </Button>
        </MainBlock>
      </div>
      <div className={styles.collapseBlock}>
        <Collapse
          title={'Очистить РуТокен'}
          expanded={expandedPanel === 'clear'}
          onExpandedChange={(isExpanded) => setExpandedPanel(isExpanded ? 'clear' : null)}
        >
          <div className={styles.collapseBlockContent}>
            <ClearToken />
          </div>
        </Collapse>
        <Collapse
          title={'Изменить пароль'}
          expanded={expandedPanel === 'password'}
          onExpandedChange={(isExpanded) => setExpandedPanel(isExpanded ? 'password' : null)}
        >
          <div className={styles.collapseBlockContent}>
            <ChangePassword />
          </div>
        </Collapse>
      </div>
    </Layout>
  )
}
