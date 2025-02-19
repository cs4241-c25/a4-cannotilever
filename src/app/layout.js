import { Geist, Geist_Mono } from "next/font/google";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { ThemeProvider } from '@mui/material/styles';
import {SessionProvider} from "next-auth/react";

import theme from './theme';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Jake Ellingtons's A4 assingment",
  description: "A food inventory organizer app",
};

export default function RootLayout({ children }) {
  return (
  <SessionProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
        {children}
          </ThemeProvider>
      </AppRouterCacheProvider>
      </body>
    </html>
  </SessionProvider>
  );
}
