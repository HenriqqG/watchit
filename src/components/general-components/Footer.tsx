import { useNavigate } from "react-router-dom";

import { Box, Flex, Text } from "@radix-ui/themes";

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
    <footer className="rounded-lg shadow-sm bottom-0 left-0 w-full absolute">
      <div className="mx-auto max-w-screen md:max-w-[70%] xl:max-w-[40%] p-4 flex flex-col items-center justify-center lg:flex-row lg:justify-between lg:items-center">
        <span className="text-sm text-gray-500 text-center dark:text-gray-400 xl:w-[35%]">
          © 2025 <a href="https://watchit.gg/" className="hover:underline">WatchIT</a>. {tl(currentLanguage, 'footer.all_rights_reserved')}
          <br />
          {tl(currentLanguage, 'footer.no_affiliation')} <a href="https://www.faceit.com/" className="hover:underline" target="_blank">FACEIT</a>.
        </span>
        <div className="hidden lg:block">
          <WatchItIcon />
        </div>
        <div className=" xl:w-[30%]">
          <span className="text-sm text-gray-500 text-center dark:text-gray-400">
            {tl(currentLanguage, 'footer.creator')} <a className="hover:underline me-6 cursor-pointer" onClick={() => window.open("https://x.com/GagnoHenriqq", "_blank")}>@GagnoHenriqq</a>
          </span>
          <Flex direction="row" style={{justifyContent: "center"}}>
            <Box className="text-sm text-gray-500 sm:text-center dark:text-gray-400 hover:underline me-6 cursor-pointer"
              onClick={() => redirectToPage("/donate")}>
              <Text>{tl(currentLanguage, 'landing.donations')}</Text>
            </Box>
            <Box className="text-sm text-gray-500 sm:text-center dark:text-gray-400 hover:underline me-6 cursor-pointer"
              onClick={() => redirectToPage("/contact")}>
              <Text>{tl(currentLanguage, 'landing.contact')}</Text>
            </Box>
          </Flex>
        </div>
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