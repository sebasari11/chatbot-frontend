import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './router'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/ucalma">
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App