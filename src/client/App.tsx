import React, { ReactNode } from 'react';
import NavBar from './components/NavBar';

export default function App({ children }: { children: ReactNode }) {
  return (
    <div className="t-0 align bg-slate-600">
        <NavBar />
          {children}
    </div>
  );
}
