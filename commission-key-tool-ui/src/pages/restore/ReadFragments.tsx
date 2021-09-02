import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { MainBlock } from '../../components/main-block/MainBlock'
import styles from './Restore.module.scss'
import { Step, Stepper } from '../../components/stepper/Stepper'
import { useRutokenConnected } from '../../components/rutoken-listener/RutokenListener'
import { FormBlock } from '../../components/form-block/FormBlock'
import { Input } from '../../components/input/Input'
import { Button } from '../../components/button/Button'
import { ipcRenderer } from 'electron'
import { KeyField } from '../../components/key-field/KeyField'
import { maskKey, stringifyKey } from '../../utils/maskKey'
import { FormBlockError } from '../../components/form-block/FormBlockError'
import { convertErrorCodeToErrorMessage } from '../../utils/convertErrorCodeToErrorMessage'
import { useHistory } from 'react-router-dom'

type SaveFragmentsProps = {
  fragmentsCount: number,
  onSaved: () => void,
  onReset: () => void,
}

type StepContentProps = {
  idx: number,
  isLoading?: boolean,
  onSubmit: (password: string) => void,
  error?: string | null,
}

const StepContent: React.FC<StepContentProps> = (props) => {
  const { idx, isLoading, error, onSubmit } = props

  const isRutokenConnected = useRutokenConnected()

  const [password, setPassword] = useState('')

  const handleSubmit = useCallback(() => {
    onSubmit(password)
  }, [onSubmit, password])

  if (!isRutokenConnected) {
    return (
      <div className={styles.stepContent}>
        <FormBlock title={`Вставьте носитель ${idx + 1}`}>
          Система найдет его сама
        </FormBlock>
      </div>
    )
  }

  return (
    <div className={styles.stepContent}>
      <FormBlock title={'Введите пин-код'}>
        {error && (
          <FormBlockError>
            {error}
          </FormBlockError>
        )}
        <Input
          type={'password'}
          className={styles.stepInput}
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <Button onClick={handleSubmit} disabled={isLoading || !password.length}>
          Отправить
        </Button>
      </FormBlock>
    </div>
  )
}

