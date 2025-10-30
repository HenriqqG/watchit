import { DownloadIcon } from "@radix-ui/react-icons";
import { Flex, Button } from "@radix-ui/themes";
import { tl } from "../../translations/translation";
import { useLanguage } from "../../contexts/LanguageContext";

export function InstallExtension() {
    const { currentLanguage } = useLanguage();
    
    return (
        <>
            <Flex direction="row" justify="center" className="pt-5 pb-5">
                <Button size="4" color="orange" variant="soft" radius="small" className="cursor-pointer" onClick={() =>
                    window.open(`https://chromewebstore.google.com/detail/watchit-smart-blocking-fo/dcpnlnlnjbgbeglkmmghoifgobadmjmo?authuser=5&hl=pt-BR`, "_blank")}>
                    <DownloadIcon width="25" height="25"></DownloadIcon>
                    <p className="play-regular">{tl(currentLanguage, 'live_supermatches_page.install_extension.button')}</p>
                </Button>
            </Flex>
        </>
    )
}