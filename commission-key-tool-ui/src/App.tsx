import React from 'react'
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import './App.global.css'
import { MainPage } from './pages/main/Main.page'
import { RestorePage } from './pages/restore/Restore.page'
import { GeneratePage } from './pages/generate/Generate.page'
import { RuTokenListener } from './components/rutoken-listener/RutokenListener'

export default function App() {
  return (
    <Router>
      <RuTokenListener>
        <Switch>
          <Route exact path={'/restore'} component={RestorePage} />
          <Route exact path={'/generate'} component={GeneratePage} />
          <Route exact path={'/'} component={MainPage} />
          <Redirect to={'/'} />
        </Switch>
      </RuTokenListener>
    </Router>
  )
}
