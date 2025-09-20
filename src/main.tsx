import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { FaceitWatcher } from './faceitwatcher/faceitwatcher.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme appearance="dark" accentColor="indigo" grayColor="slate" radius="large">
      <FaceitWatcher />
    </Theme>
  </StrictMode>,
)
