import { Box, Flex } from "@radix-ui/themes";
import watchItLogo from "../../assets/watchitlogo.png";
import { useLanguage } from "../../contexts/LanguageContext";
import { tl } from "../../translations/translation";
import chromeWebStore from "../../assets/chrome-extension-icon.png"

export function Maintenance() {
    const { currentLanguage } = useLanguage();

    return (
        <>
            <main className="flex items-center justify-center pt-16 pb-4 play-regular flex-col">
                <section className="w-full">
                    <div className="flex-1 flex flex-col items-center gap-16 min-h-0 pb-20">
                        <header className="flex flex-row items-center gap-9">
                            <div className="w-[500px] max-w-[100vw]">
                                <img
                                    src={watchItLogo}
                                    alt={tl(currentLanguage, 'header.alt_logo')}
                                    className="hidden w-full dark:block"
                                />
                            </div>
                        </header>
                        <div className="play-regular">{tl(currentLanguage, 'header.tagline')}</div>
                    </div>
                </section>
                <Flex direction="column" align="center">
                    <h2 className="pb-5"><strong>MAINTENANCE // MANUTENÇÃO // MANTENIMIENTO</strong></h2>
                    <Box className="w-[50%] pb-5">
                        en-US: Big changes on the way!
                        <br />
                        While WatchIT is under maintenance, take the time to get our Browser Extension at the link below
                    </Box>
                    <Box className="w-[50%] pb-5">
                        pt-BR: Grandes mudanças a caminho!
                        <br />
                        Enquanto WatchIT está de manutenção, aproveite o tempo para adquirir nossa Extensão de Navegador no link abaixo
                    </Box>
                    <Box className="w-[50%] pb-5">
                        es-ES: ¡Grandes cambios en camino!
                        <br />
                        Mientras WatchIT está en mantenimiento, aprovecha para obtener nuestra extensión de navegador en el enlace de abajo
                    </Box>

                    <a href="https://chromewebstore.google.com/detail/watchit-smart-blocking-fo/dcpnlnlnjbgbeglkmmghoifgobadmjmo?authuser=5&hl=pt-BR" target="_blank">
                        <img src={chromeWebStore}
                            className="w-78 h-25">
                        </img>
                    </a>
                </Flex>
            </main>
        </>
    )
}