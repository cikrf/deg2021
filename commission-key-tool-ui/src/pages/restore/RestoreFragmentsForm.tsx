import React, { useCallback, useMemo, useState } from 'react'
import { MainBlock } from '../../components/main-block/MainBlock'
import styles from './Restore.module.scss'
import { Input } from '../../components/input/Input'
import { Button } from '../../components/button/Button'
import { isPositiveInteger } from '../../utils/isPositiveInteger'

type RestoreFragmentsFormProps = {
  onSaved: (num: number) => void,
}

export const RestoreFragmentsForm: React.FC<RestoreFragmentsFormProps> = (props) => {

  const { onSaved } = props

  const [restoreCount, setRestoreCount] = useState('1')

  const restoreError = useMemo(() => {
    if (!restoreCount.length) {
      return 'Обязательное поле'
    }
    if (!isPositiveInteger(Number(restoreCount))) {
      return 'Неверный формат'
    }
    return null
  }, [restoreCount])

  const handleSubmit = useCallback(() => {
    if (restoreError) {
      return
    }

    onSaved(Number(restoreCount))

  }, [restoreCount, restoreError, onSaved])

  return (
    <div className={styles.mainBlocks}>
      <MainBlock title={'Сборка закрытого ключа из фрагментов'} bodyClassName={styles.blocksContent}>
        <div className={styles.field}>
          <div className={styles.label}>
            Из скольких фрагментов будет <br /> собираться ключ
          </div>
          <Input
            className={styles.input}
            value={restoreCount}
            error={!!restoreError}
            onChange={({ target }) => setRestoreCount(target.value)}
          />
          {!!restoreError && (
            <div className={styles.error}>
              {restoreError}
            </div>
          )}
        </div>
        <Button onClick={handleSubmit} disabled={!!restoreError}>
          Начать сборку
        </Button>
      </MainBlock>
    </div>
  )
}
