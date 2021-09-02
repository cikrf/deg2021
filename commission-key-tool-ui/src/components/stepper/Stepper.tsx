import React, { useContext } from 'react'
import styles from './Stepper.module.scss'
import clsx from 'clsx'
import { IconCheck } from '../icons/IconCheck'

type StepperProps = {
  activeStep: number,
}

const StepperContext = React.createContext<number | null>(null)

export const Stepper: React.FC<StepperProps> = (props) => {
  const { activeStep, children } = props
  return (
    <StepperContext.Provider value={activeStep}>
      <div className={styles.container}>
        {children}
      </div>
    </StepperContext.Provider>
  )
}

type StepProps = {
  value: number,
  title: (isActive: boolean, isDone: boolean) => React.ReactNode,
}

export const Step: React.FC<StepProps> = (props) => {

  const { value, title, children } = props

  const activeStep = useContext(StepperContext)!

  const isActive = activeStep === value

  const isDone = activeStep > value

  return (
    <div className={clsx(styles.step, isActive && styles.active, isDone && styles.done)}>
      <div className={styles.stepTitle}>
        {isDone ? (
          <IconCheck className={styles.stepMark} />
        ) : (
          <i className={styles.stepMark} />
        )}
        {title(isActive, isDone)}
      </div>
      {isActive && (
        <div className={styles.stepBody}>
          {children}
        </div>
      )}
    </div>
  )
}
