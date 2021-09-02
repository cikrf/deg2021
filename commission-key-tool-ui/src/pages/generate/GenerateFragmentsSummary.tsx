import React, { useCallback } from 'react'
import { MainBlock } from '../../components/main-block/MainBlock'
import styles from './Generate.module.scss'
import { GenerateFragmentsFormResult } from './GenerateFragmentsForm'
import { Button } from '../../components/button/Button'
import { stringifyKey } from '../../utils/maskKey'
import { declineNum } from '../../utils/declineNum'
import { KeyField } from '../../components/key-field/KeyField'

type GenerateFragmentsSummaryProps = {
  keys: GenerateFragmentsFormResult,
  onSaved: () => void,
}

export const GenerateFragmentsSummary: React.FC<GenerateFragmentsSummaryProps> = (props) => {

  const { keys, onSaved } = props

  const handleSubmit = useCallback(() => {
    onSaved()
  }, [onSaved])

  return (
    <div className={styles.mainBlocks}>
      <MainBlock title={'Разделение ключа'} bodyClassName={styles.blocksContent}>
        <div className={styles.keysSummaryContent}>
          <div className={styles.keysSummarySection}>
            <div className={styles.keysSummarySectionTitle}>
              Ключи комисии
            </div>
            <KeyField title={'Открытый ключ'} className={styles.commisionKeysField}>
              {stringifyKey(keys.publicKey)}
            </KeyField>
          </div>
          <div className={styles.keysSummarySection}>
            <div className={styles.keysSummarySectionTitle}>
              Разделяем ключ на {keys.shares.length} {declineNum(keys.shares.length, ['часть', 'части', 'частей'])}
            </div>
          </div>
        </div>
        <Button onClick={handleSubmit}>
          Начать запись на носители
        </Button>
      </MainBlock>
    </div>
  )
}