export const ReadFragments: React.FC<SaveFragmentsProps> = (props) => {

  const { fragmentsCount, onSaved, onReset } = props

  const isRutokenConnected = useRutokenConnected()

  const history = useHistory()

  const [activeStep, setActiveStep] = useState(0)

  const [isLoading, setLoading] = useState(false)

  const [shares, setShares] = useState(Array(fragmentsCount).fill(null))

  const [chosenPath, setChosenPath] = useState<string | null>(null)

  const [privateKey, setPrivateKey] = useState<null | Uint8Array>(null)

  const [restorePrivKeyError, setRestorePrivKeyError] = useState(false)

  const [writePrivKeyError, setWritePrivKeyError] = useState(false)

  const [readFragmentError, setReadFragmentError] = useState<string | null>(null)

  const [unmaskPrivateKey, setUnmaskPrivateKey] = useState(false)

  const handleSubmit = useCallback(async (idx, password) => {
    setLoading(true)
    const response = await ipcRenderer.invoke('read-share', {
      password,
    })
    setLoading(false)
    if (response.success) {
      const currentShares = shares.filter((s) => !!s)
      if (currentShares.every((s) => Buffer.from(s.pub).equals(Buffer.from(response.result.pub)))) {
        setShares((shares) => {
          const newShares = [...shares]
          newShares.splice(idx, 1, response.result)
          return newShares
        })
        setReadFragmentError(null)
        setActiveStep(idx + 1)
      } else {
        setReadFragmentError('Выбранный носитель содержит фрагмент другого приватного ключа')
      }
    } else {
      if (response.errorCode) {
        setReadFragmentError(convertErrorCodeToErrorMessage(response.errorCode))
      } else {
        setReadFragmentError('Не удалось прочитать фрагмент ключа')
      }
    }
  }, [shares])

  const handleChoosePath = useCallback(async () => {
    const response = await ipcRenderer.invoke('open-directory')
    if (response.success) {
      setChosenPath((currentPath) => response.result ?? currentPath)
    } else {
      // TODO: handle error
    }
  }, [])

  const handleFinish = useCallback(async () => {
    setWritePrivKeyError(false)
    setLoading(true)
    const response = await ipcRenderer.invoke('write-private-key', {
      path: chosenPath,
      key: privateKey,
    })
    setWritePrivKeyError(!response.success)
    setLoading(false)
    if (response.success) {
      onSaved()
    }
  }, [chosenPath, privateKey, onSaved])

  const lastStepContent = useMemo(() => {
    if (!chosenPath) {
      return (
        <FormBlock title={'Выберите носитель для записи закрытого ключа'}>
          <div className={styles.stepButtons}>
            <Button onClick={handleChoosePath}>
              Выбрать
            </Button>
            {!unmaskPrivateKey && (
              <Button secondary onClick={() => setUnmaskPrivateKey(true)}>
                Отобразить на экране
              </Button>
            )}
          </div>
        </FormBlock>
      )
    }
    if (!privateKey) {
      return null
    }
    const fullPath = chosenPath
      + (process.platform === 'win32' ? '\\' : '/')
      + 'private_key_'
      + stringifyKey(privateKey).slice(-4)
      + '.txt'
    return (
      <FormBlock title={`Выбран носитель ${fullPath}`}>
        {writePrivKeyError && (
          <div className={styles.lastStepError}>
            Не удалось записать закрытый ключ. Попробуйте выбрать другой носитель.
          </div>
        )}
        <div className={styles.stepButtons}>
          <Button disabled={isLoading} onClick={handleFinish}>
            Начать запись
          </Button>
          <Button disabled={isLoading} secondary onClick={handleChoosePath}>
            Выбрать другой
          </Button>
          {!unmaskPrivateKey && (
            <Button secondary onClick={() => setUnmaskPrivateKey(true)}>
              Отобразить на экране
            </Button>
          )}
        </div>
      </FormBlock>
    )
  }, [chosenPath, handleChoosePath, handleFinish, writePrivKeyError, isLoading, privateKey, unmaskPrivateKey])

  useEffect(() => {
    if (shares.every((s) => s !== null) && !privateKey) {
      ipcRenderer.invoke('restore-key', {
        shares,
      }).then((response) => {
        if (response.success) {
          setPrivateKey(response.result)
        } else {
          setRestorePrivKeyError(true)
        }
      })
    }
  }, [shares, privateKey])

  useEffect(() => {
    if (!isRutokenConnected) {
      setReadFragmentError(null)
    }
  }, [isRutokenConnected])

  return (
    <div className={styles.mainBlocks}>
      <MainBlock title={'Сборка закрытого ключа из фрагментов'} bodyClassName={styles.writeSharesContent}>
        <Stepper activeStep={activeStep}>
          {shares.map((share, idx) => {
            return (
              <Step
                key={idx}
                value={idx}
                title={(isActive, isDone) => {
                  const title = `Носитель ${idx + 1}`
                  if (isDone) {
                    return (
                      <div>
                        <div className={styles.stepTitle}>
                          <div>{title}</div>
                          <div className={styles.stepDoneTitle}>Фрагмент успешно прочитан</div>
                        </div>
                      </div>
                    )
                  }
                  return (
                    <div>
                      <div className={styles.stepTitle}>
                        <div>{title}</div>
                      </div>
                    </div>
                  )
                }}
              >
                <StepContent
                  idx={idx}
                  error={readFragmentError}
                  isLoading={isLoading}
                  onSubmit={(password) => handleSubmit(idx, password)}
                />
              </Step>
            )
          })}
          <Step
            value={shares.length}
            title={() => (
              <div>
                <div className={styles.stepTitle}>
                  {restorePrivKeyError ? 'Ошибка восстановления' : 'Запись закрытого ключа на носитель'}
                </div>
              </div>
            )}
          >
            <div className={styles.stepContent}>
              {!restorePrivKeyError ? (
                <>
                  <KeyField title={'Ключ успешно восстановлен'} className={styles.restoredPrivate}>
                    {privateKey ? (unmaskPrivateKey ? stringifyKey(privateKey) : '') : ''}
                  </KeyField>
                  {lastStepContent}
                </>
              ) : (
                <FormBlock>
                  <FormBlockError>
                    Не удалось восстановить приватный ключ
                  </FormBlockError>
                  <Button onClick={onReset}>
                    Начать заново
                  </Button>
                </FormBlock>
              )}
            </div>
          </Step>
        </Stepper>
      </MainBlock>
    </div>
  )
}
