import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import store, { StoreContext } from './store/store'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <StoreContext.Provider value={{ store }}>
    <App />
  </StoreContext.Provider>
)