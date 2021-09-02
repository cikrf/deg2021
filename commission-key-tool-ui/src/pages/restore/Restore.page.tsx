import React, { useCallback, useState } from 'react'
import { Layout } from '../../components/layout/Layout'
import { RestoreFragmentsForm } from './RestoreFragmentsForm'
import { ReadFragments } from './ReadFragments'
import { ReadFragmentsDone } from './ReadFragmentsDone'

export const RestorePage: React.FC = () => {

  const [fragmentsCount, setFragmentsCount] = useState(1)

  const [stage, setStage] = useState(1)

  const handleFormSaved = useCallback((state) => {
    setFragmentsCount(state)
    setStage(2)
  }, [])

  const handleStart = useCallback(() => {
    setStage(3)
  }, [])

  const handleReset = useCallback(() => {
    setFragmentsCount(1)
    setStage(1)
  }, [])

  let content

  switch (stage) {
    case 1: {
      content = <RestoreFragmentsForm onSaved={handleFormSaved} />
      break
    }
    case 2: {
      if (!fragmentsCount) {
        content = null
      } else {
        content = <ReadFragments
          fragmentsCount={fragmentsCount}
          onSaved={handleStart}
          onReset={handleReset}
        />
      }
      break
    }
    case 3: {
      content = <ReadFragmentsDone />
    }
  }

  return (
    <Layout>
      {content}
    </Layout>
  )
}
