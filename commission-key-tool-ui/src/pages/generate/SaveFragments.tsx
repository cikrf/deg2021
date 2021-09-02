import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { MainBlock } from '../../components/main-block/MainBlock'
import styles from './Generate.module.scss'
import { GenerateFragmentsFormResult } from './GenerateFragmentsForm'
import { Step, Stepper } from '../../components/stepper/Stepper'
import { useRutokenConnected } from '../../components/rutoken-listener/RutokenListener'
import { FormBlock } from '../../components/form-block/FormBlock'
import { Input } from '../../components/input/Input'
import { Button } from '../../components/button/Button'
import { ipcRenderer } from 'electron'
import { convertErrorCodeToErrorMessage } from '../../utils/convertErrorCodeToErrorMessage'
import { FormBlockError } from '../../components/form-block/FormBlockError'
import { stringifyKey } from '../../utils/maskKey'
import { KeyField } from '../../components/key-field/KeyField'

type SaveFragmentsProps = {
  keys: GenerateFragmentsFormResult,
  onSaved: () => void,
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

  useEffect(() => {
    if (!isRutokenConnected) {
      setPassword('')
    }
  }, [isRutokenConnected])

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

export const SaveFragments: React.FC<SaveFragmentsProps> = (props) => {

  const { keys, onSaved } = props

  const [activeStep, setActiveStep] = useState(0)

  const [isLoading, setLoading] = useState(false)

  const [chosenPath, setChosenPath] = useState<string | null>(null)

  const [writeFragmentError, setWriteFragmentError] = useState<string | null>(null)

  const [writePubKeyError, setWritePubKeyError] = useState(false)

  const handleSubmit = useCallback(async (idx, password) => {
    setLoading(true)
    const response = await ipcRenderer.invoke('write-share', {
      password,
      share: keys.shares[idx],
    })
    setLoading(false)
    if (response.success) {
      setWriteFragmentError(null)
      setActiveStep(idx + 1)
    } else {
      setWriteFragmentError(convertErrorCodeToErrorMessage(response.errorCode))
    }
  }, [keys])

  const handleChoosePath = useCallback(async () => {
    const response = await ipcRenderer.invoke('open-directory')
    if (response.success) {
      setChosenPath((currentPath) => response.result ?? currentPath)
    } else {
      // TODO: handle error
    }
  }, [])

  const handleFinish = useCallback(async () => {
    setWritePubKeyError(false)
    setLoading(true)
    const response = await ipcRenderer.invoke('write-public-key', {
      path: chosenPath,
      key: keys.publicKey,
    })
    setWritePubKeyError(!response.success)
    setLoading(false)
    if (response.success) {
      onSaved()
    }
  }, [chosenPath, keys, onSaved])

  const lastStepContent = useMemo(() => {
    if (!chosenPath) {
      return (
        <FormBlock title={'Выберите носитель для записи открытого ключа'}>
          <div className={styles.stepButtons}>
            <Button onClick={handleChoosePath}>
              Выбрать
            </Button>
          </div>
        </FormBlock>
      )
    }
    const fullPath = chosenPath
      + (process.platform === 'win32' ? '\\' : '/')
      + 'public_key_'
      + stringifyKey(keys.publicKey).slice(-4)
      + '.txt'
    return (
      <FormBlock title={`Выбран носитель ${fullPath}`}>
        {writePubKeyError && (
          <div className={styles.lastStepError}>
            Не удалось записать открытый ключ. Попробуйте выбрать другой носитель.
          </div>
        )}
        <div className={styles.stepButtons}>
          <Button disabled={isLoading} onClick={handleFinish}>
            Начать запись
          </Button>
          <Button disabled={isLoading} secondary onClick={handleChoosePath}>
            Выбрать другой
          </Button>
        </div>
      </FormBlock>
    )
  }, [chosenPath, handleChoosePath, handleFinish, writePubKeyError, isLoading, keys.publicKey])

  return (
    <div className={styles.mainBlocks}>
      <MainBlock title={'Запись ключей на носители'} bodyClassName={styles.writeSharesContent}>
        <KeyField title={'Открытый ключ'} className={styles.writeSharesPublic}>
          {stringifyKey(keys.publicKey)}
        </KeyField>
        <Stepper activeStep={activeStep}>
          {keys.shares.map((share, idx) => {
            return (
              <Step
                key={idx}
                value={idx}
                title={(isActive, isDone) => {
                  const title = `Закрытый ключ, носитель ${idx + 1}`
                  if (isDone) {
                    return (
                      <div>
                        <div className={styles.stepTitle}>
                          <div>{title}</div>
                          <div className={styles.stepDoneTitle}>Фрагмент успешно записан</div>
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
                  error={writeFragmentError}
                  isLoading={isLoading}
                  onSubmit={(password) => handleSubmit(idx, password)}
                />
              </Step>
            )
          })
          }
          <Step
            value={keys.shares.length}
            title={() => (
              <div className={styles.stepTitle}>
                <div>Запись открытого ключа на носитель</div>
              </div>
            )}
          >
            <div className={styles.stepContent}>
              {lastStepContent}
            </div>
          </Step>
        </Stepper>
      </MainBlock>
    </div>
  )
}
