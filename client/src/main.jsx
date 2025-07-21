import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './app/store.js'
import { Provider } from 'react-redux'
import { WebSocketProvider } from './contexts/WebSocketContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { SidebarProvider } from './contexts/SidebarContext.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import DashboardsHome from './components/Dashboards/DashboardsHome.jsx'
import Dashboard from './components/Dashboards/Dashboard.jsx'
import { EditModeProvider } from './contexts/EditModeContext.jsx'

const router = createBrowserRouter([
  {
    element:
      <App />,
    children: [
      { index: true, element: <DashboardsHome /> },
      { path: ":id", element: <Dashboard /> }
    ]
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <WebSocketProvider>
          <EditModeProvider>
            <SidebarProvider>
              <RouterProvider router={router} />
            </SidebarProvider>
          </EditModeProvider>
        </WebSocketProvider>
      </Provider>
    </ThemeProvider>
  </StrictMode>
)
