import { useNavigate } from "react-router-dom";

import { Box, Text } from "@radix-ui/themes";

import { useLanguage } from "../../contexts/LanguageContext";
import { tl } from "../../translations/translation";

import watchItIcon from "../../assets/watchitIcon.png";

export function Footer() {
  const { currentLanguage } = useLanguage();

  const navigator = useNavigate();

  const redirectToPage = (redirectTo: string) => {
    navigator(redirectTo, { replace: true })
  }

  return (
    <footer className="rounded-lg shadow-sm bottom-0 left-0 w-full bg-gray absolute">
      <div className="mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2025 <a href="https://watchit-cs.netlify.app/" className="hover:underline">WatchIT</a>. {tl(currentLanguage, 'footer.all_rights_reserved')}
          <br />
          {tl(currentLanguage, 'footer.no_affiliation')} <a href="https://www.faceit.com/" className="hover:underline" target="_blank">FACEIT</a>.
        </span>
        <WatchItIcon />
        <Box>
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            {tl(currentLanguage, 'footer.creator')} <a className="hover:underline me-4 md:me-6 cursor-pointer" onClick={() => window.open("https://x.com/GagnoHenriqq", "_blank")}>@GagnoHenriqq</a>
          </span> 
          <Box className="text-sm text-gray-500 sm:text-center dark:text-gray-400 hover:underline me-4 md:me-6 cursor-pointer"
            onClick={() => redirectToPage("/donate")}>
            <Text>{tl(currentLanguage, 'landing.donations')}</Text>
          </Box>
        </Box>
      </div>
    </footer >)
}

function WatchItIcon(props: any) {
  return (
    <div className="w-[50px] h-[50px]">
      <img
        {...props}
        src={watchItIcon}
        alt="WatchIt Icon"
        className="hidden w-full dark:block"
      />
    </div>
  )
}