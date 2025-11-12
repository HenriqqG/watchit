import './index.css'
import "@radix-ui/themes/styles.css";

import { StrictMode, lazy, Suspense } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async";

import { LanguageProvider } from "./contexts/LanguageContext"
import { PlayerProvider } from "./contexts/SelectedPlayerContext"

import * as Toast from "@radix-ui/react-toast"
import { Theme } from "@radix-ui/themes"

import OpenLayout from "./layouts/OpenLayout"
import MainLayout from "./layouts/MainLayout"
import ProtectedLayout from "./layouts/ProtectedLayout"
import Loading from './components/general-components/Loading';
import Donate from './pages/donate/Donate';
import ContactPage from './pages/contact/Contact';
import AnalyticsTracker from './components/general-components/AnalyticsTracker';

const LandingPage = lazy(() => import("./pages/LandingPage"))
const About = lazy(() => import("./pages/about/About"))
const DonateSuccess = lazy(() => import("./pages/donate/DonateSucess"))
const PrivacyPolicy = lazy(() => import("./pages/privacy-n-policy/PrivacyPolicy"))
const Callback = lazy(() => import("./pages/login/callback/Callback"))
const MainPage = lazy(() => import("./pages/main-page/main-page"))
const Profile = lazy(() => import("./pages/profile/Profile"))
// const Plans = lazy(() => import("./pages/pricing/Pricing"))
// const Subscription = lazy(() => import("./pages/subscription/Subscription"))
// const SubscriptionSuccess = lazy(() => import("./pages/subscription/SubscriptionSuccess"))
// const SubscriptionError = lazy(() => import("./pages/subscription/SubscriptionError"))

createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <Toast.Provider swipeDirection="right">
      <StrictMode>
        <Theme appearance="dark" accentColor="indigo" grayColor="slate" radius="large">
          <BrowserRouter>
            <HelmetProvider>
              <AnalyticsTracker />
              <PlayerProvider>
                <Suspense fallback={<Loading />}>
                  <Routes>
                    <Route element={<OpenLayout />}>
                      <Route path="/" element={<LandingPage key="landingpage" />} />
                      <Route path="/about" element={<About key="about" />} />
                      <Route path="/donate" element={<Donate key="donate" />} />
                      <Route path="/donate-success" element={<DonateSuccess key="doantesuccess" />} />
                      <Route path="/privacypolicy" element={<PrivacyPolicy key="privacypolicy" />} />
                      <Route path="/contact" element={<ContactPage key="contactpage" />} />
                      {/* <Route path="/pricing" element={<Plans />} /> */}
                    </Route>
                    <Route path="/callback" element={<Callback />} />

                    <Route element={<MainLayout />}>
                      <Route path="/watch" element={<MainPage key="mainpage" />} />
                      {/* <Route path="/subscription" element={<Subscription />} />
                    <Route path="/payment-sucess" element={<SubscriptionSuccess />} />
                    <Route path="/payment-failure" element={<SubscriptionError />} /> */}
                      <Route element={<ProtectedLayout />}>
                        <Route path="/me" element={<Profile key="profile" />} />
                      </Route>
                    </Route>
                  </Routes>
                </Suspense>
              </PlayerProvider>
            </HelmetProvider>
          </BrowserRouter>
        </Theme>
      </StrictMode>
      <Toast.Viewport className="fixed bottom-4 right-4" />
    </Toast.Provider>
  </LanguageProvider>,
)