import React, { useContext, useEffect, useState } from 'react'
import { ipcRenderer } from 'electron'

export const RutokenConnectedContext = React.createContext(false)

const listen = (onConnect: () => void, onDisconnect: () => void) => {
  ipcRenderer.send('wait-rutoken-connected')
  ipcRenderer.once('rutoken-connected', () => {
    onConnect()
    ipcRenderer.send('wait-rutoken-disconnected')
    ipcRenderer.once('rutoken-disconnected', () => {
      onDisconnect()
      listen(onConnect, onDisconnect)
    })
  })
}

export const useRutokenConnected = () => useContext(RutokenConnectedContext)

export const RuTokenListener: React.FC = ({ children }) => {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    listen(
      () => setConnected(true),
      () => setConnected(false),
    )
  }, [])

  return (
    <RutokenConnectedContext.Provider value={connected}>
      {children}
    </RutokenConnectedContext.Provider>
  )
}
