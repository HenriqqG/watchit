import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import * as Toast from '@radix-ui/react-toast';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Callback from "./pages/login/callback/Callback.tsx";
import MainLayout from './layouts/MainLayout.tsx';
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import { PlayerProvider } from './contexts/SelectedPlayerContext.tsx';
import PrivacyPolicy from './pages/privacy-n-policy/PrivacyPolicy.tsx';
import { WatchITMain } from './pages/watchit/watchit-main.tsx';

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <Toast.Provider swipeDirection="right">
      <StrictMode>
        <Theme appearance="dark" accentColor="indigo" grayColor="slate" radius="large">
          <BrowserRouter>
            <PlayerProvider>
              <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<WatchITMain />} />
                <Route path="/privacypolicy" element={<PrivacyPolicy />} />
              </Route>
              <Route path="/callback" element={<Callback />} />
            </Routes>
            </PlayerProvider>
          </BrowserRouter>
        </Theme>
      </StrictMode>
      <Toast.Viewport className="fixed bottom-4 right-4" />
    </Toast.Provider>
  </LanguageProvider>,
)