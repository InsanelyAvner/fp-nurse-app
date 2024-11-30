// app/providers.tsx
'use client';

import { ReactNode } from 'react';
import { UserContextProvider } from '@/app/context/UserContext';
import { LoadingProvider } from '@/app/context/LoadingContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LoadingProvider>
      <UserContextProvider>
        {children}
      </UserContextProvider>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </LoadingProvider>
  );
}