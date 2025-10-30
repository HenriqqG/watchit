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
import { ProtectedLayout } from './layouts/ProtectedLayout.tsx';
import { Profile } from './pages/profile/Profile.tsx';
import { MainPage } from './pages/main-page/main-page.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import OpenLayout from './layouts/OpenLayout.tsx';
import { About } from './pages/about/About.tsx';
import { FAQ } from './pages/FAQ/FAQ.tsx';

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <Toast.Provider swipeDirection="right">
      <StrictMode>
        <Theme appearance="dark" accentColor="indigo" grayColor="slate" radius="large">
          <BrowserRouter>
            <PlayerProvider>
              <Routes>
                <Route element={<OpenLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/privacypolicy" element={<PrivacyPolicy />} />
                </Route>

                <Route path="/callback" element={<Callback />} />

                <Route element={<MainLayout />}>
                  <Route path="/watch" element={<MainPage />} />
                  <Route element={<ProtectedLayout />}>
                    <Route path="/me" element={<Profile />} />
                  </Route>
                </Route>
              </Routes>
            </PlayerProvider>
          </BrowserRouter>
        </Theme>
      </StrictMode>
      <Toast.Viewport className="fixed bottom-4 right-4" />
    </Toast.Provider>
  </LanguageProvider>,
)