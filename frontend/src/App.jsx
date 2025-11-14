import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import AuthPage from './pages/AuthPage.jsx'
import * as Sentry from "@sentry/react";

const SentryRoutes=Sentry.withSentryReactRouterV7Routing(Routes);


const App = () => {
  return <>
  <button onClick={()=>{throw new Error("My test error")}}>
    throw error
  </button>
  
      <SignedIn>
       <SentryRoutes>
        <Route path='/' element={<HomePage />}/>
        <Route path='/auth' element={<Navigate to="/" replace />} />
       </SentryRoutes>
      </SignedIn>

            <SignedOut>
        <SentryRoutes>
          <Route path='/auth' element={<AuthPage />} />
          <Route path='*' element={<Navigate to="/auth" />} />
        </SentryRoutes>
      </SignedOut>
    </>
}

export default App