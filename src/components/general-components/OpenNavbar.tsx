import watchItIcon from "../../assets/watchItIcon.png";
import { useNavigate } from "react-router-dom";
import { InstallExtension } from "./InstallExtensionButton";
import { Box, Text } from "@radix-ui/themes";
import { useLanguage } from "../../contexts/LanguageContext";
import { tl } from "../../translations/translation";

export function OpenNavbar() {

     const { currentLanguage } = useLanguage();

    const navigator = useNavigate();

    const redirectToPage = (redirectTo: string) => {
        navigator(redirectTo, { replace: true })
    }

    return (
        <>
            <nav>
                <div className="mx-auto p-3 md:flex md:items-start md:justify-between px-8 py-6 cursor-pointer">
                    <div onClick={() => redirectToPage("/")}>
                        <img src={watchItIcon} className="h-17 opacity-90" />
                    </div>
                    <div className="grid grid-cols-4 gap-1 items-center">
                        <Box className="hover:underline decoration-orange-300 hover:text-orange-300 min-w-[50px] max-w-[100px] cursor-pointer"
                         onClick={() => redirectToPage("/about")}>
                            <Text>{tl(currentLanguage, 'landing.about')}</Text>
                        </Box>
                        <Box className="hover:underline decoration-orange-300 hover:text-orange-300 min-w-[50px] max-w-[100px] cursor-pointer"
                        onClick={() => redirectToPage("/donate")}>
                            <Text>{tl(currentLanguage, 'landing.donations')}</Text>
                        </Box>
                        <Box  className="hover:underline decoration-orange-300 hover:text-orange-300 min-w-[10px] max-w-[150px] cursor-pointer"
                        onClick={() => redirectToPage("/privacypolicy")}>
                            <Text>{tl(currentLanguage, 'landing.priv_policy')}</Text>
                        </Box>
                        <InstallExtension />
                    </div>
                </div>
            </nav>
        </>
    );
}