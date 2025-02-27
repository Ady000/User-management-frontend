'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <main className="container mx-auto px-4 py-8">{children}</main>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}