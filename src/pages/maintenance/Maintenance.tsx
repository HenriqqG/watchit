import { Box, Flex } from "@radix-ui/themes";
import watchItLogo from "../../assets/watchitlogo.png";
import { useLanguage } from "../../contexts/LanguageContext";
import { tl } from "../../translations/translation";
import { InstallExtension } from "../../components/general-components/InstallExtensionButton";
import { motion } from "framer-motion";

export default function Maintenance() {
    const { currentLanguage } = useLanguage();

    return (
        <>
            <main className="flex items-center justify-center pt-16 pb-4 play-regular flex-col">
                <section className="w-full">
                    <div className="flex-1 flex flex-col items-center gap-16 min-h-0 pb-20">
                        <motion.section
                            className="flex flex-col items-center text-center px-6 mt-24 max-w-3xl"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}>
                            <motion.img
                                src={watchItLogo}
                                alt="WatchIt logo"
                                className="h-32 opacity-90 drop-shadow-[0_0_25px_rgba(255,150,0,0.3)]"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }} />
                            <p className="text-lg md:text-xl text-gray-400 mt-6 max-w-xl leading-relaxed">
                                {tl(currentLanguage, "header.tagline")}
                            </p>
                        </motion.section>
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

                    <InstallExtension />
                </Flex>
            </main>
        </>
    )
}