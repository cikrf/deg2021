import React, { useCallback, useEffect, useState } from 'react'
import styles from './ChangePassword.module.scss'
import { FormBlock } from '../form-block/FormBlock'
import { InputLabel } from '../input/InputLabel'
import { Input } from '../input/Input'
import { Button } from '../button/Button'
import { ipcRenderer } from 'electron'
import { useRutokenConnected } from '../rutoken-listener/RutokenListener'
import { convertErrorCodeToErrorMessage } from '../../utils/convertErrorCodeToErrorMessage'
import { FormBlockError } from '../form-block/FormBlockError'

export const ChangePassword: React.FC = () => {

  const [oldPassword, setOldPassword] = useState('')

  const [newPassword, setNewPassword] = useState('')

  const [isLoading, setLoading] = useState(false)

  const [submitError, setSubmitError] = useState<string | null>(null)

  const [submitSuccess, setSubmitSuccess] = useState(false)

  const isRutokenConnected = useRutokenConnected()

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    const response = await ipcRenderer.invoke('change-password', {
      oldPassword,
      newPassword,
    })
    if (!response.success) {
      setSubmitError(convertErrorCodeToErrorMessage(response.errorCode))
    } else {
      setSubmitError(null)
      setSubmitSuccess(true)
    }
    setLoading(false)
  }, [oldPassword, newPassword])

  useEffect(() => {
    if (!isRutokenConnected) {
      setOldPassword('')
      setNewPassword('')
      setSubmitError(null)
      setSubmitSuccess(false)
    }
  }, [isRutokenConnected])

  if (!isRutokenConnected) {
    return (
      <div>
        <div className={styles.form}>
          <FormBlock title={'Вставьте носитель'}>
            Система найдет его сама
          </FormBlock>
        </div>
        <Button disabled={!isRutokenConnected || isLoading} onClick={handleSubmit}>
          Изменить пароль
        </Button>
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div>
        <div className={styles.form}>
          <FormBlock title={'Пароль успешно изменен'}>
            Носитель можно извлечь
          </FormBlock>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.form}>
        <FormBlock>
          {submitError && (
            <FormBlockError>
              {submitError}
            </FormBlockError>
          )}
          <InputLabel
            label={'Введите старый пароль'}
            className={styles.field}
          >
            <Input
              className={styles.input}
              type={'password'}
              value={oldPassword}
              disabled={isLoading}
              onChange={({ target }) => setOldPassword(target.value)}
            />
          </InputLabel>
          <InputLabel
            label={'Введите новый пароль'}
            className={styles.field}
          >
            <Input
              className={styles.input}
              type={'password'}
              value={newPassword}
              disabled={isLoading}
              onChange={({ target }) => setNewPassword(target.value)}
            />
          </InputLabel>
        </FormBlock>
      </div>
      <Button
        disabled={!isRutokenConnected || isLoading}
        onClick={handleSubmit}
      >
        Изменить пароль
      </Button>
    </div>
  )
}
