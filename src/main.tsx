import './index.css'
import "@radix-ui/themes/styles.css";

import { StrictMode, lazy, Suspense } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { LanguageProvider } from "./contexts/LanguageContext"
import { PlayerProvider } from "./contexts/SelectedPlayerContext"
import * as Toast from "@radix-ui/react-toast"
import { Theme } from "@radix-ui/themes"

import OpenLayout from "./layouts/OpenLayout"
import MainLayout from "./layouts/MainLayout"
import ProtectedLayout from "./layouts/ProtectedLayout"
import Loading from './components/general-components/Loading';

const LandingPage = lazy(() => import("./pages/LandingPage"))
const About = lazy(() => import("./pages/about/About"))
const Subscription = lazy(() => import("./pages/subscription/Subscription"))
const DonateSuccess = lazy(() => import("./pages/donate/DonateSucess"))
const PrivacyPolicy = lazy(() => import("./pages/privacy-n-policy/PrivacyPolicy"))
const Callback = lazy(() => import("./pages/login/callback/Callback"))
const MainPage = lazy(() => import("./pages/main-page/main-page"))
const Profile = lazy(() => import("./pages/profile/Profile"))

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <Toast.Provider swipeDirection="right">
      <StrictMode>
        <Theme appearance="dark" accentColor="indigo" grayColor="slate" radius="large">
          <BrowserRouter>
            <PlayerProvider>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route element={<OpenLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/donate-success" element={<DonateSuccess />} />
                    <Route path="/privacypolicy" element={<PrivacyPolicy />} />
                    <Route path="/plans" element={<Subscription />} />
                  </Route>
                  <Route path="/callback" element={<Callback />} />

                  <Route element={<MainLayout />}>
                    <Route path="/watch" element={<MainPage />} />
                    <Route element={<ProtectedLayout />}>
                      <Route path="/me" element={<Profile />} />
                    </Route>
                  </Route>
                </Routes>
              </Suspense>
            </PlayerProvider>
          </BrowserRouter>
        </Theme>
      </StrictMode>
      <Toast.Viewport className="fixed bottom-4 right-4" />
    </Toast.Provider>
  </LanguageProvider>,
)