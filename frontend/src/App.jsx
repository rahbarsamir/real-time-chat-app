import React from 'react'
import Main from './Screens/Main'
import {Routes,Route} from 'react-router-dom'
import { ChatProvider } from './context/ChatContext'
const App = () => {
  return (
    <ChatProvider>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </ChatProvider>
  )
}

export default App