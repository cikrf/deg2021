import React, { useCallback, useEffect, useState } from 'react'
import styles from './ClearToken.module.scss'
import { FormBlock } from '../form-block/FormBlock'
import { Button } from '../button/Button'
import { InputLabel } from '../input/InputLabel'
import { Input } from '../input/Input'
import { useRutokenConnected } from '../rutoken-listener/RutokenListener'
import { ipcRenderer } from 'electron'
import { convertErrorCodeToErrorMessage } from '../../utils/convertErrorCodeToErrorMessage'
import { FormBlockError } from '../form-block/FormBlockError'

export const ClearToken: React.FC = () => {

  const isRutokenConnected = useRutokenConnected()

  const [password, setPassword] = useState('')

  const [isLoading, setLoading] = useState(false)

  const [submitError, setSubmitError] = useState<string | null>(null)

  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    const response = await ipcRenderer.invoke('clear-token', {
      password,
    })
    if (!response.success) {
      setSubmitError(convertErrorCodeToErrorMessage(response.errorCode))
    } else {
      setSubmitError(null)
      setSubmitSuccess(true)
    }
    setPassword('')
    setLoading(false)
  }, [password])

  useEffect(() => {
    if (!isRutokenConnected) {
      setPassword('')
      setSubmitError(null)
      setSubmitSuccess(false)
    }
  }, [isRutokenConnected])

  if (!isRutokenConnected) {
    return (
      <div>
        <div className={styles.description}>
          Для очистки РуТокена потребуется ключевой носитель и пароль от него. При утрате пароля необходимо
          инициализировать РуТокен заново, данные будут утеряны.
        </div>
        <div className={styles.form}>
          <FormBlock title={'Вставьте носитель'}>
            Система найдет его сама
          </FormBlock>
        </div>
        <Button disabled={!isRutokenConnected || isLoading} onClick={handleSubmit}>
          Очистить
        </Button>
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div>
        <div className={styles.form}>
          <FormBlock title={'Носитель успешно очищен'}>
            Носитель можно извлечь
          </FormBlock>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.description}>
        Для очистки РуТокена потребуется ключевой носитель и пароль от него
      </div>
      <div className={styles.description2}>
        Носитель вставлен
      </div>
      <div className={styles.form}>
        <FormBlock>
          {submitError && (
            <FormBlockError>
              {submitError}
            </FormBlockError>
          )}
          <InputLabel className={styles.field} label={'Введите пароль'}>
            <Input
              className={styles.input}
              type={'password'}
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </InputLabel>
        </FormBlock>
      </div>
      <Button onClick={handleSubmit} disabled={!isRutokenConnected || isLoading}>
        Очистить
      </Button>
    </div>
  )
}
