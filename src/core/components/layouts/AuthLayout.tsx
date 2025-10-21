"use client";
import React from 'react'
import ThemeProvider from "@components/ThemeProvider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <main className="">
        <div className="">
          {children}
        </div>
      </main>
    </ThemeProvider>
  );
}
