import React from 'react'
import ReactDOM from 'react-dom'
import Router from '@/presentation/components/router/router'
import '@/presentation/styles/global.scss'
import { MakeLogin } from './factories/pages/login/login-factory'

ReactDOM.render(
  <Router MakeLogin={MakeLogin} />, document.getElementById('main')
)
