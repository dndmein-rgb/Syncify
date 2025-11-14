import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import * as Sentry from "@sentry/react"; 
import { ClerkProvider } from '@clerk/clerk-react'
import {
  Routes,
  Route,
  BrowserRouter,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from "react-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import AuthProvider from './providers/AuthProvider.jsx'

const queryClient=new QueryClient();

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}


Sentry.init({
  dsn: "https://78e4571d545b244f44f570fdeab6f9d0@o4510347293229056.ingest.de.sentry.io/4510364601286736",
  integrations: [
    Sentry.reactRouterV7BrowserTracingIntegration({
      useEffect: React.useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
  ],
  tracesSampleRate: 1.0,
  denyUrls: [
    // Ignore errors from ad blockers and extensions
    /extensions\//i,
    /^chrome:\/\//i,
  ],
  beforeSend(event) {
    // Silently ignore certain errors
    return event;
  },
  transport: Sentry.makeFetchTransport,
  maxBreadcrumbs: 50,
});



createRoot(document.getElementById('root')).render(
  <StrictMode>
          <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <QueryClientProvider client={queryClient}>
            <BrowserRouter>
           <AuthProvider>
             <App />
             </AuthProvider> 
             <Toaster position='top-right' />
            </BrowserRouter>
            </QueryClientProvider>
    </ClerkProvider>
  </StrictMode>,
)
