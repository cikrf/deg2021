import React, { useCallback, useState } from 'react'
import { Layout } from '../../components/layout/Layout'
import { GenerateFragmentsForm, GenerateFragmentsFormResult } from './GenerateFragmentsForm'
import { GenerateFragmentsSummary } from './GenerateFragmentsSummary'
import { SaveFragments } from './SaveFragments'
import { SaveFragmentsDone } from './SaveFragmentsDone'

export const GeneratePage: React.FC = () => {

  const [fragmentsState, setFragmentsState] = useState<GenerateFragmentsFormResult | null>(null)

  const [stage, setStage] = useState(1)

  const handleFormSaved = useCallback((state) => {
    setFragmentsState(state)
    setStage(2)
  }, [])

  const handleStart = useCallback(() => {
    setStage(3)
  }, [])

  const handleFinish = useCallback(() => {
    setStage(4)
  }, [])

  let content

  switch (stage) {
    case 1: {
      content = <GenerateFragmentsForm onSaved={handleFormSaved} />
      break
    }
    case 2: {
      if (!fragmentsState) {
        content = null
      } else {
        content = <GenerateFragmentsSummary keys={fragmentsState} onSaved={handleStart} />
      }
      break
    }
    case 3: {
      if (!fragmentsState) {
        content = null
      } else {
        content = <SaveFragments keys={fragmentsState} onSaved={handleFinish} />
      }
      break
    }
    case 4: {
      content = <SaveFragmentsDone />
    }
  }

  return (
    <Layout>
      {content}
    </Layout>
  )
}
