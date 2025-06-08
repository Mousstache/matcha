import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { NotificationProvider } from './context/NotificationContext.tsx'
import { AuthContextProvider } from './context/auth.tsx'
import { ToastProvider, HeroUIProvider} from "@heroui/react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  //   <HeroUIProvider>
      <ToastProvider placement="top-right" toastOffset={60} />
        <AuthContextProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AuthContextProvider>
    </HeroUIProvider>
  </StrictMode>,
)
