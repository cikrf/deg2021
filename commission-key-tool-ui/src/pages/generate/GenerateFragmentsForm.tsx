import React, { useCallback, useMemo, useState } from 'react'
import { MainBlock } from '../../components/main-block/MainBlock'
import styles from './Generate.module.scss'
import { Input } from '../../components/input/Input'
import { Button } from '../../components/button/Button'
import { isPositiveInteger } from '../../utils/isPositiveInteger'
import { ipcRenderer } from 'electron'
import { useRutokenConnected } from '../../components/rutoken-listener/RutokenListener'

export type GenerateFragmentsFormResult = {
  privateKey: Uint8Array,
  publicKey: Uint8Array,
  shares: Array<{
    idx: number,
    val: Uint8Array,
  }>,
}

type GenerateFragmentsFormProps = {
  onSaved: (state: GenerateFragmentsFormResult) => void,
}

export const GenerateFragmentsForm: React.FC<GenerateFragmentsFormProps> = (props) => {

  const { onSaved } = props

  const isRutokenConnected = useRutokenConnected()

  const [fragmentsCount, setFragmentsCount] = useState('1')

  const [restoreCount, setRestoreCount] = useState('1')

  const [isLoading, setLoading] = useState(false)

  const fragmentsError = useMemo(() => {
    if (!fragmentsCount.length) {
      return 'Обязательное поле'
    }
    if (!isPositiveInteger(Number(fragmentsCount))) {
      return 'Неверный формат'
    }
    return null
  }, [fragmentsCount])

  const restoreError = useMemo(() => {
    if (!restoreCount.length) {
      return 'Обязательное поле'
    }
    if (!isPositiveInteger(Number(restoreCount))) {
      return 'Неверный формат'
    }
    if (Number(restoreCount) > Number(fragmentsCount)) {
      return <>Значение не может быть больше, чем кол-во фрагментов,<br /> на которое будет разделен ключ</>
    }
    return null
  }, [restoreCount, fragmentsCount])

  const handleSubmit = useCallback(async () => {
    if (fragmentsError || restoreError) {
      return
    }

    setLoading(true)
    const response = await ipcRenderer.invoke('generate-key', {
      fragmentsCount: Number(fragmentsCount),
      restoreCount: Number(restoreCount),
    })
    setLoading(false)
    if (response.success) {
      onSaved(response.result)
    } else {
      // TODO: handle error
    }

  }, [fragmentsCount, restoreCount, fragmentsError, restoreError, onSaved])

  return (
    <div className={styles.mainBlocks}>
      <MainBlock title={'Генерация ключа'} bodyClassName={styles.blocksContent}>
        <div className={styles.field}>
          <div className={styles.label}>
            На сколько фрагментов <br />
            разделить ключ
          </div>
          <Input
            className={styles.input}
            value={fragmentsCount}
            error={!!fragmentsError}
            onChange={({ target }) => setFragmentsCount(target.value)}
          />
          {!!fragmentsError && (
            <div className={styles.error}>
              {fragmentsError}
            </div>
          )}
        </div>
        <div className={styles.field}>
          <div className={styles.label}>
            Сколько фрагментов понадобится <br />
            для восстановления
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
        {!isRutokenConnected && (
          <div className={styles.label}>
            Вставьте носитель, чтобы начать генерацию ключа
          </div>
        )}
        <Button onClick={handleSubmit} disabled={isLoading || !isRutokenConnected}>
          Начать генерацию
        </Button>
      </MainBlock>
    </div>
  )
}
