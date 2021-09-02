import React from 'react'
import styles from './Generate.module.scss'
import { MainBlock } from '../../components/main-block/MainBlock'
import { Button } from '../../components/button/Button'
import { IconSuccess } from '../../components/icons/IconSuccess'
import { useHistory } from 'react-router-dom'

export const SaveFragmentsDone: React.FC = () => {
  const history = useHistory()
  return (
    <div className={styles.mainBlocks}>
      <MainBlock title={'Генерация ключа'} bodyClassName={styles.blocksContent}>
        <IconSuccess />
        <div className={styles.successContent}>
          Запись ключа на носитель
          успешно завершена
        </div>
        <Button onClick={() => history.replace('/')}>
          Вернутья на главную
        </Button>
      </MainBlock>
    </div>
  )
}
