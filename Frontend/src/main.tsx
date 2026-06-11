import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from "./Context/Context"
createRoot(document.getElementById('root')!).render(
    
    <BrowserRouter>
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
      
    </BrowserRouter>,
   
    
)