import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { NotificationProvider } from './context/NotificationContext.tsx'
import { AuthContextProvider } from './context/auth.tsx'
import { HeroUIProvider} from "@heroui/react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <HeroUIProvider>
        <AuthContextProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AuthContextProvider>
    </HeroUIProvider>
  </StrictMode>,
)
